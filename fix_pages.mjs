import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
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

const pages = [
  ...walk('./src/pages/user/OrderHistory'),
  ...walk('./src/pages/user/OrderDetails'),
  ...walk('./src/pages/user/AddressManage')
];

pages.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Fix api imports. In dilka they were probably like `../../api/hooks/...`
    // We want to point them to `../../../../api/user/hooks/...` or similar.
    // Let's use a regex that handles any number of `../` for api hooks.
    content = content.replace(/import\s+(.*?)\s+from\s+['"](?:\.\.\/)+api\/(?:hooks|user\/hooks)\/(.*?)['"];?/g, 
        (match, imports, filePart) => {
            // we will replace with the correct relative path.
            // the depth depends on the file location.
            // pages/user/OrderHistory/page.jsx (depth 3 from src: src -> pages -> user -> OrderHistory -> page.jsx)
            // src is 4 levels up.
            const depth = file.split(path.sep).length - 2; // e.g. src/pages/user/OrderHistory/page.jsx -> split has 5 parts, depth from src is 3. 
            // wait, it's easier to just calculate relative from file dir to src/api/user/hooks
            const fileDir = path.dirname(file);
            const apiDir = path.join('src', 'api', 'user', 'hooks');
            let rel = path.relative(fileDir, apiDir).replace(/\\/g, '/');
            if (!rel.startsWith('.')) rel = './' + rel;
            return `import ${imports} from "${rel}/${filePart}";`;
        }
    );
    
    // Also fix component imports if they import from shared UI or icons.
    // e.g. `../../../components/ui/...` => depends if we have them. 

    // Theme adaptations
    // Font: dilka uses `font-poppins` or `font-archivo`. Beach mart uses `font-arial`.
    content = content.replace(/font-poppins/g, 'font-arial');
    content = content.replace(/font-archivo/g, 'font-arial');
    content = content.replace(/font-public/g, 'font-arial');

    // Branding
    content = content.replace(/fragnance aquisitions/gi, 'purchases');
    content = content.replace(/Dilka/gi, 'Beach Mart');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});

console.log('Pages fixed!');
