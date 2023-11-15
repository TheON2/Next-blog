"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const MyEditorWithNoSSR = dynamic(() => import("../MyEditor/MyEditor"), {
  ssr: false,
});

export default function WritePage() {
  const [editorData, setEditorData] = useState("");
  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editorData }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
    } catch (error) {
      console.error("Failed to submit the article:", error);
    }
  };

  return (
    <div>
      <MyEditorWithNoSSR
        data={"<p>Hello world!</p>"}
        onChange={(event, editor) => {
          console.log(editor.getData());
          const newData = editor.getData();
          setEditorData(newData);
        }}
      />
      <button onClick={handleSubmit}>Submit Article</button>
      <div>
        <h2>Content</h2>
        <div dangerouslySetInnerHTML={{ __html: editorData }}></div>
      </div>
    </div>
  );
}
