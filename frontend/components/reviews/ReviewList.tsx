'use client';

import React, { useState } from 'react';
import { Review } from '../../types';
import { ReviewCard } from './ReviewCard';
import { Star, MessageSquarePlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

interface ReviewListProps {
  listingId: string;
  reviews: Review[];
  rating: number;
  reviewCount: number;
  onReviewAdded?: () => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  listingId,
  reviews,
  rating,
  reviewCount,
  onReviewAdded,
}) => {
  const { user, showToast } = useAuth();
  const [comment, setComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Please enter a review comment', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createReview(listingId, {
        user_id: user.id,
        rating: newRating,
        comment: comment.trim(),
      });
      showToast('Review submitted successfully!', 'success');
      setComment('');
      if (onReviewAdded) onReviewAdded();
    } catch (err: any) {
      showToast(err.message || 'Failed to post review', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 py-8 border-t border-neutral-200">
      {/* Review Header Stats */}
      <div className="flex items-center gap-2 text-2xl font-bold text-neutral-900">
        <Star className="w-6 h-6 fill-neutral-900 text-neutral-900" />
        <span>{rating > 0 ? rating.toFixed(2) : 'New'}</span>
        <span>·</span>
        <span>{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</span>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((rev) => (
          <ReviewCard key={rev.id} review={rev} />
        ))}
      </div>

      {/* Submit Review Form */}
      <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200 mt-4">
        <h4 className="font-bold text-neutral-900 text-base mb-2 flex items-center gap-2">
          <MessageSquarePlus className="w-5 h-5 text-[#FF385C]" />
          <span>Leave a Review as {user.name}</span>
        </h4>
        <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-neutral-600 mb-1 block">Rating Score</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className="p-1 hover:scale-110 transition"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= newRating
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-neutral-200 text-neutral-200'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-neutral-700 ml-2">{newRating} / 5</span>
            </div>
          </div>

          <div>
            <textarea
              rows={3}
              placeholder="Share details of your stay to help future guests..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-4 rounded-2xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm font-medium bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="self-start bg-neutral-900 hover:bg-black text-white font-bold px-6 py-2.5 rounded-xl transition text-xs shadow-md disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Post Review'}
          </button>
        </form>
      </div>
    </div>
  );
};
