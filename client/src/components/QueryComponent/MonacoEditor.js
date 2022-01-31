import Editor, { useMonaco } from "@monaco-editor/react";

export const MonacoEditor = () => {
  const monaco = useMonaco();
  
  useEffect(() => {
    monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    if (monaco) {
      console.log("here is the monaco instance:", monaco);
    }
  }, [monaco]);

  return (
    <Editor
      height="90vh"
      defaultValue="// some comment"
      defaultLanguage="javascript"
    />
  );
}