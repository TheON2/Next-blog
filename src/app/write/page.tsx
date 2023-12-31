"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button, Checkbox, Chip, Input } from "@nextui-org/react";
import { marked } from "marked";

const MyEditorWithNoSSR = dynamic(() => import("../MyEditor/MyEditor"), {
  ssr: false,
});

export default function WritePage() {
  const [editorData, setEditorData] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [featured, setFeatured] = useState(false);

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
      };
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postData }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      window.location.href = `/posts/${response.statusText}`;
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
            <Button
              className="my-4"
              color="primary"
              variant="shadow"
              onClick={handleSubmit}
            >
              게시하기
            </Button>
          </div>
        </div>
        {/* 글쓰기 에디터 섹션 */}
        <div className="overflow-y-auto h-[650px]">
          <MyEditorWithNoSSR data={""} onChange={handleEditorChange} />
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
