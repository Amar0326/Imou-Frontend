import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import DataTable from "./DataTable";
import { MdDeleteOutline } from "react-icons/md";
import toast from "react-hot-toast";
import BarLoader from "react-spinners/BarLoader";
import { Link, useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
function OrderData() {
  const urlBackend = import.meta.env.VITE_BACKEND_API;

  const [excelData, setExcelData] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [myData, setMyData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [userInfo, setUserInfo] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  // handle File
  const fileType = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "text/csv",
  ];
  function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  }
  function sanitizeData(data) {
    return data.map((item) => ({
      SrNo: item.SrNo,
      ShopName: item.ShopName,
      Model: item.Model,
      CameraSDCard: item.CameraSDCard,
      DateOfDispatch: item.DateOfDispatch,
    }));
  }
  const exportToExcel = () => {
    const sanitizedData = sanitizeData(myData);

    const ws = XLSX.utils.json_to_sheet(sanitizedData);
    const wb = { Sheets: { myData: ws }, SheetNames: ["myData"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    const currentDateTime = getCurrentDateTime();
    const fileName = `ImouOrders_${currentDateTime}.xlsx`;
    saveAs(data, fileName);
  };
  const handleFile = async (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      // console.log(selectedFile.type);
      if (selectedFile && fileType.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
          console.log(e.target.result);
        };
      } else {
        setExcelFile(null);
      }
    } else {
      console.log("plz select your file");
    }
  };
  const handleExcelSubmit = async (e) => {
    e.preventDefault();
    console.log("excelData");
    setLoading(true);
    try {
      if (excelFile !== null) {
        const workbook = XLSX.read(excelFile, { type: "buffer" });
        console.log("Hello");
        const worksheetName = workbook.SheetNames[0];
        console.log("Hello 2");
        const worksheet = workbook.Sheets[worksheetName];
        console.log("Hello 3");
        const data = XLSX.utils.sheet_to_json(worksheet, {
          raw: true,
          cellDates: true,
          dateNF: "dd-mm-yyyy",
        });

        console.log("Hello 4", data);

        // Manually check and format the DateOfDispatch field
        data.forEach((row) => {
          if (row.DateOfDispatch && typeof row.DateOfDispatch === "number") {
            const date = new Date(
              Math.round((row.DateOfDispatch - 25569) * 86400 * 1000)
            );
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            row.DateOfDispatch = `${day}-${month}-${year}`;
          }
        });
        console.log("Hello3 4", data);
        setExcelData(data);
        const response = await axios.post(`${urlBackend}/v1/uploadFile`, {
          excelData: JSON.stringify(data),
        });
        console.log(response);
        if (response.data.success) {
          //   toast.success("Excel uploaded  Successfully!", {
          //     autoClose: 2000,
          //     position: "bottom-center",
          //   });
          console.log("Success", response.data);
          toast.success("Excel Uploaded Successfully.");
        } else {
          //   toast.error(response.data.message, {
          //     autoClose: 2000,
          //     position: "bottom-center",
          //   });
          console.log("errorr");
        }
        fetchData();
        setLoading(false);
      } else {
        setExcelData(null);
        toast.error("Please Upload File");
      }
    } catch (err) {
      console.log("error");
    }
    setLoading(false);
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await axios.get(`${urlBackend}/v1/getFileData`);
      console.log("result", result);
      if (result.data.success) {
        setMyData(result.data.data);
      }
      setLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };
  const handleSearchChange = async (e) => {
    setSearch(e.target.value);
    let searchValue = e.target.value;
    console.log(searchValue);
    try {
      const result = await axios.post(`${urlBackend}/v1/searchData`, {
        searchQuery: searchValue,
      });
      console.log("search results", result);
      if (result.data.success) {
        setMyData(result.data.data);
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  const handleDelete = async (data) => {
    setLoading(true);
    try {
      const id = data?._id;
      const result = await axios.delete(
        `${urlBackend}/v1/admin/deleteData/${id}`
      );
      console.log("Deleted Data", result);
      if (result.data.success) {
        toast.success(`${data.SrNo} Deleted Successfully.`);
      }
      fetchData();
      setLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };
  const fetchUserDetails = async (user) => {
    try {
      const data = {
        userId: user?._id,
      };
      const result = await axios.post(`${urlBackend}/v1/auth/getUser`, data);
      console.log("result", result);
      if (result.data.success) {
        setUserInfo(result?.data?.user);
      }
      setLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    setLoading(true);
    const user1 = localStorage.getItem("userData");
    const user = JSON.parse(user1);
    if (!user) {
      navigate("/login");
    }
    setUserInfo(user);
    if (user?.role === "admin") {
      setIsAdmin(true);
    }
    fetchData();
    fetchUserDetails(user);
    setLoading(false);
  }, []);
  return (
    <>
      <div className="w-[100%]  py-2 bg-blue-200 flex max-md:flex-col px-2  md:gap-2 justify-between items-center">
        <div className="flex md:w-[80%] max-md:w-[100%] items-center max-md:border-b max-md:pb-1">
          <span
            className="font-semibold text-2xl  w-[100%] cursor-pointer"
            onClick={() => navigate("/")}
          >
            Imou
          </span>
          <div className=" w-[100%]">
            <input
              type="text"
              className="w-[100%] py-1 px-2 rounded-xl focus:outline-none border focus:border-blue-500"
              placeholder="Search Here"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="flex items-center w-[50%] max-md:w-[100%] max-md:mt-2 md:justify-end gap-5">
          <input
            type="file"
            className="cursor-pointer "
            onChange={handleFile}
          />
          <button
            className="px-4 py-1 bg-blue-500 text-white rounded-md"
            onClick={handleExcelSubmit}
          >
            Submit
          </button>
          <button
            className="px-4 py-1 bg-blue-500 text-white rounded-md"
            onClick={exportToExcel}
          >
            Download
          </button>
        </div>
      </div>
      <div className="w-[100%] px-4 pt-2">
        <div className="overflow-x-auto h-[90vh]">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="sticky top-0 bg-gray-300 text-left">
              <tr className="bg-gray-00">
                <th className="py-2 px-4 border-b">SrNo</th>
                <th className="py-2 px-4 border-b">ShopName</th>
                <th className="py-2 px-4 border-b">Model</th>
                <th className="py-2 px-4 border-b">CameraSDCard</th>
                <th className="py-2 px-4 border-b">DateOfDispatch</th>
                {userInfo?.role === "admin" && (
                  <th className="py-2 px-4 border-b">Delete</th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr className="py-2 h-[80vh]">
                  <td></td>
                  <td></td>
                  <td></td>

                  <td className="py-2">
                    {" "}
                    <BarLoader color="blue" />
                  </td>
                  <td></td>
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
                      <td className="py-2 px-4 border-b  ">{data?.SrNo}</td>
                      <td className="py-2 px-4 border-b  ">{data?.ShopName}</td>
                      <td className="py-2 px-4 border-b  ">{data?.Model}</td>
                      <td className="py-2 px-4 border-b  ">
                        {data?.CameraSDCard}
                      </td>
                      <td className="py-2 px-4 border-b  ">
                        {data?.DateOfDispatch}
                      </td>
                      {userInfo?.role === "admin" && (
                        <td className="py-2 px-4 border-b text-2xl text-red-500 hover:text-red-700 text-center ">
                          <MdDeleteOutline
                            className="cursor-pointer"
                            onClick={() => handleDelete(data)}
                          />
                        </td>
                      )}
                    </tr>
                  );
                })}
              {!loading && myData?.length === 0 && (
                <tr className="py-2 h-[80vh]">
                  <td></td>
                  <td></td>
                  <td></td>

                  <td className="py-2"> No Data Found</td>
                  <td></td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default OrderData;
