import fs from 'fs';
import path from 'path';

function fixImportsInDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixImportsInDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Fix useProduct path
            content = content.replace(/..\/..\/api\/hooks\/useProduct/g, '../../../api/user/hooks/useProduct');
            content = content.replace(/..\/..\/..\/api\/hooks\/useProduct/g, '../../../../api/user/hooks/useProduct');
            
            // Fix filtersToSearchParams path
            content = content.replace(/..\/..\/utils\/filtersToSearchParams/g, '../../../utils/filtersToSearchParams');
            content = content.replace(/..\/..\/utils\/searchParamsToFilters/g, '../../../utils/searchParamsToFilters');
            content = content.replace(/..\/..\/..\/utils\/parseImages/g, '../../../../utils/parseImages');
            content = content.replace(/..\/..\/..\/utils\/useDebounce/g, '../../../../utils/useDebounce');

            // Fix assets
            content = content.replace(/..\/..\/..\/assets\/NoProducts.gif/g, '../../../../assets/NoProducts.gif');

            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`Updated imports in ${fullPath}`);
        }
    }
}

fixImportsInDir('src/pages/user/Shop');
