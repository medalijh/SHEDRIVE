const fs = require('fs');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Add the cleanUrl function if not exists
  if (!content.includes('function cleanUrl')) {
    const cleanFn = `
function cleanUrl(url) {
  if (!url) return "";
  let cleaned = url.trim();
  if (cleaned.endsWith('/')) cleaned = cleaned.slice(0, -1);
  if (cleaned.endsWith('/rest/v1')) cleaned = cleaned.replace('/rest/v1', '');
  if (cleaned && !cleaned.startsWith('http')) cleaned = 'https://' + cleaned;
  return cleaned;
}
`;
    // Insert after imports
    content = content.replace(/(import.*?\n)+(?=\n*(const|let|export))/s, match => match + cleanFn);
  }

  // Update server.ts and client.ts
  content = content.replace(
    /const SUPABASE_URL = process\.env\.NEXT_PUBLIC_SUPABASE_URL \|\| "https:\/\/placeholder\.supabase\.co";/g,
    'const SUPABASE_URL = cleanUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co");'
  );

  // Update middleware.ts
  if (filePath.includes('middleware.ts')) {
    content = content.replace(
      /const supabaseUrl\s*=\s*process\.env\.NEXT_PUBLIC_SUPABASE_URL;/g,
      'const supabaseUrl  = cleanUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || "");'
    );
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed url cleaning in', filePath);
  }
}

fixFile('src/lib/supabase/client.ts');
fixFile('src/lib/supabase/server.ts');
fixFile('src/lib/supabase/middleware.ts');
