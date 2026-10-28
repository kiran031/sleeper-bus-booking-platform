import React from 'react'
import Register from './pages/Register'
import Login from './pages/Login'
import { BrowserRouter, Routes, Route } from 'react-router'
import BusSearch from './pages/BusSearch'
import SleeperLayout from './components/SleeperLayout'
import BookingHeader from './components/booking/BookingHeader'
import BookingSleeper from './pages/BookingSleeper'
import BookingContent from './components/booking/BookingContent'
import ReviewBooking from './components/booking/ReviewBooking'
import StartPage from './pages/StartPage'
import Doubt from './Doubt'


const App = () => {
  return (

    <>

    <BrowserRouter>
      <Routes>
        <Route path="/start-page" element={<StartPage/>} />
        <Route path="/register" element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path="/search" element={<BusSearch />} />
        <Route path='/layout' element={<SleeperLayout/>} />
        <Route path='/sleeper-layout/:busId' element={<SleeperLayout/>} />
        <Route path='/booking-header' element={<BookingHeader/>} />
        <Route path='/booking/:busId' element={<BookingSleeper/>} />
        <Route path='/booking-content' element={<BookingContent/>} />
        <Route path='/review-booking' element={<ReviewBooking/>} />
      </Routes>
    </BrowserRouter>
    </>


  )
}

//kiran "eyJraWQiOiJGU2dmdTV2Ukd0VDR1b0Y3d3N4SE5CZlFrcGhtbnI2Z25tdkY2TjNtWmVBIiwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiIxIiwiZXhwIjoxNzkxMjU0Nzc3LCJpYXQiOjE3OTEyNTExNzd9.EjqbgpZj6RSyeMiuKqmZHzPr1Pdei5dXZbFwSiSonL4"
//Bagat "eyJraWQiOiJGU2dmdTV2Ukd0VDR1b0Y3d3N4SE5CZlFrcGhtbnI2Z25tdkY2TjNtWmVBIiwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJzdWIiOiIyIiwiZXhwIjoxNzkxMjU1MDU1LCJpYXQiOjE3OTEyNTE0NTV9.4-N4BJ4ocCdOXIQqntg7GHy5GPlPrX4HQQcQFVrQ1Bg"
export default App