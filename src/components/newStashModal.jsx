import axios from 'axios'

const NewStashModal = () => {
  const handleSubmit = async () => {
    console.log("Clicked")
      const user = await axios.post(
          "http://localhost:3050/start"
      );
      console.log(user.data)
}
  return (
    <div className="absolute top-0 left-0 flex justify-center items-center w-full h-svh bg-black bg-opacity-50">
        <div className="h-1/3 mb-10 w-1/4 bg-white">

        <div className="flex flex-col w-1/2 m-auto pt-10 gap-5">
          <select name="image" id="image" className="border-2">
            <option value="nodejs">NodeJS</option>
            <option value="python">Python</option>
          </select>
          <input type="text" className="border-2" placeholder="Select a Name"/>
          <button className="bg-green-600 text-white py-2" onClick={() => handleSubmit()}>Create</button>
        </div>
        </div>
    </div>
  )
}

export default NewStashModal
