import React from 'react'

const BookingHeader = ({ activeStep }) => {

    const steps = [
        { number: 1, label: "Select Seats" },
        { number: 2, label: "Passenger Details" },
        { number: 3, label: "Review & Pay" },
        { number: 4, label: "Confirmation" }
    ];

    return (
        <header className='sticky top-0 z-50 w-full flex justify-between px-20 font-["Inter"] bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm'>
            <div className='py-6 flex flex-col gap-1 w-[30%]'>
                <h1 className='text-3xl md:text-4xl font-bold tracking-tight text-[#0F172A]'>Book Your Seats</h1>
                <p className='text-sm md:text-base font-normal leading-relaxed text-[#64748B]'>Choose your seats and add passanger details</p>
            </div>
            <div className="w-[50%] pt-4 md:pr-20 pr-4">
                <div className="relative grid grid-cols-4">

                    {/* Connecting line */}
                    <div className="absolute left-[12.5%] right-[12.5%] top-[12.5px] h-px bg-[#CBD5E1]">
                        <div
                            className="h-full rounded-full bg-blue-500 transition-[width] duration-500 ease-in-out"
                            style={{
                                width: `${((activeStep - 1) / 3) * 100}%`
                            }}
                        />
                    </div>

                    {/* Step 1 */}
                    <div className="relative z-10 flex min-w-0 flex-col items-center gap-2">
                        <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full bg-blue-500">
                            <span className="text-sm text-white">1</span>
                        </div>
                        <span className="text-center text-sm text-slate-500">
                            Select Seats
                        </span>
                    </div>

                    {/* Step 2 */}
                    <div className="relative z-10 flex min-w-0 flex-col items-center gap-2">
                        <div className={`flex h-[25px] w-[25px] items-center justify-center rounded-full border transition-colors duration-500 ${activeStep >= 2
                            ? "bg-blue-500 border-blue-500"
                            : "bg-[#F1F5F9] border-[#CBD5E1]"
                            }`}>
                            <span className="text-sm text-[#64748B]">2</span>
                        </div>
                        <span className="text-center text-sm text-slate-500">
                            Passenger Details
                        </span>
                    </div>

                    {/* Step 3 */}
                    <div className="relative z-10 flex min-w-0 flex-col items-center gap-2">
                        <div className={`flex h-[25px] w-[25px] items-center justify-center rounded-full border transition-colors duration-500 ${activeStep >= 3
                            ? "bg-blue-500 border-blue-500"
                            : "bg-[#F1F5F9] border-[#CBD5E1]"
                            }`}>
                            <span className="text-sm text-[#64748B]">3</span>
                        </div>
                        <span className="text-center text-sm text-slate-500">
                            Review &amp; Pay
                        </span>
                    </div>

                    {/* Step 4 */}
                    <div className="relative z-10 flex min-w-0 flex-col items-center gap-2">
                        <div className={`flex h-[25px] w-[25px] items-center justify-center rounded-full border transition-colors duration-500 ${activeStep >= 4
                            ? "bg-blue-500 border-blue-500"
                            : "bg-[#F1F5F9] border-[#CBD5E1]"
                            }`}>
                            <span className="text-sm text-[#64748B]">4</span>
                        </div>
                        <span className="text-center text-sm text-slate-500">
                            Confirmation
                        </span>
                    </div>

                </div>
            </div>
        </header>
    )
}

export default BookingHeader