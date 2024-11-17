import { useState } from "react";
import { FaFile, FaReact, FaImage } from "react-icons/fa";
import { BiLogoTypescript } from "react-icons/bi";
import { IoLogoJavascript } from "react-icons/io";
import { HiDotsVertical } from "react-icons/hi";
/* eslint-disable react/prop-types */
const File = ({ file }) => {
  const ext = file.name.split(".").at(-1);
  const [menu, setMenu] = useState(false)
    return <div className="flex ml-5 items-center justify-between pr-2 cursor-pointer hover:bg-gray-700">
      <div className="flex items-center">{getLogo(ext)}{file.name}</div>
      <div onClick={() => setMenu(true)}><HiDotsVertical /></div>
      { menu?
        <div className="absolute">
          <p>CreateFile</p>
        </div>:null}
    </div>
  };

  const getLogo = (ext) => {
    switch(ext) {
      case 'js':
        return <IoLogoJavascript className="text-yellow-300 mr-1"/>;
      case 'jsx':
        return <FaReact className="text-blue-400 mr-1"/>;
      case 'ts':
        return <BiLogoTypescript className="text-blue-500 mr-1"/>;
      case 'jpg':
      case 'jpeg':
      case 'svg':
        return <FaImage className="mr-1"/>
      default:
         return <FaFile className="mr-1"/>;
    }
  }
  
  export default File;
  