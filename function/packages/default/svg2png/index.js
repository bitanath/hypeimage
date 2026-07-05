const { initWasm, Resvg } = require('@resvg/resvg-wasm');
const fs = require('fs');

var wasmBinary = fs.readFileSync(require.resolve('@resvg/resvg-wasm/index_bg.wasm'));
var inited = false;

async function main(args) {
  console.log("Called function makalu")
  var headers = args.__ow_headers || {};
  var auth = headers['x-require-whisk-auth'];
  console.log("Got header",auth,process.env.AUTH_KEY,args)
  if (auth !== process.env.AUTH_KEY) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  var svg = args.svg;

  if (!svg) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing svg parameter' }),
    };
  }

  try {
    if (!inited) {
      await initWasm(wasmBinary);
      inited = true;
    }

    var w = args.width || 400;
    var h = args.height || 300;
    var zoom = Math.max(w / 400, h / 300);
    var resvg = new Resvg(svg, { fitTo: { mode: 'zoom', value: zoom } });
    var pngData = resvg.render().asPng();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'image/png' },
      body: Buffer.from(pngData).toString('base64'),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
}

exports.main = main;
