import { useParams } from "react-router-dom";
import File from "../components/file";
import Directory from "../components/dir";
import { useEffect, useState, useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import MonacoEditor from "../components/codeEditor";
import { IoMdClose,IoIosPlay } from "react-icons/io";
import { FaRegStopCircle } from "react-icons/fa";
import TerminalComponent from "../components/terminal";
import axios from 'axios'


const Stash = () => {
  const { id } = useParams();
  const [fs, setFs] = useState([]);
  const [run, setRunning] = useState(false);
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

  const handleRun = () => {
    console.log(run)
    setRunning(!run)
  }
  
  return (
    <div className="bg-gray-900 h-screen">
      <PanelGroup direction="horizontal" className="text-white flex">
        <Panel defaultSize={18} className="pt-2 bg-gray-800">
        <div className="h-12 flex justify-between items-center">
        <h2 className="ml-4">Files</h2>
        { run?
             <button className="bg-gray-500 text-white w-20 flex items-center justify-center h-8 mr-4 gap-1"  onClick={() => handleRun()}><FaRegStopCircle className="text-base"/>Stop</button>
            :<button className="bg-green-500 text-white w-20 flex items-center justify-center h-8 mr-4 gap-1" onClick={() => handleRun()}><IoIosPlay className="text-lg"/>Run</button>
        }
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
              <div className="h-10 flex">

              </div>
              <iframe src="/console" className="transform scale-50 w-[200%] h-[200%] origin-top-left bg-white"></iframe>
            </Panel>
            <PanelResizeHandle className="h-2 hover:bg-blue-600 "/>
            <Panel defaultSize={25} className="bg-black">
              <TerminalComponent sendCommand={sendCommand} terminalOutput={terminalOutput} setTerminalOutput={setTerminalOutput}/>
            </Panel>
            </PanelGroup>
            </Panel>
      </PanelGroup>
    </div>
  );
};

export default Stash;
