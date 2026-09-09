import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2 } from 'lucide-react';
import { ShareBoardModal, BoardData, BoardMember } from './ShareBoardModal';
import { apiClient, ApiError } from '@/lib/api';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';

interface BoardHeaderProps {
  board: BoardData;
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
    } catch (err: unknown) {
      if (err instanceof Error || err instanceof ApiError) {
        toast.error(err.message || 'Failed to update board title');
      } else {
        toast.error('Failed to update board title');
      }
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
    ...(board.owner ? [{ ...board.owner, role: 'OWNER' }] : []),
    ...board.members.map((m: BoardMember) => ({ ...m.user, role: m.role }))
  ];

  return (
    <>
      <header className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-2xl border-b border-zinc-200/50 dark:border-zinc-800/50 z-10 relative">
        <div className="max-w-350 mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 flex items-center">
          <Link href="/" className="group mr-4 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300 ease-(--ease-spring) outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600">
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform duration-300 ease-(--ease-spring)" strokeWidth={1.5} />
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
                className="text-lg font-medium text-zinc-900 dark:text-zinc-100 tracking-tight bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-1 outline-none focus:ring-4 focus:ring-zinc-100 dark:focus:ring-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-500 transition-all duration-300 w-full max-w-sm"
              />
            ) : (
              <h1 
                onClick={() => setIsEditing(true)}
                className="text-lg font-medium text-zinc-900 dark:text-zinc-100 tracking-tight truncate cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 px-3 py-1 -ml-3 rounded-lg transition-colors duration-300 inline-block max-w-full"
                title="Click to edit board title"
              >
                {board.title}
              </h1>
            )}
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden sm:flex -space-x-2 overflow-hidden px-1">
              {allMembers.map((member: { id?: string; name: string; email: string; role: string }) => {
                const color = getAvatarColor(member.id || member.email || 'unknown');
                return (
                  <div
                    key={member.id || member.email}
                    className={`inline-flex h-9 w-9 rounded-[10px] ring-2 ring-white dark:ring-zinc-950 items-center justify-center text-[13px] font-bold ${color.bg} ${color.text} dark:brightness-75 shadow-sm`}
                    title={`${member.name} (${member.email})`}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                );
              })}
            </div>
            
            <ThemeToggle />
            
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-[14px] font-medium text-white hover:bg-zinc-800 active:scale-[0.96] transition-all duration-300 ease-(--ease-spring) shadow-sm focus:outline-none focus:ring-4 focus:ring-zinc-200 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus:ring-zinc-700"
            >
              <Share2 className="mr-2 h-4 w-4" strokeWidth={1.5} />
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
