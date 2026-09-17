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

const allFiles = walk('./src');

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace all store/Auth/AuthStore to pages/Auth/store/AuthStore
    content = content.replace(/store\/Auth\/AuthStore/g, 'pages/Auth/store/AuthStore');
    // For specific Auth files that moved up one directory, reduce their relative path depths:
    if (file.includes('pages\\Auth\\AdminLogin\\page.jsx')) {
        content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/assets/g, '../../../assets');
        content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/store\/Auth\/AuthStore/g, '../../store/AuthStore');
        content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/pages\/Auth\/store\/AuthStore/g, '../../store/AuthStore');
    }
    if (file.includes('pages\\Auth\\AdminLogin\\AdminLoginForm.jsx')) {
        content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/api/g, '../../../api');
        content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/store\/Auth\/AuthStore/g, '../../store/AuthStore');
        content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/pages\/Auth\/store\/AuthStore/g, '../../store/AuthStore');
        content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/pages\/user/g, '../../user');
    }
    if (file.includes('pages\\Auth\\store\\AuthStore.jsx')) {
        content = content.replace(/\.\.\/\.\.\/pages\/user/g, '../../user');
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
    }
});

console.log('Fixed auth imports');
