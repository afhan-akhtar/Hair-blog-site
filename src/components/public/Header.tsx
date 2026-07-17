import Link from "next/link";
import { Search } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-bold tracking-tight">
          Hair Club
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-plum transition-colors">
            Articles
          </Link>
          <Link href="/category/hair-care" className="hover:text-plum transition-colors">
            Hair Care
          </Link>
          <Link href="/category/hairstyles" className="hover:text-plum transition-colors">
            Categories
          </Link>
          <Link href="#" className="hover:text-plum transition-colors">
            About
          </Link>
        </nav>
        <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
          <Search className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </header>
  );
}
