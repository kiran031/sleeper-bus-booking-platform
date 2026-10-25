import React from 'react'
import { formatDate, formatTIme } from '../utils/DateTimeUtils'

const BookingSummaryPanel = ({searchParm,bookingSeat,setActiveStep}) => {

     const source = searchParm.get("source")
      const destination = searchParm.get("destination")
      const departureTime = searchParm.get("departureTime")
      const departureDate = searchParm.get("departureDate")
      const arrivalTime = searchParm.get("arrivalTime")
      const arrivalDate = searchParm.get("arrivalDate")
      const distance = searchParm.get("distance")
      const busNumber = searchParm.get("busNumber")
      const busName = searchParm.get("busName");
      const price = searchParm.get("fare")

  return (
    <>
      <div className="w-[34%] min-w-0 self-start">
        <div className="sticky top-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#5B3DF5]/10 text-[#5B3DF5]">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="5" y="3" width="14" height="18" rx="2" />
                <path d="M9 7h6M9 11h6M9 15h3" />
              </svg>
            </div>

            <div className="min-w-0">
              <h2 className="text-xl font-bold text-slate-900">
                Booking Summary
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Review your trip and fare details
              </p>
            </div>
          </div>

          {/* Trip Details */}
          <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Trip Details
              </h3>

              <button
                type="button"
                className="text-xs font-semibold text-[#5B3DF5] hover:underline"
              >
                Edit
              </button>
            </div>

            {/* Journey Timeline */}
            <div className="grid grid-cols-[12px_minmax(0,1fr)] gap-x-3">

              {/* Timeline */}
              <div className="flex flex-col items-center pt-1">
                <span className="h-3 w-3 rounded-full border-2 border-[#5B3DF5] bg-white" />

                <span className="my-1 h-[76px] border-l border-dashed border-slate-300" />

                <span className="h-3 w-3 rounded-full border-2 border-[#5B3DF5] bg-white" />
              </div>

              {/* Locations */}
              <div className="min-w-0">
                {/* Source */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900">
                      {source}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Fri {formatDate(departureDate)}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-bold text-slate-900">
                    {formatTIme(departureTime)} PM
                  </p>
                </div>

                {/* Duration */}
                <div className="my-4 flex items-center gap-2 text-[11px] font-medium text-slate-500">
                  <span className="whitespace-nowrap">
                    8h 30m
                  </span>

                  <span className="h-px flex-1 border-t border-dashed border-slate-300" />

                  <span className="whitespace-nowrap">
                    {distance} km
                  </span>
                </div>

                {/* Destination */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900">
                      {destination}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Sat, {formatDate(arrivalDate)}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-bold text-slate-900">
                    {formatTIme(arrivalTime)} AM
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 border-t border-slate-100" />

          {/* Bus Details */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Bus Details
              </h3>

              <button
                type="button"
                className="text-xs font-semibold text-[#5B3DF5] hover:underline"
              >
                Edit
              </button>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 17V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12" />
                  <path d="M5 10h14M5 14h14M7 17v3M17 17v3M5 17h14" />
                  <path d="M8 6h8" />
                  <circle cx="8" cy="17" r="1" />
                  <circle cx="16" cy="17" r="1" />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    {busName}
                  </h4>

                  <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-700">
                    <svg
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                      viewBox="0 0 24 24"
                    >
                      <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3 1.2-6.9-5-4.9 6.9-1L12 2Z" />
                    </svg>
                    4.5
                  </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  AC Sleeper (2+1) · Volvo 9600
                </p>

                <p className="text-xs text-slate-500">
                  Bus No: {busNumber}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6 border-t border-slate-100" />

          {/* Selected Seats */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Selected Seats {bookingSeat.length}
              </h3>

              <button
                type="button"
                className="text-xs font-semibold text-[#5B3DF5] hover:underline"
              >
                Edit
              </button>
            </div>


            <div className="flex flex-wrap gap-2">
              {
                bookingSeat.map((seat, seatIdx) => {
                  return <span key={seatIdx} className="rounded-lg border border-[#5B3DF5]/30 bg-[#5B3DF5]/10 px-4 py-2 text-xs font-bold text-[#5B3DF5]">
                    {seat}
                  </span>
                })
              }
            </div>

          </div>

          <div className="mb-6 border-t border-slate-100" />

          {/* Fare Details */}
          <div className="mb-5">
            <h3 className="mb-4 text-sm font-bold text-slate-900">
              Fare Details
            </h3>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-start justify-between gap-3">
                <span className="text-slate-500">
                  Base Fare (₹ {price} × {bookingSeat.length} seats)
                </span>

                <span className="shrink-0 font-semibold text-slate-700">
                  {bookingSeat.length * price}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">
                  GST (5%)
                </span>

                <span className="font-semibold text-slate-700">
                  ₹90
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-500">
                  Convenience Fee
                </span>

                <span className="font-semibold text-slate-700">
                  ₹20
                </span>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="mb-5 flex items-center justify-between gap-3 border-t border-dashed border-slate-200 pt-4">
            <span className="text-sm font-bold text-slate-700">
              Total Amount
            </span>

            <span className="text-xl font-extrabold text-[#5B3DF5]">
              ₹{(bookingSeat.length * price) + 90 + 20}
            </span>
          </div>

          {/* Continue Button */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5B3DF5] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#4930D0] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B3DF5] focus-visible:ring-offset-2"
            onClick={()=>setActiveStep(3)}
          >
            Review & Pay

            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>

          {/* Secure Booking Note */}
          <div className="mt-4 flex items-center justify-center gap-2 text-center text-[10px] text-slate-500">
            <svg
              className="h-4 w-4 shrink-0 text-emerald-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>

            <span>Secure booking · No hidden charges</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default BookingSummaryPanel