import { useParams } from "react-router-dom";
import File from "../components/file";
import Directory from "../components/dir";

const Stash = () => {
  const { id } = useParams();
  console.log(id);
  
  const fs = [
    {
      name: "assets",
      isDir: true,
      children: [
        { name: "img.js", isDir: false, children: [] },
      ],
    },
    { name: "index.ts", isDir: false, children: [] },
  ];

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
