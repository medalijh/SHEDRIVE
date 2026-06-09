const fs = require('fs');

const file = 'src/lib/supabase/server.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const SUPABASE_SERVICE_KEY = process\.env\.SUPABASE_SERVICE_ROLE_KEY \|\| "placeholder-service-key";/g,
  'const SUPABASE_SERVICE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key").trim();'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Trimmed service key in server.ts');
