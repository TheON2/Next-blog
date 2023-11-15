// components/CKEditorContent.js
"use client";

import React, { useEffect, useState } from "react";

const CKEditorContent = ({ contentUrl }) => {
  const [content, setContent] = useState("");
  useEffect(() => {
    // S3 버킷에서 HTML 파일을 가져오는 함수
    async function fetchContent() {
      try {
        const response = await fetch(contentUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const htmlContent = await response.text();
        setContent(htmlContent);
      } catch (error) {
        console.error("Failed to fetch content", error);
      }
    }

    fetchContent();
  }, [contentUrl]);
  return (
    <div
      className="ckeditor-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default CKEditorContent;
