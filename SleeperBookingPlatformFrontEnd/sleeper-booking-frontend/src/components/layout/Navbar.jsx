import React from 'react'
import { Link } from 'react-router'

const Navbar = () => {
    return (
        /* Navbar */
        <header className="flex items-center justify-between gap-4 rounded-2xl border border-white/50 bg-white/95 px-5 py-4 shadow-xl backdrop-blur-xl sm:px-7">
            <Link to="/" className="flex shrink-0 items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white shadow-md shadow-indigo-600/25">
                    SB
                </div>

                <div>
                    <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                        Sleeper<span className="text-indigo-600">Bus</span>
                    </h1>
                    <p className="text-[10px] font-semibold tracking-[0.22em] text-slate-500">
                        TRAVEL BETTER
                    </p>
                </div>
            </Link>

            <nav className="hidden items-center gap-7 lg:flex">
                <a
                    href="#home"
                    className="rounded-xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700"
                >
                    Home
                </a>

                <a
                    href="#search-buses"
                    className="text-sm font-medium text-slate-700 transition hover:text-indigo-600"
                >
                    Search Buses
                </a>

                <Link
                    to="/bookings"
                    className="text-sm font-medium text-slate-700 transition hover:text-indigo-600"
                >
                    My Bookings
                </Link>

                <a
                    href="#support"
                    className="text-sm font-medium text-slate-700 transition hover:text-indigo-600"
                >
                    Support
                </a>
            </nav>

            {/* Login and Register */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <Link
                    to="/login"
                    className="rounded-xl border border-indigo-500 px-3 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 sm:px-5"
                >
                    Login
                </Link>

                <Link
                    to="/register"
                    className="rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-950/20 transition hover:bg-indigo-700 sm:px-5"
                >
                    Register
                </Link>
            </div>
        </header>
    )
}

export default Navbar