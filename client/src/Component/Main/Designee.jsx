import React, { useState, useEffect } from 'react'
import axios from "axios"
import { API_URL } from "../utils/Apiconfig";
import { useParams } from 'react-router-dom';
import editicon from "../../assets/editicon.png";
import {Eye, FilePenLine, Trash2} from "lucide-react"
// Format the date to a user-friendly format
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // for 24-hour format
    };
    return date.toLocaleString('en-US', options);
};
function Designee() {
    const [designee, setDesignee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sharedFiles, setSharedFiles] = useState([]);
    const { email } = useParams();  // Extract the email from URL parameters
    const [popup, setPopup] = useState(null);
    // console.log("this is designess and files", designee);
      // Function to update access for a file or voice
      const updateAccess = async (fileId, voiceId, toEmailId, editAccess) => {
        try {
          // Construct the request body dynamically
          const requestBody = { to_email_id: toEmailId, edit_access: editAccess };
    
          if (fileId) {
            requestBody.file_id = fileId;
          }
          if (voiceId) {
            requestBody.voice_id = voiceId;
          }
          const token = localStorage.getItem("token");
          const response = await fetch(`${API_URL}/api/designee/update-access`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });
    
          const data = await response.json();
    
          if (response.ok) {
            // alert('Access updated successfully!');
            fetchSharedFiles();
    
          } else {
            alert(data.message || 'Failed to update access');
          }
        } catch (error) {
          console.error('Error:', error);
          // alert('An error occurred while updating access');
        }
      };
        const removefileAccess = async (toEmailId, fileId, voiceId) => {
          try {
            // Construct the request body dynamically
            const requestBody = { to_email_id: toEmailId };
      
            if (fileId) {
              requestBody.file_id = fileId;
            }
            if (voiceId) {
              requestBody.voice_id = voiceId;
            }
      
            const token = localStorage.getItem("token");
      
            const response = await fetch(`${API_URL}/api/designee/delete-voice-file-data`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
            });
      
            const data = await response.json();
      
            if (response.ok) {
              // alert('Access removed successfully!');
              fetchSharedFiles();
              // Optionally update the UI here (e.g., removing the file or voice from the list)
            } else {
              // alert(data.message || 'Failed to remove access');
            }
          } catch (error) {
            console.error('Error:', error);
            // alert('An error occurred while removing access');
          }
        };
        // Fetch the designee's shared files
        const fetchSharedFiles = async () => {
            try {
                setLoading(true);
                
                // Get the token from localStorage (or wherever it's stored)
                const token = localStorage.getItem("token");
                
                if (!token) {
                    throw new Error("Authentication token not found");
                }
                // Make the API call with the Authorization header
                const response = await axios.post(
                    `${API_URL}/api/designee/particular-user-shared-files`,
                    { to_email_id: email },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,  // Include the token in the header
                        }
                    }
                );
                const { designee, sharedFiles } = response.data;
                setDesignee(designee);  // Set the designee's details
                setSharedFiles(sharedFiles);  // Set the shared files data
                console.log("ytdwgusiuygdisofuygd",sharedFiles)
               
            } catch (error) {
                console.error("Error fetching shared files:", error);
                if (error.response && error.response.status === 401) {
                    alert("You are not authorized. Please log in.");
                }
            } finally {
                setLoading(false);
                
            }
        };
    useEffect(() => {
        fetchSharedFiles();
        setSharedFiles([]);
    }, [email]);  // Re-run the effect if email changes
    if (loading) {
        return <div>Loading...</div>;
    }
    const togglePopup = (index) => {
        if(popup === index){
            setPopup(null);
        }else{
            setPopup(index);
        }
    }
    return (
        <div className='p-4'>
  {designee ? (
    <div>
      <div className='font-semibold text-xl ml-2 '>
        <span>{designee.name}</span>
      </div>
      <div className="mt-2 bg-white rounded hidden md:flex max-h-[80vh] pb-[20px] overflow-y-scroll">
        <table className="min-w-full table-auto">
          <thead className="sticky top-0 z-50">
            <tr className="bg-gray-100 text-left text-[0.8rem] border-black">
              <th className="p-2 md:p-4 font-medium text-[#667085] text-sm w-[30%]">
                File Name
              </th>
              <th className="p-2 md:p-4 font-medium text-[#667085] text-sm w-[30%]">
                Date Upload
              </th>
              <th className="p-2 md:p-4 font-medium text-[#667085] text-sm w-[20%]">
                Access
              </th>
              <th className="p-2 md:p-4 font-medium text-[#667085] text-sm">
                Modify
              </th>
            </tr>
          </thead>
          <tbody>
  {sharedFiles.length > 0 ? (
    sharedFiles.map((file, index) => (
      <React.Fragment key={index}>
        {/* Display Files */}
        {file.files?.map((singleFile, fileIndex) => (
          <tr key={`file-${index}-${fileIndex}`} className="border-t-2 border-gray-200 relative">
            <td className="p-0 md:p-4 flex items-center gap-0 md:gap-2">
              {singleFile.file_id?.file_name || "Unknown"}
            </td>
            <td className="px-4 py-2">
              {formatDate(singleFile.file_id?.date_of_upload) || "Unknown"}
            </td>
            <td className="px-4 py-2">{singleFile.access || "Unknown"}</td>
            <td className="px-4 py-2">
              <img
                className="w-5 h-5 cursor-pointer"
                src={editicon}
                alt="Edit Icon"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePopup(`${index}-file-${fileIndex}`);
                }}
              />
            </td>
            {popup === `${index}-file-${fileIndex}` && (
              <div className="absolute right-10 mt-14 bg-white border border-gray-300 rounded-lg shadow-xl z-20 w-40">
                <ul className="text-sm">
                  <li
                    className="flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                    onClick={() => updateAccess(singleFile.file_id._id, null, designee.email, 'view')}
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    Only View
                  </li>
                  <li
                    className="flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                    onClick={() => updateAccess(singleFile.file_id._id, null, designee.email, 'edit')}
                  >
                    <FilePenLine className="h-5 w-5 mr-2" />
                    Edit Access
                  </li>
                  <li
                    className="flex px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 hover:text-red-600"
                    onClick={() => removefileAccess(designee.email, singleFile.file_id._id, null)}
                  >
                    <Trash2 className="h-5 w-5 mr-2" />
                    Remove Access
                  </li>
                </ul>
              </div>
            )}
          </tr>
        ))}
        {/* Display Voices */}
        {file.voices?.map((singleVoice, voiceIndex) => (
          <tr key={`voice-${index}-${voiceIndex}`} className="border-t-2 border-gray-200 relative">
            <td className="p-0 md:p-4 flex items-center gap-0 md:gap-2">
              {singleVoice.voice_id?.voice_name || "Unknown"}
            </td>
            <td className="px-4 py-2">
              {formatDate(singleVoice.voice_id?.date_of_upload) || "Unknown"}
            </td>
            <td className="px-4 py-2">{singleVoice.access || "Unknown"}</td>
            <td className="px-4 py-2">
              <img
                className="w-5 h-5 cursor-pointer"
                src={editicon}
                alt="Edit Icon"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePopup(`${index}-voice-${voiceIndex}`);
                }}
              />
            </td>
            {popup === `${index}-voice-${voiceIndex}` && (
              <div className="absolute right-10 mt-14 bg-white border border-gray-300 rounded-lg shadow-xl z-20 w-40">
                <ul className="text-sm">
                  <li
                    className="flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                    onClick={() => updateAccess(null, singleVoice.voice_id._id, designee.email, 'view')}
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    Only View
                  </li>
                  <li
                    className="flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                    onClick={() => updateAccess(null, singleVoice.voice_id._id, designee.email, 'edit')}
                  >
                    <FilePenLine className="h-5 w-5 mr-2" />
                    Edit Access
                  </li>
                  <li
                    className="flex px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 hover:text-red-600"
                    onClick={() => removefileAccess(designee.email, null, singleVoice.voice_id._id)}
                  >
                    <Trash2 className="h-5 w-5 mr-2" />
                    Remove Access
                  </li>
                </ul>
              </div>
            )}
          </tr>
        ))}
      </React.Fragment>
    ))
  ) : (
    <tr>
      <td colSpan="4" className="px-4 py-2 text-center">
        No shared files or voices available
      </td>
    </tr>
  )}
</tbody>
        </table>
      </div>
    </div>
  ) : (
    <>
      <div className="mt-2 bg-white rounded hidden md:flex max-h-[80vh] pb-[20px] overflow-y-scroll">
        <table className='w-full'>
          <thead className="sticky top-0 z-50">
            <tr className="bg-gray-100 text-left text-[0.8rem] border-black">
              <th className="p-2 md:p-4 font-medium text-[#667085] text-sm">File Name</th>
              <th className="p-2 md:p-4 font-medium text-[#667085] text-sm">Date Upload</th>
              <th className="p-2 md:p-4 font-medium text-[#667085] text-sm">Sharing</th>
              <th className="p-2 md:p-4 font-medium text-[#667085] text-sm">Access</th>
            </tr>
          </thead>
          <tbody className='p-2 text-gray-500'>
            <tr>
              <td colSpan="4" className="text-center">No files available</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )}
</div>
    );
}
export default Designee;
