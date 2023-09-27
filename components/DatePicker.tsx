import { getTodayDate } from '@/app/lib/expressions';
import React, { useEffect, useState } from 'react';

type DatePickerType = {
    id: string
    selectedDate?: string
    unavailableDates?: { min: string, max: string }[]
    onChange: (newDate: string) => void
    dataMin?: string
    isAvailable?: boolean
    showPastDates?: boolean
}

export function DatePicker({ id, selectedDate, dataMin, unavailableDates, isAvailable = true, showPastDates = false, onChange }: DatePickerType) {
    const [newSelectedDate, setNewSelectedDate] = useState(selectedDate ? selectedDate : '');

    useEffect(() => {
        if (selectedDate) {
            setNewSelectedDate(selectedDate)
        }
    }, [selectedDate])

    function isUnavailable(newDate: string) {
        if (!isAvailable) {
            return true
        }
        if (!unavailableDates) {
            return false
        }
        const data = new Date(newDate)
        return unavailableDates.some(({ min, max }) => {
            const dataMin = new Date(min)
            const dataMax = new Date(max)
            return data >= dataMin && data <= dataMax
        })
    }

    function handleChange(e: any) {
        setNewSelectedDate(e.target.value)
        if (isUnavailable(e.target.value)) {
            onChange('')
        } else {
            onChange(e.target.value)
        }
    }

    function getMaxDate(minDate: string) {
        const dateSplit = minDate.split('-')
        if (minDate.length < 3) {
            return minDate
        }
        return dateSplit[0] + '-' + (+dateSplit[1] + 3).toString() + '-' + dateSplit[2]
    }

    return (
        <div id={id} className="relative w-full">
            <input
                type="datetime-local"
                id={`${id}-data`}
                className='text-sm w-full h-10 border border-gray-200 text-gray-600 rounded-md p-2 mt-2 hover:border-primary active:border-primary focus:border-primary focus:outline-none focus:ring-0'
                name="data"
                value={newSelectedDate}
                onChange={handleChange}
                min={dataMin ? dataMin : showPastDates ? '' : getTodayDate()}
                max={getMaxDate(dataMin ? dataMin : getTodayDate(true))}
            />
            {isUnavailable(newSelectedDate) && (
                <p className='text-red-600 text-xs mt-1 ml-2.5'>Unavailable =(</p>
            )}
        </div>
    );
};

export default DatePicker;
