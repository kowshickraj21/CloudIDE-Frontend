import GoogleButton from '../components/googleButton'
import github from '../assets/github.svg'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
// eslint-disable-next-line react/prop-types
const Login = ({ setOpen }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem("user")){
      navigate('/console');
    }
  },[navigate])

  return (
    <div className=" absolute z-10 h-svh w-full bg-black bg-opacity-50 flex justify-center items-center">
        <div className="w-1/4 h-2/5 py-12 bg-white flex flex-col justify-evenly items-center rounded-md relative">
        <button className='absolute right-5 top-3 font-bold' onClick={() => setOpen()}>X</button>
        <GoogleButton />
        <p>or</p>
        <a href={`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}`} className="border-2 border-black px-5 py-2 flex items-center"><img src={github} alt="Google" className='pr-2'/> Continue with Github</a>
        </div>
        </div>
  )
}

export default Login