import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { MenuSection } from '@/components/menu-section';

export default function Home() {
  return (
    <div className="min-h-screen pb-28">
      {/* Hero */}
      <section className="relative flex items-center overflow-hidden" style={{ height: '92vh', minHeight: 580 }}>
        <div className="absolute inset-0">
          <img
            src="/hero-bbq.png"
            alt=""
            className="w-full h-full object-cover object-center"
            style={{ transform: 'scale(1.03)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.80) 50%, rgba(0,0,0,0.20) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.60) 0%, transparent 50%, rgba(0,0,0,0.10) 100%)' }} />
          <div className="absolute bottom-0 inset-x-0 h-40" style={{ background: 'linear-gradient(to top, var(--background), transparent)' }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-white/80 text-xs font-semibold uppercase tracking-[0.12em] mb-8 backdrop-blur-sm"
                 style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--primary)' }} />
              Open Now · Bahawalpur, Pakistan
            </div>

            <h1 className="font-heading font-black tracking-tighter text-white leading-[0.88] mb-6"
                style={{ fontSize: 'clamp(3.5rem, 10vw, 7.5rem)' }}>
              FLARE<br />
              <span style={{ color: 'var(--primary)' }}>BY TK.</span>
            </h1>

            <p className="text-base sm:text-lg text-white/60 max-w-sm leading-relaxed mb-10">
              Fire-grilled meats, bold flavors, and Bahawalpur&apos;s finest fast-casual dining — order in minutes.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a href="#menu-section"
                 className="inline-flex items-center gap-2.5 font-bold rounded-full text-base text-white transition-opacity hover:opacity-90"
                 style={{ backgroundColor: 'var(--primary)', height: '3.25rem', padding: '0 2rem', boxShadow: '0 8px 24px rgba(255,107,26,0.30)' }}>
                Order Now
                <ChevronDown className="h-4 w-4" />
              </a>
              <Link href="/deals"
                    className="inline-flex items-center font-bold rounded-full text-base text-white backdrop-blur-sm transition-colors"
                    style={{ height: '3.25rem', padding: '0 2rem', border: '1px solid rgba(255,255,255,0.20)', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                View Deals
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-12 text-sm text-white/40">
              <div><span className="text-white font-bold">68+</span> menu items</div>
              <div className="h-3 w-px bg-white/15 hidden sm:block" />
              <div><span className="text-white font-bold">Rs. 150</span> delivery</div>
              <div className="h-3 w-px bg-white/15 hidden sm:block" />
              <div>Cash on delivery</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/30 animate-bounce">
          <ChevronDown className="h-5 w-5" />
        </div>
      </section>

      {/* Menu */}
      <div id="menu-section">
        <MenuSection />
      </div>
    </div>
  );
}
