const fs = require('fs');
const m = JSON.parse(fs.readFileSync('web-build/manifest.json', 'utf8'));
m.start_url = '/shiyi_sss/';
m.prefer_related_applications = false;
if (m.icons) {
  m.icons.forEach(icon => {
    icon.src = '/shiyi_sss/' + icon.src.replace(/^\\+/, '').replace(/^\/+/, '');
  });
}
fs.writeFileSync('web-build/manifest.json', JSON.stringify(m, null, 2));
console.log('manifest fixed');
