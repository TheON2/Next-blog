import AdjacentPostCard from "@/components/AdjacentPostCard";
import CKEditorContent from "@/components/CKEditorContent";
import { getFeaturedPosts, getPostData } from "@/service/posts";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { Metadata } from "next";

type Props = {
  params: {
    slug: string;
  };
};

// export async function generateMetadata({
//   params: { slug },
// }: Props): Promise<Metadata> {
//   const { title, description } = await getPostData(slug);
//   return {
//     title,
//     description,
//   };
// }

export default async function PostPage({ params: { slug } }: Props) {
  const post = await getPostData(slug);
  const { title, category, fileUrl, next, prev } = post;
  console.log("SLUG" + post);

  return (
    <div>
      <Card className="py-4">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h1 className="text-3xl font-bold">{title}</h1>
          <div className="flex gap-4">
            <Chip color="default">{category}</Chip>
          </div>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <CKEditorContent contentUrl={fileUrl} />
        </CardBody>
      </Card>
      <article className="overflow-hidden m-4">
        <section className="flex shadow-md">
          {prev && <AdjacentPostCard post={prev} type="prev" />}
          {next && <AdjacentPostCard post={next} type="next" />}
        </section>
      </article>
    </div>
  );
}

// export async function getStaticParams() {
//   const posts = await getFeaturedPosts();
//   return posts.map((post) => ({
//     slug: post.fileUrl,
//   }));
// }
