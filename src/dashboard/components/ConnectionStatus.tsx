import { useState, useEffect } from 'react';
import { apiService } from '../../lib/api';

export default function ConnectionStatus() {
    const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
    const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

    useEffect(() => {
        checkConnections();
        
        // Verificar cada 30 segundos
        const interval = setInterval(checkConnections, 30000);
        return () => clearInterval(interval);
    }, []);

    const checkConnections = async () => {
        // Check Backend
        try {
            await apiService.healthCheck();
            setBackendStatus('connected');
        } catch (error) {
            setBackendStatus('disconnected');
        }

        // Check Supabase
        try {
            const { supabase } = await import('../../lib/supabase');
            await supabase.from('tickets').select('count').limit(1);
            setSupabaseStatus('connected');
        } catch (error) {
            setSupabaseStatus('disconnected');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'connected': return 'text-emerald-400';
            case 'disconnected': return 'text-red-400';
            default: return 'text-yellow-400';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'connected': return '✅';
            case 'disconnected': return '❌';
            default: return '🔄';
        }
    };

    return (
        <div className="flex items-center gap-4 text-xs">
            <div className={`flex items-center gap-1 ${getStatusColor(backendStatus)}`}>
                <span>{getStatusIcon(backendStatus)}</span>
                <span>Backend IA</span>
            </div>
            <div className={`flex items-center gap-1 ${getStatusColor(supabaseStatus)}`}>
                <span>{getStatusIcon(supabaseStatus)}</span>
                <span>Database</span>
            </div>
        </div>
    );
}