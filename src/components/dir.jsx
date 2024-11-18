/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import File from "./file";
import { FaAngleDown, FaAngleRight, FaFile } from "react-icons/fa";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { FiFilePlus, FiFolderPlus } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";


const Directory = ({ directory, create, getFile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [newFile, setNewFile] = useState(false);
  const [newFolder, setNewFolder] = useState(false);
  const menuRef = useRef(null);
  const newFileRef = useRef(null);
  const newFolderRef = useRef(null);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const toggleMenu = (event) => {
    event.preventDefault();
    setMenu(!menu);
  };

  const toggleNewFile = () => {
    setIsOpen(true)
    setMenu(false)
    setNewFile(true)
  }

  const toggleNewFolder = () => {
    setIsOpen(true)
    setMenu(false)
    setNewFolder(true)
  }

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenu(false);
    }
    if (newFileRef.current && !newFileRef.current.contains(event.target)) {
      setNewFile(false);
    }
    if (newFolderRef.current && !newFolderRef.current.contains(event.target)) {
      setNewFolder(false);
    }
  };

  const createFile = (name) => {
    const path = `${directory.path}/${name}`
    create(path)
    directory.children.push({
      name: name,
      path: path,
      isDir: false,
      children: [],
    })
    newFileRef.current.value = ""
    setNewFile(false)
  }

  const handleFileKeys = (e) => {
    if(e.key == 'Enter'){
      createFile(newFileRef.current.value)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={{ marginLeft: "20px" }} className="relative">
      <div
        onClick={toggleOpen}
        onContextMenu={toggleMenu}
        style={{ cursor: "pointer" }}
        className="flex items-center cursor-pointer hover:bg-gray-700"
      >
        {isOpen ? <FaAngleDown /> : <FaAngleRight />}
        {directory.name}
      </div>
      {menu ? (
        <div
          ref={menuRef}
          className="absolute right-0 w-40 py-1 px-2 border border-white rounded-lg border-opacity-50 z-10 bg-gray-800"
        >
          <p className="p-2 border-b border-white border-opacity-50 flex items-center gap-2">
            <HiOutlinePencilAlt />
            Rename
          </p>
          <p className="p-2 flex items-center gap-2" onClick={toggleNewFile}>
            <FiFilePlus />
            Create File
          </p>
          <p className="p-2 border-b border-white border-opacity-50 flex items-center gap-2" onClick={toggleNewFolder}>
            <FiFolderPlus />
            Create Folder
          </p>
          <p className="p-2 text-red-500 flex items-center gap-2">
            <IoTrashOutline />
            Delete Folder
          </p>
        </div>
      ) : null}
      {newFile ? <div className="flex items-center ml-5 mt-2"><FaFile/><input ref={newFileRef} onKeyDown={handleFileKeys} className="bg-transparent border border-white"/></div> : null}
      {newFolder ? <input ref={newFolderRef} className="mt-2 ml-5 bg-transparent border border-white" /> : null}
      {isOpen && directory.children && (
        <div>
          {directory.children.map((child, index) =>
            child.isDir ? (
              <Directory key={index} directory={child} create={create} />
            ) : (
              <File key={index} file={child} getFile={getFile} />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Directory;
