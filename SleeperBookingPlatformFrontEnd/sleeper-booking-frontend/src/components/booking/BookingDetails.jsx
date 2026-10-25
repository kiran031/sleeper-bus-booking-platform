import React from 'react'
import { formatDate, formatTIme } from '../utils/DateTimeUtils'

const BookingDetails = ({ searchParm }) => {

    

    const busName = searchParm.get("busName")
    const busNumber = searchParm.get("busNumber")
    const busType = searchParm.get("busType")
    const source = searchParm.get("source")
    const destination = searchParm.get("destination")
    const distance = searchParm.get("distance")
    const departureDate = searchParm.get("departureDate")
    const departureTime = searchParm.get("departureTime")
    const arrivalDate = searchParm.get("arrivalDate")
    const arrivalTime = searchParm.get("arrivalTime")
    const fare = searchParm.get("fare")

    

    console.log(busName);

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:gap-10 md:p-8 font-['Inter']">

            <div className="flex w-full min-w-0 items-center gap-4 md:w-[50%]">
                <div className="h-[100px] w-[15%] shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <img
                        className="h-full w-full object-cover"
                        src=""
                        alt="bus_image"
                    />
                </div>

                <div className="flex min-w-0 flex-col gap-3">
                    <div className="flex h-[30px] w-fit items-center justify-center rounded-md border border-violet-100 bg-violet-50 px-4">
                        <span className="text-xs font-semibold text-[#5B3DF5]">
                            Sleeper
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span className="text-lg font-bold tracking-tight text-slate-900">
                            {busName}
                        </span>
                        <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                            ★ Bus Rating
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                        <span className="font-medium">{busType}</span>
                        <span className="h-4 w-px bg-slate-300"></span>
                        <span>Vehicle</span>
                        <span className="h-4 w-px bg-slate-300"></span>
                        <span className="font-medium text-slate-700">
                            Bus No: {busNumber}
                        </span>
                    </div>

                    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
                        <li>AC</li>
                        <li>Charging Point</li>
                        <li>Blanket</li>
                        <li>Water Bottle</li>
                        <li>WIFI</li>
                    </ul>
                </div>
            </div>

            <div className="flex w-full min-w-0 items-center gap-4 border-t border-slate-100 pt-6 md:w-[40%] md:border-l md:border-t-0 md:pl-8 md:pt-0">

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <span className="break-words text-base font-bold text-slate-900">
                        {source}
                    </span>
                    <span className="text-xl font-bold text-slate-900">
                        {formatTIme(departureTime)} PM
                    </span>
                    <span className="text-xs text-slate-600">
                        {formatDate(departureDate)}
                    </span>
                </div>

                <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">
                        Hour
                    </span>
                    <span className="w-full text-center text-sm tracking-wider text-[#5B3DF5]">
                        ··········&gt;
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                        {distance} Km
                    </span>
                </div>

                <div className="flex min-w-0 flex-1 flex-col items-end gap-2 text-right">
                    <span className="break-words text-base font-bold text-slate-900">
                        {destination}
                    </span>
                    <span className="text-xl font-bold text-slate-900">
                        {formatTIme(arrivalTime)} AM
                    </span>
                    <span className="text-xs text-slate-600">
                        {formatDate(arrivalDate)}
                    </span>
                </div>

            </div>
        </div>
    )
}

export default BookingDetails