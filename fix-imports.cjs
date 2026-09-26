const fs = require('fs');
const path = require('path');
const files = [
  'D:\\projects\\beach-mart\\src\\pages\\admin\\Advertisement.jsx',
  'D:\\projects\\beach-mart\\src\\components\\admin\\shared\\brand\\BrandModal.jsx',
  'D:\\projects\\beach-mart\\src\\components\\admin\\shared\\products\\ProductInformation.jsx',
  'D:\\projects\\beach-mart\\src\\components\\admin\\shared\\products\\AddNewVariant.jsx',
  'D:\\projects\\beach-mart\\src\\components\\admin\\shared\\color\\ColorModal.jsx',
  'D:\\projects\\beach-mart\\src\\components\\admin\\shared\\banner\\DeviceContent.jsx',
  'D:\\projects\\beach-mart\\src\\components\\admin\\shared\\category\\CategoryModal.jsx'
];
const targetPath = 'D:\\projects\\beach-mart\\src\\components\\shared\\ImageUploader.jsx';

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    
    // Calculate relative path from file directory to targetPath
    const dir = path.dirname(f);
    let relPath = path.relative(dir, targetPath).replace(/\\/g, '/');
    if (!relPath.startsWith('.')) relPath = './' + relPath;
    // Remove .jsx
    relPath = relPath.replace(/\.jsx$/, '');

    content = content.replace(/import ImageUploader from ['"].*?ImageUploader['"];/g, `import ImageUploader from "${relPath}";`);
    fs.writeFileSync(f, content);
  }
});
