import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

function RichTextEditor({ value, onChange, placeholder = "" }) {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        height: 180,
        marginBottom: 60,
      }}
    />
  );
}
export default RichTextEditor;
