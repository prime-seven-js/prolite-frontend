import type { Post } from "@/types/post";
import { InitialAvatar } from "../layout/InitialAvatar";
import { PostHeader } from "../newfeeds/PostHeader";
import { PostImageGrid } from "../newfeeds/PostImageGrid";

const ProfilePostCard = ({ post, index }: { post: Post; index: number }) => {
    return (
        <div
            className="border-b border-white/4 px-4 py-4 hover:bg-white/1.5 transition-colors animate-fade-in-up"
            style={{ animationDelay: `${index * 80}ms` }}
        >
            <div className="flex gap-3">
                <InitialAvatar
                    name={post.users.username}
                    sizeClassName="w-10 h-10"
                    textClassName="text-sm"
                    wrapperClassName="shrink-0 self-start mt-0.5"
                />

                <div className="flex-1 min-w-0">
                    <PostHeader
                        username={post.users.username}
                        timestamp={post.created_at}
                    />
                    <p className="text-[15px] leading-relaxed mt-1 text-gray-100">
                        {post.content}
                    </p>
                    <PostImageGrid imageUrls={post.image_urls} />
                </div>
            </div>
        </div>
    );
}

export default ProfilePostCard
