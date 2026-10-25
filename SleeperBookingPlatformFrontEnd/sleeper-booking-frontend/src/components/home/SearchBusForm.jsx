
import React, { useEffect, useState } from "react";
import BusList from "./BusList";
import { todayDate } from "../utils/DateTimeUtils";

const SearchBusForm = () => {
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [date, setDate] = useState("");

    const [cityError, setCityError] = useState("");
    const [routeError, setRouteError] = useState("")
    const [isLoadingCities, setIsLoadingCities] = useState(false);

    const [activeField, setActiveField] = useState("");
    const [citySuggestion, setCitySuggestion] = useState([]);
    const [buses, setBuses] = useState([]);

    const [hasSearched, setHasSearched] = useState(false);

    // 1. Fetch city suggestions for the active input
    useEffect(() => {

        const query =
            activeField === "source"
                ? source
                : activeField === "destination"
                    ? destination
                    : "";

        if (activeField === "" || !query.trim()) {
            setCitySuggestion([]);
            setCityError("")
            setIsLoadingCities(false)
            return;
        }

        const controller = new AbortController();

        setCitySuggestion([]);
        setCityError("");
        setIsLoadingCities(false);

        const timer = setTimeout(async () => {
            setIsLoadingCities(true)
            try {
                const response = await fetch(
                    `http://localhost:8080/api/routes/cities?city=${encodeURIComponent(query)}`,
                    {
                        credentials: "include",
                        signal: controller.signal
                    }
                );

                // Read the response body as text first.
                const responseText = await response.text();

                // Support both JSON and plain-text responses.
                let responseData = {};

                try {
                    responseData = responseText
                        ? JSON.parse(responseText)
                        : {};
                } catch {
                    responseData = {
                        message: responseText
                    };
                }

                console.log("Backend response:", responseText);
                console.log("Parsed response:", responseData);
                console.log("Cities:", responseData.data?.cities);


                if (!response.ok) {
                    const message = typeof responseData.message === "string" ? responseData.message.trim("") : "";

                    const safeMessage = message && message.length <= 180 && !message.startsWith("<") ? message : `Unable to load city suggestions (HTTP ${response.status}).`;

                    setCitySuggestion([]);
                    setCityError(safeMessage)
                    return;
                }

                // Validate the expected successful response.
                const cities = responseData.data?.cities;

                if (!Array.isArray(cities)) {
                    setCitySuggestion([]);
                    setCityError(
                        "The server returned an unexpected response."
                    );
                    return;
                }

                setCitySuggestion(cities);

            } catch (error) {
                // Ignore requests cancelled because the user kept typing.
                if (error.name !== "AbortError") {
                    console.error("City suggestions failed:", error);

                    setCitySuggestion([]);
                    setCityError(
                        "Unable to connect to the server. Please try again."
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoadingCities(false);
                }
            }

        }, 400);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };

    }, [source, destination, activeField]);


    // 2. Look up available routes when the cities are swapped
    const searchRoute = async (
        sourceValue = source,
        destinationValue = destination
    ) => {

        setRouteError("")
        try {
            const params = new URLSearchParams({
                source: sourceValue,
                destination: destinationValue
            });

            const response = await fetch(
                `http://localhost:8080/api/routes/ways?${params.toString()}`,
                {
                    credentials: "include"
                }
            );

            const responseText = await response.text();

            let responseData = {};

            try {
                responseData = responseText ? JSON.parse(responseText) : ""
            } catch (error) {
                responseData = { message: responseText }
            }

            if (!response.ok) {
                setRouteError(responseData.message || "Can not find suitable routes")
                return;
            }

            console.log(responseData);
        } catch (error) {
            setRouteError(
                "Unable to connect to the server. Please try again."
            );
        }
    };

    // 3. Select a city from the suggestions
    const selectCity = (city) => {
        if (activeField === "source") {
            setSource(city);
        } else if (activeField === "destination") {
            setDestination(city);
        }

        setCitySuggestion([]);
        setActiveField("");
    };

    // 4. Swap source and destination
    const swapCities = () => {
        const newSource = destination;
        const newDestination = source;

        setSource(newSource);
        setDestination(newDestination);
        setActiveField("");
        setCitySuggestion([]);

        searchRoute(newSource, newDestination);
    };

    // 5. Search buses
    const submitHandler = async (e) => {
        e.preventDefault();

        setHasSearched(true)

        try {
            const params = new URLSearchParams({
                source,
                destination,
                departureDate: date
            });

            const response = await fetch(
                `http://localhost:8080/api/buses/search?${params.toString()}`,
                {
                    credentials: "include"
                }
            );

            if (!response.ok) {
                console.log("Something went wrong while searching buses");
                return;
            }

            const data = await response.json();

            // Update the bus results
            setBuses(data.data ?? []);

            // Log the newly received results.
            // State updates are asynchronous, so don't log `buses` here.
            console.log(data.data);

            setSource("");
            setDestination("");
            setDate("");
            setActiveField("");
            setCitySuggestion([]);
        } catch (error) {
            console.error("Error searching buses:", error);
        }
    };



    return (
        <>
            <section
                id="search-buses"
                className="mx-auto w-full max-w-7xl pb-10 pt-8 sm:pt-12 lg:pt-16"
            >
                {/* Heading */}
                <div className="mb-8 sm:mb-10">
                    <div className="mb-5 flex items-center gap-3">
                        <span className="h-[3px] w-12 rounded-full bg-indigo-500" />

                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-200 sm:text-sm">
                            Plan Your Journey
                        </p>
                    </div>

                    <h2
                        className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        Find Your{" "}
                        <span className="bg-gradient-to-r from-indigo-300 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                            Next Bus
                        </span>
                    </h2>

                    <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg lg:text-xl">
                        Search comfortable sleeper buses for your next trip.
                    </p>
                </div>

                {/* Search fields */}
                <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)_minmax(190px,0.8fr)_auto]">

                    {/* Source city */}
                    <div className={`relative min-w-0 rounded-2xl border border-white/25 bg-slate-900/45 px-5 py-2 backdrop-blur-md transition duration-300 hover:border-indigo-300/60 focus-within:border-indigo-300 focus-within:bg-slate-900/65 focus-within:ring-4 focus-within:ring-indigo-400/15 ${activeField === "source" ? "z-50" : "z-10"}`}>
                        <label
                            htmlFor="source"
                            className="mb-2 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-200 sm:text-sm"
                        >
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-500/25 text-indigo-300">
                                <svg
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M20 10c0 4.5-8 12-8 12S4 14.5 4 10a8 8 0 1 1 16 0Z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                            </span>
                            From
                        </label>

                        <input
                            type="text"
                            id="source"
                            name="source"
                            value={source}
                            placeholder="Enter source city"
                            autoComplete="off"
                            className="w-full min-w-0 bg-transparent text-base font-medium text-white outline-none placeholder:font-normal placeholder:text-slate-300 sm:text-lg"
                            onChange={(e) => setSource(e.target.value)}
                            onFocus={() => {
                                setActiveField("source");
                                setCitySuggestion([]);
                            }}
                        />

                        {activeField === "source" &&
                            citySuggestion.length > 0 && (
                                <div className="absolute bottom-full left-0 right-0 z-50 mb-3 overflow-hidden rounded-2xl border border-white/15 bg-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur-xl">
                                    {/* Dropdown heading */}
                                    <div className="border-b border-white/10 px-4 py-3">
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                            Suggested cities
                                        </p>
                                    </div>

                                    {/* Sample suggestions */}
                                    <div className="max-h-60 overflow-y-auto p-2">

                                        {
                                            citySuggestion.map((city) => {
                                                return <button key={city}
                                                    type="button"
                                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/10"
                                                    onClick={() => selectCity(city)}
                                                >
                                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                                                        <svg
                                                            className="h-5 w-5"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="1.8"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="M20 10c0 4.5-8 12-8 12S4 14.5 4 10a8 8 0 1 1 16 0Z" />
                                                            <circle cx="12" cy="10" r="3" />
                                                        </svg>
                                                    </span>

                                                    <span className="min-w-0 flex-1">
                                                        <span className="block text-sm font-semibold text-white">
                                                            {city}
                                                        </span>
                                                        <span className="mt-1 block text-xs text-slate-400">
                                                            Karnataka, India
                                                        </span>
                                                    </span>

                                                    <svg
                                                        className="h-4 w-4 text-slate-500"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    >
                                                        <path d="m9 18 6-6-6-6" />
                                                    </svg>
                                                </button>
                                            })
                                        }

                                    </div>
                                </div>
                            )}
                    </div>

                    {/* Swap icon */}
                    <button
                        type="button"
                        aria-label="Swap source and destination"
                        className="mx-auto flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-indigo-200/50 bg-white text-indigo-600 shadow-lg shadow-black/15 transition duration-300 hover:rotate-180 hover:scale-105 hover:bg-indigo-50"
                        onClick={swapCities}
                    >
                        <svg
                            className="hidden h-6 w-6 sm:block"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M17 3l4 4-4 4" />
                            <path d="M21 7H7" />
                            <path d="M7 21l-4-4 4-4" />
                            <path d="M3 17h14" />
                        </svg>

                        <svg
                            className="h-6 w-6 sm:hidden"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M7 3v14" />
                            <path d="m3 13 4 4 4-4" />
                            <path d="M17 21V7" />
                            <path d="m13 11 4-4 4 4" />
                        </svg>
                    </button>

                    {/* Destination city */}
                    <div className={`relative min-w-0 rounded-2xl border border-white/25 bg-slate-900/45 px-5 py-2 backdrop-blur-md transition duration-300 hover:border-indigo-300/60 focus-within:border-indigo-300 focus-within:bg-slate-900/65 focus-within:ring-4 focus-within:ring-indigo-400/15 ${activeField === "source" ? "z-50" : "z-10"}`}>
                        <label
                            htmlFor="destination"
                            className="mb-2 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-200 sm:text-sm"
                        >
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-500/25 text-indigo-300">
                                <svg
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M20 10c0 4.5-8 12-8 12S4 14.5 4 10a8 8 0 1 1 16 0Z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                            </span>
                            To
                        </label>

                        <input
                            type="text"
                            id="destination"
                            name="destination"
                            value={destination}
                            placeholder="Enter destination city"
                            autoComplete="off"
                            className="w-full min-w-0 bg-transparent text-base font-medium text-white outline-none placeholder:font-normal placeholder:text-slate-300 sm:text-lg"
                            onChange={(e) => setDestination(e.target.value)}
                            onFocus={() => {
                                setActiveField("destination");
                                setCitySuggestion([]);
                            }}
                        />

                        {activeField === "destination" &&
                            citySuggestion.length > 0 && (
                                <div className="absolute bottom-full left-0 right-0 z-50 mb-3 overflow-hidden rounded-2xl border border-white/15 bg-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur-xl">
                                    {/* Dropdown heading */}
                                    <div className="border-b border-white/10 px-4 py-3">
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                            Suggested cities
                                        </p>
                                    </div>

                                    {/* Sample suggestions */}
                                    <div className="max-h-60 overflow-y-auto p-2">

                                        {
                                            citySuggestion.map((city) => {
                                                return <button key={city}
                                                    type="button"
                                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-white/10"
                                                    onClick={() => selectCity(city)}
                                                >
                                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                                                        <svg
                                                            className="h-5 w-5"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="1.8"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="M20 10c0 4.5-8 12-8 12S4 14.5 4 10a8 8 0 1 1 16 0Z" />
                                                            <circle cx="12" cy="10" r="3" />
                                                        </svg>
                                                    </span>

                                                    <span className="min-w-0 flex-1">
                                                        <span className="block text-sm font-semibold text-white">
                                                            {city}
                                                        </span>
                                                        <span className="mt-1 block text-xs text-slate-400">
                                                            Karnataka, India
                                                        </span>
                                                    </span>

                                                    <svg
                                                        className="h-4 w-4 text-slate-500"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    >
                                                        <path d="m9 18 6-6-6-6" />
                                                    </svg>
                                                </button>
                                            })
                                        }

                                    </div>
                                </div>
                            )}
                    </div>

                    {/* Journey date */}
                    <div className="min-w-0 rounded-2xl border border-white/25 bg-slate-900/45 px-5 py-2 backdrop-blur-md transition duration-300 hover:border-indigo-300/60 focus-within:border-indigo-300 focus-within:bg-slate-900/65 focus-within:ring-4 focus-within:ring-indigo-400/15">
                        <label
                            htmlFor="departureDate"
                            className="mb-2 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-200 sm:text-sm"
                        >
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-500/25 text-indigo-300">
                                <svg
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <rect x="3" y="5" width="18" height="16" rx="2" />
                                    <path d="M16 3v4M8 3v4M3 11h18" />
                                </svg>
                            </span>
                            Journey Date
                        </label>

                        <input
                            type="date"
                            id="departureDate"
                            min={todayDate()}
                            name="departureDate"
                            value={date}
                            className="w-full min-w-0 bg-transparent text-base font-medium text-white outline-none [color-scheme:dark]"
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    {/* Search button */}
                    <button
                        type="button"
                        className="flex min-h-[60px] w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-700 px-5 py-2 text-base font-bold text-white shadow-xl shadow-indigo-950/40 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-900/40 focus:outline-none focus:ring-4 focus:ring-indigo-300/40 active:translate-y-0 lg:w-auto"
                        onClick={submitHandler}
                    >
                        <svg
                            className="h-6 w-6 shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>

                        <span className="whitespace-nowrap">
                            Search Buses
                        </span>
                    </button>
                </div>
            </section>

            {hasSearched && <BusList buses={buses} />}
        </>

    );
};

export default SearchBusForm;
