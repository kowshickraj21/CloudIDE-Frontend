import Navbar from "../components/navbar"
const Console = () => {
  return (
    <div>
        <Navbar />
      <div className="w-full px-10 mt-10">
      <table className="w-full text-center rounded-md">
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
      </table>
      </div>
    </div>
  )
}

export default Console
