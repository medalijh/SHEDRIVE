const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/app/**/page.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace dark Navbar background
  content = content.replace(/background:\s*["']rgba\(26,21,15,0\.92\)["']/g, 'background: "rgba(255,255,255,0.92)"');
  
  // Replace text-white in Navbar/Footer where appropriate
  // We'll specifically target the SheDrive Morocco text next to the logo
  content = content.replace(/className=["']text-lg font-bold text-white["']/g, 'className="text-lg font-bold text-black"');
  content = content.replace(/className=["']font-bold text-white["']/g, 'className="font-bold text-black"');
  
  // Also the Connexion button text-white
  content = content.replace(/className=["']btn btn-sm btn-ghost text-white["']/g, 'className="btn btn-sm btn-ghost text-black"');
  
  // Replace the Emoji logo with the Image logo
  const emojiLogoRegex = /<div className=["']w-9 h-9 rounded-full flex items-center justify-center text-lg["'][^>]*>.*?<\/div>/g;
  const imgLogo = '<img src="/logo.png" alt="SheDrive Logo" className="w-9 h-9 object-cover rounded-full border border-rose-200" />';
  content = content.replace(emojiLogoRegex, imgLogo);

  const emojiLogoRegex2 = /<div className=["']w-8 h-8 rounded-full flex items-center justify-center text-base["'][^>]*>.*?<\/div>/g;
  const imgLogo2 = '<img src="/logo.png" alt="SheDrive Logo" className="w-8 h-8 object-cover rounded-full border border-rose-200" />';
  content = content.replace(emojiLogoRegex2, imgLogo2);

  // Replace dark background in hero of safety page (if any)
  content = content.replace(/background:\s*["']var\(--color-emerald-950\)["']/g, 'background: "var(--color-silver-50)"');
  
  // Replace modal dark bg in how-it-works
  content = content.replace(/background:\s*["']var\(--color-emerald-900\)["']/g, 'background: "white"');
  
  // In how-it-works, the modal texts are white, make them black
  content = content.replace(/text-white/g, 'text-black');
  content = content.replace(/rgba\(255,255,255,0\.[^)]+\)/g, 'rgba(0,0,0,0.6)');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed Nav/Footer in ' + file);
  }
});
