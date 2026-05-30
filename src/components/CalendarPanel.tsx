"use client";

import { createMonthGrid, EVENT_CATEGORY_CLASS, getEventsForDate, getTasksForDate, TASK_PRIORITY_CLASS, todayIso, weekdays } from "@/src/planner";
import type { IsoDate, ScheduleEvent, Task } from "@/src/planner";

interface CalendarPanelProps {
  tasks: Task[];
  events: ScheduleEvent[];
  selectedDate: IsoDate;
  visibleMonth: IsoDate;
  onSelectDate(date: string): void;
}

export function CalendarPanel({ tasks, events, selectedDate, visibleMonth, onSelectDate }: CalendarPanelProps) {
  const monthGrid = createMonthGrid(visibleMonth, todayIso());

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
          {monthGrid.map((day) => {
            const dayTasks = getTasksForDate(tasks, day.date).filter((task) => !task.done);
            const dayEvents = getEventsForDate(events, day.date);
            const visibleEvents = dayEvents.slice(0, 3);
            const visibleTasks = dayTasks.slice(0, Math.max(0, 3 - visibleEvents.length));
            const hiddenCount = dayEvents.length + dayTasks.length - visibleEvents.length - visibleTasks.length;
            const className = ["day-cell", day.isCurrentMonth ? "" : "is-muted", selectedDate === day.date ? "is-selected" : ""]
              .filter(Boolean)
              .join(" ");

            return (
              <button className={className} type="button" key={day.date} onClick={() => onSelectDate(day.date)}>
                <span className="day-heading">
                  <span className={day.isToday ? "day-number is-today" : "day-number"}>{day.dayOfMonth}</span>
                </span>
                <span className="day-items">
                  {visibleEvents.map((event) => (
                    <span className={`calendar-chip event ${EVENT_CATEGORY_CLASS[event.category]}`} key={event.id}>
                      <span className="chip-time">{event.startTime}</span>
                      {event.title}
                    </span>
                  ))}
                  {visibleTasks.map((task) => (
                    <span className={`calendar-chip task ${TASK_PRIORITY_CLASS[task.priority]}`} key={task.id}>
                      할 일: {task.title}
                    </span>
                  ))}
                  {hiddenCount > 0 ? <span className="calendar-more">+{hiddenCount}개 더보기</span> : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

