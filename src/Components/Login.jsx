import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
function Login() {
  const urlBackend = import.meta.env.VITE_BACKEND_API;
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    const data = {
      username: userName,
      password: password,
    };
    console.log(data);
    const response = await axios.post(`${urlBackend}/v1/auth/login`, data);
    console.log("Datat :: ", response);
    if (response.data.success) {
      localStorage.setItem("userData",JSON.stringify(response.data.user));
      toast.success("LoggedIn successfully");
      navigate("/Orders");
    } else {
      toast.error(response.data.message);
    }
  };
  return (
    <div className="w-[100%] h-screen flex justify-center items-center p-2">
      <div className=" shadow-md p-4 w-[100%] md:w-[60%] rounded-md border">
        <span className="text-center text-2xl underline">Login</span>
        <form onSubmit={handleLogin} className="flex flex-col gap-2 mt-4">
          <label>Username</label>
          <input
            value={userName}
            type="text"
            placeholder="Enter your Username"
            className="focus:outline-none border border-blue-500 rounded-md p-2"
            onChange={(e) => setUserName(e.target.value)}
          />
          <label>Password</label>
          <input
            value={password}
            type="password"
            placeholder="Enter your Password"
            className="focus:outline-none border border-blue-500 rounded-md p-2"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white hover:bg-blue-700  w-[100%] px-4 p-2 mt-4 rounded-md"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
