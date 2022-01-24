import React, { useEffect } from "react";
import Prism from "prismjs";

const CodeEditor = props => {
  useEffect(() => {
    Prism.highlightAll();
  }, [ props.language, props.content ]);

  return (
    <div className="code-edit-container" >
      <pre id="container" className="code-output">
        <code className={`language-${props.language}`}>{props.content}</code>
      </pre>
    </div>
  );
};

export default CodeEditor;
