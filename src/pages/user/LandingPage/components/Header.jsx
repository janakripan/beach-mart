export default function Header() {
  return (
    <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="shrink-0 flex items-center">
            <span className="text-2xl font-bold text-slate-900">Beach<span className="text-sky-500">Mart</span></span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-sky-500 font-medium">Home</a>
            <a href="#" className="text-gray-700 hover:text-sky-500 font-medium">Shop</a>
            <a href="#" className="text-gray-700 hover:text-sky-500 font-medium">Categories</a>
            <a href="#" className="text-gray-700 hover:text-sky-500 font-medium">About</a>
          </nav>
          <div className="flex items-center">
            <button className="bg-slate-900 text-white px-5 py-2 rounded-full font-medium hover:bg-slate-800 transition-colors">
              Cart (0)
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
