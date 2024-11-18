import { useParams } from "react-router";
import { useGetUserPosts, useUpdatePost } from "../hooks/usePosts";
import { useState } from "react";

export function EditPostPage() {
    const { id } = useParams();
    const userPosts = useGetUserPosts();
    const updatePost = useUpdatePost();
    
    const post = userPosts.data?.find(post => post.id === Number(id));
    const [title, setTitle] = useState(post?.title || '');
    const [body, setBody] = useState(post?.body || '');
    const [tags, setTags] = useState(post?.updatetags.map(t => t.tag.name).join(', ') || '');

    const handleUpdatePost = (event) => {
        event.preventDefault();
        const tagsSanitized = tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
        updatePost.mutate({ id: Number(id), title, body, tags: tagsSanitized });
    };

    if (userPosts.isLoading) return <div>Loading...</div>;
    if (!post) return <div>Post not found</div>;

    return (
        <div>
            <h1>Edit Post</h1>
            <form onSubmit={handleUpdatePost}>
                <label htmlFor="post-title-input">Post title</label>
                <input
                    id="post-title-input"
                    value={title}
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <label htmlFor="post-body-input">Post Body</label>
                <input
                    id="post-body-input"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    type="text"
                    required
                />
                <label htmlFor="post-tags-input">Tags</label>
                <input
                    id="post-tags-input"
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="tag1, tag2, tag3"
                    required
                />
                <button disabled={updatePost.isPending}>
                    {updatePost.isPending ? 'Updating Post...' : 'Update Post'}
                </button>
            </form>
        </div>
    );
}