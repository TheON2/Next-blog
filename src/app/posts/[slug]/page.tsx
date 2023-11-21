import AdjacentPostCard from "@/components/AdjacentPostCard";
import CKEditorContent from "@/components/CKEditorContent";
import PostContent from "@/components/PostContent";
import { getFeaturedPosts, getPostData } from "@/service/posts";
import { Metadata } from "next";
import Image from "next/image";

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
  const { title, fileUrl, next, prev } = post;
  console.log("SLUG" + slug);

  return (
    <article className="overflow-hidden bg-gray-100 shadow-lg m-4">
      <CKEditorContent contentUrl={fileUrl} />

      <section className="flex shadow-md">
        {prev && <AdjacentPostCard post={prev} type="prev" />}
        {next && <AdjacentPostCard post={next} type="next" />}
      </section>
    </article>
  );
}

export async function getStaticParams() {
  const posts = await getFeaturedPosts();
  return posts.map((post) => ({
    slug: post.fileUrl,
  }));
}
