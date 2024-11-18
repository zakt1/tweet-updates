import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useSession } from "./useAuth";
import { timeStamp } from "console";

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

export function useCreatePost(){
    const {data: session} = useSession()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({title, body, tags}: CreatePostInput) => {
            if(!session?.user?.id) throw new Error('Must be logged in to create post')
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
            for (const tagName of tags) {
                try{
                    const { data: existingTag, error: existingTagError } = await supabase
                    .from('tags')
                    .select('*')
                    .eq('name', tagName)
                    .maybeSingle()

                    if(existingTagError) {
                        console.error('Error when trying to look for existing tag',existingTagError)
                        throw existingTagError
                    }
                    let tagId: number
                    if(existingTag?.id){
                        tagId = existingTag.id
                    }
                    else{
                        //no existing tag, lets create one

                        const { data: newTag, error: newTagError } = await supabase
                        .from('tags')
                        .insert({name: tagName })
                        .select('id') // will return the data as { id: 21312 }
                        .single() 
                        
                        if(newTagError){
                            console.error('Error creating newtag', newTagError)
                            throw newTagError
                        }
                        tagId = newTag.id
                    }

                    //now we definitely have a 'tagId' if we got this far, need to update the posts updatetags, so lets find the update_id and link the newly created tag by adding the tagId into the updatetags at the correct row

                    const { data: updateTag, error: updateTagError } = await supabase
                    .from('updatetags')
                    .insert({
                        update_id: post.id, 
                        tag_id: tagId
                        })

                    if (updateTagError) {
                        console.error('updateTagError', updateTagError)
                        throw updateTagError
                    }

                } catch (tagProcessingError){
                    console.error('tag processing error', tagProcessingError)
                    throw(tagProcessingError)
                }
            }
            return post

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