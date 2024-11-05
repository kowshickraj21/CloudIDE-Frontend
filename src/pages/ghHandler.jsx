import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"
import axios from "axios";
const GhHandler = () => {
    const navigate = useNavigate();
    const [ searchParams ] = useSearchParams();
    const code = searchParams.get("code");
    
    async function handleReq(code){
    try {
        const token = await axios.get(
            `http://localhost:3050/auth/github/callback?code=${code}`
        );
        localStorage.setItem("authToken",token.data);
        return true;

    } catch (error) {
        console.error("Error during Google login", error);
        return false;
    }
}  

    useEffect(() => {
        if(localStorage.getItem("authToken")){
            navigate("/");
        }
        async function handleGH(){
            if(code){
            const res = await handleReq(code);
            if(res){
                navigate("/");
            }else{
                navigate("/login")
            }
        }
        navigate("/login");
        }
        handleGH();
    },[code, navigate, searchParams])
    
  return (
    <div className="flex justify-center items-center h-svh">
      Loading...
    </div>
  )
}

export default GhHandler