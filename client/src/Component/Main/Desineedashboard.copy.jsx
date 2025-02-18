import React, { useState, useEffect, useRef } from "react";
import { API_URL } from "../utils/Apiconfig";
import files_icon from "../../assets/files-icon.png";
import editicon from "../../assets/editicon.png";
import voiceIcon from "../../assets/voice.png"
const Desineedashboard = () => {
  const [designees, setDesignees] = useState([]);
  const [popupItem, setPopupItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDesignee, setSelectedDesignee] = useState(null);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activePopupId, setActivePopupId] = useState(null);
  const dropdownRef = useRef([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
const [selectedVoiceId, setSelectedVoiceId] = useState(null);
const [openPopup, setOpenPopup] = useState(null); // Track which file/voice popup is open
const [selectedItemId, setSelectedItemId] = useState(null);
const isToggling = useRef(false);


const handleEditIconClick = (item) => {
  setSelectedItemId(item.file_id || item.voice_id); // Set the ID of the clicked item
  setIsPopupOpen(true); // Open the popup
};

// Close the popup
const handleClosePopup = () => {
  setIsPopupOpen(false);
  setSelectedItemId(null); // Clear the selected item
};

const closePopup = () => {
  setOpenPopup(null); // Close the popup
};

const handleOption = (option) => {
  // Handle the selected option for "Only View", "Edit Access", or "Remove Access"
  console.log(option);
  closePopup(); // Close the popup after the action
};

  useEffect(() => {
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
    fetchDesignees();
  }, []);

  const toggleSharedItem = (index) => {
    // Prevent multiple state updates in quick succession
    if (isToggling.current) return;
  
    isToggling.current = true;
    setOpenDropdownIndex((prevIndex) => {
      // Close if the same dropdown is clicked; otherwise, open the clicked one
      const newIndex = prevIndex === index ? null : index;
      setTimeout(() => {
        isToggling.current = false; // Reset toggle flag after debounce
      }, 100); // Adjust debounce timing as needed
      return newIndex;
    });
  };
  

  
  const closeModal = () => {
    setSelectedDesignee(null);
    setOpenDropdownIndex(null); 
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdownIndex !== null &&
        dropdownRef.current[openDropdownIndex] &&
        !dropdownRef.current[openDropdownIndex].contains(event.target)
      ) {
        setOpenDropdownIndex(null); // Close dropdown if clicked outside
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownIndex]);
  
  // if (loading) {
  //   return <div>Loading...</div>;
  // }
  if (error) {
    return <div>Error: {error}</div>;
  }
  console.log(designees);
  return (
    <div className="bg-white-100 min-h-screen p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Your Designees</h1>
        <div className="flex items-center mb-4">
          <button className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">
            Lists of Designee
          </button>
          <span className="ml-2 bg-gray-200 text-gray-600 rounded-full px-2 py-1 text-sm">
            {designees.length}
          </span>
        </div>
        <div className="overflow-x-auto bg-white rounded-lg h-[90vh]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
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
              {designees.map((designee, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap flex items-center mt-2">
                    <div className="bg-gray-100 flex items-center justify-center px-3 py-1.5 ml-[10px] rounded-lg">
                      <img className="h-8 w-8" src={files_icon} alt="" />
                      <span className="ml-4 text-sm font-medium text-gray-900">
                        {designee.designee?.name || "No name"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="ml-4 text-sm text-gray-600">
                      {designee.designee?.phone_number || "No phone number"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {designee.to_email_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center justify-start relative">
                    <i
                      className="fas fa-chevron-down cursor-pointer text-blue-600 mr-3"
                      onClick={() => toggleSharedItem(index)}
                    ></i>
                    <div>
                      <p className="font-semibold mb-1">{designee.files[0]?.file_name}</p>
                      <p className="text-xs text-blue-500 font-semibold"> + {designee.files.length + designee.voices.length} items</p>
                    </div>
                    {/* Dropdown menu */}
                    {openDropdownIndex === index && (
      <div ref={(el) => (dropdownRef.current[index] = el)} className="absolute right-10 mt-2 w-96 bg-white z-50 shadow-lg rounded-2xl border border-gray-200 top-14">
        <div className="p-4">
          <h3 className="text-lg font-semibold">Shared Items</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {/* Shared Files */}
          {designee.files?.length > 0 ? (
            designee.files.map((file, fileIndex) => (
              <li key={`file-${fileIndex}`} className="flex items-center justify-between px-4 py-3 hover:bg-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <img src={files_icon} alt="File Icon" />
                  </div>
                  <span>{file.file_name}</span>
                </div>
                <div className="flex items-center justify-between gap-x-2">
                  <a href={file.aws_file_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    View
                  </a>
                  <img
                    className="w-5 h-5"
                    src={editicon}
                    alt="Edit Icon"
                    onClick={() => handleEditIconClick(file)}
                  />
                </div>

                {/* Popup specific to this file */}
                {isPopupOpen && selectedItemId === file.file_id && (
                  <div className="absolute bg-white border border-gray-300 rounded-lg shadow-lg z-50 right-4 top-20 w-56">
                    <ul className="text-sm">
                      <li className="px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]" onClick={() => setIsPopupOpen(false)}>
                        Only View
                      </li>
                      <li className="px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]" onClick={() => setIsPopupOpen(false)}>
                        Edit Access
                      </li>
                      <li className="px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 hover:text-red-600" onClick={() => setIsPopupOpen(false)}>
                        Remove Access
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-gray-500">No files shared</li>
          )}

          {/* Shared Voices */}
          {designee.voices?.length > 0 ? (
            designee.voices.map((voice, voiceIndex) => (
              <li key={`voice-${voiceIndex}`} className="flex items-center justify-between px-4 py-3 hover:bg-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-5 rounded-full flex items-center justify-center">
                    <img src={voiceIcon} className="rounded bg-transparent object-cover" alt="Voice Icon" />
                  </div>
                  <span>{voice.voice_name}</span>
                </div>
                <div className="flex items-center justify-between gap-x-2">
                  <a href={voice.aws_file_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Listen
                  </a>
                  <img
                    className="w-5 h-5"
                    src={editicon}
                    alt="Edit Icon"
                    onClick={() => handleEditIconClick(voice)}
                  />
                </div>

                {/* Popup specific to this voice */}
                {isPopupOpen && selectedItemId === voice.voice_id && (
                  <div className="absolute bg-white border border-gray-300 rounded-lg shadow-lg z-50 right-4 top-14 w-56">
                    <ul className="text-sm">
                      <li className="px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]" onClick={() => setIsPopupOpen(false)}>
                        Only View
                      </li>
                      <li className="px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]" onClick={() => setIsPopupOpen(false)}>
                        Edit Access
                      </li>
                      <li className="px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 hover:text-red-600" onClick={() => setIsPopupOpen(false)}>
                        Remove Access
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-gray-500">No voices shared</li>
          )}
        </ul>
        <div className="p-4 flex justify-end item-end">
          <button className="w-28 bg-blue-500 text-white py-2 rounded-md" onClick={closeModal}>
            Done
          </button>
        </div>
      </div>
    )}





                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-red-600 border border-red-600 rounded-lg px-4 py-1 text-sm bg-[#FFEBEB]">
                      Remove Access
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Desineedashboard;