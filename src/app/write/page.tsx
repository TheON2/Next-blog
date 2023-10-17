"use client";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useState } from "react";

export default function WritePage() {
  const [editorData, setEditorData] = useState("");
  const handleEditorDataChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
  };

  const uploadAdapterPlugin = (editor) => {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new UploadAdapter(loader);
    };
  };

  class UploadAdapter {
    constructor(loader) {
      // CKEditor에서 제공하는 파일 로더 인스턴스를 저장합니다.
      this.loader = loader;
    }

    // 시작점으로 업로드 프로세스를 처리합니다.
    upload() {
      return this.loader.file.then(
        (file) =>
          new Promise((resolve, reject) => {
            this._initRequest();
            this._initListeners(resolve, reject, file);
            this._sendRequest(file);
          })
      );
    }

    // 어댑터와 연결된 리소스를 정리합니다.
    abort() {
      // 요청이 있었다면 취소합니다.
      if (this.xhr) {
        this.xhr.abort();
      }
    }

    // XMLHttpRequest를 초기화합니다.
    _initRequest() {
      const xhr = (this.xhr = new XMLHttpRequest());

      // 여러분의 업로드 URL로 POST 요청을 설정합니다.
      xhr.open("POST", "/api/upload", true);
      xhr.responseType = "json";
    }

    // XMLHttpRequest 이벤트 리스너를 초기화합니다.
    _initListeners(resolve, reject, file) {
      const xhr = this.xhr;
      const loader = this.loader;
      const genericErrorText = `파일을 업로드할 수 없습니다: ${file.name}.`;

      xhr.addEventListener("error", () => reject(genericErrorText));
      xhr.addEventListener("abort", () => reject());
      xhr.addEventListener("load", () => {
        const response = xhr.response;

        // 서버에서 오류가 반환된 경우
        if (!response || response.error) {
          return reject(
            response && response.error
              ? response.error.message
              : genericErrorText
          );
        }

        // 파일 업로드에 성공한 경우 서버로부터 반환된 파일의 URL을 resolve합니다.
        resolve({
          default: response.url, // 여기서는 서버 응답에 맞게 속성을 조정해야 합니다.
        });
      });

      // 업로드 프로세스 중 진행 상황을 업데이트할 수 있습니다.
      if (xhr.upload) {
        xhr.upload.addEventListener("progress", (evt) => {
          if (evt.lengthComputable) {
            loader.uploadTotal = evt.total;
            loader.uploaded = evt.loaded;
          }
        });
      }
    }

    // 데이터를 서버로 보냅니다.
    _sendRequest(file) {
      // FormData 인스턴스를 만들고, 우리의 파일을 요청에 추가합니다.
      const data = new FormData();
      data.append("upload", file);

      // 이 요청을 서버로 보냅니다.
      this.xhr.send(data);
    }
  }
  return (
    <div>
      <CKEditor
        editor={ClassicEditor}
        data={editorData}
        onChange={handleEditorDataChange}
        config={{
          extraPlugins: [uploadAdapterPlugin],
        }}
      />
      \
      <div>
        <h2>Content</h2>
        <div dangerouslySetInnerHTML={{ __html: editorData }}></div>
      </div>
    </div>
  );
}
