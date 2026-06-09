const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.tsx');

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  // Replace scale-[1.15] with scale-[1.35] to zoom the logo more and hide the grey edges perfectly
  content = content.replace(/scale-\[1\.15\]/g, 'scale-[1.35]');

  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Fixed logo scale in', f);
  }
});
