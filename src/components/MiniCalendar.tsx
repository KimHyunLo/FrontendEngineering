"use client";

import { addMonths, createMonthGrid, formatMonth, getEventsForDate, getTasksForDate, todayIso, weekdays } from "@/src/planner";
import type { IsoDate, ScheduleEvent, Task } from "@/src/planner";

interface MiniCalendarProps {
  tasks: Task[];
  events: ScheduleEvent[];
  selectedDate: IsoDate;
  visibleMonth: IsoDate;
  onSelectDate(date: IsoDate): void;
  onVisibleMonthChange(month: IsoDate): void;
}

export function MiniCalendar({ tasks, events, selectedDate, visibleMonth, onSelectDate, onVisibleMonthChange }: MiniCalendarProps) {
  const days = createMonthGrid(visibleMonth, todayIso());

  return (
    <section className="mini-calendar">
      <div className="mini-calendar-header">
        <button className="icon-button" type="button" aria-label="이전 달" onClick={() => onVisibleMonthChange(addMonths(visibleMonth, -1))}>
          {"<"}
        </button>
        <strong>{formatMonth(visibleMonth)}</strong>
        <button className="icon-button" type="button" aria-label="다음 달" onClick={() => onVisibleMonthChange(addMonths(visibleMonth, 1))}>
          {">"}
        </button>
      </div>
      <div className="mini-calendar-grid">
        {weekdays.map((weekday) => (
          <span className="mini-weekday" key={weekday}>
            {weekday}
          </span>
        ))}
        {days.map((day) => {
          const hasEvents = getEventsForDate(events, day.date).length > 0;
          const hasTasks = getTasksForDate(tasks, day.date).some((task) => !task.done);
          const className = [
            "mini-day",
            day.isCurrentMonth ? "" : "is-muted",
            day.isToday ? "is-today" : "",
            selectedDate === day.date ? "is-selected" : ""
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button className={className} type="button" key={day.date} onClick={() => onSelectDate(day.date)}>
              <span>{day.dayOfMonth}</span>
              <span className="mini-dots">
                {hasEvents ? <span className="mini-dot event" /> : null}
                {hasTasks ? <span className="mini-dot task" /> : null}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
