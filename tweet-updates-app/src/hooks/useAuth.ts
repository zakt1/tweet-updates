import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";



interface LoginCredentials {
    email: string;
    password: string;
}

interface RegistrationDetails extends LoginCredentials {
    birthday?: string;
}

export function useSession() {
    return useQuery({
        queryKey: ['session'],
        queryFn: async () => {
            const {data: { session }, error} = await supabase.auth.getSession();
            if(error) throw error
            return session;
        }
    })
}

export function useLogin() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    return useMutation({
        mutationFn: async ({email, password}: LoginCredentials) => {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['session']})
            navigate('/')
        }
    })
}