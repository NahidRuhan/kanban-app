'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { apiClient } from '@/lib/api';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { BoardCanvas } from '@/components/Board/BoardCanvas';
import { BoardHeader } from '@/components/Board/BoardHeader';

export default function BoardPage() {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [board, setBoard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBoard = async () => {
    if (!id) return;
    try {
      const data = await apiClient(`/api/boards/${id}`);
      setBoard(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load board');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !id) return;
    fetchBoard();
  }, [user, id]);

  if (loading) {
    return (
      <div className="flex flex-col h-dvh bg-[#F8F9FC] overflow-hidden">
        <div className="h-14 bg-white/80 rounded-none animate-pulse border-b border-slate-200/60" />
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
          <div className="flex gap-6 min-h-full">
            <div className="w-80 h-96 bg-slate-100 rounded-xl animate-pulse" />
            <div className="w-80 h-96 bg-slate-100 rounded-xl animate-pulse delay-75" />
            <div className="w-80 h-96 bg-slate-100 rounded-xl animate-pulse delay-150" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center space-y-4 bg-[#F8F9FC]">
        <div className="text-red-500 font-medium">{error || 'Board not found'}</div>
        <Link href="/" className="text-blue-500 hover:text-blue-600 transition-colors duration-150">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh bg-[#F8F9FC] overflow-hidden">
      <BoardHeader board={board} onUpdate={fetchBoard} />

      <main className="flex-1 overflow-hidden flex flex-col">
        <BoardCanvas boardId={board.id} initialData={{ columns: board.columns }} onBoardUpdate={fetchBoard} />
      </main>
    </div>
  );
}
