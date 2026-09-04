import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Share2, Settings } from 'lucide-react';
import { ShareBoardModal } from './ShareBoardModal';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

interface BoardHeaderProps {
  board: any;
  onUpdate: () => void;
}

const AVATAR_COLORS = [
  { bg: 'bg-blue-100', text: 'text-blue-700' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { bg: 'bg-amber-100', text: 'text-amber-700' },
  { bg: 'bg-rose-100', text: 'text-rose-700' },
  { bg: 'bg-violet-100', text: 'text-violet-700' },
  { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  { bg: 'bg-orange-100', text: 'text-orange-700' },
  { bg: 'bg-teal-100', text: 'text-teal-700' },
];

function getAvatarColor(identifier: string): { bg: string; text: string } {
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function BoardHeader({ board, onUpdate }: BoardHeaderProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(board.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitle(board.title);
  }, [board.title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleUpdateTitle = async () => {
    if (!title.trim() || title === board.title) {
      setIsEditing(false);
      setTitle(board.title);
      return;
    }
    
    try {
      await apiClient(`/api/boards/${board.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: title.trim() }),
      });
      onUpdate();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update board title');
      setTitle(board.title);
    } finally {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUpdateTitle();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTitle(board.title);
    }
  };

  // Derive unique members including owner
  const allMembers = [
    { ...board.owner, role: 'OWNER' },
    ...board.members.map((m: any) => ({ ...m.user, role: m.role }))
  ];

  return (
    <>
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 z-10 relative">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 flex items-center">
          <Link href="/" className="mr-4 p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors duration-150">
            <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          
          <div className="flex-1 overflow-hidden mr-4">
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleUpdateTitle}
                onKeyDown={handleKeyDown}
                className="text-lg font-semibold text-slate-900 tracking-tight bg-white border border-blue-500 rounded px-2 py-0.5 outline-none focus:ring-2 focus:ring-blue-500/20 w-full max-w-sm"
              />
            ) : (
              <h1 
                onClick={() => setIsEditing(true)}
                className="text-lg font-semibold text-slate-900 tracking-tight truncate cursor-pointer hover:bg-slate-100 px-2 py-0.5 -ml-2 rounded transition-colors duration-150 inline-block max-w-full"
                title="Click to edit board title"
              >
                {board.title}
              </h1>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-2 overflow-hidden px-1">
              {allMembers.map((member: any) => {
                const color = getAvatarColor(member.id || member.email);
                return (
                  <div
                    key={member.id}
                    className={`inline-flex h-9 w-9 rounded-[10px] ring-2 ring-white items-center justify-center text-xs font-bold ${color.bg} ${color.text}`}
                    title={`${member.name} (${member.email})`}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                );
              })}
            </div>
            
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 active:scale-[0.97] transition-all duration-150"
            >
              <Share2 className="mr-2 h-4 w-4 text-slate-500" strokeWidth={1.5} />
              Share
            </button>
          </div>
        </div>
      </header>

      {isShareModalOpen && (
        <ShareBoardModal 
          board={board} 
          onClose={() => setIsShareModalOpen(false)} 
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}
