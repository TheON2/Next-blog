import { Post } from "@/service/posts";
import PostCard from "./PostCard";

type Props = { posts: Post[] };
export default function PostsGrid({ posts }: Props) {
  return (
    <ul className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {posts.map((post) => (
        <li key={post._id}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
}
  