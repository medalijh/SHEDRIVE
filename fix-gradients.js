const fs = require('fs');

const filesToFix = [
  'src/app/how-it-works/page.tsx',
  'src/app/safety/page.tsx'
];

filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace dark green gradients
    content = content.replace(/linear-gradient\(135deg,\s*#0A1F15 0%,\s*#0D2A1A 100%\)/g, 'linear-gradient(135deg, var(--color-silver-50) 0%, var(--color-silver-100) 100%)');
    content = content.replace(/linear-gradient\(135deg,\s*#0A1F15 0%,\s*#0D2A1A 50%,\s*#121A10 100%\)/g, 'linear-gradient(135deg, var(--color-rose-50) 0%, var(--color-purple-50) 100%)');

    // Replace dark red gradients
    content = content.replace(/linear-gradient\(135deg,\s*#7B1919 0%,\s*#5C0F0F 100%\)/g, 'linear-gradient(135deg, var(--color-rose-100) 0%, var(--color-rose-200) 100%)');

    // Replace some text-white
    content = content.replace(/className=["']([^"']*)text-white([^"']*)["']/g, (match, p1, p2) => {
        // Only if it doesn't have btn-primary which should be white
        if (!p1.includes('btn-primary') && !p2.includes('btn-primary') && !p1.includes('bg-') && !p2.includes('bg-')) {
            return `className="${p1}text-black${p2}"`;
        }
        return match;
    });

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      console.log('Fixed dark backgrounds in ' + file);
    }
  }
});
