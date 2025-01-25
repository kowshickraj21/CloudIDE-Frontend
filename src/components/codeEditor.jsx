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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    if (monacoInstanceRef.current && monacoInstanceRef.current.getValue() !== value) {
      monacoInstanceRef.current.setValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (monacoInstanceRef.current) {
      monaco.editor.setModelLanguage(
        monacoInstanceRef.current.getModel(),
        language
      );
    }
  }, [language]);

  return <div ref={editorRef} style={{ height: '780px', width: '100%' }} />;
};

export default MonacoEditor;
