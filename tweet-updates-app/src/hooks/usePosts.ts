import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useSession } from "./useAuth";
import { startOfDay, endOfDay } from 'date-fns';

interface CreatePostInput {
    title: string;
    body: string;
    tags: string[];
}


export interface Post {
    id: number;
    title: string;
    body: string;
    tags: {tag: Tag}[];
    created_at: string;

}
export interface Tag {
    id: number;
    name: string;
}
interface UpdatePostInput {
    id: number;
    title: string;
    body: string;
    tags: string[];
}

//-----get all posts ordered latest------

export function useGetAllPosts(limit=10) {
    
    return useQuery({
        queryKey: ['posts-latest'],
        queryFn: async () => {
            const { data: allPosts, error: allPostsError } = await supabase
            .from('updates')
            .select(`*,
                    updatetags(
                    tag:tags(id, name)
                    )
                `)
            .order('created_at', {ascending: false})
            .limit(limit)
            
            
            if(allPostsError) throw  allPostsError
            return allPosts
        }

        
    })
}











//-------------get individual user's posts by user_id-----------------

export function useGetUserPosts() {
    const { data: session } = useSession();
    
    return useQuery({
        queryKey: ['user-posts', session?.user?.id],
        enabled: !!session?.user?.id,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('updates')
                .select(`
                    id,
                    title,
                    body,
                    created_at,
                    updatetags(
                        tag: tags(
                            id,
                            name
                        )
                    )
                `)
                .eq('user_id', session?.user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        }
    });
}

export function useUpdatePost() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, title, body, tags }: UpdatePostInput) => {
            // Log existing tags before deletion
            const { data: beforeTags } = await supabase
                .from('updatetags')
                .select('*')
                .eq('update_id', id);
            console.log('Tags before deletion:', beforeTags);

            // Delete existing tag associations
            const { data: deleteData, error: deleteError } = await supabase
                .from('updatetags')
                .delete()
                .eq('update_id', id)
                .select();  // Add .select() to see what was deleted

            console.log('Deleted tags:', deleteData);
            if (deleteError) {
                console.error('Delete error:', deleteError);
                throw deleteError;
            }

            // Update post content
            const { error: postError } = await supabase
                .from('updates')
                .update({ title, body })
                .eq('id', id);

            if (postError) throw postError;

            // Process new tags
            for (const tagName of tags) {
                const { data: existingTag } = await supabase
                    .from('tags')
                    .select('id')
                    .eq('name', tagName)
                    .maybeSingle();

                let tagId: number;
                if (existingTag?.id) {
                    tagId = existingTag.id;
                } else {
                    const { data: newTag } = await supabase
                        .from('tags')
                        .insert({ name: tagName })
                        .select('id')
                        .single();
                    tagId = newTag.id;
                }

                await supabase
                    .from('updatetags')
                    .insert({
                        update_id: id,
                        tag_id: tagId
                    });
            }

            // Log final tags
            const { data: afterTags } = await supabase
                .from('updatetags')
                .select('*')
                .eq('update_id', id);
            console.log('Tags after update:', afterTags);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['user-posts']);
        }
    });
}
//-------------------------------------------------------- usecreatepost-------------------------------------- //
export function useCreatePost(){
    const {data: session} = useSession()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({title, body, tags}: CreatePostInput) => {
            if(!session?.user?.id) throw new Error('Must be logged in to create post')
            
            //first lets check a post with same title hasn't been created on same calendar day
            const today = new Date(); // would log 2024-11-18T15:30:45.123Z (current time)
            const { data: existingPosts, error: checkError } = await supabase
                .from('updates')
                .select('title, created_at')
                .eq('title', title)
                .gte('created_at',  startOfDay(today).toISOString()) // gte (greater than or equal to) == created_at >=  // startofDay(today) = // Example: 2024-11-18T00:00:00.000Z (midnight) //toISOstring = // "2024-03-18T00:00:00.000Z"
                .lte('created_at', endOfDay(today).toISOString()); //.lte('created_at', endOfDay)      → Less Than or Equal to 23:59:59.999 startofDay(today) =  2024-11-18T23:59:59.999Z (end of day), "2024-03-18T23:59:59.999Z"

            if (checkError) throw checkError;
            if (existingPosts && existingPosts.length > 0) {
                throw new Error('A post with this title already exists today');
            }


            //once confirmed that there is no post with same title hasn't been created on same calendar day, now lets create our post
            const { data: post, error: postError } = await supabase
            .from('updates')
            .insert([
                {
                    title,
                    body,
                    user_id: session.user.id
                }
            ])
            .select()
            .single()

            if(postError) throw postError

            //handle checking tags one at a time
            // Process tags
            const tagPromises = tags.map(async (tagName) => {
                const { data: existingTag, error: existingTagError } = await supabase
                    .from('tags')
                    .select('id')
                    .eq('name', tagName)
                    .maybeSingle();

                if (existingTagError) throw existingTagError;

                let tagId: number;
                if (existingTag?.id) {
                    tagId = existingTag.id;
                } else {
                    const { data: newTag, error: newTagError } = await supabase
                        .from('tags')
                        .insert({ name: tagName })
                        .select('id')
                        .single();

                    if (newTagError) throw newTagError;
                    tagId = newTag.id;
                }

                return supabase
                    .from('updatetags')
                    .insert({
                        update_id: post.id,
                        tag_id: tagId
                    })
                    .select();
            });

            await Promise.all(tagPromises);
            return post;

        },
        onSuccess: () => {
            // queryClient.invalidateQueries(['posts'])
        }
    })
}

// //get all posts for list-view
// export function usePosts() {
//     return useQuery({
//         queryKey: ['posts', id],
//         queryFn: async () => {
//             const { data, error } = await supabase
//             .from('updates')
//             .select(
//                 `
//                 `
//             )
//         }
//     })
// }