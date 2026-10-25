import React from "react";
import { useNavigate } from "react-router";
import { formatDate, formatTIme } from "../utils/DateTimeUtils";

const BusList = ({ buses = [] }) => {
    const navigate = useNavigate();

    const busResults = Array.isArray(buses) ? buses : [];
    

    const handleViewSeats = (bus) => {
        const fare = bus.fare ?? bus.price ?? "";

        const bookingDetails = {
            busName: bus.busName,
            busNumber: bus.busNumber,
            distance: bus.distance,
            busType: bus.busType,
            source: bus.source,
            destination: bus.destination,
            departureDate: bus.departureDate,
            departureTime: bus.departureTime,
            arrivalDate: bus.arrivalDate,
            arrivalTime: bus.arrivalTime,
            fare,
            scheduleId: bus.scheduleId,
        };

        const query = new URLSearchParams();

        Object.entries(bookingDetails).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== "") {
                query.set(key, String(value));
            }
        });

        navigate(`/booking/${bus.busId}?${query.toString()}`);
    };

    return (
        <section
            id="bus-results"
            className="mx-auto mt-12 w-full max-w-7xl pb-16 text-white"
        >
            {/* Results heading */}
            <header className="mb-7 flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="h-[3px] w-10 rounded-full bg-indigo-500" />

                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
                            Your Journey
                        </p>
                    </div>

                    <h2
                        className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
                        style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                    >
                        Choose Your{" "}
                        <span className="bg-gradient-to-r from-indigo-300 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                            Sleeper Bus
                        </span>
                    </h2>

                    <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                        Compare departure times, journey duration, amenities
                        and fares to find the right bus for your trip.
                    </p>
                </div>

                <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-4 py-2.5 backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-indigo-400" />

                    <span className="text-sm font-medium text-slate-200">
                        {busResults.length}{" "}
                        {busResults.length === 1 ? "bus" : "buses"} found
                    </span>
                </div>
            </header>

            {/* Empty state */}
            {busResults.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-slate-900/50 px-5 py-12 text-center shadow-xl shadow-black/10 backdrop-blur-md sm:py-16">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
                        <svg
                            className="h-8 w-8"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <rect x="3" y="4" width="18" height="15" rx="3" />
                            <path d="M7 19v2M17 19v2M3 11h18M7 8h.01M17 8h.01" />
                        </svg>
                    </div>

                    <h3 className="mt-5 text-xl font-bold text-white sm:text-2xl">
                        No buses found
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
                        We couldn't find buses for this search. Try a different
                        route or travel date.
                    </p>
                </div>
            ) : (
                /* Bus result cards */
                <div className="grid gap-5">
                    {busResults.map((bus, index) => {
                        const fare = bus.fare ?? bus.price;

                        return (
                            <article
                                key={bus.busId ?? bus.scheduleId ?? index}
                                className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-950/50 shadow-xl shadow-black/10 backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-indigo-300/30 hover:shadow-2xl hover:shadow-indigo-950/20"
                            >
                                {/* Bus name and badges */}
                                <header className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.03] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                                    <div className="flex min-w-0 items-center gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
                                            <svg
                                                className="h-6 w-6"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <rect x="3" y="4" width="18" height="15" rx="3" />
                                                <path d="M7 19v2M17 19v2M3 11h18M7 8h.01M17 8h.01" />
                                            </svg>
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="truncate text-lg font-bold text-white sm:text-xl">
                                                {bus.busName ||
                                                    `Bus ${bus.busNumber ?? ""}`}
                                            </h3>

                                            {bus.busNumber && (
                                                <p className="mt-1 text-sm text-slate-400">
                                                    Bus No. {bus.busNumber}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                        {bus.busType && (
                                            <span className="rounded-full border border-indigo-300/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-200">
                                                {bus.busType}
                                            </span>
                                        )}

                                        {bus.rating != null && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-200">
                                                <span aria-hidden="true">★</span>
                                                {bus.rating}
                                            </span>
                                        )}
                                    </div>
                                </header>

                                {/* Departure, route and arrival */}
                                <div className="grid grid-cols-1 items-center gap-7 px-5 py-7 sm:grid-cols-[1fr_1.2fr_1fr] sm:px-7">
                                    {/* Departure */}
                                    <div className="min-w-0 space-y-2">
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                            Departure
                                        </p>

                                        <h4 className="text-3xl font-extrabold tracking-tight text-white">
                                            {formatTIme(bus.departureTime) || "--:--"}
                                        </h4>

                                        <p className="break-words text-base font-semibold text-slate-200">
                                            {bus.source || "Departure city"}
                                        </p>

                                        {bus.departureDate && (
                                            <p className="text-sm text-slate-400">
                                                {formatDate(bus.departureDate)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Route timeline */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <svg
                                                className="h-4 w-4 text-indigo-300"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <circle cx="12" cy="12" r="9" />
                                                <path d="M12 7v5l3 2" />
                                            </svg>

                                            <p className="text-sm font-medium text-slate-300">
                                                {bus.duration || "Journey"}
                                            </p>
                                        </div>

                                        <div className="flex w-full items-center">
                                            <span className="h-3 w-3 shrink-0 rounded-full border-2 border-indigo-300 bg-slate-950" />

                                            <span className="h-px flex-1 bg-gradient-to-r from-indigo-400/80 via-violet-400/60 to-blue-400/80" />

                                            <svg
                                                className="mx-1 h-5 w-5 shrink-0 text-indigo-300"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <path d="M3 17h18M5 17l2-6h10l2 6M7 11V7h10v4M7 20v-3M17 20v-3" />
                                            </svg>

                                            <span className="h-3 w-3 shrink-0 rounded-full border-2 border-blue-300 bg-slate-950" />
                                        </div>

                                        <p className="text-center text-xs font-medium text-slate-400">
                                            {bus.source || "Source"} →{" "}
                                            {bus.destination || "Destination"}
                                        </p>
                                    </div>

                                    {/* Arrival */}
                                    <div className="min-w-0 space-y-2 sm:text-right">
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                            Arrival
                                        </p>

                                        <h4 className="text-3xl font-extrabold tracking-tight text-white">
                                            {formatTIme(bus.arrivalTime) || "--:--"}
                                        </h4>

                                        <p className="break-words text-base font-semibold text-slate-200">
                                            {bus.destination || "Arrival city"}
                                        </p>

                                        {bus.arrivalDate && (
                                            <p className="text-sm text-slate-400">
                                                {formatDate(bus.arrivalDate)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Amenities */}
                                {Array.isArray(bus.amenities) &&
                                    bus.amenities.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.07] px-5 py-4 sm:px-7">
                                            <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                Amenities
                                            </span>

                                            {bus.amenities.map((amenity) => (
                                                <span
                                                    key={amenity}
                                                    className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300"
                                                >
                                                    {amenity}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                {/* Price, availability and action */}
                                <footer className="flex flex-col gap-5 border-t border-white/10 bg-white/[0.025] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                                    <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                                        {fare != null && (
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-slate-400">
                                                    Ticket price
                                                </p>

                                                <p className="text-3xl font-extrabold tracking-tight text-white">
                                                    ₹
                                                    {Number(fare).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    Per ticket
                                                </p>
                                            </div>
                                        )}

                                        {bus.availableSeats != null && (
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-slate-400">
                                                    Availability
                                                </p>

                                                <p className="text-sm font-semibold text-emerald-300">
                                                    {bus.availableSeats} seats
                                                    left
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    Check before booking
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        disabled={!bus.busId}
                                        className="inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-950/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-900/30 focus:outline-none focus:ring-4 focus:ring-indigo-300/30 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                        onClick={() => handleViewSeats(bus)}
                                    >
                                        View Seats

                                        <svg
                                            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <path d="M5 12h14M13 6l6 6-6 6" />
                                        </svg>
                                    </button>
                                </footer>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export default BusList;