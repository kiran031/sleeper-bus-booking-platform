import React, { useState } from 'react'
import BookingHeader from '../components/booking/BookingHeader'
import BookingDetails from '../components/booking/BookingDetails'
import { useParams, useSearchParams } from 'react-router';
import SeatSelectionPanel from '../components/booking/seatSelectionPanel';
import BookingContent from '../components/booking/BookingContent';
import ReviewBooking from '../components/booking/ReviewBooking';

const BookingSleeper = () => {

    const [activeStep, setActiveStep] = useState(1)

    const { busId } = useParams();
    const [searchParm] = useSearchParams()

    const [bookingSeat, setBookingSeat] = useState([])
    const [passengers, setPassengers] = useState([]);

    return (
        <>
            <BookingHeader activeStep={activeStep} />
            <main className='max-w-screen m-2 box-border'>
                <BookingDetails searchParm={searchParm} />
                {
                    activeStep === 3 ?
                         (<ReviewBooking searchParm={searchParm} bookingSeat={bookingSeat} passengers={passengers} setActiveStep={setActiveStep}/>)
                        : (<BookingContent busId={busId} searchParm={searchParm} setActiveStep={setActiveStep} bookingSeat={bookingSeat} setBookingSeat={setBookingSeat} passengers={passengers} setPassengers={setPassengers} />)
                }
            </main>
        </>
    )
}

export default BookingSleeper