import { Link } from "react-router-dom";
import { useGetUserPosts } from "../hooks/usePosts";

export function UserPostsPage() {
    const { data: posts, isLoading } = useGetUserPosts();
    
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
                            Tags: {post.updatetags.map(t => t.tag.name).join(', ')}
                        </div>
                        <Link to={`/posts/${post.id}/edit`}>Edit Post</Link>
                    </div>
                ))}
            </div>
        </div>
    );
}