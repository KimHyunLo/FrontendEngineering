"use client";

import { useEffect, useReducer } from "react";
import type { EventDraft, IsoDate, TaskDraft } from "@/src/planner";
import { plannerReducer, readPlannerState, STORAGE_KEY } from "./plannerReducer";
import { useLocalStorageSync } from "./useLocalStorageSync";
import { useNotificationPoller } from "./useNotificationPoller";

export function usePlannerStore() {
  const [state, dispatch] = useReducer(plannerReducer, undefined);

  useEffect(() => {
    dispatch({ type: "replace", state: readPlannerState() });
  }, []);

  useLocalStorageSync(state, STORAGE_KEY);
  useNotificationPoller(dispatch);

  return {
    state,
    hydrated: state !== undefined,
    actions: {
      selectDate(date: IsoDate) {
        dispatch({ type: "selectDate", date });
      },
      setVisibleMonth(month: IsoDate) {
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
