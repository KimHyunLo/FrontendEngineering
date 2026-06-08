"use client";

import { useEffect } from "react";
import type { Dispatch } from "react";
import type { PlannerAction } from "./plannerReducer";

export function useNotificationPoller(dispatch: Dispatch<PlannerAction>): void {
  useEffect(() => {
    const timer = window.setInterval(() => {
      dispatch({ type: "refreshNotifications" });
    }, 30_000);

    return () => window.clearInterval(timer);
  }, [dispatch]);
}
