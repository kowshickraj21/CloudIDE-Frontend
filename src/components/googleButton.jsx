import { useGoogleLogin } from '@react-oauth/google'
import google from '../assets/google.svg'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const GoogleButton = () => {
    const navigate = useNavigate();
    const login = useGoogleLogin({
        onSuccess: async (res) => {
            try {
                const user = await axios.get(
                    `http://localhost:3050/auth/google/callback?code=${res.access_token}`
                );
                localStorage.setItem("user",user.data);

                navigate("/console");
            } catch (error) {
                console.error("Error during Google login", error);
            }
        }
    });
  return (
    <div>
        <button className="border-2 border-black px-5 py-2 flex items-center" onClick={() => login()}><img src={google} alt="Google" className='pr-2'/> Continue with Google</button>
    </div>
  )
}

export default GoogleButton