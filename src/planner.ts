export type IsoDate = string;
export type LocalDateTime = string;
export type Priority = "low" | "medium" | "high";
export type EventCategory = "work" | "personal" | "study" | "health";
export type NotificationStatus = "scheduled" | "ready" | "read";

export interface Task {
  id: string;
  title: string;
  dueDate: IsoDate;
  priority: Priority;
  done: boolean;
  note: string;
  reminderAt: LocalDateTime | null;
  createdAt: LocalDateTime;
  updatedAt: LocalDateTime;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  date: IsoDate;
  startTime: string;
  endTime: string;
  category: EventCategory;
  note: string;
  reminderAt: LocalDateTime | null;
  createdAt: LocalDateTime;
  updatedAt: LocalDateTime;
}

export interface PlannerNotification {
  id: string;
  sourceId: string;
  sourceType: "task" | "event";
  title: string;
  body: string;
  notifyAt: LocalDateTime;
  status: NotificationStatus;
  createdAt: LocalDateTime;
}

export interface PlannerState {
  tasks: Task[];
  events: ScheduleEvent[];
  notifications: PlannerNotification[];
  selectedDate: IsoDate;
  visibleMonth: IsoDate;
}

export interface TaskDraft {
  title: string;
  dueDate: IsoDate;
  priority: Priority;
  note: string;
  reminderAt: LocalDateTime | null;
}

export interface EventDraft {
  title: string;
  date: IsoDate;
  startTime: string;
  endTime: string;
  category: EventCategory;
  note: string;
  reminderAt: LocalDateTime | null;
}

export interface CalendarDay {
  date: IsoDate;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export interface WeekDay {
  date: IsoDate;
  dayOfMonth: number;
  weekday: string;
  isToday: boolean;
}

const DAY_MS = 24 * 60 * 60 * 1000;
export const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

/**
 * 고유 ID를 생성한다.
 * @param prefix ID 앞에 붙이는 접두사 (예: "task", "event")
 * @returns `{prefix}_{uuid}` 형태의 문자열
 */
export function createId(prefix: string): string {
  const random = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());
  return `${prefix}_${random}`;
}

/**
 * `Date` 객체를 `YYYY-MM-DD` 형식의 IsoDate 문자열로 변환한다.
 * @param date 변환할 Date 객체
 * @returns `YYYY-MM-DD` 형식의 날짜 문자열
 */
