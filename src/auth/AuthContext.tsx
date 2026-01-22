import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getInitialSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) {
                    console.error('❌ Error getting session:', error);
                    // Para demo, crear una sesión simulada
                    const mockUser = {
                        id: 'demo-user',
                        email: 'demo@vivetori.com',
                        user_metadata: { name: 'Demo User' },
                        app_metadata: {},
                        aud: 'authenticated',
                        created_at: new Date().toISOString()
                    } as unknown as User;
                    
                    setUser(mockUser);
                    setSession({ user: mockUser } as Session);
                } else {
                    setSession(session);
                    setUser(session?.user ?? null);
                }
            } catch (error) {
                console.error('🔌 Supabase connection error:', error);
                // Modo demo sin Supabase
                const mockUser = {
                    id: 'demo-user',
                    email: 'demo@vivetori.com',
                    user_metadata: { name: 'Demo User' },
                    app_metadata: {},
                    aud: 'authenticated',
                    created_at: new Date().toISOString()
                } as unknown as User;
                
                console.log('🎭 Usando modo demo para la presentación');
                setUser(mockUser);
                setSession({ user: mockUser } as Session);
            } finally {
                setLoading(false);
            }
        };

        getInitialSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const value = {
        session,
        user,
        loading,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
