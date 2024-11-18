import { Link } from "react-router-dom";
import { useDeletePost, useGetUserPosts } from "../hooks/usePosts";
import { useDebugValue } from "react";

export function UserPostsPage() {
    const { data: posts, isLoading } = useGetUserPosts();
    console.log('posts from userPostspage:', posts )
    const deletePost = useDeletePost()

    const handleDelete = async (postId) =>{
        try{
            if(window.confirm('Are you sure you want to delete this post?'))
           await deletePost.mutate(postId)
        }catch (error){
            console.error('failed to delete post', error)
            throw error
        }
    }
    
    if (isLoading) return <div>Loading...</div>;
    
    return (
        <div>
            <h1>My Posts</h1>
            <div>
                {posts?.map(post => (
                    <div key={post.id} className="border p-4 mb-4">
                        <h2>{post.title}</h2>
                        <p>{post.body}</p>
                        <div>
                            Tags: {post.updatetags.map(element => element.tag.name).join(', ')}
                        </div>
                        <Link to={`/posts/${post.id}/edit`}>Edit Post</Link>
                        <button 
                                onClick={() => handleDelete(post.id)}
                                disabled={deletePost.isPending}
                                className="text-red-600"
                            >
                                {deletePost.isPending ? 'Deleting...' : 'Delete'}
                            </button>
                    </div>
                ))}
            </div>
        </div>
    );
}