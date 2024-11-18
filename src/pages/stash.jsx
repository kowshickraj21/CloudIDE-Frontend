import { useParams } from "react-router-dom";
import File from "../components/file";
import Directory from "../components/dir";
import { useEffect, useState, useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import MonacoEditor from "../components/codeEditor";
import { IoMdClose } from "react-icons/io";

const Stash = () => {
  const { id } = useParams();
  const [fs, setFs] = useState([]);
  const [openFiles, setOpenFiles] = useState({});
  const [currentFile, setCurrentFile] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:3050/start');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      ws.current.send(JSON.stringify({
        type: 'getDir',
        data: `stashes/${id}/`
      }));
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "dir") {
        console.log('Received message:', message);
        const root = [];

        message.data.forEach((path) => {
          const parts = path.split('/');
          let currentLevel = root;

          parts.forEach((part, index) => {
            if (index < 1 || part === "") return;
            let existingPath = currentLevel.find((node) => node.name === part);
            if (!existingPath) {
              existingPath = {
                name: part,
                path: parts.slice(0, index + 1).join('/'),
                isDir: index !== parts.length - 1,
                children: [],
              };
              currentLevel.push(existingPath);
            }
            currentLevel = existingPath.children;
          });
        });

        root.forEach((node) => {
          if (node.isDir && node.children.length === 0) {
            delete node.children;
          }
        });
        console.log(root);
        setFs(root);

      } else if (message.type === "file") {
        setOpenFiles((prevFiles) => ({
          ...prevFiles,
          [message.path]: message.data,
        }));
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [id]);

  const createFile = (filePath) => {
    ws.current.send(JSON.stringify({
      type: 'createObject',
      data: filePath
    }));
  };

  const getFile = (filePath) => {
    ws.current.send(JSON.stringify({
      type: "getFile",
      data: filePath
    }));
  };

  const handleCodeChange = (code) => {
    setOpenFiles((prevFiles) => ({
      ...prevFiles,
      [currentFile]: code,
    }));
  };

  const getLanguage = (filePath) => {
    const ext = filePath.split(".").pop();
    switch (ext) {
      case "jsx":
      case "js":
      case "tsx":
      case "ts":
        return "javascript";
      case "py":
        return "python";
      case "json":
        return "json";
      default:
        return "plaintext";
    }
  };

  const openFile = (path) => {
    if (!openFiles[path] && currentFile != path) {
      console.log("Fetching file from backend:", path);
      getFile(path);
    } else {
      console.log("File already open:", path);
    }
    console.log(openFiles)
    setCurrentFile(path);
  };
  

  return (
    <div className="bg-gray-900 h-screen">
      <PanelGroup direction="horizontal" className="text-white flex">
        <Panel defaultSize={18} className="mt-10">
          <h2 className="ml-6 mb-2">Files</h2>
          {fs.map((item, index) =>
            item.isDir ? (
              <Directory key={index} directory={item} create={createFile} getFile={openFile} />
            ) : (
              <File key={index} file={item} getFile={openFile} />
            )
          )}
        </Panel>
        <PanelResizeHandle />
        <Panel>
          <PanelGroup autoSaveId="example" direction="vertical" className="bg-gray-800">
            <Panel className="">
            <div className="h-10 w-full flex gap-5">
            {Object.keys(openFiles).map((filePath,index) => (
              <div className={`flex gap-5 px-2 items-center cursor-pointer ${filePath == currentFile?"bg-black":""}`} key={index} onClick={() => setCurrentFile(filePath)}>
                <p>{filePath.split("/").pop()}</p>
                <IoMdClose onClick={() => setOpenFiles((prevFiles) => {
                  const updatedFiles = { ...prevFiles };
                  delete updatedFiles[filePath];
                  return updatedFiles;
                })}/>
              </div>
            ))}
            </div>
              {currentFile && openFiles[currentFile] !== undefined ? (
                <MonacoEditor
                  value={openFiles[currentFile]}
                  language={getLanguage(currentFile)}
                  onChange={handleCodeChange}
                  className="w-full h-full"
                />
              ) : null}
            </Panel>
            <PanelResizeHandle />
            <Panel defaultSize={25} className="bg-black">
              terminal
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default Stash;
