import React, {useState, useEffect} from "react"
import { supabase } from '@/lib/supabase';


export default function MetricsView({ userId }) {
  const [metrics, setMetrics] = useState({
    totalMessages: 0,
    avgEmotionalScore: 0,
    sessionDuration: 0,
    supportiveResponses: 0,
    historicalAvgScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      if (!userId) return;
      setLoading(true);

      try {
        const { data: convos } = await supabase
          .from('conversations')
          .select('id, message, response, emotional_score, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });

        if (convos && convos.length > 0) {
          const totalMessages = convos.length * 2;
          const scores = convos.map((c) => c.emotional_score).filter((s) => s > 0);
          const avgScore =
            scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
          const supportive = scores.filter((s) => s > 0.6).length;
          const firstTime = new Date(convos[0].created_at);
          const lastTime = new Date(convos[convos.length - 1].created_at);
          const duration = Math.floor((lastTime - firstTime) / (1000 * 60));

          const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          const recentConvos = convos.filter(
            (c) => new Date(c.created_at) > oneWeekAgo
          );
          const recentScores = recentConvos
            .map((c) => c.emotional_score)
            .filter((s) => s > 0);
          const historicalAvg =
            recentScores.length > 0
              ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length
              : avgScore;

          setMetrics({
            totalMessages,
            avgEmotionalScore: avgScore,
            sessionDuration: duration,
            supportiveResponses: supportive,
            historicalAvgScore: historicalAvg,
          });
        }
      } catch (error) {
        console.error('Error loading metrics:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, [userId]);

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="text-gray-500 text-sm sm:text-base">Loading metrics...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Session Metrics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 text-sm sm:text-base">
            Total Messages
          </h3>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">
            {metrics.totalMessages}
          </p>
        </div>
        <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 text-sm sm:text-base">
            Avg Emotional Score
          </h3>
          <p className="text-xl sm:text-2xl font-bold text-green-600">
            {(metrics.avgEmotionalScore * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800 text-sm sm:text-base">
            Approx. Duration
          </h3>
          <p className="text-xl sm:text-2xl font-bold text-purple-600">
            {metrics.sessionDuration} min
          </p>
        </div>
        <div className="bg-orange-50 p-3 sm:p-4 rounded-lg">
          <h3 className="font-semibold text-orange-800 text-sm sm:text-base">
            Supportive Responses
          </h3>
          <p className="text-xl sm:text-2xl font-bold text-orange-600">
            {metrics.supportiveResponses}
          </p>
        </div>
      </div>
      <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg">
        <h3 className="font-semibold text-yellow-800 text-sm sm:text-base">
          Performance Tracking (Last 7 Days)
        </h3>
        <p className="text-lg sm:text-xl font-bold text-yellow-600">
          Recent Avg ERS: {(metrics.historicalAvgScore * 100).toFixed(1)}%
        </p>
        <p className="text-xs sm:text-sm text-yellow-700 mt-1">
          This score helps the bot personalize responses based on your progress over
          time.
        </p>
      </div>
    </div>
  );
}
