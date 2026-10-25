import React from 'react'

const HeroSection = () => {
    return (
        /* Hero content */
        <section
            id="home"
            className="flex flex-1 flex-col justify-center py-20 sm:py-24 lg:py-28"
        >
            <div className="max-w-2xl">
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-indigo-200 sm:text-sm">
                    Comfortable · Safe · Affordable
                </p>

                <h2 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-6xl lg:text-7xl">
                    Travel Smarter
                    <br />
                    with{" "}
                    <span className="text-indigo-400">
                        SleeperBus
                    </span>
                </h2>

                <p className="mt-6 max-w-lg text-base leading-7 text-slate-200 sm:text-xl sm:leading-8">
                    Book your next journey with comfort and ease.
                </p>
            </div>
        </section>
    )
}

export default HeroSection