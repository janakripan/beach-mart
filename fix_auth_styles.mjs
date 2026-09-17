import fs from 'fs';
import path from 'path';

function updateForms() {
    const files = [
        'src/pages/Auth/AdminLogin/AdminLoginForm.jsx',
        'src/pages/Auth/SignIn/SignInForm.jsx',
        'src/pages/Auth/Signup/SignupForm.jsx'
    ];

    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');

        // Remove mobile logo background & double size
        content = content.replace(/<div className="[^"]*bg-black[^"]*">\s*<img src={Logo} alt="[^"]*" className="[^"]*" \/>\s*<\/div>/g, 
            '<img src={Logo} alt="logo" className="h-28 md:h-32 w-auto object-contain" />');
        
        // Ensure the parent container doesn't have bg-black if the previous regex didn't catch it
        // specifically for SignupForm where it's `<div className="lg:hidden mb-8 flex justify-center bg-black rounded-lg ">`
        content = content.replace(/<div className="lg:hidden mb-8 flex justify-center bg-black rounded-lg\s*">/g, 
            '<div className="lg:hidden mb-8 flex justify-center">');

        // Form inputs styling
        // Original: className="w-full px-4 py-3 border focus:outline-none text-sm rounded-full"
        // Replace with Admin Sidebar theme matching classes
        content = content.replace(/className="[^"]*w-full px-4 py-3 border focus:outline-none text-sm rounded-full[^"]*"/g,
            'className="w-full px-4 py-3 border border-gray-200 text-sm rounded-[12px] bg-white hover:bg-[#F8FCF8] hover:border-[#E3F0E2] focus:bg-[#F8FCF8] focus:border-primary focus:outline-none focus:shadow-sm transition-all duration-200"');
            
        // Form inputs for SignupForm (they might be different)
        content = content.replace(/className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"/g,
            'className="w-full px-4 py-3 border border-gray-200 text-sm rounded-[12px] bg-white hover:bg-[#F8FCF8] hover:border-[#E3F0E2] focus:bg-[#F8FCF8] focus:border-primary focus:outline-none focus:shadow-sm transition-all duration-200"');

        // Button rounding (make it match rounded-[12px] instead of rounded-full)
        content = content.replace(/rounded-full/g, 'rounded-[12px]');

        // Write back
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated form ${file}`);
    });
}

function updatePages() {
    const files = [
        'src/pages/Auth/AdminLogin/page.jsx',
        'src/pages/Auth/SignIn/page.jsx',
        'src/pages/Auth/Signup/page.jsx'
    ];

    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');

        // Make desktop logo double size and responsive
        // Original: <img src={Logo} alt="logo" className=' h-20 object-cover ' />
        content = content.replace(/<img src={Logo} alt="logo" className=['"]\s*h-20 object-cover\s*['"] \/>/g, 
            '<img src={Logo} alt="logo" className="h-40 md:h-48 w-auto object-contain" />');

        // Also change AuthBg overlay if "remove background of all logo sections" meant removing the black overlay
        // <div className='absolute inset-0 bg-black/12'></div>
        // Let's remove the bg-black/12 or keep it? The user said "remove the background of the admin login page logo section and all of the login page logo section".
        // Usually, the logo section is the left half on desktop where the logo is centered. It has an image background. I will remove `bg-black/12` to make it clear.
        content = content.replace(/<div className=['"]absolute inset-0 bg-black\/12['"]><\/div>/g, 
            '');
            
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated page ${file}`);
    });
}

updateForms();
updatePages();
