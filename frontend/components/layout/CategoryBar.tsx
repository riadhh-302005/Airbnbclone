'use client';

import React from 'react';
import {
  Umbrella,
  TreePine,
  Castle,
  Mountain,
  Waves,
  Sparkles,
  Home,
  Palette,
  Flame,
  Filter,
} from 'lucide-react';

export const CATEGORIES = [
  { label: 'All', icon: Sparkles },
  { label: 'Beachfront', icon: Umbrella },
  { label: 'Cabins', icon: TreePine },
  { label: 'Mansions', icon: Castle },
  { label: 'Amazing views', icon: Mountain },
  { label: 'Amazing pools', icon: Waves },
  { label: 'Luxury', icon: Sparkles },
  { label: 'Countryside', icon: Home },
  { label: 'Design', icon: Palette },
  { label: 'Trending', icon: Flame },
];

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenFilterModal?: () => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  onOpenFilterModal,
}) => {
  return (
    <div className="bg-white border-b border-neutral-200 py-4 sticky top-20 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Scrollable Categories Row */}
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-1 scroll-smooth">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected =
              selectedCategory === cat.label ||
              (selectedCategory === '' && cat.label === 'All');

            return (
              <button
                key={cat.label}
                onClick={() => onSelectCategory(cat.label === 'All' ? '' : cat.label)}
                className={`flex flex-col items-center gap-2 pb-2 text-xs font-semibold whitespace-nowrap transition border-b-2 ${
                  isSelected
                    ? 'text-neutral-900 border-neutral-900 font-bold'
                    : 'text-neutral-500 border-transparent hover:text-neutral-800 hover:border-neutral-300'
                }`}
              >
                <Icon className={`w-6 h-6 ${isSelected ? 'text-neutral-900' : 'text-neutral-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filter Button Trigger */}
        {onOpenFilterModal && (
          <button
            onClick={onOpenFilterModal}
            className="flex items-center gap-2 border border-neutral-300 rounded-xl px-4 py-2.5 text-xs font-bold text-neutral-800 hover:border-neutral-900 hover:bg-neutral-50 transition shrink-0 shadow-xs"
          >
            <Filter className="w-4 h-4 text-neutral-700" />
            <span>Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
