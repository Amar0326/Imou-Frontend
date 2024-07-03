import React,{useEffect} from 'react'
import axios from 'axios'
function DataTable() {
    const urlBackend = import.meta.env.VITE_BACKEND_API;
    const fetchData = async()=>{
        try{
         const result=await axios.get(`${urlBackend}/v1/getFileData`)
         console.log('result',result);
        }catch(err){
            console.log(err.meesge)
        }
    }
  useEffect(()=>{
    fetchData()
  },[])
  return (
    <div className='w-[100%] px-4'>
      <div className='overflow-x-auto'>
        <table className="min-w-full bg-white border border-gray-200">
            <thead >
                <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b">SrNo</th>
                    <th className="py-2 px-4 border-b">ShopName</th>
                    <th className="py-2 px-4 border-b">Model</th>
                    <th className="py-2 px-4 border-b">CameraSDCard</th>
                    <th className="py-2 px-4 border-b">DateOfDispatch</th>
                </tr>
            </thead>
            <tbody>
                 <tr className='bg-gray-200 text-center'>
                    <td className="py-2 px-4 border-b  ">1111111</td>
                    <td className="py-2 px-4 border-b  ">1111111</td>
                    <td className="py-2 px-4 border-b  ">1111111</td>
                    <td className="py-2 px-4 border-b  ">1111111</td>
                    <td className="py-2 px-4 border-b  ">1111111</td>
                   
                 </tr>
                 
            </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
