import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import apiClient from '../../api/apiClient';

const SeatSelectionPanel = ({ busId, bookingSeat, setBookingSeat, setActiveStep, passengers, setPassengers }) => {

    const passangerSectionRef = useRef();

    const [layout, setLayout] = useState(null)

    const [lowerItems, setLowerItems] = useState([])
    const [upperItems, setUpperItems] = useState([])

    const [isLower, setIsLower] = useState(true)

    const [passangerDetails, setPassangerDetails] = useState({
        firstName: "",
        age: "",
        gender: "",
        seatNumber: "",
        isChecked: false
    });


    const [showPassengerForm, setShowPassengerForm] = useState(false);


    const [passangerError, setPassangerError] = useState("")
    const [passangerErrorIndex, setPassangerErrorIndex] = useState(null)

    //group births by rows
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

    //Fetch layout details
    useEffect(() => {

        const fetchLayout = async () => {

            try {

                let response;

                try {
                    response = await apiClient.get(`/api/buses/layout?busId=${busId}`)
                } catch (error) {
                    if (error.response?.status !== 401) {
                        throw error;
                    }

                    await apiClient.post("/api/token/verify")

                    response = await apiClient.get(`/api/buses/layout?busId=${busId}`)

                }

                const result = response.data

                const items = result.data.layoutItems ?? [];

                setLayout(result.data)

                console.log(items);

                setLowerItems(items.filter(item => item.deckLevel === "LOWER"))

                setUpperItems(items.filter(item => item.deckLevel === "UPPER"))
            }catch (error) {
                if(error.response?.status==401){
                    console.error("Please sign in to continue");
                }else{
                    console.error("Failed to fetch bus layout", error);
                }
            }

        };

        fetchLayout();

    }, [busId]);

    //Change active step
    useEffect(() => {

        const section = passangerSectionRef.current;

        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setActiveStep(2);
                } else {
                    setActiveStep(1);
                }
            },
            { threshold: 0 }
        );

        observer.observe(section);

        return () => observer.disconnect();
    }, [setActiveStep]);

    const lowerRows = groupByRows(lowerItems);

    //Sort lower birth
    const lowerColumns = Object.entries(lowerRows).
        sort(([a], [b]) => Number(a) - Number(b))

    const upperRows = groupByRows(upperItems);

    //Sort upper birth
    const upperColumns = Object.entries(upperRows).
        sort(([a], [b]) => Number(a) - Number(b))


    //Adding passangers for travelling
    const addPassanger = (e) => {
        e.preventDefault()
        setPassengers(prev => [
            ...prev, { ...passangerDetails }
        ])

        setPassangerDetails({
            firstName: "",
            age: "",
            gender: "",
            seatNumber: ""
        });

        setShowPassengerForm(false);
    }

    //Adding passangers to travel
    const addPassangerDetails = (e) => {

        const { name, value } = e.target;
        setPassangerDetails(prev => (
            { ...prev, [name]: value }
        ))

    }

    //Seat selection process
    const selectSeat = (e) => {

        const seat = e.target;
        const seatNumber = seat.innerText

        setBookingSeat(prev =>
            prev.includes(seatNumber) ?
                prev.filter(seat => seat !== seatNumber)
                : [...prev, seatNumber]
        )

    }

    //Selecting Passanger for travelling
    const selectedPassangers = (e, index) => {

        const isChecked = e.target.checked

        const selectedCount = passengers.filter(
            passenger => passenger.isChecked
        ).length

        if (isChecked && selectedCount >= bookingSeat.length) {
            setPassangerError("No more seats to select for passenger");
            setPassangerErrorIndex(index);
            return;
        }

        setPassengers(prev =>
            prev.map((passenger, i) =>
                i === index
                    ? { ...passenger, isChecked }
                    : passenger
            )
        );

        setPassangerError("");
        setPassangerErrorIndex(null);

    }

    return (
        <>
            <div className='w-[65%]'>
                <div className='flex justify-between p-6'>
                    <div className='flex flex-col gap-1'>
                        <h3 className='text-3xl font-bold text-slate-900'>Select Your Seats</h3>
                        <p className='font-medium text-slate-500'>Lower birth for easy access · Upper birth for privacy</p>
                    </div>
                    <div className='flex gap-6 items-center'>
                        <span className='font-medium text-slate-900'>View.</span>
                        <button className='px-2 py-1 border border-[oklch(0.88 0.01 0)] rounded-lg text-medium cursor-pointer' onClick={() => setIsLower(true)}>Lower Deck</button>
                        <button className='px-2 py-1 border border-[oklch(0.88 0.01 0)] rounded-lg text-medium cursor-pointer' onClick={() => setIsLower(false)}>Upper Deck</button>
                    </div>
                </div>

                {/* seat choosing options */}
                <div className='mt-2 px-4 w-full flex gap-10 items-center'>
                    <div className='flex gap-2 items-center'>
                        <div className='bg-[#cbf5d2] border border-slate-300 w-[30px] h-[30px]'></div>
                        <span className='font-medium'>Available</span>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <div className='bg-[#EDE9FE] border border-[#5B3DF5] w-[30px] h-[30px]'></div>
                        <span className='font-medium'>Selected</span>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <div className='bg-slate-200 border border-slate-300 w-[30px] h-[30px]'></div>
                        <span className='font-medium'>Booked</span>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <div className='bg-pink-50 border border-pink-300 w-[30px] h-[30px]'></div>
                        <span className='font-medium'>Ladies</span>
                    </div>
                </div>

                {/* seat layout */}
                <div className='relative w-full mx-auto overflow-hidden mt-6'>
                    <div className="relative min-h-[220px] w-full">

                        <svg
                            className="absolute inset-0 z-0 l-0 h-full w-full"
                            viewBox="0 0 1000 420"
                            preserveAspectRatio="none"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M95 18
                                    C55 18 30 42 30 78
                                    L30 145
                                    C30 165 44 175 44 210
                                    C44 245 30 255 30 275
                                    L30 342
                                    C30 378 55 402 95 402
                                    L940 402
                                    C970 402 985 382 985 350
                                    L985 70
                                    C985 40 970 18 940 18
                                    Z"
                                fill="#F8FAFC"
                                stroke="#94A3B8"
                                strokeWidth="4"
                                vectorEffect="non-scaling-stroke"
                            />
                        </svg>

                        <div className="relative z-10 flex min-h-[220px] max-w-[96%] mx-auto  items-stretch gap-4 px-10 py-3 sm:px-6">

                            {/* Front section: driver and entry */}
                            <div className="flex w-[46px] shrink-0 flex-col items-center justify-around gap-4 sm:w-[56px]">

                                {/* Driver */}
                                <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 p-1">
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-8 w-8 text-slate-600"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        aria-hidden="true"
                                    >
                                        <circle cx="12" cy="12" r="9" />
                                        <circle cx="12" cy="12" r="2.5" />
                                        <path d="M12 9.5V3 M9.8 13.3 5 17 M14.2 13.3 19 17" />
                                    </svg>

                                    <span className="text-xs font-semibold text-slate-600">
                                        Driver
                                    </span>
                                </div>

                                {/* Front entry */}
                                <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 p-1">
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-7 w-7 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M4 21V3h12v18" />
                                        <path d="M16 12h5 M18 9l3 3-3 3" />
                                        <circle cx="12" cy="12" r=".8" />
                                    </svg>

                                    <span className="whitespace-nowrap text-xs font-semibold text-blue-700">
                                        Front
                                        <br />
                                        Entry
                                    </span>
                                </div>

                            </div>

                            {/* Seat area: insert your dynamic seat grid here */}
                            <div className="min-w-0 flex-1 py-2">

                                {isLower ? (<div
                                    className="grid w-full gap-2"
                                    style={{
                                        gridTemplateColumns: `repeat(${lowerColumns.length}, minmax(0, 1fr))`,
                                        gridTemplateRows: "minmax(40px, auto) minmax(40px, auto) 20px minmax(40px, auto)"
                                    }}
                                >
                                    {lowerColumns.map(([rowNumber, rowItems]) =>
                                        rowItems.map(item => {
                                            const visualRow =
                                                item.columnNumber === 3 ? 1 :
                                                    item.columnNumber === 4 ? 2 :
                                                        4;

                                            const seatCode = item.positionCode ?? item.PositionCode;

                                            return (
                                                <div
                                                    key={seatCode}
                                                    style={{
                                                        gridColumn: Number(rowNumber),
                                                        gridRow: `${visualRow} / span ${item.columnSpan ?? 1}`,
                                                        background: bookingSeat.includes(seatCode) ? "#5B3DF5" : "linear-gradient(to right, #D1FAE5 0%, #D1FAE5 78%, #A7F3D0 78%, #A7F3D0 100%)"

                                                    }}
                                                    className="flex items-center justify-center rounded-lg border border-slate-300 bg-white cursor-pointer"
                                                    onClick={selectSeat}
                                                >
                                                    {seatCode}
                                                </div>
                                            );
                                        })
                                    )}

                                    {/* Aisle across the whole bus */}
                                    <div
                                        style={{
                                            gridColumn: "1 / -1",
                                            gridRow: 3
                                        }}
                                        className="flex items-center justify-center border-y border-dashed border-slate-300 text-xs text-slate-500"
                                    >

                                    </div>
                                </div>) : (

                                    <div
                                        className="grid w-full gap-2"
                                        style={{
                                            gridTemplateColumns: `repeat(${upperColumns.length}, minmax(0, 1fr))`,
                                            gridTemplateRows: "minmax(40px, auto) minmax(40px, auto) 20px minmax(40px, auto)"
                                        }}
                                    >
                                        {upperColumns.map(([rowNumber, rowItems]) =>
                                            rowItems.map(item => {
                                                const visualRow =
                                                    item.columnNumber === 3 ? 1 :
                                                        item.columnNumber === 4 ? 2 :
                                                            4;

                                                const seatCode = item.positionCode ?? item.PositionCode;

                                                return (
                                                    <div
                                                        key={seatCode}
                                                        style={{
                                                            gridColumn: Number(rowNumber),
                                                            gridRow: `${visualRow} / span ${item.columnSpan ?? 1}`,
                                                            background: bookingSeat.includes(seatCode) ? "#5B3DF5" : "linear-gradient(to right, #D1FAE5 0%, #D1FAE5 78%, #A7F3D0 78%, #A7F3D0 100%)"

                                                        }}
                                                        className="flex items-center justify-center rounded-lg border border-slate-300 bg-white cursor-pointer"
                                                        onClick={selectSeat}
                                                    >
                                                        {seatCode}
                                                    </div>
                                                );
                                            })
                                        )}

                                        {/* Aisle across the whole bus */}
                                        <div
                                            style={{
                                                gridColumn: "1 / -1",
                                                gridRow: 3
                                            }}
                                            className="flex items-center justify-center border-y border-dashed border-slate-300 text-xs text-slate-500"
                                        >

                                        </div>
                                    </div>
                                )}

                            </div>

                        </div>

                    </div>
                </div>


                {/* Passenger section */}
                <div className="mt-6 flex flex-col gap-4"
                    ref={passangerSectionRef}
                >

                    <div className="flex flex-col gap-1 px-6">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Passenger Details
                        </h2>

                        <p className="text-sm text-slate-500">
                            Add the details of everyone travelling with you.
                        </p>
                    </div>

                    {/* List of passengers already added */}
                    <div className="w-full px-6 flex flex-col gap-3 relative">
                        {passengers.map((passenger, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                            >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-100 font-semibold text-violet-700">
                                    {index + 1}
                                </div>

                                <div className='flex flex-1 flex-col gap-1'>
                                    <h2 className="font-semibold text-slate-900">Name</h2>
                                    <p className="text-sm text-slate-900">
                                        {passenger.firstName}
                                    </p>
                                </div>

                                <div className='flex flex-1 flex-col gap-1'>
                                    <h2 className="font-semibold text-slate-900">Age</h2>
                                    <p className="text-sm text-slate-900">
                                        Age: {passenger.age}
                                    </p>
                                </div>

                                <div className='flex flex-1 flex-col gap-1'>
                                    <h2 className="font-semibold text-slate-900">Gender</h2>
                                    <p className="text-sm text-slate-900">
                                        Gender: {passenger.gender}
                                    </p>
                                </div>

                                <div className='flex flex-1 flex-col gap-1'>
                                    <h2 className="font-semibold text-slate-900">Seat Number</h2>
                                    <p className="text-sm text-slate-900">
                                        Seat No: {passenger.seatNumber}
                                    </p>
                                </div>

                                <div className='flex flex-1 flex-col gap-1'>
                                    <input type="checkbox" checked={passenger.isChecked ?? false}
                                        className='p-6' onChange={(e) => selectedPassangers(e, index)} />
                                    {
                                        passangerError && passangerErrorIndex == index && (<span className='text-[10px] text-red-500 text-center'>{passangerError}</span>)
                                    }
                                </div>

                                {passenger.isChecked && (
                                    <span className="text-sm font-medium text-green-700">
                                        Added
                                    </span>
                                )}

                            </div>
                        ))}
                    </div>

                    {/* Toggle button */}
                    <button
                        type="button"
                        onClick={() => setShowPassengerForm(prev => !prev)}
                        className="w-fit ml-6 rounded-lg border border-violet-600 px-4 py-2 font-semibold text-violet-700 transition hover:bg-violet-50"
                    >
                        + Add Passenger
                    </button>

                    {/* Show or hide the form */}
                    {showPassengerForm && (
                        <form
                            onSubmit={addPassanger}
                            className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm absolute left-12"
                        >
                            <h3 className="text-lg font-semibold text-slate-900">
                                Enter Passenger Details
                            </h3>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="name" className="text-sm font-medium">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    id="name"
                                    name="firstName"
                                    placeholder="Enter full name"
                                    value={passangerDetails.firstName}
                                    onChange={addPassangerDetails}
                                    required
                                    className="h-10 rounded-lg border border-slate-300 px-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="age" className="text-sm font-medium">
                                    Age
                                </label>

                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    placeholder="Enter age"
                                    value={passangerDetails.age}
                                    onChange={addPassangerDetails}
                                    min="1"
                                    max="120"
                                    required
                                    className="h-10 rounded-lg border border-slate-300 px-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                                />
                            </div>

                            <fieldset className="flex flex-col gap-2">
                                <legend className="mb-2 text-sm font-medium">
                                    Gender
                                </legend>

                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="MALE"
                                            checked={passangerDetails.gender === "MALE"}
                                            onChange={addPassangerDetails}
                                            required
                                        />
                                        Male
                                    </label>

                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="FEMALE"
                                            checked={passangerDetails.gender === "FEMALE"}
                                            onChange={addPassangerDetails}
                                        />
                                        Female
                                    </label>
                                </div>
                            </fieldset>

                            <div className="w-full">
                                <label
                                    htmlFor="seatNumber"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Select Seat
                                </label>

                                <select
                                    id="seatNumber"
                                    name="seatNumber"
                                    value={passangerDetails.seatNumber}
                                    onChange={addPassangerDetails}
                                    required
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition duration-200 hover:border-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                                >
                                    <option value="" disabled>
                                        Choose a seat
                                    </option>

                                    {bookingSeat
                                        .filter(
                                            seat =>
                                                !passengers.some(
                                                    passenger => passenger.seatNumber === seat
                                                )
                                        )
                                        .map(seat => (
                                            <option key={seat} value={seat}>
                                                {seat}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="rounded-lg bg-violet-600 px-4 py-2 font-semibold text-white hover:bg-violet-700"
                                >
                                    Save Passenger
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowPassengerForm(false)}
                                    className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                </div>

            </div>

        </>
    )
}

export default SeatSelectionPanel