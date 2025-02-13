import React, { useState, useEffect, useRef, } from "react";
import { API_URL } from "../utils/Apiconfig";
import files_icon from "../../assets/files-icon.png";
import editicon from "../../assets/editicon.png";
import voiceIcon from "../../assets/voice.png";
import useLoadingStore from "../../store/UseLoadingStore";
import {
  Camera,
  EllipsisVertical,
  LayoutGrid,
  Menu,
  Trash,
  User,
  FilePenLine,
  Trash2,
  X,
  Eye,
  Search,
  Loader2,
  Plus
} from "lucide-react";
import usePopupStore from "../../store/DesigneeStore";


import DesignerPopup from "../Main/Designeepopup";
import designeeprofile from "../../assets/profile.png";
import play from "../../assets/Play.png";
import axios from "axios";
import useFolderDeleteStore from "../../store/FolderDeleteStore";
import { Link, useNavigate } from "react-router-dom";
const Desineedashboard = ({ searchQuery }) => {
  const [designees, setDesignees] = useState([]);
  const [popupItem, setPopupItem] = useState(null);
  const { isLoading, showLoading, hideLoading } = useLoadingStore();
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const navigate = useNavigate();
  const [selectedDesignee, setSelectedDesignee] = useState(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activePopupId, setActivePopupId] = useState(null);
  const dropdownRef = useRef([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [selectedVoiceId, setSelectedVoiceId] = useState(null);
  const [openPopup, setOpenPopup] = useState(null); // Track which file/voice popup is open
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [file, setFile] = useState(null);
  // const [showDesignerPopup, setShowDesignerPopup] = useState(false);
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [dropdowndesigneeVisible, setDropdowndesigneeVisible] = useState(null);
  const [modaldesigneeVisible, setModaldesigneeVisible] = useState(false); // Modal visibility
  const [selectedmodalDesignee, setSelectedmodalDesignee] = useState(null); // Selected designee for
  const [currentAudio, setCurrentAudio] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [popupIndex, setPopupIndex] = useState(false);
  const [popupVoiceIndex, setPopupVoiceIndex] = useState(null);
  const [check, setCheck] = useState(false);
  
  const [deletePopup, setDeletePopup] = useState(false);

  const {
    deletebuttonfolder,
    setDeletebuttonfolder,
    setSelectedFolder,
    selectedFolder,
    deleteFolder,
    openMenufolderId,
    setOpenMenufodlerId,
  } = useFolderDeleteStore();

  const toggledesigneeDropdown = (index) => {
    setDropdowndesigneeVisible(
      dropdowndesigneeVisible === index ? null : index
    ); // Toggle visibility
  };
  const [designers, setDesigners] = useState([]);
  const {
    showDesignerPopup,
    closePopup,
    setDesignerPopup,
    designeeName,
    setDesigneeName,
    designeePhone,
    setDesigneePhone,
    designeeEmail,
    setDesigneeEmail,
  } = usePopupStore();
  const isToggling = useRef(false);


  // useEffect(() => {
  //   if (openDropdownIndex) {
  //     document.body.style.overflow = 'hidden'; // Prevent scroll
  //   } else {
  //     document.body.style.overflow = 'auto'; // Allow scroll
  //   }

  // }, [openDropdownIndex]);

  const togglePopup = (filename, index) => {
    // If the popup is already open for this file, close it (set popupIndex to null)
    if (popupIndex === filename) {
      setPopupIndex(null);
      setPopupVoiceIndex(null)
      setOpenDropdownIndex(index);
    } else {
      setPopupIndex(filename); // Open the popup for the clicked file

      setOpenDropdownIndex(index);
    }
  };


  const handleDesigneeNavigate = (email) => {
    navigate(`/designee/${email}`)
  }
  const toggleVoicePopup = (voicename, index) => {
    // If the popup is already open for this file, close it (set popupIndex to null)
    if (popupIndex === voicename) {

      setPopupVoiceIndex(null);
      setOpenDropdownIndex(index);
    } else {
      // Open the popup for the clicked file
      setPopupVoiceIndex(voicename);
      setOpenDropdownIndex(index);
    }
  };

  const handleAddDesignee = async () => {
    showLoading();
    const token = localStorage.getItem("token");
  
    if (!designeeName || !designeePhone || !designeeEmail) {
      alert("Please fill in all fields.");
      hideLoading();
      return;
    }
  
    console.log("Uploading file:", file);
  
    const formData = new FormData();
    formData.append("profilePicture", file);
    formData.append("designeeName", designeeName);
    formData.append("designeePhone", designeePhone);
    formData.append("designeeEmail", designeeEmail);
  
    try {
      const response = await axios.post(
        `${API_URL}/api/designee/add-designee`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      console.log("Response received:", response);
  
      alert("Designee added successfully.");
      closePopup();
    } catch (error) {
      console.error("Error adding designee:", error);
  
      if (error.response) {
        if (error.response.status === 409) {
          alert("Designee already exists, please check.");
        } else if (error.response.status === 400) {
          const serverMessage = error.response.data.message;
          if (serverMessage === "Designee already exists and is linked to your account.") {
            alert("This designee is already linked to your account.");
          } else {
            alert("Error: " + serverMessage);
          }
        } else {
          alert("Error adding designee. Please try again later.");
        }
      } else {
        alert("Network error. Please check your connection.");
      }
    } finally {
      hideLoading();
      setDesigneeEmail("");
      setDesigneeName("");
      fetchDesignees();
      setDesigneePhone("");
      setFile(null);
    }
  };
  
  const closeOverlay = () => {
    setOverlayVisible(false); // Close the overlay

    setFileData(null); // Reset file data when closing overlay
  };

  const handleEditIconClick = (item) => {
    setSelectedItemId(item.file_id || item.voice_id); // Set the ID of the clicked item
    setIsPopupOpen(true); // Open the popup
    setOpenDropdownIndex(true);
  };

  // Open modal with designee details
  const opendesigneeModal = (designee) => {
    setSelectedmodalDesignee(designee);
    setModaldesigneeVisible(true);
  };

  // Close modal
  const closedesigneeModal = () => {
    setModaldesigneeVisible(false);
    setSelectedmodalDesignee(null);
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
        fetchDesignees();
        // Optionally update the UI here (e.g., removing the file or voice from the list)
      } else {
        // alert(data.message || 'Failed to remove access');
      }
    } catch (error) {
      console.error('Error:', error);
      // alert('An error occurred while removing access');
    }
  };



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
        fetchDesignees();

      } else {
        alert(data.message || 'Failed to update access');
      }
    } catch (error) {
      console.error('Error:', error);
      // alert('An error occurred while updating access');
    }
  };

  const deletedesignee = async (email) => {
    console.log("hello");
    const token = localStorage.getItem("token");
    console.log("hello");
    try {
      const response = await axios.delete(
        `${API_URL}/api/designee/remove-designee`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { email },
        }
      );
      console.log("hello");
      alert(response.data.message || "Access removed successfully!");
      fetchDesignees();
    } catch (error) {
      console.error("Error removing access:", error);
      alert(error.response?.data?.message || "Failed to remove access.");
    }
  };


  const fetchFileContent = async (fileId) => {
    try {
      setLoading(true);
      setError("");
      console.log("defaultttttttttttttt", fileId);
      const response = await axios.post(`${API_URL}/api/view-file-content`, {
        fileId: fileId,
      });

      console.log("xknwjxbexnbc", response);

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
      console.error("Error fetching file content:", err);
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

    console.log("MIME Type:", mimeType); // Log MIME type to check if it is image-related

    console.log("File URL:", fileUrl); // Log the File URL to check

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
              console.error("Error loading image:", e);

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
          src={fileUrl}
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

  const handlePlay = async (file) => {
    setOpenDropdownIndex(false);
    console.log("styarting playing", file);
    try {
      // const token = Cookies.get('token');
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/voice-memo/listen-recording`,
        { voice_id: file },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response ", response.data);
      const { audio_url, voice_name } = response.data;

      if (!audio_url) {
        console.error("Audio URL is missing");
        return;
      }

      // Set the current audio for the popup without playing it
      setCurrentAudio({ url: audio_url, name: voice_name });
      console.log("currentAudio ", currentAudio);
    } catch (err) {
      console.error("Error fetching audio:", err);
    }
  };

  // Close the popup
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedItemId(null); // Clear the selected item
  };

  // const closePopup = () => {
  //   setOpenPopup(null); // Close the popup
  // };

  const [viewMode, setViewMode] = useState("grid");

  // Toggle view mode function
  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === "grid" ? "list" : "grid"));
  };

  const removeAccess = async (to_email_id) => {
    try {
      const response = await fetch(
        `${API_URL}/api/designee/delete-shared-data`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for authentication
          },
          body: JSON.stringify({ to_email_id }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // alert(data.message || "Access removed successfully.");
        // Optional: Update UI to reflect changes
        setDesignees(designees.filter((d) => d.to_email_id !== to_email_id));
        fetchDesignees();
        popupIndex(null);

      } else {
        // alert(data.message || "Failed to remove access.");
      }
    } catch (error) {
      console.error("Error removing access:", error);
      // alert("An error occurred while removing access.");
    }
    finally {
      setDeletePopup(false);
    }
  };

  const handleOption = (option) => {
    // Handle the selected option for "Only View", "Edit Access", or "Remove Access"
    console.log(option);
    closePopup(); // Close the popup after the action
  };
  const fetchDesignees = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token is missing.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `${API_URL}/api/designee/getting-all-shared-files`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDesignees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDesignees();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.some((ref) => ref && ref.contains(e.target))
      ) {
        setOpenDropdownIndex(false);
        // setDeletePopup(null)
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleSharedItem = (index, e) => {
    e.stopPropagation(); // Prevent click event from bubbling up
    if (isToggling.current) return;

    isToggling.current = true;
    setDeletePopup(null)
    setOpenDropdownIndex((prevIndex) => {
      const newIndex = prevIndex === index ? null : index;
      setTimeout(() => {
        isToggling.current = false;
      }, 100);
      return newIndex;
    });
  };

  const filterdDesigee = designees.filter((designee) =>
    (designee.designee.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const closeModal = () => {
    setSelectedDesignee(null);
    setOpenDropdownIndex(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Generate a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // Set the preview URL
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDeletePopup = (index) => {
    if (deletePopup === index) {
      setDeletePopup(null);
    } else {
      setDeletePopup(index);
    }
  }

  // if (loading) {
  //   return <div>Loading...</div>;
  // }
  if (error) {
    return <div>Error: {error}</div>;
  }
  console.log(designees);

  return (



    <div className="p-2 max-h-full max-w-screen">

      <div className="md:hidden h-14 p-2 w-full border-2 border-gray-200 rounded-xl md:mt-4 mb-3 flex">
        <Search className="mt-1.5 text-gray-500" />
        <input
          type="text"
          placeholder="Search"
          className="w-full h-full p-4 outline-none"
        // value={MobilesearchQuery}
        // onChange={(e) => MobilesetsearchQuery(e.target.value)}
        />
      </div>
      <div className="flex justify-between">
      <h1 className="text-2xl font-semibold mb-4">Your Designees</h1>
      <h1>
      <div className="inline md:hidden">
          <button
            // onClick={() => addFolder()}
            onClick={() => {
             
              setDesignerPopup();
            
            }}
            className='bg-[#0067FF] text-sm p-2 hover:bg-blue-600 flex text-white rounded'
          ><Plus className='mr-2 h-5 w-5' />Add Designee</button>
          </div>
      </h1>
      </div>
      <div className="flex justify-between">
        <div className="flex justify-between w-full mb-4">
          <div>
          <button className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">
            Lists of Designee
          </button>
          <span className="ml-2 bg-gray-200 text-gray-600 rounded-full px-2 py-1 text-sm">
            {designees.length}
          </span>
          </div>
          <div className="hidden md:inline">
          <button
            // onClick={() => addFolder()}
            onClick={() => {
             
              setDesignerPopup();
            
            }}
            className='px-2 py-2 pt-2 bg-[#0067FF] hover:bg-blue-600 flex text-white rounded-lg'
          ><Plus className='mr-2 ' />Add Designee</button>
          </div>
        </div>
{showDesignerPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-lg font-semibold">Add Designee</h3>
                <button
                  onClick={() => closePopup()}
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-center mb-4">
                  <div
                    className="w-24 h-24 rounded-full border-dashed border-2 flex items-center justify-center text-gray-500"
                    onClick={() =>
                      document.getElementById("file-input").click()
                    }
                  >
                    {preview ? (
                      // Display the preview image if available
                      <img
                        src={preview}
                        alt="Selected Preview"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      // Show the camera icon when no image is selected
                      <Camera className="h-6 w-6" />
                    )}
                  </div>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    className="hidden" // Hide the input element
                    onChange={handleFileChange} // Handle file change event
                  />
                </div>
                <label className="block mb-2 text-sm font-medium">
                  Enter Designee Name
                </label>
                <input
                  type="text"
                  placeholder="Designee Name"
                  value={designeeName}
                  onChange={(e) => setDesigneeName(e.target.value)}
                  className="border p-2 rounded w-full mb-3"
                />
                <label className="block mb-2 text-sm font-medium">
                  Enter Designee Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Designee Phone Number"
                  value={designeePhone}
                  onChange={(e) => setDesigneePhone(e.target.value)}
                  className="border p-2 rounded w-full mb-3"
                />
                <label className="block mb-2 text-sm font-medium">
                  Enter Designee Email
                </label>
                <input
                  type="email"
                  placeholder="Designee Email"
                  value={designeeEmail}
                  onChange={(e) => setDesigneeEmail(e.target.value)}
                  className="border p-2 rounded w-full mb-4"
                />
              </div>

              {isLoading ? (
                <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-400 flex justify-center items-center">
                  <Loader2 className="animate-spin h-6 w-6 text-center" />
                </button>
              ) : (
                <button
                  onClick={handleAddDesignee}
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Invite to Cumulus
                </button>
              )}
            </div>
          </div>
        )}
        <div className="flex justify-end  md:hidden">
          <button
            className="px-4 py-2 text-black rounded-md text-sm w-32 flex"
            onClick={toggleViewMode}
          >
            {viewMode === "list" ? (
              <LayoutGrid className="h-5" />
            ) : (
              <Menu className="h-5" />
            )}

            {viewMode === "list" ? "Grid View" : "List View"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white mt-2 rounded-lg h-[90vh]">
        <div className="hidden md:block">
          {/* Table view for larger screens */}
          <table className=" divide-gray-200 w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shared To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shared Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modify
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filterdDesigee.map((designee, index) => (
                <tr key={index}>
                  {/* Designee Information */}
                  <td className="whitespace-nowrap flex items-center mt-2">
                    <Link to={`/designee/${designee.to_email_id}`}>
                    <div 
                    className="bg-gray-100 flex items-center justify-center px-3 py-1.5 ml-2 rounded-lg">
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={designee.designee?.profile_picture || "No pic"}
                        alt="File Icon"
                      />

                      <span className="ml-4 text-sm font-medium text-gray-900">
                        {designee.designee?.name || "No name"}
                      </span>
                    </div>
                    </Link>
                  </td>

                  {/* Phone Number */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="text-gray-600">
                      {designee.designee?.phone_number || "No phone number"}
                    </span>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {designee.to_email_id}
                  </td>

                  {/* Files and Dropdown */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center relative">
                    <i
                      className="fas fa-chevron-down cursor-pointer text-blue-600 mr-3"
                      onClick={(e) => {
                        toggleSharedItem(index, e);
                        setPopupIndex(null);
                        setPopupVoiceIndex(null)
                      }} // Pass event to the toggle function
                    ></i>
                    <div>
                      <p className="font-semibold mb-1">
                        {designee.files[0]?.file_name?.length > 30
                          ? `${designee.files[0]?.file_name.substring(0, 30)}...`
                          : designee.files[0]?.file_name}
                      </p>
                      <p className="text-xs text-blue-500 font-semibold">
                        + {designee.files.length + designee.voices.length}{" "}
                        items
                      </p>
                    </div>

                    {/* Dropdown Menu */}
                    {openDropdownIndex === index && (
                      <div
                        ref={(el) => (dropdownRef.current[index] = el)}
                        className="absolute h-80 overflow-auto right-10 mt-2 min-w-96  bg-white z-50 shadow-lg rounded-2xl border top-14"
                        onClick={(e) => e.stopPropagation()} // Prevent dropdown close on clicking inside
                      >
                        <div className="p-4">
                          <h3 className="text-lg font-semibold">
                            Shared Items
                          </h3>
                        </div>
                        <ul className="">
                          {/* Shared Files */}
                          {designee.files?.length > 0 ? (
                            designee.files.map((file, fileIndex) => (
                              <>
                                <li
                                  key={`file-${fileIndex}`}
                                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-100"
                                  onClick={(e) => e.stopPropagation()} // Prevent dropdown close on clicking file
                                >
                                  <div
                                    className="flex items-center space-x-3"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent dropdown close

                                      fetchFileContent(
                                        file.id || file.file_id
                                      );
                                    }}
                                  >
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                      <img
                                        src={files_icon}
                                        alt="File Icon"
                                      />
                                    </div>
                                    <span>{file.file_name?.length > 20
                                            ? `${file.file_name.substring(0, 20)}...`
                                            : file.file_name}</span>
                                  </div>
                                  <img
                                    className="w-5 h-5 "
                                    src={editicon}
                                    alt="Edit Icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      // setOpenDropdownIndex(index);
                                      // handleEditIconClick(file);
                                      togglePopup(
                                        `file-${fileIndex}`,
                                        index
                                      );
                                    }}
                                  />
                                </li>

                                {popupIndex === `file-${fileIndex}` && (
                                  <div className="absolute mt-[15px] right-0 bg-white border border-gray-300 rounded-lg shadow-xl z-10 w-40">
                                    <ul className="text-sm">
                                      <li className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                        onClick={() => updateAccess(file.file_id, null, designee.to_email_id, 'view')}
                                      >
                                        <span>
                                          <Eye className="h-5 w-5 mr-2" />
                                        </span>
                                        Only View
                                      </li>
                                      <li className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                        onClick={() => updateAccess(file.file_id, null, designee.to_email_id, 'edit')}
                                      >
                                        <span>
                                          <FilePenLine className="h-5 w-5 mr-2" />
                                        </span>
                                        Edit Access
                                      </li>
                                      <li
                                        className=" flex px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 hover:text-red-600"
                                        onClick={() => removefileAccess(designee.to_email_id, file.file_id, null)}
                                      >
                                        <span>
                                          <Trash2 className="h-5 w-5 mr-2" />
                                        </span>
                                        Remove Access
                                      </li>
                                    </ul>
                                  </div>
                                )}
                              </>
                            ))
                          ) : (
                            <li className="px-4 py-3 text-gray-500">
                              {/* No files shared */}
                            </li>
                          )}

                          {/* Shared Voices */}
                          {designee.voices?.length > 0 ? (
                            designee.voices.map((voice, voiceIndex) => (
                              <>
                                <li
                                  key={`voice-${voiceIndex}`}
                                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-100"
                                  onClick={(e) => e.stopPropagation()} // Prevent dropdown close on clicking voice
                                >
                                  <div
                                    className="flex items-center space-x-3"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent dropdown close
                                      console.log(
                                        "voice1.voice_id",
                                        voice.voice_id
                                      ); // Use voice.voice_id here

                                      handlePlay(voice.voice_id);
                                    }}
                                  >
                                    <img
                                      src={play}
                                      alt="Play Icon"
                                      className="h-5"
                                    />
                                    <span className="text-sm font-semibold ml-4">
                                      {voice.voice_name}
                                    </span>
                                  </div>
                                  <img
                                    className="w-5 h-5"
                                    src={editicon}
                                    alt="Edit Icon"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent dropdown close

                                      e.preventDefault();
                                      handleEditIconClick(voice);
                                      // setPopupIndex(null);
                                      toggleVoicePopup(
                                        `file-${voiceIndex}`,
                                        index
                                      );
                                    }}
                                  />
                                </li>



                                {popupVoiceIndex === `file-${voiceIndex}` && (
                                  <div className="absolute mt-[15px] right-0 bg-white border border-gray-300 rounded-lg shadow-xl z-10 w-40">
                                    <ul className="text-sm">
                                      <li className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                        onClick={() => updateAccess(null, voice.voice_id, designee.to_email_id, 'view')}
                                      >
                                        <span>
                                          <Eye className="h-5 w-5 mr-2" />
                                        </span>
                                        Only View voice
                                      </li>
                                      <li className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                        onClick={() => updateAccess(null, voice.voice_id, designee.to_email_id, 'edit')}
                                      >
                                        <span>
                                          <FilePenLine className="h-5 w-5 mr-2" />
                                        </span>
                                        Edit Access
                                      </li>
                                      <li
                                        className=" flex px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 hover:text-red-600"
                                        onClick={() => removefileAccess(designee.to_email_id, voice.voice_id, null)}
                                      >
                                        <span >
                                          <Trash2 className="h-5 w-5 mr-2" />
                                        </span>
                                        Remove Access
                                      </li>

                                    </ul>
                                  </div>
                                )}

                              </>
                            ))
                          ) : (
                            <li className="px-4 py-3 text-gray-500">
                              {/* No voices shared */}
                            </li>
                          )}
                        </ul>
                        {/* <div className="p-4 flex justify-end">
                              <button
                                className="w-28 bg-blue-500 text-white py-2 rounded-md"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent dropdown close
                                  closeModal();
                                }}
                              >
                                Done
                              </button>
                            </div> */}
                      </div>
                    )}
                  </td>

                  {/* Remove Access Button */}
                  <td className="relative">
                    <div className="flex">
                      <div className="flex">
                        <button
                          className="text-red-600 border mr-1 border-red-600 rounded-lg p-2 text-xs bg-[#FFEBEB]"
                          onClick={() => removeAccess(designee.to_email_id)}
                        >
                          Remove Access
                        </button></div>
                      <div className="flex group">

                        <div
                          className="text-red-600 px-4 py-1 text-sm flex cursor-pointer  "
                          onClick={() => deletedesignee(designee.to_email_id)}
                        >
                          < Trash className="" />
                        </div>

                        <div className="absolute mt-16 inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          
                            <span className="text-red-700 bg-white border text-xs p-1 font-semibold rounded-lg">Delete Designee</span>
                         
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card view for smaller screens */}
        <div className="md:hidden">
          {viewMode === "list" ? (
            // If viewMode is "list"
            <div className="grid gap-2 grid-cols-1">
              {designees.map((designee, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg  overflow-y-auto border-2 border-gray-100 "
                >
                  
                  <div 
                  
                  className="flex justify-between">
                    <h3 
                    onClick={ () => {
                      handleDesigneeNavigate(designee.to_email_id)}
                    }
                    className="font-semibold text-lg">
                      {designee.designee?.name || "No name"}
                    </h3>
                    <img
                      src={designee.designee?.profile_picture || "No pic"}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                      onClick={() => opendesigneeModal(designee)}
                    />

                    {/* Modal */}
                    {modaldesigneeVisible && selectedmodalDesignee && (
                      <div className="fixed inset-0 h-full px-3 w-full backdrop-blur-[2px] flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg border-2 p-2 w-full max-w-md">
                          {/* Modal Header */}
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                              Designee Details
                            </h2>
                            <button onClick={closedesigneeModal}>
                              <X className="text-gray-500 w-6 h-6" />
                            </button>
                          </div>
                          <hr />
                          {/* Modal Content */}
                          <div className="flex items-center mb-4">
                            <img
                              src={
                                designee.designee?.profile_picture ||
                                "No pic"
                              }
                              alt="Profile"
                              className="w-20 h-20 rounded-full object-cover mr-4"
                            />
                            <div>
                              <h3 className="text-2xl font-semibold mb-4">
                                {selectedmodalDesignee.designee?.name ||
                                  "No name"}
                              </h3>

                              <p className="text-sm text-gray-600 mb-4">
                                <strong>Contact Number:</strong>{" "}
                                {selectedmodalDesignee.designee
                                  ?.phone_number || "N/A"}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Email:</strong>{" "}
                                {selectedmodalDesignee.to_email_id ||
                                  "No email"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <p className="text-sm text-gray-600">
                      {designee.to_email_id?.length > 15
                        ? `${designee.to_email_id.substring(0, 15)}...`
                        : designee.to_email_id}
                    </p>
                    <p className="text-sm text-gray-600 mt-4 font-semibold">
                      {designee.files[0]?.file_name}
                    </p>
                    <div className="flex w-full justify-between">
                      <p
                        onClick={

                          (e) => {
                            toggleSharedItem(index, e)
                            setPopupIndex(null);
                            setPopupVoiceIndex(null)
                            setCheck(!check);
                          }
                        }
                        className="text-xs text-blue-500 font-semibold relative"
                      >
                        + {designee.files.length + designee.voices.length} items
                      </p>
                      <button onClick={() => { handleDeletePopup(index) }}><EllipsisVertical /></button>


                    </div>
                    {deletePopup === index && (
                      <>
                        <div className="fixed inset-0 h-full px-3 w-full backdrop-blur-[2px] flex items-center justify-center z-50">
                          <div
                            ref={(el) => (dropdownRef.current[index] = el)}
                            className="absolute h-40 w-60 z-50 bg-white shadow-2xl border-2 rounded-md p-3 mt-10">
                            <div className="flex justify-between mb-2 pb-2 border-b-2">
                              <p className="text-xl font-semibold text-gray-600"> {designee.designee?.name || "No name"}</p>
                              <p onClick={() => setDeletePopup(null)} ><X className="h-5 w-5 text-red-500" /></p></div>
                            <p
                              onClick={() => {
                                removeAccess(designee.to_email_id)
                                setDeletePopup(null);
                              }}
                              className="text-sm font-semibold text-red-500 p-1 hover:text-gray-600 mb-3">Remove Access</p>
                            <p
                              onClick={() => deletedesignee(designee.to_email_id)}
                              className="text-sm font-semibold text-red-500 p-1 hover:text-gray-600">Remove Designee</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Dropdown menu */}
                  {openDropdownIndex === index && (
                    <div className="fixed inset-0 h-full px-3 w-full backdrop-blur-[2px] flex items-center justify-center z-50">
                      <div
                        ref={(el) => (dropdownRef.current[index] = el)}
                        className="absolute h-80 overflow-y-auto  min-w-80 sm:min-w-96 bg-white z-50 shadow-lg rounded-2xl border"
                        onClick={(e) => e.stopPropagation()} // Prevent dropdown close on clicking inside
                      >
                        <div className="p-4">
                          <h3 className="text-lg font-semibold">
                            Shared Items
                          </h3>
                        </div>
                        <ul className="">
                          {/* Shared Files */}
                          {designee.files?.length > 0 ? (
                            designee.files.map((file, fileIndex) => (
                              <>
                                <li
                                  key={`file-${fileIndex}`}
                                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-100"
                                  onClick={(e) => e.stopPropagation()} // Prevent dropdown close on clicking file
                                >
                                  <div
                                    className="flex items-center space-x-3"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent dropdown close

                                      fetchFileContent(file.id || file.file_id);
                                    }}
                                  >
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                      <img src={files_icon} alt="File Icon" />
                                    </div>
                                    <span>{file.file_name}</span>
                                  </div>
                                  <img
                                    className="w-5 h-5 relative"
                                    src={editicon}
                                    alt="Edit Icon"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent dropdown close
                                      handleEditIconClick(file);
                                      togglePopup(
                                        `file-${fileIndex}`,
                                        index
                                      );
                                    }}
                                  />
                                </li>

                                {popupIndex === `file-${fileIndex}` && (
                                  <div className="absolute mt-[15px] right-0 bg-white border border-gray-300 rounded-lg shadow-xl z-10 w-40">
                                    <ul className="text-sm">
                                      <li className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                        onClick={() => updateAccess(file.file_id, null, designee.to_email_id, 'view')}
                                      >
                                        <span>
                                          <Eye className="h-5 w-5 mr-2" />
                                        </span>
                                        Only View
                                      </li>
                                      <li className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                        onClick={() => updateAccess(file.file_id, null, designee.to_email_id, 'edit')}
                                      >
                                        <span>
                                          <FilePenLine className="h-5 w-5 mr-2" />
                                        </span>
                                        Edit Access
                                      </li>
                                      <li
                                        className=" flex px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 hover:text-red-600"
                                        onClick={() => removefileAccess(designee.to_email_id, file.file_id, null)}
                                      >
                                        <span>
                                          <Trash2 className="h-5 w-5 mr-2" />
                                        </span>
                                        Remove Access
                                      </li>
                                    </ul>
                                  </div>
                                )}

                              </>
                            ))
                          ) : (
                            <li className="px-4 py-3 text-gray-500">
                              {/* No files shared */}
                            </li>
                          )}

                          {/* Shared Voices */}
                          {designee.voices?.length > 0 ? (
                            designee.voices.map((voice, voiceIndex) => (
                              <>
                                <li
                                  key={`voice-${voiceIndex}`}
                                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-100"
                                  onClick={(e) => e.stopPropagation()} // Prevent dropdown close on clicking voice
                                >
                                  <div
                                    className="flex items-center space-x-3"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent dropdown close
                                      console.log(
                                        "voice1.voice_id",
                                        voice.voice_id
                                      ); // Use voice.voice_id here

                                      handlePlay(voice.voice_id);
                                    }}
                                  >
                                    <img
                                      src={play}
                                      alt="Play Icon"
                                      className="h-5"
                                    />
                                    <span className="text-sm font-semibold ml-4">
                                      {voice.voice_name}
                                    </span>
                                  </div>
                                  <img
                                    className="w-5 h-5"
                                    src={editicon}
                                    alt="Edit Icon"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent dropdown close
                                      handleEditIconClick(voice);
                                      toggleVoicePopup(
                                        `file-${voiceIndex}`,
                                        index
                                      );
                                    }}
                                  />
                                </li>

                                {popupVoiceIndex === `file-${voiceIndex}` && (
                                  <div className="absolute mt-[15px] right-0 bg-white border border-gray-300 rounded-lg shadow-xl z-10 w-40">
                                    <ul className="text-sm">
                                      <li className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                        onClick={() => updateAccess(null, voice.voice_id, designee.to_email_id, 'view')}

                                      >
                                        <span>
                                          <Eye className="h-5 w-5 mr-2" />
                                        </span>
                                        Only View voice
                                      </li>
                                      <li className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                        onClick={() => updateAccess(null, voice.voice_id, designee.to_email_id, 'edit')}
                                      >
                                        <span>
                                          <FilePenLine className="h-5 w-5 mr-2" />
                                        </span>
                                        Edit Access
                                      </li>
                                      <li
                                        className=" flex px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 hover:text-red-600"
                                        onClick={() => removefileAccess(designee.to_email_id, voice.voice_id, null)}
                                      >
                                        <span>
                                          <Trash2 className="h-5 w-5 mr-2" />
                                        </span>
                                        Remove Access
                                      </li>
                                    </ul>
                                  </div>
                                )}

                              </>
                            ))
                          ) : (
                            <li className="px-4 py-3 text-gray-500">
                              {/* No voices shared */}
                            </li>
                          )}


                        </ul>
                        {/* <div className="p-4 flex justify-end">
                            <button
                              className="w-28 bg-blue-500 text-white py-2 rounded-md"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent dropdown close
                                closeModal();
                              }}
                            >
                              Done
                            </button>
                          </div> */}
                      </div>
                    </div>
                  )}

                  {/* <button
                        onClick={() => toggleSharedItem(index)}
                        className="text-blue-500 text-sm mt-2"
                      >
                        View Shared Items
                      </button> */}



                  {/* <div className="mt-2">
                        <button
                          className="w-full text-red-600 border border-red-600 rounded-lg px-4 py-1 text-sm bg-[#FFEBEB]"
                          onClick={() => removeAccess(designee.to_email_id)}
                        >
                          Remove Access
                        </button>
                        
                      </div> */}
                </div>
              ))}
            </div>
          ) : (
            <div>
              {/* Grid of Designees */}
              <div className="grid gap-2 grid-cols-2">
                {designees.map((designee, index) => (
                  <div
                    key={index}
                    className="bg-white border rounded-lg min-h-full gap-y-8 flex flex-col justify-between"
                  >
                    {/* Profile Image and Name */}
                    <div 
                     
                    className="flex items-center justify-between bg-gray-100 rounded-lg p-1 overflow-hidden">
                      <img
                        src={designee.designee?.profile_picture || "No pic"}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover"
                        onClick={() => opendesigneeModal(designee)}
                      />
                      <h3 
                      onClick={ () => {
                        handleDesigneeNavigate(designee.to_email_id)}
                      }
                      className="min-w-full pl-2 font-semibold text-xl">
                        {designee.designee?.name || "No name"}
                      </h3>
                    </div>

                    {/* File and Items Information */}
                    <div className="flex justify-between  px-2">
                      <div className="pb-2 flex w-full justify-between">
                        <div className="flex flex-col ">
                          <p className="text-sm font-semibold text-gray-600">
                            {designee.files[0]?.file_name}
                          </p>


                          <p
                            onClick={

                              (e) => {
                                toggleSharedItem(index, e)
                                setPopupIndex(null);
                                setPopupVoiceIndex(null)
                              }
                            }
                            className="text-xs text-blue-500 w-full h-full mt-1 font-semibold"
                          >
                            +{" "}
                            {designee.files.length + designee.voices.length}{" "}
                            items
                          </p>
                        </div>

                        <p
                          //  onClick={() => handleRemove(index)}
                          className="relative"
                        >
                          {" "}
                          {/* <Trash
                                className="text-red-500"
                                // onClick={() =>
                                  
                                // }
                              /> */}
                          <EllipsisVertical onClick={() => { handleDeletePopup(index) }} />
                        </p>

                      </div>
                      {deletePopup === index && (
                        <>
                          <div className="fixed inset-0 h-full px-3 w-full backdrop-blur-[2px] flex items-center justify-center z-50">
                            <div
                              ref={(el) => (dropdownRef.current[index] = el)}
                              className="absolute h-40 w-60 z-50 bg-white shadow-2xl border-2 rounded-md p-3 mt-10">
                              <div className="flex justify-between mb-2 pb-2 border-b-2">
                                <p className="text-xl font-semibold text-gray-600"> {designee.designee?.name || "No name"}</p>
                                <p onClick={() => setDeletePopup(null)} ><X className="h-5 w-5 text-red-500" /></p></div>
                              <p
                                onClick={() => {
                                  removeAccess(designee.to_email_id)
                                  setDeletePopup(null);
                                }}
                                className="text-sm font-semibold text-red-500 p-1 hover:text-gray-600 mb-3">Remove Access</p>
                              <p
                                onClick={() => deletedesignee(designee.to_email_id)} // Pass the designee email
                                className="text-sm font-semibold text-red-500 p-1 hover:text-gray-600">Remove Designee</p>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Dropdown menu */}
                      {openDropdownIndex === index && (
                        <div className="fixed inset-0 h-full px-3 w-full backdrop-blur-[2px] flex items-center justify-center z-50">
                          <div
                            ref={(el) => (dropdownRef.current[index] = el)}
                            className="absolute h-80 overflow-auto min-w-80 sm:min-w-96 bg-white z-50 shadow-lg rounded-2xl border top-80"
                            onClick={(e) => e.stopPropagation()} // Prevent dropdown close on clicking inside
                          >
                            <div className="p-4">
                              <h3 className="text-lg font-semibold">
                                Shared Items
                              </h3>
                            </div>
                            <ul className="">
                              {/* Shared Files */}
                              {designee.files?.length > 0 ? (
                                designee.files.map((file, fileIndex) => (
                                  <>
                                    <li
                                      key={`file-${fileIndex}`}
                                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-100"
                                      onClick={(e) => e.stopPropagation()} // Prevent dropdown close on clicking file
                                    >
                                      <div
                                        className="flex items-center space-x-3"
                                        onClick={(e) => {
                                          e.stopPropagation(); // Prevent dropdown close

                                          fetchFileContent(
                                            file.id || file.file_id
                                          );
                                        }}
                                      >
                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                          <img
                                            src={files_icon}
                                            alt="File Icon"
                                          />
                                        </div>
                                        <span>{file.file_name}</span>
                                      </div>
                                      <img
                                        className="w-5 h-5"
                                        src={editicon}
                                        alt="Edit Icon"
                                        onClick={(e) => {
                                          e.stopPropagation(); // Prevent dropdown close
                                          handleEditIconClick(file);
                                          togglePopup(
                                            `file-${fileIndex}`,
                                            index
                                          );
                                        }}
                                      />
                                    </li>

                                    {popupIndex === `file-${fileIndex}` && (
                                      <div className="absolute mt-[15px] right-0 bg-white border border-gray-300 rounded-lg shadow-xl z-10 w-40">
                                        <ul className="text-sm">
                                          <li className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                            onClick={() => updateAccess(file.file_id, null, designee.to_email_id, 'view')}
                                          >
                                            <span>
                                              <Eye className="h-5 w-5 mr-2" />
                                            </span>
                                            Only View
                                          </li>
                                          <li className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                            onClick={() => updateAccess(file.file_id, null, designee.to_email_id, 'edit')}
                                          >
                                            <span>
                                              <FilePenLine className="h-5 w-5 mr-2" />
                                            </span>
                                            Edit Access
                                          </li>
                                          <li
                                            className=" flex px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 hover:text-red-600"
                                            onClick={() => removefileAccess(designee.to_email_id, file.file_id, null)}
                                          >
                                            <span>
                                              <Trash2 className="h-5 w-5 mr-2" />
                                            </span>
                                            Remove Access
                                          </li>
                                        </ul>
                                      </div>
                                    )}


                                  </>
                                ))
                              ) : (
                                <li className="px-4 py-3 text-gray-500">
                                  {/* No files shared */}
                                </li>
                              )}

                              {/* Shared Voices */}
                              {designee.voices?.length > 0 ? (
                                designee.voices.map((voice, voiceIndex) => (
                                  <>
                                    <li
                                      key={`voice-${voiceIndex}`}
                                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-100"
                                      onClick={(e) => e.stopPropagation()} // Prevent dropdown close on clicking voice
                                    >
                                      <div
                                        className="flex items-center space-x-3"
                                        onClick={(e) => {
                                          e.stopPropagation(); // Prevent dropdown close
                                          console.log(
                                            "voice1.voice_id",
                                            voice.voice_id
                                          ); // Use voice.voice_id here

                                          handlePlay(voice.voice_id);
                                        }}
                                      >
                                        <img
                                          src={play}
                                          alt="Play Icon"
                                          className="h-5"
                                        />
                                        <span className="text-sm font-semibold ml-4">
                                          {voice.voice_name}
                                        </span>
                                      </div>
                                      <img
                                        className="w-5 h-5"
                                        src={editicon}
                                        alt="Edit Icon"
                                        onClick={(e) => {
                                          e.stopPropagation(); // Prevent dropdown close
                                          handleEditIconClick(voice);
                                          toggleVoicePopup(
                                            `file-${voiceIndex}`,
                                            index
                                          );
                                        }}
                                      />
                                    </li>

                                    {popupVoiceIndex === `file-${voiceIndex}` && (
                                      <div className="absolute mt-[15px] right-0 bg-white border border-gray-300 rounded-lg shadow-xl z-10 w-40">
                                        <ul className="text-sm">
                                          <li className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                            onClick={() => updateAccess(null, voice.voice_id, designee.to_email_id, 'view')}
                                          >
                                            <span>
                                              <Eye className="h-5 w-5 mr-2" />
                                            </span>
                                            Only View voice
                                          </li>
                                          <li className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                            onClick={() => updateAccess(null, voice.voice_id, designee.to_email_id, 'edit')}
                                          >
                                            <span>
                                              <FilePenLine className="h-5 w-5 mr-2" />
                                            </span>
                                            Edit Access
                                          </li>
                                          <li
                                            className=" flex px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 hover:text-red-600"
                                            onClick={() => removefileAccess(designee.to_email_id, voice.voice_id, null)}
                                          >
                                            <span>
                                              <Trash2 className="h-5 w-5 mr-2" />
                                            </span>
                                            Remove Access
                                          </li>
                                        </ul>
                                      </div>
                                    )}

                                  </>
                                ))
                              ) : (
                                <li className="px-4 py-3 text-gray-500">
                                  {/* No voices shared */}
                                </li>
                              )}
                            </ul>
                            {/* <div className="p-4 flex justify-end">
                                <button
                                  className="w-28 bg-blue-500 text-white py-2 rounded-md"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent dropdown close
                                    closeModal();
                                  }}
                                >
                                  Done
                                </button>
                              </div> */}
                          </div>
                        </div>
                      )}

                      {/* Ellipsis Button */}
                      {/* <div className="pt-2 mb-2" onClick={() => toggledesigneeDropdown(index)}>
                          <Trash className="mr-2" />
                          </div> */}
                    </div>

                    {/*Designee Dropdown Menu */}
                    {dropdowndesigneeVisible === index && (
                      <div className="absolute bg-white shadow-lg rounded-lg mt-2  w-48 p-2">
                        <button
                          onClick={() => opendesigneeModal(designee)}
                          className="w-full flex items-center text-gray-700 hover:bg-gray-200 rounded-lg p-2"
                        >
                          <User className="mr-2" />
                          Designee Details
                        </button>
                        <button
                          // onClick={() => handleRemove(index)}
                          className="w-full flex items-center text-red-600 hover:bg-red-100 rounded-lg p-2"
                        >
                          <Trash className="mr-2" />
                          Remove Access
                        </button>
                      </div>
                    )}
                    {/* Modal */}
                    {modaldesigneeVisible && selectedmodalDesignee && (
                      <div className="fixed inset-0 backdrop-blur-[2px] px-4 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-2 w-full max-w-md relative">
                          {/* Modal Header */}
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                              Designee Details
                            </h2>
                            <button onClick={closedesigneeModal}>
                              <X className="text-gray-500 w-6 h-6" />
                            </button>
                          </div>
                          <hr />
                          {/* Modal Content */}
                          <div className="flex items-center mb-4">
                            <img
                              src={
                                designee.designee?.profile_picture ||
                                "No pic"
                              }
                              alt="Profile"
                              className="w-20 h-20 rounded-full object-cover mr-4"
                            />
                            <div>
                              <h3 className="text-2xl font-semibold mb-4">
                                {selectedmodalDesignee.designee?.name ||
                                  "No name"}
                              </h3>

                              <p className="text-sm text-gray-600 mb-4 ">
                                <strong>Contact Number:</strong>{" "}
                                {selectedmodalDesignee.designee?.phone_number ||
                                  "N/A"}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Email:</strong>{" "}
                                {selectedmodalDesignee.to_email_id || "No email"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>


            </div>
          )}
        </div>

      </div>

      {deletebuttonfolder && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="deleteModalLabel"
          aria-describedby="deleteModalDescription"
        >
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full m-2">
            <div className="flex justify-between items-center mb-4">
              <h2 id="deleteModalLabel" className="text-lg font-semibold">
                Are you sure you want to delete this folder?
              </h2>
            </div>
            <div
              id="deleteModalDescription"
              className="text-sm text-gray-600 mb-4"
            >
              This action cannot be undone. Please confirm if you'd like to
              proceed.
            </div>            <div className="flex justify-end gap-2 my-2">
              <button
                onClick={() => setDeletebuttonfolder(false)}
                className="border-2 border-blue-500 text-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>              <button
                onClick={() => {
                  if (selectedFolder) deleteFolder(selectedFolder);
                  setDeletebuttonfolder(false);
                }}
                className="bg-blue-500 text-white px-6 py-2 rounded flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {currentAudio && (
        <div className="absolute top-1/2 md:top-2/3 right-1/2 md:right-[25%] transform translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-lg rounded-lg w-80">
          <h2 className="text-lg font-bold mb-4 text-black">
            {currentAudio.name}
          </h2>

          <div className="audio-container items-center justify-center bg-gray-100 rounded-2xl">
            <audio
              id="audio-player"
              src={currentAudio.url}
              controls
              className="w-full rounded"
              controlsList="nodownload" // Disable download option
            >
              Your browser does not support the audio element.
            </audio>
          </div>

          <button
            onClick={() => setCurrentAudio(null)}
            className="mt-6 px-4 py-2 bg-[#0067FF] text-white rounded-md w-full"
          >
            Close
          </button>
        </div>
      )}
      {loading && <p>Loading...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {showOverlay && renderOverlay()}
    </div>

  );
};
export default Desineedashboard;
