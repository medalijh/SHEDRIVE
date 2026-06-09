const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/app/**/page.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Restore the correct white background for navbars
  content = content.replace(/background:\s*["']rgba\(0,0,0,0\.6\)["']/g, 'background: "rgba(255,255,255,0.92)"');
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Restored white navbar bg in ' + file);
  }
});
