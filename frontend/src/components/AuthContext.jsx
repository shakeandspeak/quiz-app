import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async (userId) => {
            // First try to get the existing profile
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            // If no profile exists or there was an error, attempt to create one
            if (error || !data) {
                console.log('Profile not found, attempting to create one...');
                
                // Get the user's email
                const { data: userData } = await supabase.auth.getUser();
                const userEmail = userData?.user?.email;
                
                // Default to 'student' role if none is specified
                const defaultRole = 'student';
                
                // Insert the profile
                const { data: newProfile, error: insertError } = await supabase
                    .from('profiles')
                    .insert({
                        id: userId,
                        email: userEmail,
                        role: defaultRole
                    })
                    .select('role')
                    .single();
                
                if (insertError) {
                    console.error('Error creating profile:', insertError);
                    return defaultRole;
                }
                
                return newProfile?.role || defaultRole;
            }

            return data?.role;
        };

        const getSession = async () => {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                setUser(session.user);
                const userRole = await fetchUserRole(session.user.id);
                setRole(userRole);
            } else {
                setUser(null);
                setRole(null);
            }

            setLoading(false);
        };

        getSession();

        const { subscription } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setUser(session.user);
                fetchUserRole(session.user.id).then(setRole);
            } else {
                setUser(null);
                setRole(null);
            }
        });

        return () => {
            subscription?.unsubscribe?.();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);