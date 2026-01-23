import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface TicketStats {
    total: number;
    processed: number;
    pending: number;
    sentiment: {
        positive: number;
        negative: number;
        neutral: number;
    };
    categories: {
        technical: number;
        billing: number;
        commercial: number;
        support: number;
    };
}

export default function TicketStatsComponent() {
    const [stats, setStats] = useState<TicketStats>({
        total: 0,
        processed: 0,
        pending: 0,
        sentiment: { positive: 0, negative: 0, neutral: 0 },
        categories: { technical: 0, billing: 0, commercial: 0, support: 0 }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();

        // Subscribe to realtime changes
        const channel = supabase
            .channel('stats-updates')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'tickets' },
                () => fetchStats()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchStats = async () => {
        try {
            const { data: tickets, error } = await supabase
                .from('tickets')
                .select('*');

            if (error) throw error;

            const stats: TicketStats = {
                total: tickets?.length || 0,
                processed: tickets?.filter(t => t.processed).length || 0,
                pending: tickets?.filter(t => !t.processed).length || 0,
                sentiment: {
                    positive: tickets?.filter(t => t.sentiment?.toLowerCase() === 'positivo').length || 0,
                    negative: tickets?.filter(t => t.sentiment?.toLowerCase() === 'negativo').length || 0,
                    neutral: tickets?.filter(t => t.sentiment?.toLowerCase() === 'neutral').length || 0,
                },
                categories: {
                    technical: tickets?.filter(t => t.category?.toLowerCase() === 'técnico').length || 0,
                    billing: tickets?.filter(t => t.category?.toLowerCase() === 'facturación').length || 0,
                    commercial: tickets?.filter(t => t.category?.toLowerCase() === 'comercial').length || 0,
                    support: tickets?.filter(t => t.category?.toLowerCase() === 'soporte').length || 0,
                }
            };

            setStats(stats);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 rounded-xl bg-slate-800/50 border border-slate-700 animate-pulse"></div>
                ))}
            </div>
        );
    }

    const StatCard = ({ title, value, icon, color = 'blue' }: { title: string; value: number; icon: string; color?: string }) => (
        <div className={`bg-gradient-to-r from-slate-800/50 to-slate-700/30 border border-slate-600 rounded-xl p-6 backdrop-blur-sm hover:border-${color}-500/30 transition-all`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    <p className={`text-3xl font-bold text-${color}-400 mt-1`}>{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-${color}-500/20 flex items-center justify-center text-xl`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    const percentage = (value: number, total: number) => total > 0 ? ((value / total) * 100).toFixed(1) : '0';

    return (
        <div className="mb-8">
            {/* Main Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard title="Total Tickets" value={stats.total} icon="📊" color="blue" />
                <StatCard title="Procesados" value={stats.processed} icon="✅" color="emerald" />
                <StatCard title="Pendientes" value={stats.pending} icon="⏳" color="amber" />
                <StatCard title="Tasa de Procesamiento" value={parseInt(percentage(stats.processed, stats.total))} icon="🎯" color="purple" />
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sentiment Analysis */}
                <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 border border-slate-600 rounded-xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                        😊 Análisis de Sentimiento
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                Positivo
                            </span>
                            <span className="text-emerald-400 font-medium">
                                {stats.sentiment.positive} ({percentage(stats.sentiment.positive, stats.processed)}%)
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                Neutral
                            </span>
                            <span className="text-blue-400 font-medium">
                                {stats.sentiment.neutral} ({percentage(stats.sentiment.neutral, stats.processed)}%)
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                Negativo
                            </span>
                            <span className="text-red-400 font-medium">
                                {stats.sentiment.negative} ({percentage(stats.sentiment.negative, stats.processed)}%)
                            </span>
                        </div>
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 border border-slate-600 rounded-xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                        📂 Distribución por Categoría
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400 flex items-center gap-2">
                                🔧 Técnico
                            </span>
                            <span className="text-slate-300 font-medium">
                                {stats.categories.technical} ({percentage(stats.categories.technical, stats.processed)}%)
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400 flex items-center gap-2">
                                💳 Facturación
                            </span>
                            <span className="text-slate-300 font-medium">
                                {stats.categories.billing} ({percentage(stats.categories.billing, stats.processed)}%)
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400 flex items-center gap-2">
                                💼 Comercial
                            </span>
                            <span className="text-slate-300 font-medium">
                                {stats.categories.commercial} ({percentage(stats.categories.commercial, stats.processed)}%)
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400 flex items-center gap-2">
                                📚 Soporte
                            </span>
                            <span className="text-slate-300 font-medium">
                                {stats.categories.support} ({percentage(stats.categories.support, stats.processed)}%)
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}