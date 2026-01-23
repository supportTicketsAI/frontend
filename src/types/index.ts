import { apiBaseUrl } from '../lib/env.config';

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

export interface ProcessTicketRequest {
    ticket_id: string;  // Requerido: UUID del ticket
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

export const API_CONFIG = {
    BASE_URL: apiBaseUrl,
    ENDPOINTS: {
        PROCESS_TICKET: '/process-ticket',
        GET_TICKETS: '/tickets',
        HEALTH: '/health',
        WEBSOCKET: '/ws'
    }
};
