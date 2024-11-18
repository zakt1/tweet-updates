import { useLocation, useParams } from "react-router";
import { useGetPostsByTag } from "../hooks/useTags";

export function TagPostsPage() {
    const { id } = useParams()
    const { state } = useLocation()

    const { data: tagPosts} = useGetPostsByTag(Number(id))
    console.log('tagPosts', tagPosts)

    return (
        <div>
            <h1>Posts tagged with: {state.tagName}</h1>
            {tagPosts?.map(post => (
                <div key={post.id}>
                    <h2>{post.title}</h2>
                    <p>{post.body}</p>
                </div>
            ))}
        </div>
    );
}
