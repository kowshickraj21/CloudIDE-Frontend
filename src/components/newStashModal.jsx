/* eslint-disable react/prop-types */
import axios from 'axios'
import { useRef } from 'react';
import { useState } from 'react'
import { IoCloseCircleOutline } from "react-icons/io5";

const NewStashModal = ({ User, close }) => {
  const [available,setAvailable] = useState(false);
  const nameInput = useRef(null)
  const imageInput = useRef(null)
  const portInput = useRef(null)

  const handleSubmit = async () => {
    console.log("Clicked")
      await axios.post(
          "http://localhost:3050/create",
          {
            name : nameInput.current.value,
            image: imageInput.current.value,
            owner: User.email,
            port: Number(portInput.current.value),
          }
      );
  }

  const handleAvailable = async (name) => {
    const stash = await axios.post(
      "http://localhost:3050/findStash",
      {
        name : name
      }
      )
    if(stash) setAvailable(true)
  }

  return (
    <div className="absolute top-0 left-0 flex justify-center items-center w-full h-svh bg-black bg-opacity-50">
        <div className="h-auto mb-10 w-1/3 bg-white shadow-2xl shadow-gray-600 relative">
        <button className='absolute right-1 top-1' onClick={close}><IoCloseCircleOutline  className='text-3xl'/></button>
        <div className="flex flex-col w-2/3 m-auto py-10 gap-10 ">
        <h2 className='m-auto text-xl font-semibold my-2'>Create a Stash</h2>
          <select name="image" id="image" className="border-2 " ref={imageInput} defaultValue={"node"}>
            <option value="node">NodeJS</option>
            <option value="python">Python</option>
          </select>
          <div className='flex gap-2 w-full'>
          <input type="text" className="border-2 w-full pl-2" placeholder="Choose a Name" ref={nameInput}/>
          <button onClick={() => handleAvailable(nameInput.current.value)} className='underline'>Check Availability</button>
          </div>
          <input type="text" className="border-2 w-full pl-2" placeholder='Port Number' pattern="[1-9]{1}[0-9]{3}" ref={portInput}/>
          <button className="bg-green-600 text-white py-2" disabled={!available} onClick={() => handleSubmit()}>Create</button>
        </div>
        </div>
    </div>
  )
}

export default NewStashModal
