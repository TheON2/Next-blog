import React, { useState, useEffect } from "react";
import { getPostData, getPostHTML } from "@/service/posts";
import CKEditorForm from "@/components/CKEditorForm";

type Props = {
  params: {
    slug: string;
  };
};

export default async function UpdatePage({ params: { slug } }: Props) {
  const post = await getPostData(slug);
  const postHTML = await getPostHTML(post.fileUrl);
  console.log(postHTML);

  return <CKEditorForm post={post} postHTML={postHTML} />;
}
