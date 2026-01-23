import { useState } from 'react';
import { apiService } from '../../lib/api';
import toast from 'react-hot-toast';

export default function TicketCreator() {
    const [creating, setCreating] = useState(false);
    const [ticketDescription, setTicketDescription] = useState('');
    const [showExamples, setShowExamples] = useState(false);

    const exampleTickets = [
        "Mi factura está incorrecta, me cobraron servicios que no contraté",
        "No puedo acceder a mi cuenta, el sistema me dice que mis credenciales son incorrectas",
        "Excelente servicio, todo funciona perfectamente y el soporte es muy rápido",
        "La aplicación se cierra constantemente en mi móvil Android",
        "Quiero información sobre los nuevos planes comerciales disponibles"
    ];

    const processTicket = async () => {
        if (!ticketDescription.trim()) {
            toast.error('Por favor ingresa una descripción del ticket');
            return;
        }

        setCreating(true);
        try {
            // Generar UUID para el ticket
            const ticketId = crypto.randomUUID();
            
            const result = await apiService.processTicket({
                ticket_id: ticketId,
                description: ticketDescription.trim()
            });
            
            toast.success(
                `¡Ticket procesado exitosamente!\n📋 ${result.category}\n😊 Sentimiento: ${result.sentiment}\n🎯 Confianza: ${(result.confidence * 100).toFixed(1)}%`
            );
            
            setTicketDescription('');
        } catch (error: any) {
            console.error('Error processing ticket:', error);
            toast.error('Error al procesar el ticket. Inténtalo nuevamente.');
        } finally {
            setCreating(false);
        }
    };

    const useExample = (example: string) => {
        setTicketDescription(example);
        setShowExamples(false);
    };

    return (
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/30 border border-slate-600 rounded-xl p-6 mb-8 backdrop-blur-sm">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-emerald-400 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    Crear Nuevo Ticket de Soporte
                </h3>
                <p className="text-slate-300">
                    Describe tu problema o consulta y nuestro sistema de IA lo categorizará y analizará automáticamente
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="ticket-description" className="block text-sm font-medium text-slate-200 mb-2">
                        Descripción del Ticket
                    </label>
                    <textarea
                        id="ticket-description"
                        value={ticketDescription}
                        onChange={(e) => setTicketDescription(e.target.value)}
                        placeholder="Describe tu problema, consulta o comentario en detalle..."
                        className="w-full h-32 px-4 py-3 bg-slate-900/70 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                        disabled={creating}
                    />
                    <div className="flex justify-between items-center mt-2">
                        <div className="text-xs text-slate-400">
                            {ticketDescription.length}/500 caracteres
                        </div>
                        <button
                            onClick={() => setShowExamples(!showExamples)}
                            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            {showExamples ? 'Ocultar ejemplos' : 'Ver ejemplos'}
                        </button>
                    </div>
                </div>

                {showExamples && (
                    <div className="bg-slate-900/40 rounded-lg p-4 border border-slate-600">
                        <p className="text-sm font-medium text-slate-300 mb-3">Ejemplos de tickets:</p>
                        <div className="space-y-2">
                            {exampleTickets.map((example, index) => (
                                <button
                                    key={index}
                                    onClick={() => useExample(example)}
                                    className="w-full text-left p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-sm text-slate-300 border border-slate-700 hover:border-slate-600 transition-all"
                                >
                                    "{example}"
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={processTicket}
                        disabled={creating || !ticketDescription.trim()}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {creating ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Procesando con IA...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Procesar con IA
                            </>
                        )}
                    </button>
                    
                    <button
                        onClick={() => setTicketDescription('')}
                        disabled={creating || !ticketDescription.trim()}
                        className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium rounded-lg transition-colors border border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Limpiar
                    </button>
                </div>
            </div>

            <div className="mt-6 p-4 bg-slate-900/30 rounded-lg border border-slate-700">
                <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm text-slate-300 font-medium mb-1">¿Cómo funciona nuestro AI Co-Pilot?</p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Nuestro sistema de IA analiza automáticamente tu ticket para categorizarlo (Técnico, Comercial, Facturación, Soporte) 
                            y determinar el sentimiento (Positivo, Neutral, Negativo). Los tickets negativos activan notificaciones automáticas 
                            para respuesta prioritaria.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}