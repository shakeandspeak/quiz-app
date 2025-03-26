import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [name, setName] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async (userId) => {
            try {
                // First try to get the existing profile
                const { data: existingProfile, error: fetchError } = await supabase
                    .from('profiles')
                    .select('role, name')
                    .eq('id', userId)
                    .single();

                // If profile exists, return its data
                if (existingProfile) {
                    return existingProfile;
                }

                // Only if no profile exists, create a new one
                if (fetchError && fetchError.code === 'PGRST116') { // Record not found error
                    console.log('Profile not found, creating new profile...');
                    
                    // Get the user's data
                    const { data: userData } = await supabase.auth.getUser();
                    const userEmail = userData?.user?.email;
                    const userRole = userData?.user?.user_metadata?.role || 'student';
                    const userName = userData?.user?.user_metadata?.name || '';
                    
                    // Insert the profile
                    const { data: newProfile, error: insertError } = await supabase
                        .from('profiles')
                        .insert({
                            id: userId,
                            email: userEmail,
                            role: userRole,
                            name: userName
                        })
                        .select('role, name')
                        .single();
                    
                    if (insertError) {
                        console.error('Error creating profile:', insertError);
                        return { role: userRole, name: userName };
                    }
                    
                    return newProfile || { role: userRole, name: userName };
                }

                // If there was a different error, log it and return defaults
                if (fetchError) {
                    console.error('Error fetching profile:', fetchError);
                    return { role: 'student', name: '' };
                }

                return { role: 'student', name: '' }; // Default fallback
            } catch (error) {
                console.error('Unexpected error in fetchUserProfile:', error);
                return { role: 'student', name: '' };
            }
        };

        const getSession = async () => {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                setUser(session.user);
                const profile = await fetchUserProfile(session.user.id);
                setRole(profile.role);
                setName(profile.name);
            } else {
                setUser(null);
                setRole(null);
                setName(null);
            }

            setLoading(false);
        };

        getSession();

        const { subscription } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setUser(session.user);
                fetchUserProfile(session.user.id).then(profile => {
                    setRole(profile.role);
                    setName(profile.name);
                });
            } else {
                setUser(null);
                setRole(null);
                setName(null);
            }
        });

        return () => {
            subscription?.unsubscribe?.();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, name, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);