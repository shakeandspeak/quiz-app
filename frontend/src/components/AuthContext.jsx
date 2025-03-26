import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserRole = async (userId) => {
            try {
                // First try to get the existing profile
                const { data: existingProfile, error: fetchError } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', userId)
                    .single();

                // If profile exists, return its role
                if (existingProfile) {
                    return existingProfile.role;
                }

                // Only if no profile exists, create a new one
                if (fetchError && fetchError.code === 'PGRST116') { // Record not found error
                    console.log('Profile not found, creating new profile...');
                    
                    // Get the user's email and metadata
                    const { data: userData } = await supabase.auth.getUser();
                    const userEmail = userData?.user?.email;
                    const userRole = userData?.user?.user_metadata?.role || 'student'; // Use role from metadata if available
                    
                    // Insert the profile
                    const { data: newProfile, error: insertError } = await supabase
                        .from('profiles')
                        .insert({
                            id: userId,
                            email: userEmail,
                            role: userRole
                        })
                        .select('role')
                        .single();
                    
                    if (insertError) {
                        console.error('Error creating profile:', insertError);
                        return userRole;
                    }
                    
                    return newProfile?.role || userRole;
                }

                // If there was a different error, log it and return default role
                if (fetchError) {
                    console.error('Error fetching profile:', fetchError);
                    return 'student';
                }

                return 'student'; // Default fallback
            } catch (error) {
                console.error('Unexpected error in fetchUserRole:', error);
                return 'student';
            }
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