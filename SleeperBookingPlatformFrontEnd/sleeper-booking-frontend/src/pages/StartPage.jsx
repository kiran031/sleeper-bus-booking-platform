import React from "react";
import heroBackground from "../assets/images/sleeperbus-hero.png";
import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/home/HeroSection";
import SearchBusForm from "../components/home/SearchBusForm";

const StartPage = () => {
    return (
        <main
            className="relative min-h-screen overflow-hidden bg-slate-950 bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `
                    linear-gradient(
                        90deg,
                        rgba(5, 15, 35, 0.82) 0%,
                        rgba(5, 15, 35, 0.42) 55%,
                        rgba(5, 15, 35, 0.12) 100%
                    ),
                    url(${heroBackground})
                `,
            }}
        >
            <div className="relative z-10 mx-auto flex min-h-screen max-w-[1600px] flex-col px-5 py-5 sm:px-8 lg:px-12">

                {/* Navbar */}
                <Navbar />

                {/* Hero content */}
                <HeroSection />

                {/* Search panel design */}
                <SearchBusForm />
            </div>
        </main>
    );
};

export default StartPage;