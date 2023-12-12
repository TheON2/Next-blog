"use client";

import AdjacentPostCard from "@/components/AdjacentPostCard";
import CKEditorContent from "@/components/CKEditorContent";
import TextModal from "@/components/TextModal";
import { Post } from "@/service/posts";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import Link from "next/link";
import { useEffect, useState } from "react";
import SubmitModal from "./SubmitModal";

type PostFormProps = {
  post: {
    title: string;
    category: string;
    fileUrl: string;
    next: Post | null;
    prev: Post | null;
    postId: string;
  };
};

export default function PostForm({ post }: PostFormProps) {
  const { title, category, fileUrl, next, prev, postId } = post;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const handleSubmit = async () => {
    try {
      const fileNameWithExtension = post.fileUrl.split("/").pop() as string;
      const fileName = fileNameWithExtension.replace(".html", "");
      const postData = {
        fileName,
        postId,
      };

      const response = await fetch("/api/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postData }),
      });
      setIsSubmit(true);
      //   window.location.href = `/posts`;

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Failed to submit the article:", error);
    }
  };

  useEffect(() => {
    if (isDeleting) {
      handleSubmit();
    }
  }, [isDeleting]);

  const triggerDelete = () => {
    setIsDeleting(true);
  };
  return (
    <div>
      <Card className="py-4">
        <CardHeader className="pb-0 pt-2 px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <div className="flex gap-4">
              <Chip color="default">{category}</Chip>
            </div>
          </div>
          <div className="flex gap-2 mr-8">
            <Link href={`/update/${post.postId}`}>
              <h1>수정</h1>
            </Link>
            <Link href={``}>
              <TextModal
                title={"삭제"}
                text={"삭제 하시겠습니까?"}
                action={triggerDelete}
              ></TextModal>
            </Link>
          </div>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <CKEditorContent contentUrl={fileUrl} />
        </CardBody>
      </Card>
      <SubmitModal
        title={"삭제완료"}
        text={"삭제가 완료되었습니다."}
        isOpen={isSubmit}
        onClose={() => (window.location.href = "/posts")}
      />
      <article className="overflow-hidden m-4">
        <section className="flex shadow-md">
          {prev && <AdjacentPostCard post={prev} type="prev" />}
          {next && <AdjacentPostCard post={next} type="next" />}
        </section>
      </article>
    </div>
  );
}
