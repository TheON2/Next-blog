import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Metadata } from "next";
import { useState } from "react";

export const metadata: Metadata = {
  title: "UpdatePage",
  description: "개발관련 글을 수정하는 페이지",
};

export default async function UpdatePage() {
  const [editorData, setEditorData] = useState("");
  return (
    <div>
      <CKEditor
        editor={ClassicEditor}
        data={editorData}
        onChange={(event, editor) => {
          const data = editor.getData();
          setEditorData(data);
        }}
      />
    </div>
  );
}
