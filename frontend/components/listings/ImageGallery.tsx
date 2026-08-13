'use client';

import React, { useState } from 'react';
import { ListingImage } from '../../types';
import { Grid, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  images: ListingImage[];
  title: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const imgList =
    images && images.length > 0
      ? images.map((i) => i.image_url)
      : ['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&auto=format&fit=crop&q=80'];

  const mainImage = imgList[0];
  const sideImages = imgList.slice(1, 5);

  return (
    <>
      {/* Desktop 5-Photo Grid / Mobile Hero */}
      <div className="relative my-6">
        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-4 gap-2 rounded-3xl overflow-hidden h-[420px]">
          {/* Main Large Image */}
          <div className="col-span-2 h-full relative cursor-pointer group" onClick={() => { setModalIndex(0); setIsOpenModal(true); }}>
            <img
              src={mainImage}
              alt={title}
              className="w-full h-full object-cover group-hover:opacity-90 transition duration-300"
            />
          </div>

          {/* Right Side Images */}
          <div className="col-span-2 grid grid-cols-2 gap-2 h-full">
            {sideImages.map((url, idx) => (
              <div
                key={idx}
                className="relative h-[206px] cursor-pointer group overflow-hidden"
                onClick={() => { setModalIndex(idx + 1); setIsOpenModal(true); }}
              >
                <img
                  src={url}
                  alt={`${title} ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:opacity-90 transition duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Single Hero */}
        <div className="block md:hidden rounded-2xl overflow-hidden h-72 relative">
          <img src={mainImage} alt={title} className="w-full h-full object-cover" />
        </div>

        {/* View All Photos Button */}
        <button
          onClick={() => { setModalIndex(0); setIsOpenModal(true); }}
          className="absolute bottom-4 right-4 bg-white/95 hover:bg-white text-neutral-900 border border-neutral-300 font-semibold text-xs px-4 py-2 rounded-xl shadow-md transition flex items-center gap-2"
        >
          <Grid className="w-4 h-4" />
          <span>Show all photos</span>
        </button>
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 animate-fadeIn">
          {/* Modal Header */}
          <div className="w-full max-w-5xl flex items-center justify-between py-2 text-white">
            <span className="text-sm font-semibold">{modalIndex + 1} / {imgList.length}</span>
            <button
              onClick={() => setIsOpenModal(false)}
              className="p-2 hover:bg-white/10 rounded-full transition text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Display Image */}
          <div className="relative max-w-4xl w-full flex-1 flex items-center justify-center p-4">
            <img
              src={imgList[modalIndex]}
              alt={title}
              className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl"
            />

            {imgList.length > 1 && (
              <>
                <button
                  onClick={() => setModalIndex((prev) => (prev - 1 + imgList.length) % imgList.length)}
                  className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition backdrop-blur-sm"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setModalIndex((prev) => (prev + 1) % imgList.length)}
                  className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition backdrop-blur-sm"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          <div className="py-2 text-center text-xs text-white/70">{title}</div>
        </div>
      )}
    </>
  );
};
