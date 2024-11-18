import { useState } from "react";
import { useCreatePost } from "../hooks/usePosts";


export function CreatePostPage() {

    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [tags, setTags] = useState('')

    const createPost = useCreatePost()
    const sanitizeTags = (tagString) => {
        return tagString.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length >0)
    }
    //handleSubmitPost
    const handleCreatePost = (event) => {
        event.preventDefault()
        const tagsSanitized = sanitizeTags(tags)
        console.log('tagsSanitized', tagsSanitized)
        createPost.mutate({title: title, body: body, tags: tagsSanitized})
    }
    
    return (

        <div>
            <h1>Create Post</h1>

            <form onSubmit={handleCreatePost}>
                <label htmlFor="post-title-input">Post title</label>
                <input 
                id="post-title-input"
                value={title}
                type="text"
                placeholder="Enter a title for your post"
                onChange={(event) => setTitle(event.target.value)}
                required
                />

                <label htmlFor="post-body-input">Post Body</label>
                <input 
                id="post-body-input"
                value={body}
                onChange={(event)=> setBody(event.target.value)}
                type="text"
                placeholder="write your post content here"
                required
                />

                <label htmlFor="post-tags-input">Tags</label>
                <input 
                id="post-tags-input"
                type="text"
                value={tags}
                onChange={(event)=> setTags(event.target.value)}
                placeholder="tag1, tag2, tag3"
                required
                />

                <button disabled={createPost.isPending}>
                    {createPost.isPending? 'Creating Post...': 'Create Post'}
                </button>
            </form>
        </div>
    )
}