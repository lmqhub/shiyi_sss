const fs = require('fs');
const path = require('path');

// Fix index.html
let html = fs.readFileSync('web-build/index.html', 'utf8');
html = html.replace(/(href|src)="(?!\/shiyi_sss\/)([^"]+)"/g, (m, attr, url) => {
  if (url.startsWith('/') || url.startsWith('\\')) {
    return attr + '="/shiyi_sss/' + url.replace(/^[\\/]+/, '') + '"';
  }
  return m;
});
fs.writeFileSync('web-build/index.html', html);
console.log('index.html fixed');

// Fix manifest.json
const manifest = JSON.parse(fs.readFileSync('web-build/manifest.json', 'utf8'));
manifest.start_url = '/shiyi_sss/';
manifest.prefer_related_applications = false;
if (manifest.icons) {
  manifest.icons.forEach(icon => {
    icon.src = '/shiyi_sss/' + icon.src.replace(/^[\\/]+/, '').replace(/\\/g, '/');
  });
}
fs.writeFileSync('web-build/manifest.json', JSON.stringify(manifest, null, 2));
console.log('manifest.json fixed');

console.log('Done');
