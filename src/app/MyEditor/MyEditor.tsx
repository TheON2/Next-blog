import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";

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
    />
  );
}