export function toIsoDate(date: Date): IsoDate {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * `Date` 객체를 `YYYY-MM-DDTHH:mm` 형식의 LocalDateTime 문자열로 변환한다.
 * @param date 변환할 Date 객체
 * @returns `YYYY-MM-DDTHH:mm` 형식의 날짜+시각 문자열
 */
export function toLocalDateTime(date: Date): LocalDateTime {
  const isoDate = toIsoDate(date);
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${isoDate}T${hour}:${minute}`;
}

/** 오늘 날짜를 IsoDate 형식으로 반환한다. */
export function todayIso(): IsoDate {
  return toIsoDate(new Date());
}

/** 현재 날짜·시각을 LocalDateTime 형식으로 반환한다. */
export function nowLocalDateTime(): LocalDateTime {
  return toLocalDateTime(new Date());
}

/**
 * IsoDate 문자열을 `Date` 객체로 파싱한다. 시간대 오프셋 없이 로컬 자정으로 해석한다.
 * @param value `YYYY-MM-DD` 형식의 날짜 문자열
 * @returns 해당 날짜의 로컬 자정 Date 객체
 */
export function parseIsoDate(value: IsoDate): Date {
  const [year = "0", month = "1", day = "1"] = value.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

/**
 * IsoDate에 지정한 일수를 더한 날짜를 반환한다.
 * @param value 기준 날짜 (IsoDate)
 * @param amount 더할 일수 (음수면 이전 날짜)
 */
export function addDays(value: IsoDate, amount: number): IsoDate {
  const date = parseIsoDate(value);
  date.setDate(date.getDate() + amount);
  return toIsoDate(date);
}

/**
 * LocalDateTime에 지정한 분을 더한 날짜·시각을 반환한다.
 * @param value 기준 날짜·시각 (LocalDateTime)
 * @param amount 더할 분 수 (음수면 이전 시각)
 */
export function addMinutes(value: LocalDateTime, amount: number): LocalDateTime {
  const date = new Date(value);
  date.setMinutes(date.getMinutes() + amount);
  return toLocalDateTime(date);
}

/**
 * IsoDate에 지정한 개월 수를 더한 달의 1일을 반환한다.
 * @param value 기준 날짜 (IsoDate)
 * @param amount 더할 개월 수 (음수면 이전 달)
 */
export function addMonths(value: IsoDate, amount: number): IsoDate {
  const date = parseIsoDate(value);
  return toIsoDate(new Date(date.getFullYear(), date.getMonth() + amount, 1));
}

/**
 * 주어진 날짜가 속한 주의 일요일(첫째 날)을 반환한다.
 * @param value 기준 날짜 (IsoDate)
 */
export function startOfWeek(value: IsoDate): IsoDate {
  const date = parseIsoDate(value);
  date.setDate(date.getDate() - date.getDay());
  return toIsoDate(date);
}

/**
 * IsoDate를 `YYYY년 M월` 형식의 문자열로 반환한다.
 * @param value 기준 날짜 (IsoDate)
 */
export function formatMonth(value: IsoDate): string {
  const date = parseIsoDate(value);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

/**
 * IsoDate를 `YYYY년 M월 N번째 주` 형식의 문자열로 반환한다.
 * @param value 기준 날짜 (IsoDate)
 */
export function formatWeekTitle(value: IsoDate): string {
  const date = parseIsoDate(value);
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const weekNumber = Math.floor((date.getDate() + firstDayOfMonth.getDay() - 1) / 7) + 1;
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${weekNumber}번째 주`;
}

/**
 * IsoDate를 `YYYY.MM.DD` 형식의 문자열로 반환한다.
 * @param value 기준 날짜 (IsoDate)
 */
export function formatDate(value: IsoDate): string {
  const date = parseIsoDate(value);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

/**
 * LocalDateTime을 `YYYY.MM.DD HH:mm` 형식의 문자열로 반환한다.
 * @param value 기준 날짜·시각 (LocalDateTime)
 */
export function formatDateTime(value: LocalDateTime): string {
  const [date, time = ""] = value.split("T");
  return `${formatDate(date)} ${time}`;
}

/**
 * 두 LocalDateTime을 비교한다. `Array.sort` 콜백에 직접 전달할 수 있다.
 * @returns `left < right`이면 음수, 같으면 0, `left > right`이면 양수
 */
export function compareDateTime(left: LocalDateTime, right: LocalDateTime): number {
  return new Date(left).getTime() - new Date(right).getTime();
}

/**
 * 월 달력 렌더링에 필요한 42개(6행 × 7열) `CalendarDay` 배열을 반환한다.
 * 앞뒤 달의 날짜로 빈 셀을 채운다.
 * @param visibleMonth 표시할 달의 임의 날짜 (IsoDate)
 * @param today 오늘 날짜 (isToday 판별에 사용)
 */
export function createMonthGrid(visibleMonth: IsoDate, today: IsoDate): CalendarDay[] {
  const monthStart = parseIsoDate(visibleMonth);
  const firstDay = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1);
  const gridStart = new Date(firstDay.getTime() - firstDay.getDay() * DAY_MS);
  const currentMonth = firstDay.getMonth();

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart.getTime() + index * DAY_MS);
    const iso = toIsoDate(date);
    return {
      date: iso,
      dayOfMonth: date.getDate(),
      isCurrentMonth: date.getMonth() === currentMonth,
      isToday: iso === today
    };
  });
}

/**
 * 주 타임라인 렌더링에 필요한 7개 `WeekDay` 배열을 반환한다.
 * `selectedDate`가 속한 주의 일요일부터 토요일까지를 포함한다.
 * @param selectedDate 기준 날짜 (IsoDate)
 * @param today 오늘 날짜 (isToday 판별에 사용)
 */
export function createWeekDays(selectedDate: IsoDate, today: IsoDate): WeekDay[] {
  const start = startOfWeek(selectedDate);
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(start, index);
    const parsed = parseIsoDate(date);
    return {
      date,
      dayOfMonth: parsed.getDate(),
      weekday: weekdays[index],
      isToday: date === today
    };
  });
}

/**
 * 특정 날짜에 해당하는 태스크를 필터링하고 정렬해 반환한다.
 * 미완료 태스크가 앞에, 같은 완료 상태 내에서는 우선순위 높은 순으로 정렬한다.
 * @param tasks 전체 태스크 목록
 * @param date 조회할 날짜 (IsoDate)
 */
