// Node script to test header element positions using Chrome DevTools Protocol or simple DOM analysis
const fs = require('fs');

console.log('Inspecting Header markup and styling...');
const html = fs.readFileSync('rendered_dom.html', 'utf8');

const regex = /<button[^>]*aria-label="Open mobile menu"[^>]*>([\s\S]*?)<\/button>/;
const match = html.match(regex);
if (match) {
  console.log('Mobile button tag:', match[0]);
} else {
  console.log('Mobile button not matched by regex');
}
