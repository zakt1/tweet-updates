import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

// hooks/useTags.ts
export function useGetTags() {
    return useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('tags')
                .select('*')
                .order('name');
                
            if (error) throw error;
            return data;
        }
    });
}

// hooks/usePostsByTag.ts
export function useGetPostsByTag(tagId: number) {
    return useQuery({
        queryKey: ['posts-by-tag', tagId],
        enabled: !!tagId,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('updates')
                .select(`
                    *,
                    updatetags!inner(tag_id)
                `)
                .eq('updatetags.tag_id', tagId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        }
    });
}