export function getTasksForDate(tasks: Task[], date: IsoDate): Task[] {
  return tasks
    .filter((task) => task.dueDate === date)
    .sort((left, right) => Number(left.done) - Number(right.done) || priorityWeight(right.priority) - priorityWeight(left.priority));
}

/**
 * 특정 날짜에 해당하는 일정을 필터링하고 시작 시각 오름차순으로 정렬해 반환한다.
 * @param events 전체 일정 목록
 * @param date 조회할 날짜 (IsoDate)
 */
export function getEventsForDate(events: ScheduleEvent[], date: IsoDate): ScheduleEvent[] {
  return events
    .filter((event) => event.date === date)
    .sort((left, right) => `${left.startTime}-${left.endTime}`.localeCompare(`${right.startTime}-${right.endTime}`));
}

/**
 * 앱 첫 실행 시 사용할 시드 데이터가 포함된 초기 `PlannerState`를 생성한다.
 * 저장된 상태가 없을 때 폴백으로 사용된다.
 */
export function createInitialState(): PlannerState {
  const today = todayIso();
  const tomorrow = addDays(today, 1);
  const nextWeek = addDays(today, 7);
  const createdAt = nowLocalDateTime();

  const tasks: Task[] = [
    {
      id: "task_seed_1",
      title: "월간 회고 정리",
      dueDate: today,
      priority: "high",
      done: false,
      note: "",
      reminderAt: `${today}T16:00`,
      createdAt,
      updatedAt: createdAt
    },
    {
      id: "task_seed_2",
      title: "다음 주 준비 항목 점검",
      dueDate: tomorrow,
      priority: "medium",
      done: false,
      note: "",
      reminderAt: `${tomorrow}T09:30`,
      createdAt,
      updatedAt: createdAt
    }
  ];

  const events: ScheduleEvent[] = [
    {
      id: "event_seed_1",
      title: "제품 회의",
      date: today,
      startTime: "10:00",
      endTime: "10:50",
      category: "work",
      note: "",
      reminderAt: `${today}T09:50`,
      createdAt,
      updatedAt: createdAt
    },
    {
      id: "event_seed_2",
      title: "스터디",
      date: nextWeek,
      startTime: "20:00",
      endTime: "21:00",
      category: "study",
      note: "",
      reminderAt: `${nextWeek}T19:30`,
      createdAt,
      updatedAt: createdAt
    }
  ];

  return {
    tasks,
    events,
    notifications: [...tasks.map(createTaskNotification), ...events.map(createEventNotification)].filter(
      (notification): notification is PlannerNotification => notification !== null
    ),
    selectedDate: today,
    visibleMonth: today
  };
}

/**
 * `TaskDraft`로부터 새 `Task` 객체를 생성한다. id·타임스탬프를 자동 부여한다.
 * @param draft 사용자가 입력한 태스크 초안
 */
