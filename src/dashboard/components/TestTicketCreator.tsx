import { useState } from 'react';
import { apiService } from '../../lib/api';
import toast from 'react-hot-toast';

export default function TestTicketCreator() {
    const [creating, setCreating] = useState(false);

    const createTestTicket = async () => {
        setCreating(true);
        try {
            const result = await apiService.createTestTicket();
            toast.success(`¡Ticket de prueba creado y procesado! ${result.category} - ${result.sentiment}`);
        } catch (error: any) {
            console.error('Error creating test ticket:', error);
            toast.error('Error al crear ticket de prueba. Verifica que el backend esté corriendo.');
        } finally {
            setCreating(false);
        }
    };

    const checkBackendHealth = async () => {
        try {
            const health = await apiService.healthCheck();
            if (health.status === 'healthy') {
                toast.success('✅ Backend conectado y funcionando correctamente');
            } else {
                toast.error('❌ Backend no está funcionando correctamente');
            }
        } catch (error) {
            toast.error('❌ No se puede conectar con el backend');
        }
    };

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-slate-200 mb-1">Panel de Prueba</h3>
                    <p className="text-sm text-slate-400">
                        Crear tickets de prueba para demostrar la funcionalidad de IA
                    </p>
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={createTestTicket}
                    disabled={creating}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50"
                >
                    {creating ? (
                        <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Creando...
                        </>
                    ) : (
                        <>
                            <span>🧪 Crear Ticket de Prueba</span>
                        </>
                    )}
                </button>

                <button
                    onClick={checkBackendHealth}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium rounded-lg transition-colors border border-slate-600"
                >
                    <span>🔍 Verificar Backend</span>
                </button>
            </div>

            <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
                <p className="text-xs text-slate-400 leading-relaxed">
                    <strong>💡 Instrucciones:</strong> El backend debe estar corriendo en <code className="px-1 py-0.5 bg-slate-800 rounded text-slate-300">localhost:8000</code>. 
                    Los tickets creados aparecerán automáticamente en la lista y se procesarán con IA en tiempo real.
                </p>
            </div>
        </div>
    );
}