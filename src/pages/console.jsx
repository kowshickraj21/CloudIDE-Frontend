import { useState } from "react";
import Navbar from "../components/navbar"
import NewStashModal from "../components/newStashModal";
const Console = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [newStashModal, setNewStashModal] = useState(false);
  return (
    <div className="bg-black bg-opacity-85 h-svh text-white">
        <Navbar User={user}/>
      <div className="w-full px-20 mt-10">
        <div className="flex justify-between py-8 items-center">
        <h2 className="font-semibold text-4xl">Your Stashes</h2>
        <button className="bg-green-600 text-white px-5 py-2" onClick={() => {setNewStashModal(true)}}>Create Stash</button>
        {newStashModal ? <NewStashModal User={user} close={() => setNewStashModal(false)}/>:null}
        </div>
      <table className="w-11/12 m-auto text-center rounded-md">
        <tbody>
        <tr className="bg-gray-500 border-2 h-10">
          <td>S.No</td>
          <td>Name</td>
          <td>Base</td>
        </tr>
        <tr className="border-b-2 h-10">
        <td>1</td>
          <td>check</td>
          <td>nodejs</td>
        </tr>
        <tr className="border-b-2 h-10">
        <td>1</td>
          <td>check</td>
          <td>nodejs</td>
        </tr>
        <tr className="border-b-2 h-10">
        <td>1</td>
          <td>check</td>
          <td>nodejs</td>
        </tr>
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default Console
