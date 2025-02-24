import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { API_URL } from "../utils/Apiconfig";
import { useParams } from "react-router-dom";
import editicon from "../../assets/editicon.png";
import { EllipsisVertical, Eye, FilePenLine, Trash2, X } from "lucide-react";
// Format the date to a user-friendly format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // for 24-hour format
  };
  return date.toLocaleString("en-US", options);
};
function Designee({ searchQuery }) {
  const [designee, setDesignee] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [loading, setLoading] = useState(true);
  const popupRef = useRef(null);
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [sharedFiles, setSharedFiles] = useState([]);
  const { email } = useParams(); // Extract the email from URL parameters
  const [popup, setPopup] = useState(null);
  const filteredSharedFiles = sharedFiles.map((file) => ({
    ...file,
    files: file.files?.filter((singleFile) =>
      singleFile.file_id?.file_name?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(file => file.files?.length > 0);
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
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        // alert('Access updated successfully!');
        fetchSharedFiles();
      } else {
        alert(data.message || "Failed to update access");
      }
    } catch (error) {
      // console.error("Error:", error);
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

      const response = await fetch(
        `${API_URL}/api/designee/delete-voice-file-data`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // alert('Access removed successfully!');
        fetchSharedFiles();
        // Optionally update the UI here (e.g., removing the file or voice from the list)
      } else {
        // alert(data.message || 'Failed to remove access');
      }
    } catch (error) {
      // console.error("Error:", error);
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
            Authorization: `Bearer ${token}`, // Include the token in the header
          },
        }
      );
      const { designee, sharedFiles } = response.data;
      setDesignee(designee); // Set the designee's details
     
      setSharedFiles(sharedFiles); // Set the shared files data
     
    } catch (error) {
      // console.error("Error fetching shared files:", error);
      if (error.response && error.response.status === 401) {
        alert("You are not authorized. Please log in.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchFileContent = async (fileId) => {
    try {
      setLoading(true);
      setError("");
      
      const response = await axios.post(`${API_URL}/api/view-file-content`, {
        fileId: fileId,
      });

   

      const { file_name, file_url, file_type } = response.data;

      if (!file_url) {
        throw new Error("File URL is missing from the response.");
      }

      setFileData({
        fileName: file_name || "Unknown",
        mimeType: file_type || "Unknown",
        fileUrl: file_url,
      });

      setShowOverlay(true); // Show overlay after fetching file details
    } catch (err) {
      // console.error("Error fetching file content:", err);
      setError(
        err.response?.data?.message ||
        "An unexpected error occurred while fetching the file content."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderFileContent = () => {
    if (!fileData || !fileData.fileUrl) return null;

    const { mimeType, fileUrl } = fileData; // Destructuring to get mimeType and fileUrl from state



    // Handle Image files (e.g., PNG, JPG, SVG)

    if (
      mimeType.startsWith("image/") || // Covers common image types
      mimeType === "image/jpeg" ||
      mimeType === "image/jpg" ||
      mimeType === "image/png" ||
      mimeType === "jpg" || // Specific check for 'jpg'
      mimeType === "jpeg" || // Specific check for 'jpeg'
      mimeType === "png" ||
      mimeType === "image/svg+xml"
    ) {
      return (
        <div>
          <img
            src={fileUrl}
            alt="file content"
            style={{ width: "100%", maxHeight: "500px" }}
            onError={(e) => {
              // console.error("Error loading image:", e);

              e.target.src = "https://via.placeholder.com/500"; // Fallback if image fails to load
            }}
          />
        </div>
      );
    }

    // Handle PDF files

    if (mimeType === "application/pdf" || mimeType === "pdf") {
      return (
        <iframe
          src={`${fileUrl}#toolbar=0`}
          title="PDF Document"
          style={{ width: "90vw", height: "90vh", border: "none" }}
        />
      );
    }

    // Handle Word Documents (.docx) via Google Docs Viewer

    if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword" ||
      mimeType === "docx" // In case backend sends 'docx' instead of full MIME type
    ) {
      const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
        fileUrl
      )}&embedded=true`;

      return (
        <iframe
          src={googleDocsUrl}
          title="Word Document Viewer"
          style={{ width: "100vw", height: "100vh", border: "none" }}
          className="max-w-6xl overflow-hidden"
        />
      );
    }

    // Handle Excel files (e.g., .xlsx, .xls)

    if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      mimeType === "application/vnd.ms-excel"
    ) {
      return (
        <div>
          <p>Spreadsheet detected. Please download to view:</p>

          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            Download Spreadsheet
          </a>
        </div>
      );
    }

    // Default fallback for unsupported file types

    return <p>Unsupported file type for viewing.</p>;
  };

  const renderOverlay = () => (
    <div
      className="fixed top-0 left-0 min-w-[100vw] h-[100%] bg-[rgba(0,0,0,0.8)] text-white z-[1000] flex flex-col justify-center items-center"
      onContextMenu={(e) => e.preventDefault()} // Restrict right-click
    >
      <div className="h-10 px-10 w-screen pr-10  mb-4 fixed top-0 flex justify-end">

        {/*   
        <div className={`p-4 ${isEditing ? "" : "flex"}`}>
          <p >{filename}</p>
        </div> */}

        <div className="flex">

          <button
            className="text-white mt-2"
            onClick={() => setShowOverlay(false)}
          >
            <X />
          </button>
        </div>
      </div>
      <div className="text-black mt-4 flex justify-center items-center p-5 rounded-lg min-w-[20%] min-h-[90%] relative h-auto">
        {renderFileContent()}
      </div>
    </div>
  );


  const togglePopup = (id) => {
    setPopup((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopup(null)
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [popup]); // Add popup to dependencies to track changes properly

  useEffect(() => {
    fetchSharedFiles();
    setSharedFiles([]);
    setDesignee(null)
  }, [email]); // Re-run the effect if email changes
  if (loading) {
    return <div>Loading...</div>;
  }
  // const togglePopup = (index) => {
  //     if(popup === index){
  //         setPopup(null);
  //     }else{
  //         setPopup(index);
  //     }
  // }
  return (
    <div className="p-4">
      {designee ? (
        <div>
          <div className="font-semibold text-xl ml-2 mb-2 ">
            <span>{designee.name}</span>
            {/* <img
                          className="h-8 w-8 rounded-full object-cover"
                          src={designee.profile?.profilePicture
                             || "No pic"}
                          alt="File Icon"
            /> */}
          </div>
          <div className="mt-2 bg-white rounded hidden md:flex  max-h-[80vh]  pb-[100px] overflow-y-scroll">
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
                {filteredSharedFiles.length > 0 ? (
                  filteredSharedFiles.map((file, index) => (
                    <React.Fragment key={index}>
                      {/* Display Files */}
                      {file.files?.map((singleFile, fileIndex) => (
                        <tr
                          key={`file-${index}-${fileIndex}`}
                          className="border-t-2 border-gray-200 relative"
                        >
                          <td className="p-0 md:p-4 flex items-center gap-0 md:gap-2">
                            <span
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent dropdown close

                                fetchFileContent(
                                  singleFile.file_id
                                );
                              }}
                              className="text-sm cursor-pointer"
                            >{(singleFile.file_id?.file_name?.length > 20 ? singleFile.file_id.file_name.slice(0, 20) + "..." : singleFile.file_id?.file_name) || "Unknown"}
                            </span>
                          </td>
                          <td className=" text-sm p-0 md:p-4">
                            {formatDate(singleFile.file_id?.date_of_upload) ||
                              "Unknown"}
                          </td>
                          <td className="text-sm p-0 md:p-4">
                            {singleFile.access || "Unknown"}
                          </td>
                          <td className="text-sm p-0 md:p-4 relative">
                            <img
                              className="w-5 h-5 cursor-pointer"
                              src={editicon}
                              alt="Edit Icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                const rect = e.target.getBoundingClientRect();
                                setPopupPosition({ top: rect.top + window.scrollY + 30, left: rect.left - 150 });
                                togglePopup(`${index}-file-${fileIndex}`);
                              }}
                            />
                            {popup === `${index}-file-${fileIndex}` && (
                              <div


                                className="absolute mt-2 ml-[-60px] bg-white border border-gray-300 rounded-lg shadow-xl z-20 w-40"
                              >
                                <ul className="text-sm">
                                  <li
                                    ref={popupRef}
                                    className="flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                    onClick={() => {
                                      updateAccess(singleFile.file_id._id, null, designee.email, "view")
                                      
                                    }
                                    }
                                  >
                                    <Eye className="h-5 w-5 mr-2" />
                                    Only View
                                  </li>
                                  <li
                                    className="flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                    onClick={() =>
                                      updateAccess(singleFile.file_id._id, null, designee.email, "edit")
                                    }
                                  >
                                    <FilePenLine className="h-5 w-5 mr-2" />
                                    Edit Access
                                  </li>
                                  <li
                                    className="flex px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 hover:text-red-600"
                                    onClick={() =>
                                      removefileAccess(designee.email, singleFile.file_id._id, null)
                                    }
                                  >
                                    <Trash2 className="h-5 w-5 mr-2" />
                                    Remove Access
                                  </li>
                                </ul>
                              </div>
                            )}
                          </td>

                        </tr>
                      ))}
                      {/* Display Voices */}
                      {file.voices?.map((singleVoice, voiceIndex) => (
                        <tr
                          key={`voice-${index}-${voiceIndex}`}
                          className="border-t-2 border-gray-200 relative"
                        >
                          <td className="p-0 md:p-4 flex items-center gap-0 md:gap-2">
                            <span
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent dropdown close

                                fetchFileContent(
                                  singleVoice.voice_id
                                );
                              }}
                              className="bg-gray-100 rounded p-2 cursor-pointer"
                            >{(singleVoice.voice_id?.voice_name?.length > 20 ? singleVoice.voice_id.voice_name.slice(0, 20) + "..." : singleVoice.voice_id?.voice_name) || "Unknown"}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            {formatDate(singleVoice.voice_id?.date_of_upload) ||
                              "Unknown"}
                          </td>
                          <td className="px-4 py-2">
                            {singleVoice.access || "Unknown"}
                          </td>
                          <td className="px-4 py-2">
                            <img
                              className="w-5 h-5 cursor-pointer"
                              src={editicon}
                              alt="Edit Icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                const rect = e.target.getBoundingClientRect();
                                setPopupPosition({ top: rect.top + window.scrollY + 30, left: rect.left - 150 });
                                togglePopup(`${voiceIndex}`);
                              }}
                            />
                            {popup === `${voiceIndex}` && (
                              <div


                                className="absolute mt-2 ml-[-60px] bg-white border border-gray-300 rounded-lg shadow-xl z-20 w-40"
                              >
                                <ul className="text-sm">
                                  <li
                                    ref={popupRef}
                                    className="flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                    onClick={() => {
                                      updateAccess(null, singleVoice.voice_id._id, designee.email, "view")
                                      
                                    }
                                    }
                                  >
                                    <Eye className="h-5 w-5 mr-2" />
                                    Only View
                                  </li>
                                  <li
                                    className="flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                    onClick={() =>
                                      updateAccess(null, singleVoice.voice_id._id, designee.email, "edit")
                                    }
                                  >
                                    <FilePenLine className="h-5 w-5 mr-2" />
                                    Edit Access
                                  </li>
                                  <li
                                    className="flex px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 hover:text-red-600"
                                    onClick={() =>
                                      removefileAccess(designee.email, null, singleVoice.voice_id._id)
                                    }
                                  >
                                    <Trash2 className="h-5 w-5 mr-2" />
                                    Remove Access
                                  </li>
                                </ul>
                              </div>
                            )}
                          </td>

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

          <div className="md:hidden">
            {
              designee ? (
                <>
                  <div className="w-full max-h-[80vh] min-h-[50vh] pb-[100px] p-1 bg-white mt-2 overflow-y-scroll ">
                    {filteredSharedFiles.length > 0 ? (
                      filteredSharedFiles.map((file, index) => (
                        <React.Fragment key={index}>
                          {/* Display Files */}
                          {file.files?.map((singleFile, fileIndex) => (
                            <div
                              key={`file-${index}-${fileIndex}`}
                              className="border-t-2 flex justify-between border-gray-100 p-2 relative border-2 rounded-lg mb-4"
                            >
                              <div
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent dropdown close

                                  fetchFileContent(
                                    singleFile.file_id
                                  );
                                }}
                                className="flex flex-col">
                                <h1
                                  className=" flex items-center bg-gray-100 max-w-32 overflow-hidden p-2 rounded cursor-pointer gap-0 text-xl font-semibold">
                                  {(singleFile.file_id?.file_name && singleFile.file_id.file_name.length > 10) ?
                                    singleFile.file_id.file_name.substring(0, 10) + "..." :
                                    singleFile.file_id?.file_name || " "}

                                </h1>
                                <h1 className=" py-2">
                                  {formatDate(singleFile.file_id?.date_of_upload) ||
                                    "Unknown"}
                                </h1>
                              </div>
                              <div>
                                <h1 className="px-4 py-2 font-semibold text-gray-500">
                                  {singleFile.access || "Unknown"}
                                </h1>
                              </div>

                              <div className="flex flex-col">

                                <button className="px-4 py-2 relative">
                                  <button
                                    className="w-5 h-5 cursor-pointer"


                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const rect = e.target.getBoundingClientRect();
                                      setPopupPosition({ top: rect.top + window.scrollY + 30, left: rect.left - 150 });
                                      togglePopup(`${index}-file-${fileIndex}`);
                                    }}

                                  > <EllipsisVertical /></button>
                                  {popup === `${index}-file-${fileIndex}` && (
                                    <div
                                      ref={popupRef}
                                      // style={{ top: popupPosition.top, left: popupPosition.left }}
                                      className="absolute right-0  bg-white border border-gray-300 rounded-lg shadow-xl z-20 w-40"
                                    >
                                      <ul className="text-sm">
                                        <li
                                          className="flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                          onClick={() => {
                                            updateAccess(singleFile.file_id._id, null, designee.email, "view")
                                            setPopup(null);
                                          }
                                          }
                                        >
                                          <Eye className="h-5 w-5 mr-2" />
                                          Only View
                                        </li>
                                        <li
                                          className="flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                          onClick={() => {
                                            updateAccess(singleFile.file_id._id, null, designee.email, "edit")
                                            setPopup(null);
                                          }
                                          }
                                        >
                                          <FilePenLine className="h-5 w-5 mr-2" />
                                          Edit Access
                                        </li>
                                        <li
                                          className="flex px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 hover:text-red-600"
                                          onClick={() => {
                                            removefileAccess(designee.email, singleFile.file_id._id, null)
                                            setPopup(null);
                                          }
                                          }
                                        >
                                          <Trash2 className="h-5 w-5 mr-2" />
                                          Remove Access
                                        </li>
                                      </ul>
                                    </div>
                                  )}
                                </button>
                              </div>

                            </div>
                          ))}
                          {/* Display Voices */}
                          {file.voices?.map((singleVoice, voiceIndex) => (
                            <div
                              key={`voice-${index}-${voiceIndex}`}
                              className="border-t-2 flex justify-between border-gray-100 p-2 relative border-2 rounded-lg mb-4"
                            >
                              <div className="flex flex-col">
                                <h1 className=" flex items-center bg-gray-100 p-2 max-w-32 rounded cursor-pointer gap-0 text-xl font-semibold">
                                  {(singleVoice.voice_id?.voice_name && singleVoice.voice_id.voice_name.length > 10) ?
                                    singleVoice.voice_id.voice_name.substring(0, 10) + "..." :
                                    singleVoice.voice_id?.voice_name || "Unknown"}
                                </h1>
                                <h1 className="py-2 text-sm">
                                  {formatDate(singleVoice.voice_id?.date_of_upload) ||
                                    "Unknown"}
                                </h1>
                              </div>
                              <div>
                                <h1 className="px-4 ml-10 py-2 font-semibold text-gray-500">
                                  {singleVoice.access || "Unknown"}
                                </h1>
                              </div>
                              <div className="px-4 py-2">
                                <button className="px-4 py-2 relative">
                                  <button
                                    className="w-5 h-5 cursor-pointer"


                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const rect = e.target.getBoundingClientRect();
                                      setPopupPosition({ top: rect.top + window.scrollY + 30, left: rect.left - 150 });
                                      togglePopup(`${index}-voice-${voiceIndex}`);
                                    }}

                                  > <EllipsisVertical /></button>
                                  {popup === `${index}-voice-${voiceIndex}` && (
                                    <div
                                      ref={popupRef}
                                      // style={{ top: popupPosition.top, left: popupPosition.left }}
                                      className="absolute right-0  bg-white border border-gray-300 rounded-lg shadow-xl z-20 w-40"
                                    >
                                      <ul className="text-sm">
                                        <li
                                          className="flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                          onClick={() => {
                                            updateAccess(null, singleVoice.voice_id._id, designee.email, "view")
                                            setPopup(null);
                                          }
                                          }
                                        >
                                          <Eye className="h-5 w-5 mr-2" />
                                          Only View
                                        </li>
                                        <li
                                          className="flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                          onClick={() => {
                                            updateAccess(null, singleVoice.voice_id._id, designee.email, "edit")
                                            setPopup(null);
                                          }
                                          }
                                        >
                                          <FilePenLine className="h-5 w-5 mr-2" />
                                          Edit Access
                                        </li>
                                        <li
                                          className="flex px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 hover:text-red-600"
                                          onClick={() => {
                                            removefileAccess(designee.email, null, singleVoice.voice_id._id)
                                            setPopup(null);
                                          }
                                          }
                                        >
                                          <Trash2 className="h-5 w-5 mr-2" />
                                          Remove Access
                                        </li>
                                      </ul>
                                    </div>
                                  )}
                                </button>
                              </div>

                            </div>

                          ))}
                        </React.Fragment>
                      ))
                    ) : (
                      <>
                        <div>

                          <h1 className="px-4 py-2 text-center">
                            No shared files or voices available
                          </h1>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h1 className="px-4 mt-10 py-2 text-center">
                      No shared files or voices available
                    </h1>
                  </div>
                </>
              )
            }


          </div>
        </div>
      ) : (
        <>
          <div className="mt-2 bg-white rounded hidden md:flex max-h-[80vh] pb-[20px] overflow-y-scroll">

            <h1></h1>
            <table className="w-full">
              <thead className="sticky top-0 z-50">
                <tr className="bg-gray-100 text-left text-[0.8rem] border-black">
                  <th className="p-2 md:p-4 font-medium text-[#667085] text-sm">
                    File Name
                  </th>
                  <th className="p-2 md:p-4 font-medium text-[#667085] text-sm">
                    Date Upload
                  </th>
                  <th className="p-2 md:p-4 font-medium text-[#667085] text-sm">
                    Sharing
                  </th>
                  <th className="p-2 md:p-4 font-medium text-[#667085] text-sm">
                    Access
                  </th>
                </tr>
              </thead>
              <tbody className="p-2 text-gray-500">
                <tr>
                  <td colSpan="4" className="text-center">
                    No files available
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {showOverlay && renderOverlay()}
    </div>
  );
}
export default Designee;
