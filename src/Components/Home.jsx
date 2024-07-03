import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import DataTable from "./DataTable";
import { MdDeleteOutline } from "react-icons/md";
import toast from "react-hot-toast";
import BarLoader from "react-spinners/BarLoader";

function Home() {
  const urlBackend = import.meta.env.VITE_BACKEND_API;

  const [excelData, setExcelData] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [myData, setMyData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  // handle File
  const fileType = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "text/csv",
  ];
  const handleFile = async (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      // console.log(selectedFile.type);
      if (selectedFile && fileType.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
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
        const data = XLSX.utils.sheet_to_json(worksheet);
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
        toast.error("Please Upload File")
      }
    } catch (err) {
      console.log("error");
    }
    setLoading(false)
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
      console.log(err.meesge);
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
      const result = await axios.delete(`${urlBackend}/v1/deleteData/${id}`);
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
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <div className="w-[100%]  py-2 bg-blue-200 flex max-md:flex-col px-2  md:gap-2 justify-between items-center">
        <div className="flex md:w-[80%] max-md:w-[100%] items-center max-md:border-b max-md:pb-1">
          <span className="font-semibold  w-[100%]">AMAR APP</span>
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
        <div className="flex items-center w-[50%] max-md:w-[100%] max-md:mt-2 md:justify-end">
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
                <th className="py-2 px-4 border-b">Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr className="py-2 h-[80vh]">
                    <td></td>
                    <td></td>
                    <td></td>
                   
                    <td className="py-2"> <BarLoader color="blue" /></td>
                    <td></td>
                    <td></td>
                  </tr>
              )}
              {!loading &&
                myData &&
                myData?.length > 0 &&
                myData.map((data, index) => {
                  return (
                    <tr
                      className={`${
                        index % 2 === 0 ? "bg-white " : "bg-gray-100"
                      }  hover:bg-gray-200`}
                      key={index}
                    >
                      <td className="py-2 px-4 border-b  ">{data.SrNo}</td>
                      <td className="py-2 px-4 border-b  ">{data.ShopName}</td>
                      <td className="py-2 px-4 border-b  ">{data.Model}</td>
                      <td className="py-2 px-4 border-b  ">
                        {data.CameraSDCard}
                      </td>
                      <td className="py-2 px-4 border-b  ">
                        {data.DateOfDispatch}
                      </td>
                      <td className="py-2 px-4 border-b text-2xl text-red-500 hover:text-red-700 text-center ">
                        <MdDeleteOutline
                          className="cursor-pointer"
                          onClick={() => handleDelete(data)}
                        />
                      </td>
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

export default Home;
