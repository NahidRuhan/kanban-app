'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { apiClient } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, Plus, Loader2, Trash2, LayoutGrid } from 'lucide-react';
import { toast } from 'sonner';

const BOARD_COLORS = [
  { bg: 'bg-blue-100', icon: 'text-blue-500' },
  { bg: 'bg-emerald-100', icon: 'text-emerald-500' },
  { bg: 'bg-amber-100', icon: 'text-amber-500' },
  { bg: 'bg-rose-100', icon: 'text-rose-500' },
  { bg: 'bg-violet-100', icon: 'text-violet-500' },
  { bg: 'bg-cyan-100', icon: 'text-cyan-500' },
  { bg: 'bg-orange-100', icon: 'text-orange-500' },
  { bg: 'bg-teal-100', icon: 'text-teal-500' },
];

function getBoardColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return BOARD_COLORS[Math.abs(hash) % BOARD_COLORS.length];
}

interface Board {
  id: string;
  title: string;
  ownerId: string;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchBoards = async () => {
      try {
        const data = await apiClient('/api/boards');
        setBoards(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBoards();
  }, [user]);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;
    
    setCreating(true);
    try {
      const data = await apiClient('/api/boards', {
        method: 'POST',
        body: JSON.stringify({ title: newBoardTitle }),
      });
      setBoards([...boards, data]);
      setNewBoardTitle('');
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteOrLeaveBoard = (e: React.MouseEvent, boardId: string, isOwner: boolean) => {
    e.preventDefault();
    
    if (isOwner) {
      toast('Delete this board?', {
        description: 'This action cannot be undone.',
        action: {
          label: 'Delete',
          onClick: async () => {
            try {
              await apiClient(`/api/boards/${boardId}`, {
                method: 'DELETE',
              });
              setBoards(prev => prev.filter(b => b.id !== boardId));
              toast.success('Board deleted');
            } catch (err: any) {
              toast.error(err.message || 'Failed to delete board');
            }
          }
        },
        cancel: { label: 'Cancel', onClick: () => {} }
      });
    } else {
      toast('Leave this board?', {
        description: 'You will no longer have access to this board.',
        action: {
          label: 'Leave',
          onClick: async () => {
            try {
              await apiClient(`/api/boards/${boardId}/members/${user?.id}`, {
                method: 'DELETE',
              });
              setBoards(prev => prev.filter(b => b.id !== boardId));
              toast.success('You have left the board');
            } catch (err: any) {
              toast.error(err.message || 'Failed to leave board');
            }
          }
        },
        cancel: { label: 'Cancel', onClick: () => {} }
      });
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#F8F9FC]">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#F8F9FC] flex flex-col font-sans">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image src="/logo.svg" alt="Logo" width={32} height={32} className="w-8 h-8" />
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">Kanban</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-500">{user.email}</span>
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
              title="Logout"
            >
              <LogOut className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <section className="mb-8">
          <label className="block text-sm font-medium text-slate-600 mb-2">Create a new board</label>
          <form onSubmit={handleCreateBoard} className="flex">
            <input
              type="text"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              placeholder="Board title..."
              className="flex-1 max-w-sm block w-full rounded-l-lg border-y border-l border-slate-200/60 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
              required
            />
            <button
              type="submit"
              disabled={creating}
              className="inline-flex justify-center items-center rounded-r-lg border border-transparent bg-blue-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-600 active:scale-[0.97] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {creating ? <Loader2 className="animate-spin h-5 w-5" strokeWidth={1.5} /> : <Plus className="h-5 w-5" strokeWidth={1.5} />}
            </button>
          </form>
        </section>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-100 rounded-xl h-32 animate-pulse" />
            ))}
          </div>
        ) : boards.length === 0 ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-12 mt-4">
            <LayoutGrid className="h-12 w-12 text-slate-300 mb-4" strokeWidth={1.5} />
            <h3 className="text-lg font-medium text-slate-400">No boards yet</h3>
            <p className="text-sm text-slate-400 mt-1">Create your first board to get started</p>
          </div>
        ) : (
          <div className="space-y-8">
            {boards.filter(b => b.ownerId === user.id).length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-slate-800 mb-4">My Boards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {boards.filter(b => b.ownerId === user.id).map((board) => {
                    const color = getBoardColor(board.id);
                    return (
                      <Link
                        key={board.id}
                        href={`/board/${board.id}`}
                        className="block bg-white rounded-xl p-5 border border-slate-200/60 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group relative"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color.bg}`}>
                            <LayoutGrid className={`h-4 w-4 ${color.icon}`} strokeWidth={1.5} />
                          </div>
                          <button
                            onClick={(e) => handleDeleteOrLeaveBoard(e, board.id, true)}
                            className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none"
                            title="Delete Board"
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-slate-900 truncate mb-2">{board.title}</h3>
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-600">
                            Owner
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {boards.filter(b => b.ownerId !== user.id).length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Shared Boards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {boards.filter(b => b.ownerId !== user.id).map((board) => {
                    const color = getBoardColor(board.id);
                    return (
                      <Link
                        key={board.id}
                        href={`/board/${board.id}`}
                        className="block bg-white rounded-xl p-5 border border-slate-200/60 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_1px_2px_rgba(15,23,42,0.04)] hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group relative"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color.bg}`}>
                            <LayoutGrid className={`h-4 w-4 ${color.icon}`} strokeWidth={1.5} />
                          </div>
                          <button
                            onClick={(e) => handleDeleteOrLeaveBoard(e, board.id, false)}
                            className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none"
                            title="Leave Board"
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-slate-900 truncate mb-2">{board.title}</h3>
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-500">
                            Shared
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
