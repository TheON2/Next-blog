"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button, Checkbox, Input } from "@nextui-org/react";

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

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleEditorChange = (event, editor) => {
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

      console.log(response);

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Failed to submit the article:", error);
    }
  };

  return (
    <div>
      <div key={"lg"} className="flex w-3/4 flex-wrap mt-12 mb-6 md:mb-0 gap-4">
        <Input
          size={"lg"}
          type="email"
          label="제목"
          value={title}
          onChange={handleTitleChange}
        />
        <Input
          size={"sm"}
          type="email"
          label=""
          placeholder="카테고리"
          value={category}
          onChange={handleCategoryChange}
        />
      </div>
      <Checkbox
        className="my-4"
        size="md"
        onChange={(e) => setFeatured(e.target.checked)}
      >
        비밀글
      </Checkbox>
      <MyEditorWithNoSSR data={""} onChange={handleEditorChange} />

      <Button
        className="my-4"
        color="primary"
        variant="shadow"
        onClick={handleSubmit}
      >
        게시하기
      </Button>
      <div>
        <div dangerouslySetInnerHTML={{ __html: editorData }}></div>
      </div>
    </div>
  );
}
