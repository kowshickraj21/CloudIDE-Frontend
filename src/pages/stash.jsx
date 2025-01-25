import { useParams } from "react-router-dom";
import File from "../components/file";
import Directory from "../components/dir";
import { useEffect, useState, useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import MonacoEditor from "../components/codeEditor";
import { IoMdClose } from "react-icons/io";
import TerminalComponent from "../components/terminal";
import axios from 'axios'


const Stash = () => {
  const { id } = useParams();
  const [fs, setFs] = useState([]);
  const [openFiles, setOpenFiles] = useState({});
  const [currentFile, setCurrentFile] = useState("");
  const [terminalOutput,setTerminalOutput] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    const initialize = async() => {

    const stashData = await axios.post( "http://localhost:3050/findStash", { name:id })
    const stash = stashData.data
    console.log("stash",stash)

    axios.post(
      "http://localhost:3050/start",
      {
        name: stash.name,
        image: stash.image,
        owner: stash.owner,
        port: stash.port
      }
    );

    ws.current = new WebSocket(`ws://localhost:3050/run?stash=${id}`);

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
      } else if(message.type === "output") {
        setTerminalOutput(message.data)
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
  }
  initialize()
  }, [id]);

  const createFile = (filePath) => {
    ws.current.send(JSON.stringify({
      type: 'createObject',
      data: filePath
    }));
  };

  const saveFile = (content) => {
    ws.current.send(JSON.stringify({
      type: 'writeFile',
      path: currentFile,
      data: content
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

  const sendCommand = (command) => {
      ws.current.send(JSON.stringify({
        type: 'terminalCommand',
        data: command
      }));
  }

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
    <div>
    {
      fs.length >0 ? 
    <div className="bg-gray-900 h-screen">
      <PanelGroup direction="horizontal" className="text-white flex">
        <Panel defaultSize={18} className="pt-2 bg-gray-800">
        <div className="h-12 flex justify-between items-center">
        <h2 className="ml-4">Files</h2>
          </div>
          {fs.map((item, index) =>
            item.isDir ? (
              <Directory key={index} directory={item} create={createFile} getFile={openFile} />
            ) : (
              <File key={index} file={item} getFile={openFile} />
            )
          )}
        </Panel>
        <PanelResizeHandle className="w-2 hover:bg-blue-600"/>
            <Panel className="bg-gray-700">
            <div className="h-10 w-full flex gap-5">
            {Object.keys(openFiles).map((filePath,index) => (
              <div className={`flex gap-5 px-2 items-center cursor-pointer ${filePath == currentFile?"bg-black":""}`} key={index} onClick={() => setCurrentFile(filePath)}>
                <p>{filePath.split("/").pop()}</p>
                <IoMdClose onClick={() => setOpenFiles((prevFiles) => {
                  const updatedFiles = {...prevFiles};
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
                  saveFile = {saveFile}
                  className="w-full h-full"
                  theme="vs-dark"
                />
              ) :
                Object.keys(openFiles).length == 0? 
                <div className="w-full h-full flex justify-center items-center">
                  Start Coding by Opening a File
                </div>:null
              }
            </Panel>
            <PanelResizeHandle className="w-2 hover:bg-blue-600 "/>
            <Panel defaultSize={25}>
            <PanelGroup direction="vertical">
            <Panel defaultSize={25} className="">
              <div className="h-full flex justify-center items-center">
                <p>Run to see the Output</p>
              </div>
              {/* <iframe src="/console" className="transform scale-50 w-[200%] h-[200%] origin-top-left bg-white"></iframe> */}

            </Panel>
            <PanelResizeHandle className="h-2 hover:bg-blue-600 "/>
            <Panel defaultSize={25} className="bg-black">
              <TerminalComponent sendCommand={sendCommand} terminalOutput={terminalOutput} setTerminalOutput={setTerminalOutput}/>
            </Panel>
            </PanelGroup>
            </Panel>
      </PanelGroup>
    </div>
      : <div role="status" className="bg-gray-900 h-screen flex items-center justify-center">
      <svg aria-hidden="true" className="w-20 h-20 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
  </div>      }
    </div>
  );
};

export default Stash;
