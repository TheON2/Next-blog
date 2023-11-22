import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import CustomEditor from "@/ckeditor2";
import { Markdown } from "@ckeditor/ckeditor5-markdown-gfm";

import React from "react";
import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment";

interface MyEditorProps {
  data: string;
  onChange: (event: any, editor: any) => void;
}

export default function MyEditor(props: MyEditorProps) {
  return (
    <div className="ckeditor-container">
      <CKEditor
        editor={CustomEditor}
        data={props.data}
        onChange={props.onChange}
        config={{
          mediaEmbed: {
            previewsInData: true,
          },
          ckfinder: {
            uploadUrl: "/api/uploadImage",
          },
          toolbar: {
            items: [
              "bold",
              "italic",
              "underline",
              "highlight",
              "|",
              "bulletedList",
              "numberedList",
              "|",
              "outdent",
              "indent",
              "|",
              "blockQuote",
              "code",
              "codeBlock",
              "findAndReplace",
              "|",
              "alignment",
              "fontBackgroundColor",
              "fontFamily",
              "fontColor",
              "fontSize",
              "|",
              "horizontalLine",
              "pageBreak",
              "removeFormat",
              "showBlocks",
              "sourceEditing",
              "style",
              "subscript",
              "textPartLanguage",
              "todoList",
              "selectAll",
              "insertTable",
              "imageInsert",
              "link",
              "imageUpload",
              "mediaEmbed",
              "undo",
              "redo",
            ],
            shouldNotGroupWhenFull: true,
          },

          language: "ko",
        }}
      />
    </div>
  );
}
