import React, { useEffect, useState } from "react";
import { formatINR } from "../utils/Amount";

const ReviewBooking = ({ searchParm, bookingSeat, passengers, setActiveStep }) => {

    const [fareBreakdown, setFareBreakdown] = useState(null);
    const [fareQuoteError, setFareQuoteError] = useState("");


    const source = searchParm.get("source")
    const destination = searchParm.get("destination")
    const departureTime = searchParm.get("departureTime")
    const departureDate = searchParm.get("departureDate")
    const arrivalTime = searchParm.get("arrivalTime")
    const arrivalDate = searchParm.get("arrivalDate")
    const distance = searchParm.get("distance")
    const busNumber = searchParm.get("busNumber")
    const busName = searchParm.get("busName")
    const busType = searchParm.get("busType")
    const price = Number(searchParm.get("fare"))
    const scheduleId = searchParm.get("scheduleId")

    const [bookingId, setBookingId] = useState(null);
    const [seatBook, setSeatBook] = useState({
        bookingId: "",
        userId: "",
        scheduleId: "",
        travellingDate: "",
        passenger: {
            passengerId: "",
            passengerName: "",
            age: "",
            gender: "",
            seatNumbers: ""
        },
        status: "",
        totalAmount: "",
        message: ""
    })
    const [paymentMessage, setPaymentMessage] = useState("");

    useEffect(() => {
        if (!scheduleId || bookingSeat.length === 0) {
            setFareBreakdown(null);
            setFareQuoteError("");
            return;
        }

        const controller = new AbortController();

        const loadFareQuote = async () => {
            try {
                setFareQuoteError("");

                const response = await fetch(
                    "http://localhost:8080/api/booking/fare-quote",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            scheduleId: Number(scheduleId),
                            seatNumbers: bookingSeat
                        }),
                        signal: controller.signal
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        await response.text() ||
                        "Failed to calculate fare"
                    );
                }

                const data = await response.json();
                setFareBreakdown(data.data);

            } catch (error) {
                if (error.name !== "AbortError") {
                    setFareQuoteError(error.message);
                    setFareBreakdown(null);
                }
            }
        };

        loadFareQuote();

        return () => controller.abort();
    }, [scheduleId, bookingSeat]);

    console.log(fareBreakdown);


    const bookingData = {
        travellingDate: departureDate,
        scheduleId: scheduleId,
        passengers: passengers
            .filter(passenger => passenger.isChecked)
            .map(passenger => ({
                passengerName: passenger.firstName,
                age: Number(passenger.age),
                gender: passenger.gender,
                seatNumber: passenger.seatNumber
            }))
    };

    const handleBookingSeat = async () => {

        const selectedPassangersCount = passengers.
            filter(passenger => passenger.isChecked)
            .length;

        if (selectedPassangersCount == 0) {
            console.log("No selected passenger");
            return;
        }

        if (selectedPassangersCount !== bookingSeat.length) {
            console.log("Passenger count must match the number of selected seats");
            return;
        }

        try {

            let currentBookingId = seatBook.bookingId || null;

            if (!currentBookingId) {
                let response = await fetch("http://localhost:8080/api/booking/seat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(bookingData),
                    credentials: "include"
                })

                if (!response.ok) {
                    console.log("Something went wrong", await response.text());
                    return;
                }

                let responseData = await response.json();
                currentBookingId = responseData.data.bookingId;
                setSeatBook(responseData.data)
            }


            if (!currentBookingId) {
                console.error("Booking ID is missing from the response");
                return;
            }

            const paymentResponse = await fetch(
                `http://localhost:8080/api/payments/orders?bookingId=${currentBookingId}`,
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            if (!paymentResponse.ok) {
                console.error(
                    "Order creation failed",
                    await paymentResponse.text()
                );
                return;
            }

            let order = await paymentResponse.json();
            order = order.data

            const options = {
                key: order.keyId,
                order_id: order.orderId,
                amount: order.amount,
                currency: order.currency,
                name: "Sleeper Bus Booking",
                description: "Bus booking payment",

                handler: async function (paymentResponse) {
                    console.log(paymentResponse);
                    console.log("Payment ID:", paymentResponse.razorpay_payment_id);
                    console.log("Order ID:", paymentResponse.razorpay_order_id);
                    console.log("Signature:", paymentResponse.razorpay_signature);
                    const param = new URLSearchParams({
                        "paymentID": paymentResponse.razorpay_payment_id,
                        "orderID": paymentResponse.razorpay_order_id,
                        "signature": paymentResponse.razorpay_signature
                    })

                    const paymentIntiationResponse = await fetch(`http://localhost:8080/api/payments/verify?${param.toString()}`, {
                        method: "POST",
                        credentials: "include"
                    })

                    const result = await paymentIntiationResponse.json();
                    console.log(result);

                },

                modal: {
                    ondismiss: function () {
                        setPaymentMessage(
                            "Payment window closed. Your payment status is still pending. Please verify the status before trying again."
                        );

                    }
                },


            };


            const razorpay = new window.Razorpay(options);

            // Register the failure event OUTSIDE the options object
            razorpay.on("payment.failed", function (response) {
                const error = response.error;

                setPaymentMessage(
                    error?.description || "Payment failed. Please try again."
                );

                console.error("Razorpay payment failure:", {
                    code: error?.code,
                    reason: error?.reason,
                    description: error?.description,
                    paymentId: error?.metadata?.payment_id,
                    orderId: error?.metadata?.order_id
                });
            });

            razorpay.open()


        } catch (error) {
            console.log(error);
        }
    }


    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

            {/* Page heading */}
            <div className="mb-6">
                <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                        STEP 3 OF 4
                    </span>
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Review Your Booking
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Please verify your journey, passenger details and fare
                    before proceeding to payment.
                </p>
            </div>

            {/* Main layout */}
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">

                {/* Left: booking details */}
                <div className="flex min-w-0 flex-col gap-5">

                    {/* Journey details */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                    <svg
                                        className="h-5 w-5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M5 17V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12" />
                                        <path d="M5 10h14M5 14h14M7 17v3M17 17v3M5 17h14" />
                                    </svg>
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        Journey Details
                                    </h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Your travel information
                                    </p>
                                </div>
                            </div>

                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                                Selected
                            </span>
                        </div>

                        {/* Journey route */}
                        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 rounded-xl bg-slate-50 p-4 sm:gap-5 sm:p-5">

                            <div className="min-w-0">
                                <p className="text-xs font-medium text-slate-500">
                                    FROM
                                </p>

                                <h4 className="mt-2 break-words text-lg font-bold text-slate-900 sm:text-xl">
                                    {source}
                                </h4>

                                <p className="mt-1 text-xs text-slate-500">
                                    {departureTime} PM
                                </p>
                            </div>

                            <div className="flex min-w-16 flex-col items-center gap-1">
                                <span className="text-xs font-medium text-slate-500">
                                    8h 30m
                                </span>

                                <div className="relative flex w-full items-center">
                                    <div className="h-px w-full border-t border-dashed border-slate-300" />

                                    <svg
                                        className="absolute right-0 h-4 w-4 translate-x-1/2 text-violet-600"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M5 12h14m-6-6 6 6-6 6" />
                                    </svg>
                                </div>

                                <span className="text-[10px] text-slate-500">
                                    Direct journey
                                </span>
                            </div>

                            <div className="min-w-0 text-right">
                                <p className="text-xs font-medium text-slate-500">
                                    TO
                                </p>

                                <h4 className="mt-2 break-words text-lg font-bold text-slate-900 sm:text-xl">
                                    {destination}
                                </h4>

                                <p className="mt-1 text-xs text-slate-500">
                                    {arrivalTime} AM
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 place-items-center">

                            <div>
                                <p className="text-xs text-slate-500">
                                    Travel Date
                                </p>
                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                    {departureDate}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Distance
                                </p>
                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                    {distance} km
                                </p>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <p className="text-xs text-slate-500">
                                    {busType}
                                </p>
                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                    AC Sleeper
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bus information */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                <svg
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect x="4" y="3" width="16" height="18" rx="3" />
                                    <path d="M4 10h16M8 6h8M8 15h.01M16 15h.01M8 21v-3M16 21v-3" />
                                </svg>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900">
                                    Bus Information
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    Your selected service
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <h4 className="text-base font-bold text-slate-900">
                                    {busName}
                                </h4>

                                <p className="mt-1 text-sm text-slate-500">
                                    Bus No: {busNumber}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <span className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600">
                                    AC Sleeper
                                </span>

                                <span className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600">
                                    Comfortable Berths
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Selected seats */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <h3 className="font-bold text-slate-900">
                                    Selected Seats
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    Review your chosen berths
                                </p>
                            </div>

                            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                                {bookingSeat.length} Seats
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-3">

                            {
                                bookingSeat.length != 0 ? (
                                    bookingSeat.map((seat, seatIdx) => {
                                        return <div key={seatIdx} className="flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-violet-700 shadow-sm">
                                                <svg
                                                    className="h-5 w-5"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <rect x="4" y="4" width="16" height="16" rx="2" />
                                                    <path d="M4 10h16" />
                                                </svg>
                                            </div>

                                            <div>
                                                <p className="text-sm font-bold text-violet-800">
                                                    {seat}
                                                </p>
                                                <p className="mt-1 text-[11px] text-violet-600">
                                                    Lower Berth
                                                </p>
                                            </div>
                                        </div>
                                    })
                                ) : <p>No Seats Selected</p>
                            }

                        </div>
                    </div>

                    {/* Passengers */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div>
                                <h3 className="font-bold text-slate-900">
                                    Passenger Details
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    People travelling on this booking
                                </p>
                            </div>

                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                {passengers.length} Passengers
                            </span>
                        </div>

                        <div className="flex flex-col divide-y divide-slate-100">

                            {/* Passenger 1 */}
                            {
                                passengers.length == 0 ? (<span>No passanger selected</span>)
                                    : (
                                        passengers.map((passenger, id) => {
                                            return <div key={id} className="flex items-center gap-3 py-4 first:pt-0">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                                                    01
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="break-words text-sm font-semibold text-slate-900">
                                                        {passenger.firstName}
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        Age: {passenger.age} · {passenger.gender}
                                                    </p>
                                                </div>

                                                <span className="text-xs font-medium text-green-700">
                                                    Seat {passenger.seatNumber}
                                                </span>


                                            </div>
                                        })
                                    )
                            }

                        </div>
                    </div>
                </div>

                {/* Right: fare summary */}
                <aside className="min-w-0 lg:sticky lg:top-28">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        {/* Summary header */}
                        <div className="border-b border-slate-100 bg-slate-50 p-5">
                            <h3 className="text-lg font-bold text-slate-900">
                                Fare Summary
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Check your total before paying
                            </p>
                        </div>

                        <div className="p-5">

                            {/* Fare breakdown */}
                            <div className="flex flex-col gap-4">

                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm text-slate-600">
                                            Base Fare
                                        </p>
                                        <p className="mt-1 text-xs text-slate-400">
                                            {formatINR(price)}
                                        </p>
                                    </div>

                                    <span className="text-sm font-semibold text-slate-800">
                                        {fareBreakdown ? formatINR(fareBreakdown.baseFare) : "—"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-sm text-slate-600">
                                        GST
                                    </span>
                                    <span className="text-sm font-semibold text-slate-800">
                                        {fareBreakdown ? formatINR(fareBreakdown.gstAmount) : "—"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-sm text-slate-600">
                                        Convenience Fee
                                    </span>
                                    <span className="text-sm font-semibold text-slate-800">
                                        {fareBreakdown ? formatINR(fareBreakdown.convenienceFee) : "—"}
                                    </span>
                                </div>
                            </div>

                            <div className="my-5 border-t border-dashed border-slate-200" />

                            {/* Total */}
                            <div className="flex items-end justify-between gap-3">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">
                                        Total Amount
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Inclusive of displayed fees
                                    </p>
                                </div>

                                <span className="text-2xl font-extrabold tracking-tight text-violet-700">
                                    {fareBreakdown ? formatINR(fareBreakdown.totalAmount) : "—"}
                                </span>
                            </div>

                            {/* Edit booking */}
                            <button
                                type="button"
                                className="mt-5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                onClick={() => setActiveStep(1)}
                            >
                                Back to Booking
                            </button>

                            {/* Payment CTA */}
                            <button
                                type="button"
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#5B3DF5] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4930D0] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
                                onClick={handleBookingSeat}
                            >
                                Continue to Payment

                                <svg
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M5 12h14m-6-6 6 6-6 6" />
                                </svg>
                            </button>

                            {paymentMessage && (
                                <p>{paymentMessage}</p>
                            )}

                            {/* Security note */}
                            <div className="mt-4 flex items-start justify-center gap-2 text-center text-xs leading-5 text-slate-500">
                                <svg
                                    className="mt-0.5 h-4 w-4 shrink-0 text-green-600"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                                    <path d="m9 12 2 2 4-4" />
                                </svg>

                                <span>
                                    Secure payment processing.
                                    Your booking is confirmed after payment verification.
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>

            </div>
        </section>
    );
};

export default ReviewBooking;