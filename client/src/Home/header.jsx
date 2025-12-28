


// if user clicked join we create new account for user
// if user clicked login we just make user log in back to his account


export default function Header() {
  return (
    <header className="w-full  p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide select-none cursor-pointer">
          WordRace
        </h1>

        {/* Navigation */}
        <nav className="flex space-x-4">
          <button className="cursor-pointer px-4 py-2 bg-[#273F4F] border border-white text-white font-semibold rounded-lg shadow hover:bg-[#132e42] transition">
            Join
          </button>
          <button className="cursor-pointer px-4 py-2 border border-white text-white font-semibold hover:backdrop-grayscale-200 rounded-lg transition">
            Login
          </button>
        </nav>
      </div>
    </header>
  );
}
