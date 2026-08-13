'use client';

import React from 'react';
import { Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 mt-20 text-neutral-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-bold text-neutral-900 mb-4">Support</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><a href="#" className="hover:underline">Help Center</a></li>
              <li><a href="#" className="hover:underline">AirCover</a></li>
              <li><a href="#" className="hover:underline">Anti-discrimination</a></li>
              <li><a href="#" className="hover:underline">Disability support</a></li>
              <li><a href="#" className="hover:underline">Cancellation options</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-neutral-900 mb-4">Hosting</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><a href="/host" className="hover:underline">Airbnb your home</a></li>
              <li><a href="#" className="hover:underline">AirCover for Hosts</a></li>
              <li><a href="#" className="hover:underline">Hosting resources</a></li>
              <li><a href="#" className="hover:underline">Community forum</a></li>
              <li><a href="#" className="hover:underline">Hosting responsibly</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-neutral-900 mb-4">Airbnb</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><a href="#" className="hover:underline">Newsroom</a></li>
              <li><a href="#" className="hover:underline">New features</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Investors</a></li>
              <li><a href="#" className="hover:underline">Gift cards</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-neutral-900 mb-4">Demo Application</h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Full-Stack Airbnb Marketplace Clone built with Next.js 14, TypeScript, Tailwind CSS, FastAPI, and SQLite.
            </p>
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-neutral-500">
          <div className="flex flex-wrap items-center gap-4">
            <span>© 2026 Airbnb Clone, Inc.</span>
            <span>·</span>
            <a href="#" className="hover:underline">Privacy</a>
            <span>·</span>
            <a href="#" className="hover:underline">Terms</a>
            <span>·</span>
            <a href="#" className="hover:underline">Sitemap</a>
          </div>
          <div className="flex items-center gap-6 font-semibold text-neutral-800">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>English (US)</span>
            </div>
            <span>₹ INR</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
