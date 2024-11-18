import { useGetAllPosts } from "../hooks/usePosts";

export function LatestPostsPage(){

    const {data: allPosts, error: getPostsError} = useGetAllPosts()

    return (
        <div>
            <h1>Latest Posts</h1>
                
            {allPosts?.map(post => (
                                <div key={post.id} className="border-2 border-sky-500 p-9 mb-9">
                                <h2>{post.title}</h2>
                                <p>{post.body}</p>
                                <div>
                                    Tags: {post.updatetags.map(element => element.tag.name).join(', ')}
                                </div>
                                </div>
                                )
                        )}

        </div>
    )
}