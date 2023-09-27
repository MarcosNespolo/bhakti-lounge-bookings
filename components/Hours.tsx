"use client"

import { format, isSameMinute } from "date-fns"
import { CheckCircle2 } from "lucide-react"
import React, { memo, useState } from "react"
import { cn } from "../app/lib/utils"

// eslint-disable-next-line react/display-name
const AvailableHours = memo(({ freeTimes, isPickup, confirmOption }: { freeTimes: Date[], isPickup: boolean, confirmOption: (selectedTime: Date) => void }) => {
    const [selectedTime, setSelectedTime] = useState<Date>()

    return (
        <div className="flex flex-col items-center gap-2 p-4">
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6  text-md gap-2">
                {freeTimes.map((hour, hourIdx) => (
                    <div key={hourIdx}>
                        <button
                            type="button"
                            className={cn(
                                "text-sm rounded-lg px-2 text-gray-800 relative w-[48px] h-[26px]",
                                selectedTime &&
                                    isSameMinute(selectedTime, hour)
                                    ? "bg-primary/40 text-gray-800 font-semibold"
                                    : "hover:bg-primary/10"
                            )}
                            onClick={() => setSelectedTime(hour)}
                        >
                            <CheckCircle2
                                className={cn(
                                    "w-[14px] h-[14px] absolute hidden top-0 right-0 transform translate-x-1 -translate-y-1.5 text-white bg-primary rounded-full",
                                    selectedTime && isSameMinute(selectedTime, hour) && "block"
                                )}
                            />
                            {format(hour, "HH:mm")}
                        </button>
                    </div>
                ))}
            </div>
            {selectedTime && (
                <button
                    className={`h-fit flex flex-col w-full py-2 items-center justify-center relative py-2 rounded-lg text-white opacity-90 shadow bg-[#eba258] hover:opacity-100`}
                    onClick={() => confirmOption(selectedTime)}
                >
                    <p>Confirm {isPickup ? 'Pick-up' : 'Drop-off'}</p>
                    {format(selectedTime, "dd MMMM yyyy HH:mm")}h
                </button>
            )}
        </div>
    )
})

export default AvailableHours