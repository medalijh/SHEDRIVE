const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.tsx');

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  // Pattern to match logo img tag
  const regex = /<img\s+src="\/logo\.png"\s+alt="SheDrive Logo"\s+className="([^"]+)"\s*\/>/g;

  content = content.replace(regex, (match, className) => {
    // Extract width and height classes if any
    const wMatch = className.match(/w-\d+|w-\[\d+px\]/);
    const hMatch = className.match(/h-\d+|h-\[\d+px\]/);
    const wClass = wMatch ? wMatch[0] : '';
    const hClass = hMatch ? hMatch[0] : '';
    
    // Remove the width and height and mx-auto from the inner img classes, and also remove border and rounded stuff
    // We'll put them on the wrapper
    let wrapperClasses = className;
    let innerClasses = 'w-full h-full object-cover mix-blend-multiply scale-[1.15]';

    // The wrapper gets the layout, size, borders, rounding
    // The inner gets full size, mix blend, and scale
    
    // Make sure the wrapper has overflow-hidden, flex, items-center, justify-center, bg-white, flex-shrink-0
    if (!wrapperClasses.includes('overflow-hidden')) wrapperClasses += ' overflow-hidden';
    if (!wrapperClasses.includes('flex')) wrapperClasses += ' flex items-center justify-center';
    if (!wrapperClasses.includes('bg-white')) wrapperClasses += ' bg-white';
    if (!wrapperClasses.includes('flex-shrink-0')) wrapperClasses += ' flex-shrink-0';
    
    return `<div className="${wrapperClasses.trim()}"><img src="/logo.png" alt="SheDrive Logo" className="${innerClasses}" /></div>`;
  });

  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Fixed logo in', f);
  }
});
