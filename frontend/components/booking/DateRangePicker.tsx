'use client';

import React from 'react';
import { DateRange } from '../../types';

interface DateRangePickerProps {
  checkIn: string;
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
  disabledRanges?: DateRange[];
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  checkIn,
  checkOut,
  onChange,
  disabledRanges = [],
}) => {
  const today = new Date().toISOString().split('T')[0];

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCin = e.target.value;
    if (checkOut && newCin >= checkOut) {
      onChange(newCin, '');
    } else {
      onChange(newCin, checkOut);
    }
  };

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCout = e.target.value;
    onChange(checkIn, newCout);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 rounded-2xl border border-neutral-300 overflow-hidden focus-within:ring-2 focus-within:ring-neutral-900">
        {/* Check In */}
        <div className="p-3 border-r border-neutral-300 bg-white">
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-900 block mb-0.5">
            Check-In
          </label>
          <input
            type="date"
            min={today}
            value={checkIn}
            onChange={handleCheckInChange}
            className="w-full text-xs font-semibold text-neutral-900 bg-transparent focus:outline-none cursor-pointer"
          />
        </div>

        {/* Check Out */}
        <div className="p-3 bg-white">
          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-900 block mb-0.5">
            Checkout
          </label>
          <input
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={handleCheckOutChange}
            className="w-full text-xs font-semibold text-neutral-900 bg-transparent focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Booked ranges notice if any */}
      {disabledRanges.length > 0 && (
        <div className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
          <p className="font-bold">Unavailable Booked Dates:</p>
          <ul className="list-disc list-inside mt-0.5">
            {disabledRanges.map((r, idx) => (
              <li key={idx}>
                {r.check_in} to {r.check_out}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
