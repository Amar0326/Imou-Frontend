import React, { useEffect, useState } from "react";
import BarLoader from "react-spinners/BarLoader";
import BeatLoader from "react-spinners/BeatLoader";
import axios from "axios";
import { IoIosAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
function UserData() {
  const urlBackend = import.meta.env.VITE_BACKEND_API;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [myData, setMyData] = useState([]);
  const [userInfo, setUserInfo] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fetchData = async (user) => {
    setLoading(true);
    try {
      const data = {
        id: user?._id,
      };
      const result = await axios.post(
        `${urlBackend}/v1/admin/getAllUsers`,
        data
      );
      console.log("result", result.data.allUsers);
      if (result.data.success) {
        setMyData(result.data.allUsers);
      }
      setLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };
  const handleAddUser = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const data = {
        username: userName,
        password: password,
      };
      console.log(data);
      const response = await axios.post(`${urlBackend}/v1/auth/signUp`, data);
      console.log("Datat :: ", response);
      if (response.data.success) {
        toast.success("User Created Successfully");
        setIsModalOpen(false);
      } else {
        toast.error(response.data.message);
      }
      setIsLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    const user1 = localStorage.getItem("userData");
    const user = JSON.parse(user1);
    if (!user || user?.role != "admin") {
      navigate("/login");
    } else if (user?.role === "admin") {
      setUserInfo(user);
      fetchData(user);
      setLoading(false);
    }
  }, [isModalOpen]);

  return (
    <div className="w-[100%] h-screen">
      <div className="flex justify-between items-center w-[100%] bg-blue-200 p-2 pr-5">
        <span className="text-2xl font-semibold cursor-pointer" onClick={()=>navigate("/")} >Imou</span>
        <button className="p-2 px-4 font-semibold rounded-md flex items-center bg-blue-500 text-white hover:bg-blue-700 ">
          <IoIosAdd size={32} />
          <span className="" onClick={() => setIsModalOpen(true)}>
            Add User
          </span>
        </button>
      </div>
      <div className="w-[100%] px-4 pt-2">
        <div className="overflow-x-auto h-[90vh]">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="sticky top-0 bg-gray-300 text-left">
              <tr className="bg-gray-00">
                <th className="py-2 px-4 border-b">SrNo</th>
                <th className="py-2 px-4 border-b">Username</th>
                <th className="py-2 px-4 border-b">Password</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr className="py-2 h-[80vh]">
                  <td></td>

                  <td className="py-2">
                    {" "}
                    <BarLoader color="blue" />
                  </td>
                  <td></td>
                </tr>
              )}
              {!loading &&
                myData &&
                myData?.length > 0 &&
                myData?.map((data, index) => {
                  return (
                    <tr
                      className={`${
                        index % 2 === 0 ? "bg-white " : "bg-gray-100"
                      }  hover:bg-gray-200`}
                      key={index}
                    >
                      <td className="py-2 px-4 border-b  ">{index + 1}</td>
                      <td className="py-2 px-4 border-b  ">{data.username}</td>
                      <td className="py-2 px-4 border-b  ">{data.password}</td>
                    </tr>
                  );
                })}
              {!loading && myData?.length === 0 && (
                <tr className="py-2 h-[80vh]">
                  <td></td>

                  <td className="py-2"> No Data Found</td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${
            isModalOpen ? "" : "hidden"
          }`}
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-lg shadow-lg p-6 z-10 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Add User</h2>
            <form onSubmit={handleAddUser} className="flex flex-col gap-2 mt-4">
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
              <div className="flex mt-4 gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-blue-300 text-blue-700 px-4 py-2 rounded-md"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white hover:bg-blue-700  px-4 p-2  rounded-md"
                >
                  {isLoading ? <BeatLoader color="#dbdeed" /> : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserData;
