'use client';

import React from 'react';
import { Review } from '../../types';
import { Star } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  let dateFormatted = 'Recently';
  if (review.created_at) {
    try {
      dateFormatted = format(parseISO(review.created_at), 'MMMM yyyy');
    } catch {
      dateFormatted = 'Recently';
    }
  }

  const userAvatar =
    review.user?.avatar ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';

  const userName = review.user?.name || 'Guest User';

  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60">
      <div className="flex items-center gap-3">
        <img
          src={userAvatar}
          alt={userName}
          className="w-10 h-10 rounded-full object-cover border border-neutral-200"
        />
        <div>
          <h4 className="font-bold text-neutral-900 text-sm">{userName}</h4>
          <p className="text-xs text-neutral-500">{dateFormatted}</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Star
            key={idx}
            className={`w-3.5 h-3.5 ${
              idx < Math.floor(review.rating)
                ? 'fill-neutral-900 text-neutral-900'
                : 'fill-neutral-200 text-neutral-200'
            }`}
          />
        ))}
        <span className="text-xs font-bold text-neutral-800 ml-1">{review.rating.toFixed(1)}</span>
      </div>

      <p className="text-xs text-neutral-700 leading-relaxed font-normal">{review.comment}</p>
    </div>
  );
};
