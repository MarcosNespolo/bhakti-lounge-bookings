
"use client"
import { ArrowPathIcon, FunnelIcon, NoSymbolIcon } from "@heroicons/react/24/outline"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"
import DatePicker from "./DatePicker"
import { getNextMonthDate, getTodayDate } from "@/app/lib/expressions"
import { vehicleOptions } from "@/app/lib/constants"
import InputCodeModal from "./CancelModal"

type CarType = {
  id: number
  created_at: string
  name: string
  image: string
}

type BookingType = {
  id: string
  created_at: string
  car: CarType
  pickup: string
  dropoff: string
  reason: string
  user: string
  active: boolean
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
  const [pickupDateFilter, setPickupDateFilter] = useState<string[]>([getTodayDate(), getNextMonthDate()])
  const [dropoffDateFilter, setDropoffDateFilter] = useState<string[]>(['', ''])
  const [vehiclesFilter, setVehiclesFilter] = useState<number[]>(vehicleOptions.map(vehicle => vehicle.id))
  const [user, setUser] = useState<string>('')
  const [isFilterOn, setIsFilterOn] = useState<boolean>(false)
  const [filtersOn, setFiltersOn] = useState<number>(0)
  const [seeCanceled, setSeeCanceled] = useState<boolean>(false)
  const [bookIdToCancel, setBookIdToCancel] = useState<string>('')

  useEffect(() => {
    setFiltersOn(0)
    getBookings()
  }, [pickupDateFilter, dropoffDateFilter, vehiclesFilter, user, seeCanceled])

  function onChangeVehiclesFilter(vehicleId: number) {
    if (vehiclesFilter.includes(vehicleId)) {
      setVehiclesFilter(vehiclesFilter.filter(vehicleFilter => vehicleFilter != vehicleId))
    } else {
      setVehiclesFilter(vehicleFilter => [...vehicleFilter, vehicleId])
    }
  }

  async function getBookings() {
    setIsLoading(true)
    let filtersCount = 0

    let query = supabase
      .from('bookings')
      .select(' * , car(*)')
      .order('pickup')
      .in('car', vehiclesFilter)

    if (!seeCanceled) {
      query.eq('active', true)
    }

    if (user != '') {
      filtersCount++
      query.ilike('user', `%${user}%`)
    }

    if (pickupDateFilter[0] != '') {
      filtersCount++
      query.gt('pickup', pickupDateFilter[0])
    }
    if (pickupDateFilter[1] != '') {
      filtersCount++
      query.lt('pickup', pickupDateFilter[1])
    }
    if (dropoffDateFilter[0] != '') {
      filtersCount++
      query.gt('dropoff', dropoffDateFilter[0])
    }
    if (dropoffDateFilter[1] != '') {
      filtersCount++
      query.lt('dropoff', dropoffDateFilter[1])
    }

    setFiltersOn(filtersCount)
    const { data, error: bookingsError } = await query

    if (data) {
      setIsLoading(false)
      setBookings(data)
    }
    if (bookingsError) {
      setIsLoading(false)
      setError(bookingsError.message)
    }
  }

  return (
    <div className="flex flex-col p-4 h-fit w-full rounded-lg bg-white shadow-md max-w-sm">
      <InputCodeModal
        isOpen={bookIdToCancel != ''}
        bookingId={bookIdToCancel}
        closeModal={() => setBookIdToCancel('')}
        onAction={() => getBookings()}
      />
      <img
        className='w-40 mx-auto my-6'
        src={'/bhakti-logo.jpg'}
      />
      {!isLoading &&
        <button
          onClick={() => setIsFilterOn(isFilterOn => !isFilterOn)}
          className={`
          flex items-center
          relative
          z-10
          w-fit 
          p-2 gap-1 mb-2 ml-auto 
          shadow 
          text-gray-600 text-sm font-medium 
          rounded-lg 
          text-gray-600
          border
          border-gray-100
          hover:border-primary
          ${isFilterOn
              ? 'bg-gray-100 shadow-inner'
              : 'bg-white'
            }
        `}
        >
          {filtersOn > 0 &&
            <p className="-top-3 -right-3 absolute flex items-center justify-center bg-red-400 text-white font-semibold w-5 h-5 rounded-full text-xs">
              {filtersOn}
            </p>
          }
          <FunnelIcon className="stroke-2 h-4 w-4" />
          Filters
        </button>
      }
      {isFilterOn &&
        <div className="flex flex-col gap-4 mb-4 border border-gray-100 rounded-lg p-2">
          <div className='w-full flex-flex-row gap-2'>
            <p className='text-sm font-semibold'>Name</p>
            <input
              type='text'
              className='text-sm border border-gray-200 w-full rounded-md p-2 mt-2 focus:border-primary focus:outline-none focus:ring-0'
              onChange={(newDate) => setUser(newDate.target.value)}
            />
          </div>
          <div className="flex flex-row gap-4">
            {vehicleOptions.map(vehicle => (
              <p
                className="flex flex-row gap-2 text-sm font-semibold cursor-pointer hover:opacity-80"
                onClick={() => onChangeVehiclesFilter(vehicle.id)}
              >
                <input
                  type="checkbox"
                  checked={vehiclesFilter.includes(vehicle.id)}
                  className='cursor-pointer color-primary'
                />
                {vehicle.name}
              </p>
            ))}
          </div>
          <div>
            <p className='text-sm font-semibold'>Pick-up</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <DatePicker
                id="pickup-start"
                selectedDate={pickupDateFilter[0]}
                onChange={newDate => setPickupDateFilter(pickupDate => [newDate, pickupDate[1]])}
                showPastDates
              />
              <DatePicker
                id="pickup-end"
                selectedDate={pickupDateFilter[1]}
                onChange={newDate => setPickupDateFilter(pickupDate => [pickupDate[0], newDate])}
                showPastDates
              />
            </div>
          </div>
          <div>
            <p className='text-sm font-semibold'>Drop-off</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <DatePicker
                id="dropoff-start"
                selectedDate={dropoffDateFilter[0]}
                onChange={newDate => setDropoffDateFilter(dropoff => [newDate, dropoff[1]])}
                showPastDates
              />
              <DatePicker
                id="dropoff-end"
                selectedDate={dropoffDateFilter[1]}
                onChange={newDate => setDropoffDateFilter(dropoff => [dropoff[0], newDate])}
                showPastDates
              />
            </div>
          </div>
          <p
            className="flex flex-row gap-2 text-sm font-semibold cursor-pointer hover:opacity-80"
            onClick={() => setSeeCanceled(seeCanceled => !seeCanceled)}
          >
            <input
              type="checkbox"
              checked={seeCanceled}
              className='cursor-pointer color-primary'
            />
            See Canceled
          </p>
        </div>
      }
      {isLoading
        ? <ArrowPathIcon className={'animate-spin text-gray-200 mx-auto my-4 h-12 w-12'} />
        : bookings && bookings.length > 0 && bookings.map((booking, index) => (
          <div key={index} className={`w-full flex flex-col max-w-sm mt-4 gap-4 p-4 rounded-md border 
            ${booking.active
              ? 'bg-white shadow-md border-gray-50'
              : 'bg-gray-50 shadow-sm saturate-0 opacity-70 border-gray-100'
            }`}>
            <div className="flex flex-row gap-4">
              <div className="flex items-center bg-gray-100 -mt-4 -ml-4 rounded-md shadow p-2 sm:p-4">
                <img
                  className={`w-fit h-10 sm:h-16`}
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
            {booking.active
              ? <button
                onClick={() => setBookIdToCancel(booking.id)}
                className={`
                  flex items-center
                  w-fit 
                  p-2 gap-1 ml-auto 
                  shadow 
                  text-gray-600 text-sm font-medium 
                  rounded-lg 
                  text-gray-600
                  bg-white
                  border
                  border-gray-100
                  hover:border-red-400
                  hover:text-red-500
              `}
              >
                <NoSymbolIcon className="stroke-2 h-4 w-4" />
                Cancel
              </button>
              : <p className="text-sm ml-auto font-semibold">
                Canceled
              </p>
            }
          </div>
        ))}
    </div>
  )
}