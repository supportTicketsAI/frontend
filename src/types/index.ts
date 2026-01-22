// Tipos que coinciden exactamente con el backend Python
export type TicketCategory = 'Técnico' | 'Facturación' | 'Comercial' | 'Soporte';
export type TicketSentiment = 'Positivo' | 'Neutral' | 'Negativo';

export interface Ticket {
    id: string;
    created_at: string;
    description: string;
    category: TicketCategory | null;
    sentiment: TicketSentiment | null;
    processed: boolean;
    confidence_score?: number;
    processing_time?: number;
}

// Request/Response types para la API
export interface ProcessTicketRequest {
    ticket_id?: string;
    description: string;
}

export interface ProcessTicketResponse {
    ticket_id: string;
    category: string;
    sentiment: string;
    confidence: number;
    processed: boolean;
    processing_time: string;
    notification_sent: boolean;
}

// API Configuration
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
    ENDPOINTS: {
        PROCESS_TICKET: '/process-ticket',
        GET_TICKETS: '/tickets',
        HEALTH: '/health',
        WEBSOCKET: '/ws'
    }
};
