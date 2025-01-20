/* eslint-disable react/prop-types */
import { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';

const MonacoEditor = ({ value, language, onChange, saveFile }) => {
  const editorRef = useRef(null);
  const monacoInstanceRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const editor = monaco.editor.create(editorRef.current, {
      value: value || '',
      language: language,
      theme: 'vs-dark',
    });

    monacoInstanceRef.current = editor;

    editor.onDidChangeModelContent(() => {
      const updatedValue = editor.getValue();
      onChange(updatedValue);
    });

    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => {
        saveFile(editor.getValue());
      }
    );
    return () => {
      editor.dispose();
    };
  }, [value, language, onChange, saveFile]);

  return <div ref={editorRef} style={{ height: '700px', width: '100%' }} />;
};

export default MonacoEditor;
