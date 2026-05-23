"use client";

import { createInitialState } from "@/src/planner";
import { useEffect, useReducer, useState } from "react";
import type { EventDraft, TaskDraft } from "@/src/planner";
import { plannerReducer, readPlannerState, STORAGE_KEY } from "./plannerReducer";

export function usePlannerStore() {
  const [state, dispatch] = useReducer(plannerReducer, undefined, () => createInitialState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    dispatch({ type: "replace", state: readPlannerState() });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      dispatch({ type: "refreshNotifications" });
    }, 30_000);

    return () => window.clearInterval(timer);
  }, []);

  return {
    state,
    hydrated,
    actions: {
      selectDate(date: string) {
        dispatch({ type: "selectDate", date });
      },
      setVisibleMonth(month: string) {
        dispatch({ type: "setVisibleMonth", month });
      },
      addTask(draft: TaskDraft) {
        dispatch({ type: "addTask", draft });
      },
      updateTask(id: string, draft: TaskDraft) {
        dispatch({ type: "updateTask", id, draft });
      },
      toggleTask(id: string) {
        dispatch({ type: "toggleTask", id });
      },
      deleteTask(id: string) {
        dispatch({ type: "deleteTask", id });
      },
      addEvent(draft: EventDraft) {
        dispatch({ type: "addEvent", draft });
      },
      updateEvent(id: string, draft: EventDraft) {
        dispatch({ type: "updateEvent", id, draft });
      },
      deleteEvent(id: string) {
        dispatch({ type: "deleteEvent", id });
      },
      markNotificationRead(id: string) {
        dispatch({ type: "markNotificationRead", id });
      },
      snoozeNotification(id: string, minutes: number) {
        dispatch({ type: "snoozeNotification", id, minutes });
      }
    }
  };
}
