'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit2, Trash2, GripVertical, Lock } from 'lucide-react';
import { TaskDetailModal } from './TaskDetailModal';

interface TaskProps {
  task: { id: string; title: string; description?: string };
  onDelete: (id: string) => void;
  onUpdate: () => void;
  isRemoteDragging?: boolean;
}

export function TaskItem({ task, onDelete, onUpdate, isRemoteDragging }: TaskProps) {
  const [modalMode, setModalMode] = useState<'view' | 'edit' | null>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    disabled: isRemoteDragging,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isRemoteDragging ? 0.4 : 1,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        id={`task-${task.id}`}
        style={style}
        className={`bg-white p-3 rounded-lg shadow-[0_1px_3px_rgba(15,23,42,0.06)] border group flex items-center transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] relative wrap-break-words ${
          isDragging ? 'border-blue-400 shadow-lg' : 'border-slate-200/60 hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)] hover:-translate-y-0.5'
        }`}
      >
        <div 
          {...attributes}
          {...listeners}
          className={`mr-2 ${isRemoteDragging ? 'cursor-not-allowed text-slate-300' : 'cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500'} transition-colors duration-150`}
        >
          <GripVertical className="h-4 w-4 stroke-[1.5]" />
        </div>
        
        <div className="flex-1 text-sm text-slate-700 cursor-pointer" onClick={() => !isRemoteDragging && setModalMode('view')}>
          {task.title}
        </div>
        
        {isRemoteDragging && (
          <div className="absolute right-2 top-2 text-blue-400">
            <Lock className="h-3.5 w-3.5 stroke-[1.5]" />
          </div>
        )}

        {!isRemoteDragging && (
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button 
              onClick={() => setModalMode('edit')}
              className="p-1 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors duration-150"
              title="Edit Task"
            >
              <Edit2 className="h-4 w-4 stroke-[1.5]" />
            </button>
            <button 
              onClick={() => onDelete(task.id)}
              className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors duration-150"
              title="Delete Task"
            >
              <Trash2 className="h-4 w-4 stroke-[1.5]" />
            </button>
          </div>
        )}
      </div>

      {modalMode && (
        <TaskDetailModal 
          task={task} 
          onClose={() => setModalMode(null)} 
          onUpdate={onUpdate}
          mode={modalMode}
        />
      )}
    </>
  );
}
