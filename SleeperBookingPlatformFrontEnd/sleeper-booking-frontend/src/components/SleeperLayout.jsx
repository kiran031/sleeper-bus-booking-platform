import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router'

const SleeperLayout = () => {

    const { busId } = useParams();
    const [searchParm] = useSearchParams()

    const source = searchParm.get("source")
    const destination = searchParm.get("destination")
    const departureDate = searchParm.get("departureDate")
    const arrivalDate = searchParm.get("arrivalDate")
    const fare = searchParm.get("fare")

    const [layout, setLayout] = useState(null)

    const [lowerItems, setLowerItems] = useState([])
    const [upperItems, setUpperItems] = useState([])

    const [selectedSeats, setSelectedSeats] = useState([])

    const groupByRows = (items) => {
        return items.reduce((rows, item) => {

            const row = item.rowNumber;


            if (!rows[row]) {
                rows[row] = []
            }

            rows[row].push(item);

            return rows
        }, {})
    }

    useEffect(() => {

        const fetchLayout = async () => {

            let response = await fetch(`http://localhost:8080/api/buses/layout?busId=${busId}`, {
                credentials: "include"
            })

            if (!response.ok) {
                throw new Error("Failed to fetch bus layout")
            }

            let result = await response.json()

            const items = result.data.layoutItems ?? [];

            setLayout(result.data)

            console.log(items);

            setLowerItems(items.filter(item => item.deckLevel === "LOWER"))

            setUpperItems(items.filter(item => item.deckLevel === "UPPER"))


        };

        fetchLayout().catch(console.error)

    }, [busId])

    console.log(layout);

    console.log(lowerItems);

    console.log(upperItems);

    const lowerRows = groupByRows(lowerItems);
    const upperRows = groupByRows(upperItems);


    console.log("Lower rows:", lowerRows);
    console.log("Upper rows:", upperRows);

    const selectSeat = (e) => {

        console.log("selected seat is working");

        const seatCode = e.currentTarget.dataset.seatCode
        setSelectedSeats(prev => 
            prev.includes(seatCode)?
            prev.filter(seat=>seat!=seatCode)
            :[...prev, seatCode])
        console.log(selectedSeats);

    }


    return (

        <main className='w-full min-h-screen'>
            <section className='w-full max-w-4xl m-auto px-10'>
                <div className='w-full max-w-2xl m-auto flex justify-between items-center gap-4 '>
                    <div className='flex flex-col gap-1'>
                        <p className='text-xl text-slate-700'>{source}</p>
                        <p className='text-xl text-slate-700'>{departureDate}</p>
                    </div>
                    <div className="flex shrink-0 items-center justify-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-600 shadow-sm">
                            <svg
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
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <p className='text-xl text-slate-700'>{destination}</p>
                        <p className='text-xl text-slate-700'>{arrivalDate}</p>
                    </div>
                </div>
            </section>
            <section className='w-full max-w-4xl m-auto px-10 flex md:flex-row flex-col  md:items-start items-cen
            ter'>

                {/* Lower Level */}
                <div className="w-full py-2 flex-1">
                    <h2 className='text-2xl tracking-tight text-slate-900 px-20 pb-1'>Lower Level</h2>

                    <div className="border border-slate-200 rounded-xl bg-white  px-15 py-2 flex flex-col gap-2">

                        {
                            Object.entries(lowerRows)
                                .sort(([a], [b]) => Number(a) - Number(b))
                                .map(([rowNumber, rowItems]) => (
                                    <div
                                        key={rowNumber}
                                        className="grid h-28 items-stretch gap-2"
                                        style={{
                                            gridTemplateColumns: "1fr 24px 1fr 1fr"
                                        }}

                                    >
                                        {
                                            rowItems.map(item => (
                                                <div
                                                    key={item.positionCode ?? item.PositionCode}
                                                    data-seat-code={item.positionCode ?? item.PositionCode}
                                                    style={{
                                                        gridColumn: `${item.columnNumber} / span ${item.columnSpan ?? 1}`
                                                    }}
                                                    className={`flex flex-col gap-1 items-center justify-center rounded-lg  text-sm font-medium ${selectedSeats.includes(item.positionCode)? "bg-sky-100 border-sky-400 text-sky-800"
                                                                : "bg-slate-50/70 border-slate-200 text-slate-600"} `}
                                                    onClick={selectSeat}
                                                >   
                                                   <span className='text-[14px]'>{item.positionCode ?? item.positionCode}</span>
                                                   <span className='text-[12px]'>₹ {fare}</span>
                                                </div>
                                            ))}
                                        <div
                                            className="flex items-center justify-center"
                                            style={{ gridColumn: 2, gridRow: 1 }}
                                        >
                                            <div className="h-20 w-px bg-slate-400" />
                                        </div>
                                    </div>
                                ))}

                    </div>
                </div>

                {/* Upper Level */}
                <div className='w-full max-w-5xl py-2 flex-1'>
                    <h2 className='text-2xl tracking-tight text-slate-900 px-20 pb-1'>Upper Level</h2>

                    <div className="border border-slate-200 rounded-xl bg-white  px-15 py-2 flex flex-col gap-2">

                        {
                            Object.entries(upperRows)
                                .sort(([a], [b]) => Number(a) - Number(b))
                                .map(([rowNumber, rowItems]) => (
                                    <div
                                        key={rowNumber}
                                        className="grid h-28 items-stretch gap-2"
                                        style={{
                                            gridTemplateColumns: "1fr 24px 1fr 1fr"
                                        }}

                                    >
                                        {
                                            rowItems.map(item => (
                                                <div
                                                    key={item.positionCode ?? item.PositionCode}
                                                    style={{
                                                        gridColumn: `${item.columnNumber} / span ${item.columnSpan ?? 1}`
                                                    }}
                                                    className="flex flex-col gap-1 items-center justify-center rounded-lg border border-slate-200 bg-slate-50/70 text-sm font-medium text-slate-600"
                                                >
                                                   <span className='text-[14px]'>{item.positionCode ?? item.positionCode}</span>
                                                   <span className='text-[12px]'>₹ {fare}</span>
                                                </div>
                                            ))}
                                        <div
                                            className="flex items-center justify-center"
                                            style={{ gridColumn: 2, gridRow: 1 }}
                                        >
                                            <div className="h-20 w-px bg-slate-400" />
                                        </div>
                                    </div>
                                ))}

                    </div>
                </div>
            </section>
            <div className=' mt-4 w-full max-w-4xl m-auto flex justify-end items-center md:px-20 px-10 py-6'>
                <button className='h-10 bg-blue-500 border-blue-500 text-white shadow-sm rounded-lg px-6 font-semibold transition-all duration-200 hover:bg-blue-600 active:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 cursor-pointer'>Book Seat</button>
            </div>
        </main>
    )
}

export default SleeperLayout