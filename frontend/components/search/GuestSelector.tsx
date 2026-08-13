'use client';

import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface GuestSelectorProps {
  adults: number;
  childrenCount: number;
  onChange: (adults: number, childrenCount: number) => void;
}

export const GuestSelector: React.FC<GuestSelectorProps> = ({
  adults,
  childrenCount,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-6 py-2">
      {/* Adults */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-neutral-900 text-sm">Adults</h4>
          <p className="text-xs text-neutral-500">Ages 13 or above</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChange(Math.max(1, adults - 1), childrenCount)}
            disabled={adults <= 1}
            className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-900 disabled:opacity-30 disabled:hover:border-neutral-300 transition"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-6 text-center font-bold text-sm text-neutral-900">{adults}</span>
          <button
            type="button"
            onClick={() => onChange(adults + 1, childrenCount)}
            className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-900 transition"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Children */}
      <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
        <div>
          <h4 className="font-bold text-neutral-900 text-sm">Children</h4>
          <p className="text-xs text-neutral-500">Ages 2–12</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onChange(adults, Math.max(0, childrenCount - 1))}
            disabled={childrenCount <= 0}
            className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-900 disabled:opacity-30 disabled:hover:border-neutral-300 transition"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-6 text-center font-bold text-sm text-neutral-900">{childrenCount}</span>
          <button
            type="button"
            onClick={() => onChange(adults, childrenCount + 1)}
            className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-900 transition"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
