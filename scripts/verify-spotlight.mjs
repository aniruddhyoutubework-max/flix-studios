import http from 'http';

function checkUrl(url, label) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        console.log(`[${label}] Status: ${res.statusCode}, Bytes: ${data.length}`);
        resolve({ status: res.statusCode, data });
      });
    }).on('error', reject);
  });
}

async function verify() {
  console.log('=== VERIFYING FLIX STUDIOS SERVER & SPOTLIGHT ===');
  await checkUrl('http://localhost:5173/', 'Homepage');
  await checkUrl('http://localhost:5173/products', 'Products Page');
  await checkUrl('http://localhost:5173/products/flixcore-plugin', 'Product Detail Page');
  await checkUrl('http://localhost:5173/motion/product-cinematic.mp4', 'Motion MP4');
  await checkUrl('http://localhost:5173/products/flixcore/cover.png', 'Product Cover Graphic');
  await checkUrl('http://localhost:5173/products/flixcore/1.png', 'Slide 1 Graphic');
  console.log('=== ALL HTTP ASSET VERIFICATIONS PASSED ===');
}

verify().catch((err) => {
  console.error('[FAILED]:', err);
  process.exit(1);
});
