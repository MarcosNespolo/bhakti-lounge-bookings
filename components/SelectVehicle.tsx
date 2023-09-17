
"use client"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"
import { ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { formatDate } from "./ListBookings"
import DatePicker from "./DatePicker"
import { VEHICLE_ID, vehicleOptions } from "@/app/lib/constants"

export default function SelectVehicle() {
  const [vehicleSelected, setVehicleSelected] = useState<number>(VEHICLE_ID.CAR)
  const [reason, setReason] = useState<string>('')
  const [user, setUser] = useState<string>('')
  const [pickup, setPickup] = useState<string>('')
  const [dropoff, setDropoff] = useState<string>('')
  const [error, setError] = useState<string | null>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingBookings, setIsLoadingBookings] = useState<boolean>(false)
  const [isBooked, setIsBooked] = useState<boolean>(false)
  const [unavailableDates, setUnavailableDates] = useState<{ min: string, max: string }[]>([])
  const [isIntervalAvailable, setIsIntervalAvailable] = useState<boolean>(true)
  const [isPickupAvailable, setPickupAvailable] = useState<boolean>(true)

  const supabase = createClientComponentClient()

  function isBookingDisabled() {
    return !(pickup != '' && dropoff != '' && user != '' && isIntervalAvailable && isPickupAvailable)
  }


  function verifyPickup() {
    if (new Date(pickup) < new Date()) {
      setPickupAvailable(false)
      return
    }
    setPickupAvailable(true)
  }

  function verifyInterval() {
    if (new Date(dropoff) < new Date()) {
      setIsIntervalAvailable(false)
      return
    }
    for (const booking of unavailableDates) {
      if (new Date(pickup) < new Date(booking.min) && new Date(dropoff) > new Date(booking.max)) {
        setIsIntervalAvailable(false)
        return
      }
    }
    setIsIntervalAvailable(true)
  }

  async function setBooking() {
    const newBooking = {
      car: vehicleSelected,
      user,
      reason,
      pickup,
      dropoff
    }
    console.log(newBooking)

    setIsLoading(true)

    await supabase
      .from('bookings')
      .insert(newBooking)
      .then((result) => {
        setIsLoading(false)
        console.log(result)
        if (result.status >= 400) {
          setError(result?.error?.message ?? null)
          console.log('ERROR: ', result?.error?.message)
        } else {
          setIsBooked(true)
          setError(null)
        }
      })
  }

  useEffect(() => {
    const getBookings = async () => {
      setIsLoadingBookings(true)
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(' * , car(*)')
        .order('pickup')
      if (bookingsData) {
        console.log(bookingsData)
        setUnavailableDates(bookingsData.map(booking => {
          return {
            min: booking.pickup,
            max: booking.dropoff
          }
        }))
        setIsLoadingBookings(false)
      }
      if (bookingsError) {
        console.log(bookingsError)
        setIsLoadingBookings(false)
        setError(bookingsError.message)
      }
    }

    getBookings()
  }, [])

  useEffect(() => {
    verifyInterval()
  }, [pickup, dropoff])

  useEffect(() => {
    verifyPickup()
  }, [pickup])

  return (
    <div className="p-4 px-6 h-fit w-full rounded-lg bg-white shadow-md max-w-sm">
      <img
        className='w-40 mx-auto my-6'
        src={'/bhakti-logo.jpg'}
      />
      {isLoadingBookings
        ? <ArrowPathIcon className={'animate-spin text-gray-200 mx-auto mb-4 h-12 w-12'} />
        : isBooked
          ?
          <>
            <div
              className="flex flex-col gap-2 p-4 mt-4 justify-center items-center w-full rounded-md bg-green-50 text-green-800 text-sm text-center"
            >
              <CheckCircleIcon
                className="w-12 h-12 text-green-800 opacity-50"
              />
              <p className="font-semibold">
                Your booking has been confirmed!
              </p>
              <p className="">
                If you're running late, please contact the manager.
              </p>
            </div>
            <div className="w-full flex flex-col bg-white shadow-md max-w-sm mt-4 gap-4 p-4 rounded-md border border-gray-50">
              <div className="flex flex-row gap-4">
                <div className="flex items-center bg-gray-100 -mt-4 -ml-4 rounded-md shadow p-2 sm:p-4">
                  <img
                    className='w-fit h-10 sm:h-16'
                    src={vehicleOptions.find(vehicle => vehicle.id == vehicleSelected)?.image}
                  />
                </div>
                <div className="flex flex-col gap-2 mb-4 gap-2 text-sm">
                  <div>
                    <p className='font-semibold'>Pick-up</p>
                    {formatDate(pickup)}
                  </div>
                  <div>
                    <p className='font-semibold'>Drop-off</p>
                    {formatDate(dropoff)}
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-8 text-sm">
                <div className="text-sm">
                  <p className='font-semibold'>Name</p>
                  {user}
                </div>
                {reason &&
                  <div className="text-sm break-all">
                    <p className='font-semibold'>Reason</p>
                    {reason}
                  </div>
                }
              </div>
            </div>
          </>
          :
          <>
            <div className='flex flex-row p-1 justify-between rounded-lg bg-[#e4e8c5] shadow-inner'>
              {vehicleOptions.map(vehicle => (
                <div
                  key={vehicle.id}
                  onClick={() => setVehicleSelected(vehicle.id)}
                  className={`p-4 cursor-pointer w-fit rounded-md hover:opacity-100 ${vehicleSelected == vehicle.id ? 'bg-white opacity-100 shadow' : 'bg-transparent opacity-60 hover:shadow hover:bg-white/30'}`}>
                  <img
                    className='h-16'
                    src={vehicle.image}
                  />
                </div>
              ))}
            </div>
            <div className='flex flex-col gap-4 mt-8 w-full'>
              <div className='w-full'>
                <p className='text-sm font-semibold'>Pick-up</p>
                <DatePicker
                  id="pickup"
                  isAvailable={isPickupAvailable}
                  onChange={newDate => setPickup(newDate)}
                  unavailableDates={unavailableDates}
                />
              </div>
              <div>
                <p className='text-sm font-semibold'>Drop-off</p>
                <DatePicker
                  id="dropoff"
                  dataMin={pickup ? pickup : ''}
                  isAvailable={isIntervalAvailable}
                  onChange={newDate => setDropoff(newDate)}
                  unavailableDates={unavailableDates}
                />
              </div>
              <div className='w-full flex-flex-row gap-2'>
                <p className='text-sm font-semibold'>Name</p>
                <input
                  type='text'
                  className='text-sm border border-gray-200 w-full rounded-md p-2 mt-2 focus:border-primary focus:outline-none focus:ring-0'
                  onChange={(newDate) => setUser(newDate.target.value)}
                />
              </div>
              <div className='w-full flex-flex-row gap-2'>
                <p className='text-sm font-semibold'>Reason</p>
                <textarea
                  className='text-sm border border-gray-200 w-full rounded-md p-2 mt-2 focus:border-primary focus:outline-none focus:ring-0'
                  onChange={(newDate) => setReason(newDate.target.value)}
                />
              </div>
              <button
                className={`h-11 flex flex-row items-center justify-center relative py-2 rounded-lg text-white opacity-90 shadow ${isBookingDisabled() ? 'bg-gray-400' : 'bg-[#eba258] hover:opacity-100'}`}
                onClick={() => setBooking()}
                disabled={isBookingDisabled()}
              >
                {isLoading
                  ? <ArrowPathIcon className={'animate-spin h-4 w-4'} />
                  : <p>Confirm Booking</p>
                }
              </button>
              {error
                ?
                <div className="w-full p-2 rounded-md bg-red-100 text-red-800 text-sm">
                  <p className="font-semibold">
                    Oops, we encountered an issue. =(
                  </p>
                  <p className="font-semibold mt-2">
                    Please get in touch with us and report the following error:
                  </p>
                  <p className="mt-2">
                    {error}
                  </p>
                </div>
                : <></>
              }
            </div>
          </>
      }
    </div>
  )
}