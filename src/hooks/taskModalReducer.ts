import type { IsoDate, LocalDateTime, Priority, Task } from "@/src/planner";

type TaskModalMode = "create" | "edit";

export interface TaskModalState {
  mode: TaskModalMode | null;
  editingTaskId: string | null;
  title: string;
  dueDate: IsoDate;
  priority: Priority;
  note: string;
  reminderAt: LocalDateTime;
}

export type TaskModalAction =
  | { type: "OPEN_CREATE"; selectedDate: IsoDate }
  | { type: "OPEN_EDIT"; task: Task }
  | { type: "CLOSE" }
  | { type: "SET_TITLE"; value: string }
  | { type: "SET_DUE_DATE"; value: IsoDate }
  | { type: "SET_PRIORITY"; value: Priority }
  | { type: "SET_NOTE"; value: string }
  | { type: "SET_REMINDER_AT"; value: LocalDateTime };

export const INITIAL_MODAL_STATE: TaskModalState = {
  mode: null,
  editingTaskId: null,
  title: "",
  dueDate: "",
  priority: "medium",
  note: "",
  reminderAt: ""
};

export function taskModalReducer(state: TaskModalState, action: TaskModalAction): TaskModalState {
  switch (action.type) {
    case "OPEN_CREATE":
      return { mode: "create", editingTaskId: null, title: "", dueDate: action.selectedDate, priority: "medium", note: "", reminderAt: "" };
    case "OPEN_EDIT":
      return { mode: "edit", editingTaskId: action.task.id, title: action.task.title, dueDate: action.task.dueDate, priority: action.task.priority, note: action.task.note ?? "", reminderAt: action.task.reminderAt ?? "" };
    case "CLOSE":
      return { ...state, mode: null, editingTaskId: null };
    case "SET_TITLE": return { ...state, title: action.value };
    case "SET_DUE_DATE": return { ...state, dueDate: action.value };
    case "SET_PRIORITY": return { ...state, priority: action.value };
    case "SET_NOTE": return { ...state, note: action.value };
    case "SET_REMINDER_AT": return { ...state, reminderAt: action.value };
    default: return state;
  }
}
