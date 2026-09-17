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

    // Fix imports going to constants
    content = content.replace(/from\s+['"]((?:\.\.\/)+)constants\/data['"]/g, 'from "../../../constants/data"');
    
    // Specifically fix the known broken ones based on depth
    if (file.includes('pages\\user\\LandingPage')) {
        content = content.replace(/from\s+['"]\.\.\/\.\.\/\.\.\/constants\/data['"]/g, 'from "../../../../constants/data"');
    }
    
    if (file.includes('components\\admin\\shared')) {
        // Since it moved from src/admin to src/components/admin/shared (depth + 2)
        // ../../api/admin/hooks goes to ../../../../api/admin/hooks
        content = content.replace(/from\s+['"]\.\.\/\.\.\/api\/admin\/hooks['"]/g, 'from "../../../../api/admin/hooks"');
        content = content.replace(/from\s+['"]\.\.\/\.\.\/api\/admin\/services['"]/g, 'from "../../../../api/admin/services"');
        content = content.replace(/from\s+['"]\.\.\/api\/admin\/hooks['"]/g, 'from "../../../api/admin/hooks"');
    }
    
    if (file.includes('api\\admin\\useReturnData.js')) {
        content = content.replace(/from\s+['"]\.\.\/hooks\/useReturn['"]/g, 'from "../user/hooks/useReturn"');
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
    }
});

console.log('Fixed imports');
