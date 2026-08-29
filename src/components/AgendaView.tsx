import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  CheckCircle2,
  Circle,
  Tag,
  Clock,
  Layers,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Filter,
  Trash2,
} from 'lucide-react';
import { AppState, AgendaTask } from '../types';
import { formatDateDisplay, cn } from '../lib/utils';
import { playBaselineChime } from '../services/sound';

interface AgendaViewProps {
  appState: AppState;
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Partial<AgendaTask>) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTaskDate: (taskId: string, targetDate: string) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  appState,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onMoveTaskDate,
}) => {
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [targetDateForAdd, setTargetDateForAdd] = useState<string>(appState.currentDate);

  // Form State
  const [title, setTitle] = useState('');
  const [outputUnit, setOutputUnit] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [roleGoalId, setRoleGoalId] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);

  // Generate 7 days of the current week starting from Monday
  const getDaysOfWeek = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday...
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + distanceToMonday);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      days.push({
        dateStr,
        dayName,
        dayNum,
        isToday: dateStr === appState.currentDate,
      });
    }
    return days;
  };

  const weekDays = getDaysOfWeek();

  const handleOpenAddForDate = (dateStr: string) => {
    setTargetDateForAdd(dateStr);
    setShowAddModal(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      outputUnit: outputUnit.trim() || '1 physical output unit delivered',
      date: targetDateForAdd,
      dayOfWeek: new Date(targetDateForAdd).getDay(),
      priority,
      roleGoalId: roleGoalId || undefined,
      estimatedMinutes,
      completed: false,
    });

    setTitle('');
    setOutputUnit('');
    setShowAddModal(false);
  };

  // Filter tasks
  const filteredTasks = appState.agendaTasks.filter((t) => {
    if (selectedRoleFilter !== 'all' && t.roleGoalId !== selectedRoleFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-[#111111] border border-[#262626] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 bg-[#161616] text-[#C5A059] border border-[#262626]">
              Output Deliverables Board
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#E0E0E0] mt-2 tracking-tight">
            Weekly Agenda & Finite Outputs
          </h1>
          <p className="text-xs text-[#808080] max-w-2xl mt-1 leading-relaxed italic font-serif">
            Strict separation from recurring routines. Every agenda task must specify an objective physical output unit.
          </p>
        </div>

        {/* Filter by Role Goal */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-[#161616] px-3 py-2 border border-[#262626] text-xs">
            <Filter className="w-3.5 h-3.5 text-[#808080]" />
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="bg-transparent text-[#E0E0E0] focus:outline-none text-xs"
            >
              <option value="all">All Monthly Roles</option>
              {appState.monthlyRoleGoals.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.roleName}
                </option>
              ))}
            </select>
          </div>

          <button
            id="agenda-add-task-btn"
            onClick={() => handleOpenAddForDate(appState.currentDate)}
            className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#D6B570] text-black text-xs uppercase tracking-widest font-semibold flex items-center gap-2 shadow-sm flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Agenda</span>
          </button>
        </div>
      </div>

      {/* 7-Day Columns Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {weekDays.map((day) => {
          const dayTasks = filteredTasks.filter((t) => t.date === day.dateStr);
          const completedCount = dayTasks.filter((t) => t.completed).length;

          return (
            <div
              key={day.dateStr}
              className={`border flex flex-col min-h-[380px] transition-all ${
                day.isToday
                  ? 'bg-[#161616] border-[#C5A059]/40 shadow-sm'
                  : 'bg-[#111111] border-[#262626]'
              }`}
            >
              {/* Day Column Header */}
              <div className={`p-3.5 border-b flex items-center justify-between ${
                day.isToday ? 'border-[#C5A059]/30 bg-[#1A1A1A]' : 'border-[#262626]'
              }`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-widest font-medium text-[#E0E0E0]">
                      {day.dayName}
                    </span>
                    <span className={`text-xs font-mono font-bold px-1.5 py-0.2 ${
                      day.isToday ? 'bg-[#C5A059] text-black' : 'text-[#808080]'
                    }`}>
                      {day.dayNum}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#808080] font-mono mt-0.5">
                    {completedCount}/{dayTasks.length} Done
                  </div>
                </div>

                <button
                  id={`add-task-day-${day.dateStr}`}
                  onClick={() => handleOpenAddForDate(day.dateStr)}
                  className="p-1 text-[#808080] hover:text-[#E0E0E0] hover:bg-[#161616] transition-colors"
                  title="Add output unit to this day"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Task Items in Day Column */}
              <div className="p-3 space-y-2 flex-1 overflow-y-auto">
                {dayTasks.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center p-4">
                    <span className="text-[11px] text-[#555] italic">No tasks scheduled</span>
                  </div>
                ) : (
                  dayTasks.map((task) => {
                    const linkedRole = appState.monthlyRoleGoals.find((r) => r.id === task.roleGoalId);

                    return (
                      <div
                        key={task.id}
                        className={`p-3 border transition-all space-y-2 ${
                          task.completed
                            ? 'bg-[#0A0A0A] border-[#222222] opacity-50'
                            : 'bg-[#161616] border-[#262626] hover:border-[#C5A059]'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <button
                            id={`toggle-task-${task.id}`}
                            onClick={() => {
                              onToggleTask(task.id);
                              if (!task.completed) playBaselineChime();
                            }}
                            className="mt-0.5 flex-shrink-0"
                          >
                            <div className="w-3.5 h-3.5 border border-[#C5A059] flex items-center justify-center">
                              {task.completed && <div className="w-2 h-2 bg-[#C5A059]"></div>}
                            </div>
                          </button>

                          <div className="flex-1 min-w-0">
                            <h4 className={`text-xs font-medium leading-tight ${task.completed ? 'line-through text-[#808080]' : 'text-[#E0E0E0]'}`}>
                              {task.title}
                            </h4>
                          </div>

                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="text-[#808080] hover:text-[#E06C75] p-0.5 transition-colors flex-shrink-0"
                            title="Delete task"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Output Unit & Role Badges */}
                        <div className="text-[10px] text-[#808080] pl-5 leading-tight">
                          Output: <span className="text-[#A3A3A3]">{task.outputUnit}</span>
                        </div>

                        <div className="flex items-center justify-between gap-1 pl-5 pt-1 text-[9px]">
                          {linkedRole && (
                            <span className="truncate max-w-[100px] text-[#C5A059] bg-[#0A0A0A] px-1.5 py-0.5 border border-[#262626] font-mono">
                              {linkedRole.roleName}
                            </span>
                          )}

                          {/* Quick Shift Button to Next Day */}
                          <div className="flex items-center gap-1 ml-auto">
                            <select
                              value={task.date}
                              onChange={(e) => onMoveTaskDate(task.id, e.target.value)}
                              className="bg-[#0A0A0A] border border-[#262626] text-[9px] text-[#808080] px-1 py-0.5 focus:outline-none"
                              title="Move task to another day"
                            >
                              {weekDays.map((wd) => (
                                <option key={wd.dateStr} value={wd.dateStr}>
                                  {wd.dayName} {wd.dayNum}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#262626] p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <h2 className="text-lg font-serif text-[#E0E0E0]">
                Schedule Finite Agenda Task
              </h2>
              <span className="text-xs font-mono text-[#C5A059]">{formatDateDisplay(targetDateForAdd)}</span>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">Task Title / Action</label>
                <input
                  type="text"
                  placeholder="e.g. Write migration script for legacy user profiles"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059]"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">
                  Verifiable Output Deliverable Unit <span className="text-[#C5A059]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1 script file committed & verified with tests"
                  value={outputUnit}
                  onChange={(e) => setOutputUnit(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none focus:border-[#C5A059]"
                  required
                />
                <p className="text-[10px] text-[#808080] mt-1">
                  Track concrete output and completion, not feelings or effort stories.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">Link to Monthly Role</label>
                  <select
                    value={roleGoalId}
                    onChange={(e) => setRoleGoalId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none"
                  >
                    <option value="">No linked role</option>
                    {appState.monthlyRoleGoals.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.roleName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#808080] block mb-1">Target Date</label>
                <input
                  type="date"
                  value={targetDateForAdd}
                  onChange={(e) => setTargetDateForAdd(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#262626] text-xs text-[#E0E0E0] focus:outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#262626] text-[#808080] hover:text-[#E0E0E0] text-xs uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C5A059] hover:bg-[#D6B570] text-black text-xs uppercase tracking-widest font-semibold"
                >
                  Save Agenda Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
