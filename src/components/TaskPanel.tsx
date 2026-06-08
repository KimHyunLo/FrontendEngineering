"use client";

import { useMemo, useState } from "react";
import { formatDate, getTasksForDate, makeDefaultTaskDraft, PRIORITY_LABEL, taskToDraft } from "@/src/planner";
import type { IsoDate, Task, TaskDraft } from "@/src/planner";
import { TaskEditorModal } from "@/src/components/TaskEditorModal";
import type { TaskEditorState } from "@/src/components/TaskEditorModal";

type TaskFilter = "selected" | "open" | "done" | "all";

interface TaskPanelProps {
  selectedDate: IsoDate;
  tasks: Task[];
  onAddTask(draft: TaskDraft): void;
  onUpdateTask(id: string, draft: TaskDraft): void;
  onToggleTask(id: string): void;
  onDeleteTask(id: string): void;
}

export function TaskPanel({ selectedDate, tasks, onAddTask, onUpdateTask, onToggleTask, onDeleteTask }: TaskPanelProps) {
  const [modalState, setModalState] = useState<TaskEditorState | null>(null);
  const [filter, setFilter] = useState<TaskFilter>("selected");

  const visibleTasks = useMemo(() => {
    if (filter === "selected") {
      return getTasksForDate(tasks, selectedDate);
    }
    if (filter === "open") {
      return tasks.filter((task) => !task.done);
    }
    if (filter === "done") {
      return tasks.filter((task) => task.done);
    }
    return tasks;
  }, [filter, selectedDate, tasks]);

  function openCreateModal() {
    setModalState({ mode: "create", draft: makeDefaultTaskDraft(selectedDate) });
  }

  function openEditModal(task: Task) {
    setModalState({ mode: "edit", taskId: task.id, draft: taskToDraft(task) });
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>할 일</h2>
        <div className="panel-actions">
          <div className="segmented" aria-label="할 일 필터">
            {taskFilters.map((item) => (
              <button
                type="button"
                key={item.value}
                className={filter === item.value ? "active" : ""}
                onClick={() => setFilter(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button className="primary-button" type="button" onClick={openCreateModal}>
            추가
          </button>
        </div>
      </div>
      <div className="panel-body">
        <div className="list">
          {visibleTasks.length === 0 ? (
            <div className="empty-state">항목 없음</div>
          ) : (
            visibleTasks.map((task) => (
              <article className={`task-row priority-${task.priority} ${task.done ? "done" : ""}`} key={task.id}>
                <div className="item-line">
                  <div>
                    <div className="item-title">{task.title}</div>
                    <div className="item-meta">
                      <span className="tag">{formatDate(task.dueDate)}</span>
                      <span className="tag">{PRIORITY_LABEL[task.priority]}</span>
                      {task.reminderAt ? <span className="tag">{task.reminderAt.replace("T", " ")}</span> : null}
                    </div>
                    {task.note ? <div className="item-note">{task.note}</div> : null}
                  </div>
                  <div className="row-actions">
                    <button className="secondary-button" type="button" onClick={() => openEditModal(task)}>
                      수정
                    </button>
                    <button className="secondary-button" type="button" onClick={() => onToggleTask(task.id)}>
                      {task.done ? "열기" : "완료"}
                    </button>
                    <button className="danger-button" type="button" onClick={() => onDeleteTask(task.id)}>
                      삭제
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
      {modalState ? (
        <TaskEditorModal
          title={modalState.mode === "edit" ? "할 일 수정" : "할 일 추가"}
          initialDraft={modalState.draft}
          isEditing={modalState.mode === "edit"}
          onClose={() => setModalState(null)}
          onSubmit={(draft) => {
            if (modalState.mode === "edit") {
              onUpdateTask(modalState.taskId, draft);
            } else {
              onAddTask(draft);
            }
            setModalState(null);
          }}
        />
      ) : null}
    </section>
  );
}

const taskFilters: Array<{ value: TaskFilter; label: string }> = [
  { value: "selected", label: "선택일" },
  { value: "open", label: "진행" },
  { value: "done", label: "완료" },
  { value: "all", label: "전체" }
];
