import React, { useState } from 'react';

type DatePickerType = {
    id: string
    unavailableDates: { min: string, max: string }[]
    onChange: (newDate: string) => void
    dataMin?: string
    isAvailable?: boolean
}

export function DatePicker({ id, dataMin, unavailableDates, isAvailable = true, onChange }: DatePickerType) {
    const [selectedDate, setSelectedDate] = useState('');

    function isUnavailable(newDate: string) {
        if (!isAvailable) {
            return true
        }
        const data = new Date(newDate)
        return unavailableDates.some(({ min, max }) => {
            const dataMin = new Date(min)
            const dataMax = new Date(max)
            return data >= dataMin && data <= dataMax
        })
    }

    function handleChange(e: any) {
        setSelectedDate(e.target.value)
        if (isUnavailable(e.target.value)) {
            onChange('')
        } else {
            onChange(e.target.value)
        }
    };

    function getTodayDate() {
        const today = new Date();
        return today.getFullYear() +
            '-' +
            (today.getMonth() + 1).toLocaleString('en-NZ', {
                minimumIntegerDigits: 2,
                useGrouping: false
            }) +
            '-' +
            today.getDate().toLocaleString('en-NZ', {
                minimumIntegerDigits: 2,
                useGrouping: false
            }) +
            'T00:00'
    }

    function getMaxDate(minDate: string) {
        const dateSplit = minDate.split('-')
        if (minDate.length < 3) {
            return minDate
        }
        return dateSplit[0] + '-' + (+dateSplit[1] + 3).toString() + '-' + dateSplit[2]
    }

    return (
        <div className="relative w-full">
            <input
                type="datetime-local"
                id={`${id}-data`}
                className='text-sm w-full h-10 border border-gray-200 text-gray-600 rounded-md p-2 mt-2 active:border-[#fab820] focus:border-[#fab820] focus:outline-none focus:ring-0'
                name="data"
                value={selectedDate}
                onChange={handleChange}
                min={dataMin ? dataMin : getTodayDate()}
                max={getMaxDate(dataMin ? dataMin : getTodayDate())}
            />
            {isUnavailable(selectedDate) && (
                <p className='text-red-600 text-xs mt-1 ml-2.5'>Unavailable =(</p>
            )}
        </div>
    );
};

export default DatePicker;
