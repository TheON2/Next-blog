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
          ui: {
            viewportOffset: { top: 200 },
          },
          mediaEmbed: {
            previewsInData: true,
          },
          ckfinder: {
            uploadUrl: "/api/uploadImage",
          },
          mention: {
            feeds: [
              {
                marker: "@",
                feed: [
                  "@apple",
                  "@bears",
                  "@brownie",
                  "@cake",
                  "@cake",
                  "@candy",
                  "@canes",
                  "@chocolate",
                  "@cookie",
                  "@cotton",
                  "@cream",
                  "@cupcake",
                  "@danish",
                  "@donut",
                  "@dragée",
                  "@fruitcake",
                  "@gingerbread",
                  "@gummi",
                  "@ice",
                  "@jelly-o",
                  "@liquorice",
                  "@macaroon",
                  "@marzipan",
                  "@oat",
                  "@pie",
                  "@plum",
                  "@pudding",
                  "@sesame",
                  "@snaps",
                  "@soufflé",
                  "@sugar",
                  "@sweet",
                  "@topping",
                  "@wafer",
                ],
                minimumCharacters: 1,
              },
            ],
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
