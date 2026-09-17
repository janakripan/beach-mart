import fs from 'fs';

let content = fs.readFileSync('src/pages/Auth/Signup/SignupForm.jsx', 'utf8');

// Update Field classNames
content = content.replace(/className={`w-full px-4 py-3 border rounded-\[12px\] text-sm\s*focus:outline-none\s*transition-all \${(.*?) \? 'border-red-500' : 'border-gray-300'\s*}`}/g,
    `className={\`w-full px-4 py-3 border rounded-[12px] text-sm focus:outline-none transition-all bg-white hover:bg-[#F8FCF8] focus:bg-[#F8FCF8] focus:shadow-sm \${$1 ? 'border-red-500' : 'border-gray-200 hover:border-[#E3F0E2] focus:border-primary'}\`}`);

// Update Submit button
content = content.replace(/className="w-full bg-black text-white py-2 rounded-\[12px\] font-roboto font-medium hover:bg-gray-800/g,
    'className="w-full bg-primary text-white py-2 rounded-[12px] font-roboto font-medium hover:bg-[#126442]/90');

fs.writeFileSync('src/pages/Auth/Signup/SignupForm.jsx', content, 'utf8');
console.log('Signup form updated');
