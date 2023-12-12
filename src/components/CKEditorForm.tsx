"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import { Input } from "@nextui-org/input";
import { marked } from "marked";
import { PostData } from "@/service/posts";
import { Chip } from "@nextui-org/react";
import ButtonModal from "./ButtonModal";
import SubmitModal from "./SubmitModal";

const MyEditorWithNoSSR = dynamic(() => import("../app/MyEditor/MyEditor"), {
  ssr: false,
});

export default function CKEditorForm({
  post,
  postHTML,
  fileName,
  postId,
}: {
  post: PostData;
  postHTML: string;
  fileName: string;
  postId: string;
}) {
  const [editorData, setEditorData] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [featured, setFeatured] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  console.log(post);
  console.log(postHTML);

  useEffect(() => {
    setEditorData(postHTML);
    setTitle(post.title);
    setCategory(post.category);
    setFeatured(post.featured);
    setThumbnail(post.thumbnail);
  }, [postHTML, post]);

  const handleTitleChange = (event: any) => {
    setTitle(event.target.value);
  };

  const handleCategoryChange = (event: any) => {
    setCategory(event.target.value);
  };

  const handleEditorChange = (event: any, editor: any) => {
    const newData = editor.getData();
    setEditorData(newData);
    const parser = new DOMParser();
    const doc = parser.parseFromString(newData, "text/html");
    const firstImage = doc.querySelector("img");
    console.log(firstImage);
    if (firstImage && firstImage.src) {
      setThumbnail(firstImage.src);
    }
    if (doc && doc.body.textContent) {
      setDescription(doc.body.textContent.trim().substring(0, 40));
    }
  };

  const handleSubmit = async () => {
    try {
      const postData = {
        htmlContent: editorData,
        title,
        description,
        category,
        thumbnail,
        featured,
        fileName,
        postId,
      };

      console.log("썸네일" + thumbnail);
      const response = await fetch("/api/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postData }),
      });
      setIsSubmit(true);
      //window.location.href = `/posts/${response.statusText}`;

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Failed to submit the article:", error);
    }
  };

  const htmlContent = marked(editorData);

  return (
    <div className="flex flex-row w-full">
      <div className="flex flex-1 max-w-[50%] flex-col">
        <div className="sticky top-0 bg-white z-10 h-[230px]">
          <div className="flex flex-wrap gap-4 p-4">
            <Input
              size="sm"
              type="email"
              label="제목"
              value={title}
              onChange={handleTitleChange}
            />
            <Input
              size="sm"
              type="email"
              label=""
              placeholder="카테고리"
              value={category}
              onChange={handleCategoryChange}
            />
            <Checkbox
              className="my-4"
              size="md"
              onChange={(e) => setFeatured(e.target.checked)}
            >
              비밀글
            </Checkbox>
            <ButtonModal
              title={"수정하기"}
              text={"글을 수정하시겠습니까?"}
              action={handleSubmit}
            />
            <SubmitModal
              title={"수정완료"}
              text={"수정이 완료되었습니다."}
              isOpen={isSubmit}
              onClose={() => (window.location.href = `/posts/${postId}`)}
            />
          </div>
        </div>
        {/* 글쓰기 에디터 섹션 */}
        <div className="overflow-y-auto h-[650px]">
          <MyEditorWithNoSSR data={editorData} onChange={handleEditorChange} />
        </div>
      </div>
      {/* 미리보기 섹션 */}
      <div className="flex-1 overflow-y-auto h-[800px] max-w-[50%]">
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="flex gap-4">
          {category.length >= 1 && (
            <Chip className="my-4" color="default">
              {category}
            </Chip>
          )}
        </div>
        <div
          className="ck-content p-8 break-words"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        ></div>
      </div>
    </div>
  );
}
