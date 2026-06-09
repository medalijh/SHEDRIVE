const fs = require('fs');

const files = [
  'src/lib/supabase/client.ts',
  'src/lib/supabase/server.ts',
  'src/lib/supabase/middleware.ts'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace('function cleanUrl(url) {', 'function cleanUrl(url: string | undefined | null): string {');
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed types in', file);
});
