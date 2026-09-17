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

    if (file.includes('api\\user\\services')) {
        content = content.replace(/from\s+['"]\.\.\/apiClient['"]/g, 'from "../../apiClient"');
    }
    
    if (file.includes('pages\\admin\\Auth\\AdminLogin')) {
        content = content.replace(/from\s+['"]\.\.\/\.\.\/\.\.\/assets/g, 'from "../../../../assets');
        content = content.replace(/from\s+['"]\.\.\/store\/AuthStore['"]/g, 'from "../../../../store/Auth/AuthStore"');
    }
    
    if (file.includes('components\\admin\\shared')) {
        content = content.replace(/from\s+['"]\.\.\/assets/g, 'from "../../../assets');
        content = content.replace(/src=\{(Logo)\}/, 'src={Logo}'); // wait, this was fine. The import is what fails.
        // wait, Sidebar.jsx imports DCLogo like:
        // import Logo from "../assets/DCLogo.png";
        // but with single or double quotes, the regex above catches it.
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
    }
});

console.log('Fixed more imports 3');
