"use client";

import { CalendarDays } from "lucide-react";

import { CalendarGrid } from "@/features/calendar/components/CalendarGrid";
import { EventPanel } from "@/features/calendar/components/EventPanel";
import { useCalendar } from "@/features/calendar/hooks/useCalendar";

export function CalendarPage() {
  const {
    currentMonth,
    selectedDate,
    selectedEvents,
    events,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    selectDate,
    addEvent,
    deleteEvent,
  } = useCalendar();

  const today = new Date();

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black">
            <CalendarDays className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/30">
              Nexa Utility
            </p>

            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Calendar
            </h1>
          </div>
        </div>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/35">
          Organize your days, keep track of events, and manage your schedule
          locally on this device.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <CalendarGrid
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          today={today}
          events={events}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          onToday={goToToday}
          onSelectDate={selectDate}
        />

        <EventPanel
          selectedDate={selectedDate}
          events={selectedEvents}
          onAddEvent={addEvent}
          onDeleteEvent={deleteEvent}
        />
      </div>
    </div>
  );
}
