import React, {useState } from 'react'
import BookingSummaryPanel from './BookingSummaryPanel'
import SeatSelectionPanel from './seatSelectionPanel'

const BookingContent = ({ busId, searchParm,setActiveStep,bookingSeat,setBookingSeat,passengers,setPassengers}) => {


    return (
        <section className='w-full max-w-7xl m-auto flex gap-4 mt-4 font-["Inter"]'>
            <SeatSelectionPanel busId={busId} bookingSeat={bookingSeat} setBookingSeat={setBookingSeat} setActiveStep={setActiveStep} passengers={passengers} setPassengers={setPassengers}/>
            <BookingSummaryPanel searchParm={searchParm} bookingSeat={bookingSeat} setBookingSeat={setBookingSeat} setActiveStep={setActiveStep} passengers={passengers} setPassengers={setPassengers}/>
        </section>
    )
}

export default BookingContent