/* eslint-disable react/prop-types */
import { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';

const MonacoEditor = ({ value, language, onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = monaco.editor.create(editorRef.current, {
      value: value || '',
      language: language,
      theme: 'vs-dark',
    });

    if (editorRef.current.onK) {
      editor.onDidChangeModelContent(() => {
        const value = editor.getValue();
        onChange(value);
      });
    }

    return () => {
      editor.dispose();
    };
  }, [value, language, onChange]);

  return <div ref={editorRef} style={{ height: '500px', width: '100%' }} />;
};

export default MonacoEditor;
