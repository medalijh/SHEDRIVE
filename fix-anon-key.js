const fs = require('fs');

const files = [
  'src/lib/supabase/client.ts',
  'src/lib/supabase/server.ts',
  'src/lib/supabase/middleware.ts'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace anon key assignment
  content = content.replace(
    /const SUPABASE_ANON_KEY = process\.env\.NEXT_PUBLIC_SUPABASE_ANON_KEY \|\| "placeholder-anon-key";/g,
    'const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key").trim();'
  );

  content = content.replace(
    /const supabaseKey\s*=\s*process\.env\.NEXT_PUBLIC_SUPABASE_ANON_KEY;/g,
    'const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();'
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log('Trimmed anon key in', file);
});
