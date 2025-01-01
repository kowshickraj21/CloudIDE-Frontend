import { useState } from "react";
import Navbar from "../components/navbar"
import NewStashModal from "../components/newStashModal";
const Console = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [newStashModal, setNewStashModal] = useState(false);
  return (
    <div>
        <Navbar User={user}/>
      <div className="w-full px-10 mt-10">
        <button className="bg-green-600 text-white px-5 py-2" onClick={() => {setNewStashModal(true)}}>Create Stash</button>
        {newStashModal ? <NewStashModal User={user} close={() => setNewStashModal(false)}/>:null}
      <table className="w-full text-center rounded-md">
        <tbody>
        <tr className="bg-gray-100 border-2 h-10">
          <td><input type="checkbox" name="" id="" /></td>
          <td>Name</td>
          <td>Base</td>
        </tr>
        <tr className="border-b-2 h-10">
        <td><input type="checkbox" name="" id="" /></td>
          <td>check</td>
          <td>nodejs</td>
        </tr>
        <tr className="border-b-2 h-10">
        <td><input type="checkbox" name="" id="" /></td>
          <td>check</td>
          <td>nodejs</td>
        </tr>
        <tr className="border-b-2 h-10">
        <td><input type="checkbox" name="" id="" /></td>
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
