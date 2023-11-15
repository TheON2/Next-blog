import FilterablePosts from "@/components/FilterablePosts";
import { getAllPost, getAllPosts } from "@/service/posts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Posts",
  description: "개발 관련 블로그 글",
};

export default async function PostsPage() {
  const posts = await getAllPosts();
  const post = await getAllPost();
  console.log(post);
  const categories = [...new Set(posts.map((post) => post.category))];
  return <FilterablePosts posts={posts} categories={categories} />;
}
