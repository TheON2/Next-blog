import PostForm from "@/components/PostForm";
import { Post, getFeaturedPosts, getPostData } from "@/service/posts";
import { Metadata } from "next";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({
  params: { slug },
}: Props): Promise<Metadata> {
  const { title, description } = await getPostData(slug);
  return {
    title,
    description,
  };
}

export default async function PostPage({ params: { slug } }: Props) {
  const post = await getPostData(slug);
  const { title, category, fileUrl, next, prev, postId } = post;
  return (
    <PostForm post={post}/>
  );
}

export async function getStaticParams() {
  const posts: Post[] = await getFeaturedPosts();
  return posts.map((post) => ({
    slug: post.fileUrl,
  }));
}
