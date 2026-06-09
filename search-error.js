const fs = require('fs');
const path = require('path');

function searchInDir(dir, pattern) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            searchInDir(fullPath, pattern);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.ts') || fullPath.endsWith('.cjs') || fullPath.endsWith('.mjs')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(pattern)) {
                console.log(`Found in: ${fullPath}`);
            }
        }
    }
}

searchInDir('./node_modules', 'Invalid path specified in request URL');
