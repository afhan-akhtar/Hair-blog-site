import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-plum-dark text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">Hair Club</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Beauty advice that feels inspiring—and genuinely useful.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Site</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Latest</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Shop</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Discover</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="#" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Press</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/category/hairstyles" className="hover:text-white transition-colors">Hairstyles</Link></li>
              <li><Link href="/category/hair-color" className="hover:text-white transition-colors">Hair Color</Link></li>
              <li><Link href="/category/hair-care" className="hover:text-white transition-colors">Hair Care</Link></li>
              <li><Link href="/category/styling" className="hover:text-white transition-colors">Styling</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/50">© 2025 Hair Club. All rights reserved.</p>
          <div className="flex gap-4">
            {["Instagram", "Pinterest", "TikTok"].map((social) => (
              <Link key={social} href="#" className="text-sm text-white/50 hover:text-white transition-colors">
                {social}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
