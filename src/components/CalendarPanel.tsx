"use client";

import { weekdays } from "@/src/planner";
import type { CalendarDayViewModel, IsoDate } from "@/src/planner";

interface CalendarPanelProps {
  days: CalendarDayViewModel[];
  onSelectDate(date: IsoDate): void;
}

export function CalendarPanel({ days, onSelectDate }: CalendarPanelProps) {
  return (
    <section className="calendar-board">
      <div className="calendar-grid" role="grid">
        <div className="calendar-weekdays">
          {weekdays.map((weekday) => (
            <div className="weekday" key={weekday}>
              {weekday}
            </div>
          ))}
        </div>
        <div className="calendar-days">
          {days.map((day) => (
            <button className={day.className} type="button" key={day.date} onClick={() => onSelectDate(day.date)}>
              <span className="day-heading">
                <span className={day.isToday ? "day-number is-today" : "day-number"}>{day.dayOfMonth}</span>
              </span>
              <span className="day-items">
                {day.visibleEvents.map((event) => (
                  <span className={`calendar-chip event ${event.categoryClass}`} key={event.id}>
                    <span className="chip-time">{event.startTime}</span>
                    {event.title}
                  </span>
                ))}
                {day.visibleTasks.map((task) => (
                  <span className={`calendar-chip task ${task.priorityClass}`} key={task.id}>
                    할 일: {task.title}
                  </span>
                ))}
                {day.hiddenCount > 0 ? <span className="calendar-more">+{day.hiddenCount}개 더보기</span> : null}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
