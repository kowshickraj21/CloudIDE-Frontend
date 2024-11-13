/* eslint-disable react/prop-types */
import { useState } from "react";
import File from "./file";
import { FaAngleDown,FaAngleRight } from "react-icons/fa";


const Directory = ({ directory }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <div onClick={toggleOpen} style={{ cursor: 'pointer' }} className="flex items-center">
        {isOpen ? <FaAngleDown /> : <FaAngleRight />}{directory.name}
      </div>
      {isOpen && (
        <div>
          {directory.children.map((child, index) =>
            child.isDir ? (
              <Directory key={index} directory={child} />
            ) : (
              <File key={index} file={child} />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Directory;