export function createTaskFromDraft(draft: TaskDraft): Task {
  const timestamp = nowLocalDateTime();
  return {
    id: createId("task"),
    title: draft.title.trim(),
    dueDate: draft.dueDate,
    priority: draft.priority,
    done: false,
    note: draft.note.trim(),
    reminderAt: draft.reminderAt,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

/**
 * `EventDraft`로부터 새 `ScheduleEvent` 객체를 생성한다. id·타임스탬프를 자동 부여한다.
 * @param draft 사용자가 입력한 일정 초안
 */
export function createEventFromDraft(draft: EventDraft): ScheduleEvent {
  const timestamp = nowLocalDateTime();
  return {
    id: createId("event"),
    title: draft.title.trim(),
    date: draft.date,
    startTime: draft.startTime,
    endTime: draft.endTime,
    category: draft.category,
    note: draft.note.trim(),
    reminderAt: draft.reminderAt,
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

/**
 * 기존 `Task`에 `TaskDraft`의 변경 내용을 적용한 새 객체를 반환한다. `updatedAt`을 갱신한다.
 * @param task 수정 대상 기존 태스크
 * @param draft 사용자가 입력한 수정 내용
 */
export function updateTaskFromDraft(task: Task, draft: TaskDraft): Task {
  return {
    ...task,
    title: draft.title.trim(),
    dueDate: draft.dueDate,
    priority: draft.priority,
    note: draft.note.trim(),
    reminderAt: draft.reminderAt,
    updatedAt: nowLocalDateTime()
  };
}

/**
 * 기존 `ScheduleEvent`에 `EventDraft`의 변경 내용을 적용한 새 객체를 반환한다. `updatedAt`을 갱신한다.
 * @param event 수정 대상 기존 일정
 * @param draft 사용자가 입력한 수정 내용
 */
export function updateEventFromDraft(event: ScheduleEvent, draft: EventDraft): ScheduleEvent {
  return {
    ...event,
    title: draft.title.trim(),
    date: draft.date,
    startTime: draft.startTime,
    endTime: draft.endTime,
    category: draft.category,
    note: draft.note.trim(),
    reminderAt: draft.reminderAt,
    updatedAt: nowLocalDateTime()
  };
}

/**
 * `ScheduleEvent`를 `EventDraft`로 변환한다. 편집 모달을 열 때 초기값으로 사용된다.
 * @param event 변환할 일정
 */
export function eventToDraft(event: ScheduleEvent): EventDraft {
  return {
    title: event.title,
    date: event.date,
    startTime: event.startTime,
    endTime: event.endTime,
    category: event.category,
    note: event.note ?? "",
    reminderAt: event.reminderAt
  };
}

/**
 * 태스크의 `reminderAt`으로부터 알림 객체를 생성한다.
 * `reminderAt`이 null이면 `null`을 반환한다.
 * @param task 알림을 생성할 태스크
 * @returns 생성된 알림 또는 `null`
 */
export function createTaskNotification(task: Task): PlannerNotification | null {
  if (!task.reminderAt) {
    return null;
  }

  return {
    id: createId("notice"),
    sourceId: task.id,
    sourceType: "task",
    title: task.title,
    body: `${task.dueDate}까지 완료`,
    notifyAt: task.reminderAt,
    status: compareDateTime(task.reminderAt, nowLocalDateTime()) <= 0 ? "ready" : "scheduled",
    createdAt: nowLocalDateTime()
  };
}

/**
 * 일정의 `reminderAt`으로부터 알림 객체를 생성한다.
 * `reminderAt`이 null이면 `null`을 반환한다.
 * @param event 알림을 생성할 일정
 * @returns 생성된 알림 또는 `null`
 */
export function createEventNotification(event: ScheduleEvent): PlannerNotification | null {
  if (!event.reminderAt) {
    return null;
  }

  return {
    id: createId("notice"),
    sourceId: event.id,
    sourceType: "event",
    title: event.title,
    body: `${event.date} ${event.startTime}-${event.endTime}`,
    notifyAt: event.reminderAt,
    status: compareDateTime(event.reminderAt, nowLocalDateTime()) <= 0 ? "ready" : "scheduled",
    createdAt: nowLocalDateTime()
  };
}

/**
 * `scheduled` 상태인 알림 중 `notifyAt`이 현재 시각 이전인 것을 `ready`로 전환한다.
 * 이미 `ready` 또는 `read`인 알림은 변경하지 않는다.
 * @param notifications 갱신할 알림 목록
 * @returns 상태가 업데이트된 새 알림 배열
 */
export function refreshNotificationStatuses(notifications: PlannerNotification[]): PlannerNotification[] {
  const now = nowLocalDateTime();
  return notifications.map((notification) => {
    if (notification.status !== "scheduled") {
      return notification;
    }
    return compareDateTime(notification.notifyAt, now) <= 0 ? { ...notification, status: "ready" } : notification;
  });
}

/**
 * 알림을 지정한 분 만큼 미루고 상태를 `scheduled`로 되돌린다.
 * @param notification 스누즈할 알림
 * @param minutes 미룰 분 수
 * @returns 갱신된 새 알림 객체
 */
export function snoozeNotification(notification: PlannerNotification, minutes: number): PlannerNotification {
  return {
    ...notification,
    notifyAt: addMinutes(notification.notifyAt, minutes),
    status: "scheduled"
  };
}

/** `EventCategory` 값을 CSS 클래스 이름으로 매핑한다. */
export const EVENT_CATEGORY_CLASS: Record<EventCategory, string> = {
  work: "category-work",
  personal: "category-personal",
  study: "category-study",
  health: "category-health"
};

/** `Priority` 값을 CSS 클래스 이름으로 매핑한다. */
export const TASK_PRIORITY_CLASS: Record<Priority, string> = {
  high: "priority-high",
  medium: "priority-medium",
  low: "priority-low"
};

/**
 * 우선순위를 정렬 가중치 숫자로 변환한다. high=3, medium=2, low=1.
 * @param priority 우선순위
 */
function priorityWeight(priority: Priority): number {
  if (priority === "high") {
    return 3;
  }
  if (priority === "medium") {
    return 2;
  }
  return 1;
}
