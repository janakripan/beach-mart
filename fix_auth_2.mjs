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

const allFiles = walk('./src/pages/Auth');

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    content = content.replace(/\.\.\/\.\.\/\.\.\/api\/hooks\//g, '../../../api/user/hooks/');
    content = content.replace(/\.\.\/\.\.\/Checkout\//g, '../../user/Checkout/');
    content = content.replace(/\.\.\/\.\.\/Cart\//g, '../../user/Cart/');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
    }
});

console.log('Fixed signin/signup imports');
