import { ProcessTicketRequest, ProcessTicketResponse, Ticket, API_CONFIG } from '../types';

class ApiService {
    private baseURL = API_CONFIG.BASE_URL;

    // Procesar ticket con el backend Python
    async processTicket(request: ProcessTicketRequest): Promise<ProcessTicketResponse> {
        try {
            const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.PROCESS_TICKET}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error processing ticket:', error);
            throw error;
        }
    }

    // Obtener todos los tickets desde el backend
    async getTickets(): Promise<Ticket[]> {
        try {
            const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.GET_TICKETS}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching tickets:', error);
            throw error;
        }
    }

    // Health check del backend
    async healthCheck(): Promise<any> {
        try {
            const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.HEALTH}`);
            return await response.json();
        } catch (error) {
            console.error('Error checking backend health:', error);
            return { status: 'error', message: 'Backend not available' };
        }
    }

    // Crear ticket de prueba
    async createTestTicket(): Promise<ProcessTicketResponse> {
        const testDescriptions = [
            "Mi aplicación se cuelga constantemente, esto es muy frustrante",
            "¿Podrían ayudarme con la configuración de mi cuenta? Gracias",
            "Excelente servicio, muchas gracias por la ayuda rápida",
            "Necesito cancelar mi suscripción, el cobro fue duplicado",
            "Error 500 en el login, no puedo acceder a mi dashboard",
            "¿Cuáles son los precios de los planes premium?",
            "Tutorial para configurar webhooks, por favor"
        ];

        const randomDescription = testDescriptions[Math.floor(Math.random() * testDescriptions.length)];
        
        return this.processTicket({
            ticket_id: crypto.randomUUID(),
            description: randomDescription
        });
    }
}

// Exportar instancia singleton
export const apiService = new ApiService();