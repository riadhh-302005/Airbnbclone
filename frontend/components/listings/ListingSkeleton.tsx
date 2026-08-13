'use client';

import React from 'react';

export const ListingSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="aspect-square w-full rounded-2xl bg-neutral-200" />
      <div className="h-4 bg-neutral-200 rounded-md w-3/4" />
      <div className="h-3 bg-neutral-200 rounded-md w-1/2" />
      <div className="h-4 bg-neutral-200 rounded-md w-1/3" />
    </div>
  );
};
