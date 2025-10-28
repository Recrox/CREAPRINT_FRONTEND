const fs = require('fs');
const path = require('path');

const files = ['index.html', 'styles.css'];
const src = path.join(__dirname, '..', 'src');
const dest = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

for (const f of files) {
  const s = path.join(src, f);
  const d = path.join(dest, f.replace('.ts', '.js'));
  if (fs.existsSync(s)) {
    fs.copyFileSync(s, path.join(dest, f));
    console.log('copied', f);
  }
}
