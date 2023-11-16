import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Markdown } from "@ckeditor/ckeditor5-markdown-gfm";

import React from "react";

interface MyEditorProps {
  data: string;
  onChange: (event: any, editor: any) => void;
}

export default function MyEditor(props: MyEditorProps) {
  return (
    <CKEditor
      editor={ClassicEditor}
      config={{
        ckfinder: {
          uploadUrl: "/api/uploadImage",
        },
      }}
      data={props.data}
      onChange={props.onChange}
      onReady={(editor) => {
        const root = editor.editing.view.document.getRoot();
        if (root) {
          editor.editing.view.change((writer) => {
            writer.setStyle("min-height", "400px", root);
          });
        }
      }}
    />
  );
}
