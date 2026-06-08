"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { addDays, addMonths, parseIsoDate, todayIso } from "@/src/planner";
import type { EventDraft, IsoDate, PlannerState, TaskDraft } from "@/src/planner";

export type CalendarView = "month" | "week";

export function routeFor(view: CalendarView, date: IsoDate): string {
  return `/${view}?date=${date}`;
}

interface NavigationActions {
  selectDate(date: IsoDate): void;
  setVisibleMonth(month: IsoDate): void;
  addTask(draft: TaskDraft): void;
  updateTask(id: string, draft: TaskDraft): void;
  addEvent(draft: EventDraft): void;
  updateEvent(id: string, draft: EventDraft): void;
}

export function usePlannerNavigation(
  view: CalendarView,
  state: PlannerState | undefined,
  hydrated: boolean,
  actions: NavigationActions,
  initialDate: string | undefined
) {
  const router = useRouter();
  const routeDate = parseIsoDate(initialDate ?? "");

  useEffect(() => {
    if (!hydrated) return;

    const date = routeDate ?? todayIso();
    actions.selectDate(date);

    if (!routeDate) {
      router.replace(routeFor(view, date), { scroll: false });
    }
  }, [hydrated, routeDate, view]);

  function navigate(date: IsoDate) {
    actions.selectDate(date);
    router.replace(routeFor(view, date), { scroll: false });
  }

  return {
    selectDate: navigate,
    movePrevious() {
      if (!state) return;
      navigate(view === "month" ? addMonths(state.visibleMonth, -1) : addDays(state.selectedDate, -7));
    },
    moveNext() {
      if (!state) return;
      navigate(view === "month" ? addMonths(state.visibleMonth, 1) : addDays(state.selectedDate, 7));
    },
    selectToday() {
      navigate(todayIso());
    },
    addTask(draft: TaskDraft) {
      actions.addTask(draft);
      router.replace(routeFor(view, draft.dueDate), { scroll: false });
    },
    updateTask(id: string, draft: TaskDraft) {
      actions.updateTask(id, draft);
      router.replace(routeFor(view, draft.dueDate), { scroll: false });
    },
    addEvent(draft: EventDraft) {
      actions.addEvent(draft);
      router.replace(routeFor(view, draft.date), { scroll: false });
    },
    updateEvent(id: string, draft: EventDraft) {
      actions.updateEvent(id, draft);
      router.replace(routeFor(view, draft.date), { scroll: false });
    }
  };
}
