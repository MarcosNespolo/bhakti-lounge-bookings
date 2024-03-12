"use client";

import { useMemo, useState } from "react";
import { cn, dayNames } from "../app/lib/utils";
import {
  add,
  addDays,
  addHours,
  eachDayOfInterval,
  eachMinuteOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isAfter,
  isBefore,
  isEqual,
  isSameMonth,
  isThisMonth,
  isToday,
  parse,
  set,
  startOfDay,
  startOfToday,
  startOfWeek,
  startOfYesterday,
} from "date-fns";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import AvailableHours from "./Hours";
import TimesBar from "./TimesBar";

type CalendarType = {
  isPickup?: boolean;
  unavailableDates?: { min: string; max: string }[];
  onAction: (newDate: Date) => void;
};

export default function Calendar({
  isPickup = false,
  unavailableDates,
  onAction,
}: CalendarType) {
  // display div of availables times
  const [calendarTouched, setCalendarTouched] = useState<Boolean>(false);

  // handle dates
  let today = startOfToday();
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let [selectedDay, setSelectedDay] = useState(today);
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  let days = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(firstDayCurrentMonth, { weekStartsOn: 1 }),
        end: endOfWeek(endOfMonth(firstDayCurrentMonth), { weekStartsOn: 1 }),
      }),
    [firstDayCurrentMonth]
  );

  // all days avaiilable times in this month until you change it
  const [availableTimesInThisMonth, setAvailableTimesInThisMonth] = useState<
    number[]
  >([]);
  const [
    availableTimesInThisMonthForEachDay,
    setAvailableTimesInThisMonthForEachDay,
  ] = useState<Date[][]>([]);

  // next and prev month functions
  function prevMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }
  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  // get available times for the selected day
  const freeTimes = useMemo(() => {
    const StartOfToday = startOfDay(selectedDay);
    const endOfToday = endOfDay(selectedDay);
    // change your working hours here
    const startHour = set(StartOfToday, { hours: 5 });
    const endHour = set(endOfToday, { hours: 23, minutes: 0 });
    let hoursInDay = eachMinuteOfInterval(
      {
        start: startHour,
        end: endHour,
      },
      { step: 30 }
    );

    let freeTimes: Date[] = hoursInDay;

    if (unavailableDates) {
      if (isPickup) {
        unavailableDates.forEach((unavailableDate) => {
          freeTimes = freeTimes.filter(
            (hour) =>
              new Date(hour) < new Date(unavailableDate.min) ||
              new Date(hour) >= new Date(unavailableDate.max)
          );
        });
      } else {
        unavailableDates.forEach((unavailableDate) => {
          freeTimes = freeTimes.filter(
            (hour) =>
              new Date(hour) <= new Date(unavailableDate.min) ||
              new Date(hour) > new Date(unavailableDate.max)
          );
        });
      }
    }

    return freeTimes;
  }, [selectedDay]);

  // calculate the number of available times for each day in this month
  useMemo(() => {
    let thisMonthTimesLength: number[] = [];
    let thisMonthTimesEachDay: Date[][] = [];
    days.map((day, dayIdx) => {
      // get times

      const StartOfToday = startOfDay(day);
      const endOfToday = endOfDay(day);
      // change your working hours here
      const startHour = set(StartOfToday, { hours: 5 });
      const endHour = set(endOfToday, { hours: 23, minutes: 0 });
      let hoursInDay = eachMinuteOfInterval(
        {
          start: startHour,
          end: endHour,
        },
        { step: 30 }
      );
      // filter the available hours

      let freeTimes: Date[] = hoursInDay;

      if (unavailableDates) {
        if (isPickup) {
          unavailableDates.forEach((unavailableDate) => {
            freeTimes = freeTimes.filter(
              (hour) =>
                new Date(hour) < new Date(unavailableDate.min) ||
                new Date(hour) >= new Date(unavailableDate.max)
            );
          });
        } else {
          unavailableDates.forEach((unavailableDate) => {
            freeTimes = freeTimes.filter(
              (hour) =>
                new Date(hour) <= new Date(unavailableDate.min) ||
                new Date(hour) > new Date(unavailableDate.max)
            );
          });
        }
      }

      thisMonthTimesLength.push(freeTimes.length);
      thisMonthTimesEachDay.push(freeTimes);
    });

    setAvailableTimesInThisMonth(thisMonthTimesLength);
    setAvailableTimesInThisMonthForEachDay(thisMonthTimesEachDay);
  }, [currentMonth]);

  return (
    <div className="flex flex-col w-full justify-center items-center gap-2 bg-gray-50 rounded-lg">
      {/* calendar implementation */}
      <div className="flex flex-col h-fit w-full p-2">
        {/* calendar header */}
        <div className="flex flex-row w-full items-center text-gray-600">
          <button
            type="button"
            className={`flex justify-end rounded-md p-1 ${
              !isThisMonth(new Date(currentMonth)) && "hover:bg-secondary"
            }`}
            onClick={prevMonth}
            disabled={isThisMonth(new Date(currentMonth))}
          >
            <ChevronLeft
              size={20}
              aria-hidden="true"
              className={cn(
                isThisMonth(new Date(currentMonth)) && "text-gray-300"
              )}
            />
          </button>
          <h2 className="font-semibold justify-center flex w-full">
            {format(firstDayCurrentMonth, " MMMM yyyy")}
          </h2>
          <button
            type="button"
            className="flex justify-end rounded-md p-1 hover:bg-secondary"
            onClick={nextMonth}
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>

        {/* calendar body */}
        <div>
          <div className="grid grid-cols-7 mt-4">
            {dayNames.map((day, i) => {
              return (
                <div
                  key={i}
                  className={cn(
                    "flex justify-center items-center text-sm text-gray-600 w-full py-2",
                    {
                      "bg-gray-100": day === "Sun" || day === "Sat",
                    }
                  )}
                >
                  {day}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-7 text-sm">
            {days.map((day, dayIdx) => {
              return (
                <div
                  key={day.toString()}
                  className={cn(
                    dayIdx === 0 && colStartClasses[getDay(day) - 1],
                    "h-14 justify-center flex items-center",
                    (getDay(day) === 0 || getDay(day) === 6) && "bg-gray-100"
                  )}
                >
                  <button
                    onClick={() => {
                      setCalendarTouched(true);
                      setSelectedDay(day);
                    }}
                    className={cn(
                      "w-10 h-10 flex flex-col p-2 justify-center items-center rounded-xl gap-0 group relative group",
                      isEqual(day, selectedDay) &&
                        "bg-primary/40 text-gray-800",
                      isEqual(today, day) && "bg-blue-50",
                      isBefore(day, today) &&
                        "text-gray-400 cursor-not-allowed",
                      isEqual(today, day) && "bg-blue-50",
                      isBefore(day, today) && "cursor-not-allowed",
                      isEqual(day, selectedDay) &&
                        isToday(day) &&
                        "bg-blue-200",
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth) &&
                        "text-gray-400",
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        !isBefore(day, today) &&
                        isSameMonth(day, firstDayCurrentMonth) &&
                        "text-gray-900 hover:bg-primary/10"
                    )}
                    disabled={isBefore(day, today)}
                  >
                    {isAfter(day, startOfYesterday()) && (
                      <span className="hidden group-hover:flex absolute top-0 -translate-x-.5 -translate-y-4 z-10 text-[11px] bg-slate-900 text-slate-100 px-1 rounded-md gap-1 z-50">
                        <span>{availableTimesInThisMonth[dayIdx]}</span>
                        <span>Available</span>
                      </span>
                    )}

                    <time
                      dateTime={format(day, "yyyy-MM-dd")}
                      className={cn(
                        "group-hover:font-semibold",
                        (isEqual(day, selectedDay) || isToday(day)) &&
                          "font-semibold"
                      )}
                    >
                      {format(day, "d")}
                    </time>

                    <CheckCircle2
                      className={cn(
                        "hidden",
                        isEqual(day, selectedDay) &&
                          "absolute block top-0 right-0 h-[14px] w-[14px] translate-x-1 -translate-y-1 bg-primary rounded-full text-white z-10"
                      )}
                    />

                    {isAfter(day, startOfYesterday()) && (
                      <TimesBar
                        times={availableTimesInThisMonthForEachDay[dayIdx]}
                      />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={cn(`hidden`, calendarTouched && "block")}>
        <AvailableHours
          freeTimes={freeTimes}
          confirmOption={(selectedTime) => onAction(selectedTime)}
          isPickup={isPickup}
        />
      </div>
    </div>
  );
}

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];
