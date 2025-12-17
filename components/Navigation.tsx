'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/mantras', label: 'Mantra Library' },
    { href: '/tracker', label: 'Chanting Tracker' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 dark:from-amber-900 dark:via-orange-900 dark:to-amber-800 shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
            <span className="text-white font-bold text-xl">Krishna Bhakti</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-white font-medium transition-all duration-200 hover:scale-110 ${
                  isActive(item.href) ? 'border-b-2 border-white pb-1' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 hover:scale-110"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-white" />
              ) : (
                <Sun className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-white" />
              ) : (
                <Sun className="w-5 h-5 text-white" />
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-amber-600 dark:bg-amber-900 border-t border-amber-700 dark:border-amber-800 animate-slideDown">
          <div className="px-4 py-3 space-y-2">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full text-left px-4 py-2 text-white font-medium rounded transition-all duration-200 ${
                  isActive(item.href) ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
