import { eachMinuteOfInterval, endOfDay, isSameMinute, set, startOfDay } from 'date-fns'
import React, { memo } from 'react'
import { cn } from '../app/lib/utils'

// eslint-disable-next-line react/display-name
const TimesBar = memo(({times}:{times:Date[]}) => {

  const StartOfWeek = startOfDay(times[0])
  const EndtOfWeek = endOfDay(times[0])
  const startHour = set(StartOfWeek, { hours: 0 })
  const endHour = set(EndtOfWeek, { hours: 23, minutes: 30 })
  let hoursInDay = eachMinuteOfInterval(
    {
      start: startHour,
      end: endHour,
    },
    { step: 30 }
  )

  return (
    <div className={cn(`w-[42px]`, 'flex justify-center rounded-md overflow-hidden')}>
      <div className='flex rounded-md'>
        {hoursInDay.map((hour, i) => {
          return (
            <div
              key={i}
              className={cn(
                times.some((time) => isSameMinute(hour, time)) &&
                  "h-[4px] w-[.5px] bg-green-300",
                !times.some((time) => isSameMinute(hour, time)) &&
                  "h-[4px] w-[.5px] bg-gray-300"
              )}
            />
          )
        })}
      </div>
    </div>
  )
})

export default TimesBar