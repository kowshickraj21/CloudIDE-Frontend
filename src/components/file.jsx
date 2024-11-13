import { FaFile, FaReact, FaImage } from "react-icons/fa";
import { BiLogoTypescript } from "react-icons/bi";
import { IoLogoJavascript } from "react-icons/io";
/* eslint-disable react/prop-types */
const File = ({ file }) => {
  const ext = file.name.split(".").at(-1);
    return <div className="flex ml-5 items-center">{getLogo(ext)}{file.name}</div>;
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
  