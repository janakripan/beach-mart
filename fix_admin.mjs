import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const adminComponents = walk('./src/components/admin');
const adminPages = walk('./src/pages/admin');
const adminAuth = walk('./src/pages/Auth/AdminLogin');
const allFiles = [...adminComponents, ...adminPages, ...adminAuth];

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Text replacement
    content = content.replace(/Dilka Center/gi, 'Beach Mart');
    content = content.replace(/Dilka Centre/gi, 'Beach Mart');
    content = content.replace(/Dilka Centere/gi, 'Beach Mart');
    content = content.replace(/Dilka Perfumes/gi, 'Beach Mart');

    // Logo replacement
    content = content.replace(/import\s+([a-zA-Z0-9_]+)\s+from\s+['"].*DCLogo\.png['"];?/g, 'const $1 = "/Logo.png";');

    // Theme replacement (bg-black -> bg-primary, etc)
    // We only want to replace bg-black with bg-primary in Sidebar where it's the main theme color
    if (file.includes('Sidebar.jsx') || file.includes('MobileNavbar.jsx') || file.includes('Navbar.jsx')) {
        content = content.replace(/bg-black/g, 'bg-primary');
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});

console.log('Admin updates complete!');
