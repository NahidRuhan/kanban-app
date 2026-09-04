'use client';

import { useState } from 'react';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskItem } from './TaskItem';
import { Loader2, Plus, Trash2, Check, X, Edit2, GripHorizontal } from 'lucide-react';
import { apiClient, ApiError } from '@/lib/api';
import { toast } from 'sonner';
import { RemoteDragState } from './BoardCanvas';

interface ColumnProps {
  column: {
    id: string;
    title: string;
    tasks: { id: string; title: string; position: number }[];
  };
  onAddTask: (columnId: string, title: string) => Promise<void>;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: () => void;
  onUpdateColumn: () => void;
  remoteDrags: { [taskId: string]: RemoteDragState };
}

const COLUMN_ACCENTS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#14B8A6'];

function getColumnAccent(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLUMN_ACCENTS[Math.abs(hash) % COLUMN_ACCENTS.length];
}

export function ColumnView({ column, onAddTask, onDeleteTask, onUpdateTask, onUpdateColumn, remoteDrags }: ColumnProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const isRemotelyDragged = Object.values(remoteDrags).some(drag => drag.type === 'column' && drag.item.id === column.id);
  const visualDragState = isDragging || isRemotelyDragged;

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
    opacity: visualDragState ? 0.3 : 1,
  };

  const accentColor = getColumnAccent(column.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setCreating(true);
    await onAddTask(column.id, newTaskTitle);
    setNewTaskTitle('');
    setCreating(false);
  };

  const handleUpdateColumn = async () => {
    if (!editTitle.trim() || editTitle === column.title) {
      setIsEditing(false);
      return;
    }
    try {
      await apiClient(`/api/columns/${column.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: editTitle }),
      });
      setIsEditing(false);
      onUpdateColumn();
    } catch (e: unknown) {
      if (e instanceof Error || e instanceof ApiError) {
        toast.error(e.message || 'Failed to update column title');
      } else {
        toast.error('Failed to update column title');
      }
    }
  };

  const handleDeleteColumn = () => {
    toast('Delete this column?', {
      description: 'All tasks in this column will be deleted.',
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            await apiClient(`/api/columns/${column.id}`, { method: 'DELETE' });
            onUpdateColumn();
            toast.success('Column deleted');
          } catch (e: unknown) {
            if (e instanceof Error || e instanceof ApiError) {
              toast.error(e.message || 'Failed to delete column');
            } else {
              toast.error('Failed to delete column');
            }
          }
        }
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {}
      }
    });
  };

  return (
    <div 
      id={`column-${column.id}`}
      ref={setNodeRef}
      style={style}
      className={`w-full h-full flex flex-col rounded-xl max-h-full bg-[#F1F3F9] relative ${
        visualDragState ? 'shadow-none border-2 border-dashed border-slate-400' : 'shadow-[0_1px_3px_rgba(15,23,42,0.04)]'
      }`}
    >
      <div 
        className="h-1 rounded-t-xl absolute top-0 left-0 right-0 w-full"
        style={{ backgroundColor: accentColor, opacity: visualDragState ? 0.5 : 1 }}
      />
      
      <div className="p-3 pt-4 font-semibold text-slate-800 flex justify-between items-center group mt-1">
        <div 
          {...attributes} 
          {...listeners} 
          className="mr-2 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 rounded p-1 hover:bg-slate-200/50"
        >
          <GripHorizontal className="w-4 h-4" />
        </div>
        {isEditing ? (
          <div className="flex items-center space-x-1 flex-1 mr-2">
            <input 
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border rounded-lg border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUpdateColumn();
                if (e.key === 'Escape') {
                  setEditTitle(column.title);
                  setIsEditing(false);
                }
              }}
            />
            <button onClick={handleUpdateColumn} className="text-emerald-600 hover:text-emerald-700 p-1 rounded-md hover:bg-emerald-50 transition-colors duration-150"><Check className="h-4 w-4 stroke-[1.5]"/></button>
            <button onClick={() => { setEditTitle(column.title); setIsEditing(false); }} className="text-slate-500 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors duration-150"><X className="h-4 w-4 stroke-[1.5]"/></button>
          </div>
        ) : (
          <>
            <div className="flex-1 flex items-center space-x-2">
              <span className="truncate" title={column.title}>{column.title}</span>
              <span className="bg-slate-200/80 text-slate-500 rounded-full px-2 py-0.5 text-xs font-mono tabular-nums font-medium">
                {column.tasks.length}
              </span>
            </div>
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <button onClick={() => setIsEditing(true)} className="p-1 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors duration-150">
                <Edit2 className="h-4 w-4 stroke-[1.5]" />
              </button>
              <button onClick={handleDeleteColumn} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors duration-150">
                <Trash2 className="h-4 w-4 stroke-[1.5]" />
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2 min-h-30">
        <SortableContext items={column.tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {column.tasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onDelete={onDeleteTask} 
              onUpdate={onUpdateTask} 
              isRemoteDragging={!!remoteDrags[task.id]}
            />
          ))}
        </SortableContext>
      </div>

      <div className="p-3 border-t border-slate-200/50 mt-auto">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            placeholder="Add a task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-1 bg-white border border-slate-200 rounded-l-lg px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
          />
          <button
            type="submit"
            disabled={creating || !newTaskTitle.trim()}
            className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 active:scale-[0.97] transition-all duration-150 disabled:opacity-40"
          >
            {creating ? <Loader2 className="animate-spin h-5 w-5 stroke-[1.5]" /> : <Plus className="h-5 w-5 stroke-[1.5]" />}
          </button>
        </form>
      </div>
    </div>
  );
}
