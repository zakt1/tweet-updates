import { Link } from "react-router-dom";
import { useGetTags } from "../hooks/useTags";

export function TagListPage() {
    const { data: tags } = useGetTags();
    
    return (
        <div>
            <h1>All Tags</h1>
            <div>
                {tags?.map(tag => (
                    <div className="mr-2" key={tag.id}>

                    <Link to={`/tags/${tag.id}`} state={{tagName: tag.name}}>
                        {tag.name}
                    </Link>

                    </div>
                ))}
            </div>
        </div>
    );
}