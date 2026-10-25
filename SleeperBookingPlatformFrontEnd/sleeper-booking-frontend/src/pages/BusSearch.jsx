
import React, { useEffect, useState } from 'react'
import BusList from '../components/home/BusList'

const BusSearch = () => {

    const [source, setSource] = useState("")
    const [destination, setDestination] = useState("")
    const [date, setDate] = useState("")

    const [activeField, setActiveField] = useState("")

    const [citySuggestion, setCitySuggestion] = useState([])

    const [buses, setBuses] = useState([])

    useEffect(() => {

        const query = activeField == "source" ? source : activeField == "destination" ? destination : "";

        if (activeField == "") return;

        if (!query.trim()) return;

        const timer = setTimeout(async () => {
            try {
                let response = await fetch(`http://localhost:8080/api/routes/cities?city=${encodeURIComponent(query)}`, {
                    credentials: "include"
                });

                if (!response.ok) return;

                let data = await response.json()

                setCitySuggestion(data.data.cities)

                console.log("Active field:", activeField);

                console.log(data);

            } catch (error) {
                console.log(error);
            }
        }, 400);

        return () => {
            clearTimeout(timer)
        };
    }, [source, destination, activeField])


    const searchRoute = async (sourceValue = source, destinationValue = destination) => {

        console.log("3. searchRoute function called");
        console.log("Source:", sourceValue);
        console.log("Destination:", destinationValue);


        try {

            const parms = new URLSearchParams({
                source: sourceValue,
                destination: destinationValue
            })

            let response = await fetch(`http://localhost:8080/api/routes/ways?${parms.toString()}`, {
                credentials: "include"
            })

            if (!response.ok) {
                console.log("something went wrong");
                return;
            }

            let data = await response.json();
            console.log(data);
            console.log(data.message);

        } catch (error) {

        }
    }

    const selectCity = (city) => {

        if (activeField == "source") {
            setSource(city)
        } else if (activeField == "destination") {
            setDestination(city)
        }

        setCitySuggestion([])
        setActiveField("");

    }

    const submitHandler = async (e) => {

        e.preventDefault()

        try {

            let response = await fetch(`http://localhost:8080/api/buses/search?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&departureDate=${date}`,
                {
                    credentials: "include"
                })

            if (!response.ok) {
                console.log("something went wrong");
                return;
            }

            let data = await response.json();

            console.log(data);

            setBuses(data.data)

            console.log(buses);


            setSource("")
            setDestination("")
            setDate("")

        } catch (err) {
            console.log(err);
        }
    }
    

    return (
        <>
            <main className='w-full min-h-screen'>

                <section className='w-full max-w-6xl m-auto flex flex-col gap-5 items-center pt-4'>

                    <div className="text-center flex flex-col gap-4 items-center justify-center pt-2">
                        <h1 className='text-[38px] md:text-5xl font-bold tracking-tight text-slate-900 '
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >Find Your Perfect Journey</h1>

                        <p className='text-[24px] md:text-lg text-slate-500 leading-relaxed'>
                            Search comfortable sleeper buses for your next trip.
                        </p>

                    </div>

                    <form className="w-full max-w-4xl flex md:flex-row flex-col md:gap-15 gap-10 md:items-center" onSubmit={submitHandler}>

                        <div className="md:flex-[2] w-full flex md:flex-row flex-col items-center gap-0">

                            <div className=" relative w-full max-w-md md:max-w-none md:flex-1 flex flex-col gap-1 justify-center items-start border border-slate-300 rounded-lg">
                                <label htmlFor="source" className='text-[20px]  md:text-base font-medium text-slate-700 flex gap-1 items-center'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M20 10c0 4.5-8 12-8 12S4 14.5 4 10a8 8 0 1 1 16 0Z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    From</label>
                                <input
                                    type="text"
                                    id="source"
                                    name="source"
                                    value={source}
                                    placeholder="Enter departure city"
                                    onFocus={() => {
                                        setActiveField("source")
                                        setCitySuggestion([]);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                        }
                                    }}

                                    className='w-full h-12 rounded-lg  bg-white px-2 text-[20px]  md:text-base text-slate-800 outline-none transition'
                                    onChange={(e) => {
                                        setActiveField("source")
                                        setSource(e.target.value)
                                    }}
                                    autoComplete='off'
                                />
                                {activeField == "source" && citySuggestion.length > 0 && (
                                    <div className='absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden'>
                                        {
                                            citySuggestion.map((city) => {
                                                return <button
                                                    key={city}
                                                    type="button"
                                                    onMouseDown={(e) =>
                                                        selectCity(city)
                                                    }
                                                    className="w-full px-4 py-3 text-left text-slate-700 hover:bg-slate-100"
                                                >
                                                    {city}
                                                </button>
                                            })
                                        }
                                    </div>
                                )}
                            </div>
                            <button className='flex items-center justify-center px-2 cursor-pointer rounded-lg' type='button' onClick={() => {
                                const newSource = destination;
                                const newDestination = source;
                                setSource(newSource);
                                setDestination(newDestination);
                                setActiveField("");
                                setCitySuggestion([]);
                                searchRoute(newSource, newDestination);
                            }}>
                                <svg
                                    className="hidden md:block"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M17 3l4 4-4 4" />
                                    <path d="M21 7H7" />
                                    <path d="M7 21l-4-4 4-4" />
                                    <path d="M3 17h14" />
                                </svg>
                                <svg
                                    className="block md:hidden"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M7 3v14" />
                                    <path d="m3 13 4 4 4-4" />
                                    <path d="M17 21V7" />
                                    <path d="m13 11 4-4 4 4" />
                                </svg>
                            </button>

                            <div className="relative w-full max-w-md md:flex-1 border border-slate-300 rounded-lg flex flex-col justify-center items-start">
                                <label htmlFor="destination" className='text-[20px] md:text-base font-medium text-slate-700 flex gap-1 items-center   '>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M20 10c0 4.5-8 12-8 12S4 14.5 4 10a8 8 0 1 1 16 0Z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    To</label>
                                <input
                                    type="text"
                                    id="destination"
                                    name="destination"
                                    value={destination}
                                    placeholder="Enter destination city"
                                    onFocus={() => {
                                        setActiveField("destination")
                                        setCitySuggestion([]);
                                    }}

                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                        }
                                    }}

                                    className='w-full h-12 rounded-lg  bg-white px-2 text-[20px]  md:text-base text-slate-800 outline-none transition'
                                    onChange={(e) => {
                                        setActiveField("destination")
                                        setDestination(e.target.value)
                                    }}
                                    autoComplete='off'
                                />
                                {activeField == "destination" && citySuggestion.length > 0 && (
                                    <div className='absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden"'>
                                        {
                                            citySuggestion.map((city) => {
                                                return <button
                                                    key={city}
                                                    type="button"
                                                    onMouseDown={(e) =>
                                                        selectCity(city)
                                                    }
                                                    className="w-full px-4 py-3 text-left text-slate-700 hover:bg-slate-100"
                                                >
                                                    {city}
                                                </button>
                                            })
                                        }
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-full max-w-md mx-auto md:max-w-none border border-slate-300 rounded-lg flex flex-col justify-center items-start md:flex-1">
                            <label htmlFor="departureDate" className='text-[20px] md:text-base font-medium text-slate-700 flex gap-2 items-center px-1'>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                Travel Date</label>
                            <input
                                type="date"
                                id="departureDate"
                                name="departureDate"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className='w-full h-12 rounded-lg bg-white px-2 text-[20px] md:text-base text-slate-800 outline-none'
                            />
                        </div>

                        <button type="submit" className='w-full max-w-md mx-auto md:max-w-none md:flex-1 h-14 rounded-lg bg-blue-400 px-1 text-[20px] md:text-base font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer'>
                            Search
                        </button>

                    </form>

                </section>


                <BusList buses={buses} />


            </main>

        </>
    )
}

export default BusSearch