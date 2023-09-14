
"use client"
import { ArrowPathIcon } from "@heroicons/react/24/outline"
import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { error } from "console"
import { useEffect, useState } from "react"

type CarType = {
  id: number,
  created_at: string,
  name: string,
  image: string
}

type BookingType = {
  id: string,
  created_at: string,
  car: CarType,
  pickup: string,
  dropoff: string,
  reason: string,
  user: string
}

export function formatDate(timestamp: string) {
  const date = new Date(timestamp)
  const dateFormatted = date.toLocaleDateString('en-NZ', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return dateFormatted
}

export default function ListBookings() {
  const supabase = createClientComponentClient()
  const [bookings, setBookings] = useState<BookingType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>('')

  useEffect(() => {
    const getBookings = async () => {
      setIsLoading(true)
      const { data, error: bookingsError } = await supabase
        .from('bookings')
        .select(' * , car(*)')
        .order('pickup')
      if (data) {
        console.log(data)
        setIsLoading(false)
        setBookings(data)
      }
      if (bookingsError) {
        console.log(bookingsError)
        setIsLoading(false)
        setError(bookingsError.message)
      }
    }

    getBookings()
  }, [])


  return (
    <div className="p-4 h-fit w-full rounded-lg bg-white shadow-md max-w-sm">
      <img
        className='w-40 mx-auto my-6'
        src={'/bhakti-logo.jpg'}
      />
      {isLoading
        ? <ArrowPathIcon className={'animate-spin text-gray-200 mx-auto mb-4 h-12 w-12'} />
        : bookings && bookings.length > 0 && bookings.map(booking => (
          <div className="w-full flex flex-col bg-white shadow-md max-w-sm mt-4 gap-4 p-4 rounded-md border border-gray-50">
            <div className="flex flex-row gap-4">
              <div className="flex items-center bg-gray-100 -mt-4 -ml-4 rounded-md shadow p-2 sm:p-4">
                <img
                  className='w-fit h-10 sm:h-16'
                  src={booking.car.image}
                />
              </div>
              <div className="flex flex-col gap-2 mb-4 gap-2 text-sm">
                <div>
                  <p className='font-semibold'>Pick-up</p>
                  {formatDate(booking.pickup)}
                </div>
                <div>
                  <p className='font-semibold'>Drop-off</p>
                  {formatDate(booking.dropoff)}
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-8 text-sm">
              <div className="text-sm">
                <p className='font-semibold'>Name</p>
                {booking.user}
              </div>
              {booking.reason &&
                <div className="text-sm break-all">
                  <p className='font-semibold'>Reason</p>
                  {booking.reason}
                </div>
              }
            </div>
          </div>
        ))}
    </div>
  )
}