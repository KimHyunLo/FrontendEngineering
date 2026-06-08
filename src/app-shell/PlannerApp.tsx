"use client";

import { CalendarPanel } from "@/src/components/CalendarPanel";
import { MiniCalendar } from "@/src/components/MiniCalendar";
import { NotificationMenu } from "@/src/components/NotificationMenu";
import { SchedulePanel } from "@/src/components/SchedulePanel";
import { TaskPanel } from "@/src/components/TaskPanel";
import { WeekTimeline } from "@/src/components/WeekTimeline";
import { usePlannerNavigation, routeFor } from "@/src/hooks/usePlannerNavigation";
import type { CalendarView } from "@/src/hooks/usePlannerNavigation";
import { usePlannerStore } from "@/src/hooks/usePlannerStore";
import { formatMonth, formatWeekTitle } from "@/src/planner";
import Link from "next/link";

interface PlannerAppProps {
  view: CalendarView;
  initialDate?: string;
}

export function PlannerApp({ view, initialDate }: PlannerAppProps) {
  const { state, hydrated, actions } = usePlannerStore();
  const nav = usePlannerNavigation(view, state, hydrated, actions, initialDate);

  if (state === undefined) return null;

  const loadedState = state;
  const toolbarTitle = view === "month" ? formatMonth(loadedState.visibleMonth) : formatWeekTitle(loadedState.selectedDate);

  return (
    <main className="app-shell">
      <header className="calendar-topbar">
        <div className="brand">
          <h1>캘린더</h1>
          <span>일정과 할 일</span>
        </div>
        <div className="calendar-toolbar" aria-label="캘린더 이동">
          <button className="secondary-button" type="button" onClick={nav.selectToday}>
            오늘
          </button>
          <button className="icon-button" type="button" aria-label="이전" onClick={nav.movePrevious}>
            {"<"}
          </button>
          <button className="icon-button" type="button" aria-label="다음" onClick={nav.moveNext}>
            {">"}
          </button>
          <div className="toolbar-title">{toolbarTitle}</div>
        </div>
        <div className="topbar-actions">
          <div className="segmented view-switch" aria-label="캘린더 보기">
            <Link className={view === "month" ? "active" : ""} href={routeFor("month", state.selectedDate)}>
              월
            </Link>
            <Link className={view === "week" ? "active" : ""} href={routeFor("week", state.selectedDate)}>
              주
            </Link>
          </div>
          <span className="tag">{hydrated ? "저장됨" : "로딩"}</span>
          <NotificationMenu
            notifications={state.notifications}
            onRead={actions.markNotificationRead}
            onSnooze={actions.snoozeNotification}
          />
        </div>
      </header>

      <section className="calendar-workspace">
        <aside className="calendar-sidebar">
          {view === "week" ? (
            <MiniCalendar
              tasks={loadedState.tasks}
              events={loadedState.events}
              selectedDate={loadedState.selectedDate}
              visibleMonth={loadedState.visibleMonth}
              onSelectDate={nav.selectDate}
              onVisibleMonthChange={actions.setVisibleMonth}
            />
          ) : null}
          <SchedulePanel
            selectedDate={state.selectedDate}
            events={state.events}
            onAddEvent={nav.addEvent}
            onUpdateEvent={nav.updateEvent}
            onDeleteEvent={actions.deleteEvent}
          />
          <TaskPanel
            selectedDate={state.selectedDate}
            tasks={state.tasks}
            onAddTask={nav.addTask}
            onUpdateTask={nav.updateTask}
            onToggleTask={actions.toggleTask}
            onDeleteTask={actions.deleteTask}
          />
        </aside>

        {view === "month" ? (
          <CalendarPanel
            tasks={loadedState.tasks}
            events={loadedState.events}
            selectedDate={loadedState.selectedDate}
            visibleMonth={loadedState.visibleMonth}
            onSelectDate={nav.selectDate}
          />
        ) : (
          <WeekTimeline
            tasks={loadedState.tasks}
            events={loadedState.events}
            selectedDate={loadedState.selectedDate}
            onSelectDate={nav.selectDate}
            onAddEvent={nav.addEvent}
            onUpdateEvent={nav.updateEvent}
          />
        )}
      </section>
    </main>
  );
}
