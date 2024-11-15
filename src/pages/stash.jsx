import { useParams } from "react-router-dom";
import File from "../components/file";
import Directory from "../components/dir";
import { useEffect, useState } from "react";

const Stash = () => {
  const { id } = useParams();
  const [fs, setFs] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3050/start');

    ws.onopen = () => {
      console.log('WebSocket connected');
      ws.send(JSON.stringify({
        'type': 'getDir',
        'data': `stashes/${id}/`
      }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
      const root = [];

      message.forEach((path) => {
        const parts = path.split('/').slice(2);
        let currentLevel = root;

        parts.forEach((part, index) => {
          let existingPath = currentLevel.find((node) => node.name === part);
          if(part == "")return;
          if (!existingPath) {
            existingPath = {
              name: part,
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

      setFs(root);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

  }, [id]);

  return (
    <div className="bg-black h-svh text-white">
      {fs.map((item, index) =>
        item.isDir ? (
          <Directory key={index} directory={item} />
        ) : (
          <File key={index} file={item} />
        )
      )}
    </div>
  );
};

export default Stash;
