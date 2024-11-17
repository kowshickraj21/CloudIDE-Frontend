import { useParams } from "react-router-dom";
import File from "../components/file";
import Directory from "../components/dir";
import { useEffect, useState, useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const Stash = () => {
  const { id } = useParams();
  const [fs, setFs] = useState([]);
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
        if (typeof message === 'string') {
          console.log("File", message);
        } else {
          console.log('Received message:', message);
          const root = [];

          message.forEach((path) => {
            const parts = path.split('/');
            let currentLevel = root;

            parts.forEach((part, index) => {
              if(index < 1 || part === "") return 
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
          console.log(root)
          setFs(root);
        }
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
      };

    }, [id]);

  const createFile = (filePath) => {
    ws.current.send(JSON.stringify({
      type: 'createObject',
      data: filePath
    }));
  };

  return (
    <div className="bg-gray-900 h-screen">
    <PanelGroup direction="horizontal" className="text-white flex">
      <Panel defaultSize={18} className="mt-10">
        <h2 className="ml-6 mb-2">Files</h2>
        {fs.map((item, index) =>
          item.isDir ? (
            <Directory key={index} directory={item} create={createFile}/>
          ) : (
            <File key={index} file={item} className="cursor-pointer"/>
          )
        )}
      </Panel>
      <PanelResizeHandle />
      <Panel>
      <PanelGroup autoSaveId="example" direction="vertical" className="bg-gray-800">
      <Panel className="mt-10">
      <h2 className="ml-6 mb-2">Files</h2>
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
