import { useState, useEffect } from 'react';
import { leaderboardApi } from '../services/api';
import { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  onClose: () => void;
}

export default function Leaderboard({ onClose }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [sortBy, setSortBy] = useState<'best' | 'average'>('best');
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState<number>(-1);

  useEffect(() => {
    loadLeaderboard();
  }, [sortBy]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const [leaderboardData, rankData] = await Promise.all([
        sortBy === 'best'
          ? leaderboardApi.getBestScores(20)
          : leaderboardApi.getAverageScores(20),
        leaderboardApi.getMyRank(sortBy).catch(() => ({ rank: -1, sortBy }))
      ]);

      setLeaderboard(leaderboardData.leaderboard);
      setMyRank(rankData.rank);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-50 border-yellow-300';
    if (rank === 2) return 'bg-gray-50 border-gray-300';
    if (rank === 3) return 'bg-orange-50 border-orange-300';
    return 'bg-white border-gray-200';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">🏆 Leaderboard</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      {/* Sort Toggle */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setSortBy('best')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            sortBy === 'best'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Best Score
        </button>
        <button
          onClick={() => setSortBy('average')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            sortBy === 'average'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Average Score
        </button>
      </div>

      {/* My Rank */}
      {myRank > 0 && (
        <div className="mb-6 p-4 bg-primary-50 border-2 border-primary-300 rounded-lg">
          <p className="text-primary-800 font-semibold">
            Your Rank: <span className="text-2xl">{getRankIcon(myRank)}</span>
          </p>
        </div>
      )}

      {/* Leaderboard List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading leaderboard...</p>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          <p>No scores yet. Be the first to complete a quiz!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry) => (
            <div
              key={entry.userId}
              className={`p-4 rounded-lg border-2 ${getRankColor(entry.rank)} transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold w-12 text-center">
                    {getRankIcon(entry.rank)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {entry.username}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {entry.totalQuizzes} quiz{entry.totalQuizzes !== 1 ? 'zes' : ''} completed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">
                    {sortBy === 'best' ? entry.bestScore : entry.averageScore.toFixed(1)}%
                  </div>
                  <p className="text-xs text-gray-500">
                    {sortBy === 'best' ? 'Best' : 'Avg'} Score
                  </p>
                </div>
              </div>
              {entry.recentScores.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Recent scores:</p>
                  <div className="flex gap-2">
                    {entry.recentScores.map((score, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 rounded text-xs font-medium"
                      >
                        {score.toFixed(0)}%
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

