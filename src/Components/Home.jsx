import React, { useEffect, useState } from "react";
import BarLoader from "react-spinners/BarLoader";
import { Link ,useNavigate} from "react-router-dom";
function Home() {
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate =useNavigate()
  const handleLogOut=async()=>{
     localStorage.removeItem("userData")
     window.location.href = "/";
  }
  useEffect(() => {
    setLoading(true);
    const user1 = localStorage.getItem("userData");
    const user = JSON.parse(user1)
    setUserInfo(user);
    if (user?.role === "admin") {
      setIsAdmin(true);

    }else{
      navigate('/')
    }
    setLoading(false);
  },[]);
  return (
    <>
      <div className="w-[100%] h-screen flex flex-col bg-blue-100">
        <div className="w-[100%]  py-2 bg-blue-200 flex max-md:flex-col px-2  md:gap-2 justify-between items-center">
          <span className="text-left text-2xl font-semibold cursor-pointer" onClick={()=>navigate("/")}>Imou</span>
        </div>
        <div className="w-[100%] h-[90vh] flex max-md:flex-col gap-4 justify-center items-center ">
          {loading && <BarLoader color="blue" />}
          {!loading && userInfo && 
              <Link to={"/Orders"} className="p-2 px-4 bg-blue-500 text-white hover:bg-blue-700  rounded-md  ">
                View Data
              </Link>
          }
          {!loading && !userInfo && (
       
              <Link to={"/login"} className="p-2 px-4  bg-blue-500 text-white hover:bg-blue-700  rounded-md  ">
                Login
              </Link>
          
          )}
          {
            !loading && isAdmin &&
            <Link to={'/Users'} className="p-2 px-4  bg-blue-500 text-white hover:bg-blue-700  rounded-md  " >
               View Users
            </Link>
          }{!loading && userInfo &&
          <button onClick={handleLogOut} className="p-2 px-4  bg-blue-500 text-white hover:bg-blue-700  rounded-md  ">
            Logout
          </button>}
        </div>
      </div>
    </>
  );
}

export default Home;
