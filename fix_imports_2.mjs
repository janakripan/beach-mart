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

    // utils
    content = content.replace(/['"](?:\.\.\/)+utils\/(.*?)['"]/g, '"../../../../utils/$1"');
    
    // AuthStore
    content = content.replace(/['"](?:\.\.\/)+Auth\/store\/AuthStore['"]/g, '"../../../Auth/store/AuthStore"');
    content = content.replace(/['"](?:\.\.\/)+pages\/Auth\/store\/AuthStore['"]/g, '"../../../Auth/store/AuthStore"');
    
    // DotWaveLoader
    content = content.replace(/['"](?:\.\.\/)+components\/DotWaveLoader['"]/g, '"../../../../components/admin/DotWaveLoader"');
    
    // Assets (dirham.svg)
    content = content.replace(/['"](?:\.\.\/)+assets\/dirham\.svg['"]/g, '"../../../../assets/dirham.svg"');
    
    // Assets (empty-orders.svg, etc)
    content = content.replace(/['"](?:\.\.\/)+assets\/(.*?)['"]/g, '"../../../../assets/$1"');

    // Remove duplicates if any were already replaced by node script
    // Oh wait, `../../../../utils/...` - if the file is in `src/pages/user/OrderHistory/components/TransitCard.jsx`, 
    // it's 4 levels down (TransitCard -> components -> OrderHistory -> user -> pages). Wait.
    // src/pages/user/OrderHistory/components/TransitCard.jsx
    // To get to `src/utils`:
    // ../ -> components
    // ../../ -> OrderHistory
    // ../../../ -> user
    // ../../../../ -> pages
    // ../../../../../ -> src
    // Wait. `../../../../../utils/...`
    // Let's dynamically calculate the path to `src` from `file`.
    
    const depth = file.split(path.sep).length - 2; // src/pages/user/OrderHistory/page.jsx -> 5 parts -> depth 3 (from src)
    // Actually, src is index 1.
    const parts = file.split(path.sep);
    const srcIndex = parts.indexOf('src');
    const depthToSrc = parts.length - srcIndex - 1;
    let upToSrc = '';
    for(let i=1; i<depthToSrc; i++) {
        upToSrc += '../';
    }
    // if file is src/pages/user/OrderHistory/page.jsx
    // depthToSrc = 5 - 1 - 1 = 3.
    // i=1: '../', i=2: '../../'.  Wait.
    // file is in OrderHistory/. So to get to src/ it's `../../../`
    upToSrc = '../'.repeat(depthToSrc - 1);
    
    // replace `utils`
    content = content.replace(/['"](?:\.\.\/)+utils\/(.*?)['"]/g, `"${upToSrc}utils/$1"`);
    
    // replace `AuthStore` (in src/pages/Auth/store/AuthStore)
    // to get to src/pages: `../`.repeat(depthToSrc - 2)
    const upToPages = '../'.repeat(depthToSrc - 2);
    content = content.replace(/['"](?:\.\.\/)+Auth\/store\/AuthStore['"]/g, `"${upToPages}Auth/store/AuthStore"`);
    
    // replace `DotWaveLoader` (in src/components/admin/DotWaveLoader)
    content = content.replace(/['"](?:\.\.\/)+components\/DotWaveLoader['"]/g, `"${upToSrc}components/admin/DotWaveLoader"`);
    content = content.replace(/['"](?:\.\.\/)+components\/admin\/DotWaveLoader['"]/g, `"${upToSrc}components/admin/DotWaveLoader"`);

    // assets
    content = content.replace(/['"](?:\.\.\/)+assets\/(.*?)['"]/g, `"${upToSrc}assets/$1"`);

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated imports in ${file}`);
    }
});

console.log('Fixes complete!');
