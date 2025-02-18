import React, { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import editicon from "../../assets/edit-icon.png";
import profileicon from "../../assets/profile-icon.png";
import fetchUserData from "./fetchUserData";
// import profileavatar from "../../assets/profile-avatar.png";
import { ProfileContext } from '../utils/ProfileContext';
import avatar from "../../assets/avatar.png";
import key from "../../assets/key.png";
import file from "../../assets/file.png";
import filefolder from "../../assets/files-folder.png";
import security from "../../assets/security.png";
import { API_URL } from "../utils/Apiconfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import googledrive from '../../assets/googledrive.png';
import dropbox from '../../assets/dropbox.png';
import profile from '../../assets/profile.png';
import plans from '../../assets/plans.png';
import { FAPI_URL } from "../utils/Apiconfig";
import { FaPen } from "react-icons/fa";
import DropboxPicker from "../utils/GoogleDropboxPicker";
import GainAccess from "./gainaccess"
const DROPBOX_APP_KEY = "oy5t6b3unmpbk0b";  // Replace with your actual Dropbox App Key
const DROPBOX_APP_SECRET = "4jne7a8ly866znt";  // Replace with your actual Dropbox App Secret setGoogleemail
const DROPBOX_REDIRECT_URI = `${FAPI_URL}/my-profile`;
const Profile = () => {
  const [folderSize, setFolderSize] = useState(null);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [memb, setMemb] = useState(false);
  const [connected, setConnected] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("dropboxAccessToken") || "");
  const [googleUser, setGoogleUser] = useState(null);
  const [information,setInformation ] = useState(null);
  const [googleemail, setGoogleemail] = useState(null);
  const [validate, setValidate] = useState(true);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const { profilePicture, setProfilePicture } = useContext(ProfileContext);
  const navigate = useNavigate();
  // Fetch user details on component mount
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false); 
  const [socialSecurityNumber, setSocialSecurityNumber] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [formData, setFormData] = useState({
    ssn: "",
    address: "",
  });
  const [isEdditing, setIsEdditing] = useState({
    ssn: false,
    address: false,
  });
  const [status, setStatus] = useState(false); // Default status is false
  
  const [socialSecurityPass, setSocialSecurityPass] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/api/gain-access/verify-social-pass`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ socialSecurityPass }),
      });
      const data = await response.json();
      if (response.ok) {
        // alert("verified");
        setMessage("Password verified. You can now update details.");
        setTimeout(() => {
        }, 1000);
        setSocialSecurityPass("");
        setStatus(false);
        setValidate(false);
        setInformation(true);
      
      } else {
        setMessage(data.message);
        alert("Please enter valid key")
      }
    } catch (error) {
      setMessage("Error verifying password.");
    }
    setLoading(false);
  };
  const handleGainAccess = async () => {
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/api/gain-access/check-social-pass`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        if (data.socialSecurityPassExists) {
          setStatus(true);
          setMessage("You already have a social security pass.");
        } else {
          setShowPopup(true);
          setMessage("No pass found. Please set your social security pass.");
        }
      } else {
        setMessage(data.message);
      }
      console.log(message);
    } catch (error) {
      setMessage("Error checking access.");
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const toggleEdit = (field) => {
    setIsEdditing({ ...isEdditing, [field]: !isEdditing[field] });
  };
  const fetchsecurityUserDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/api/gain-access/user/details`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setFormData({
          ssn: data.socialSecurityNumber || "",
          address: data.homeAddress || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchsecurityUserDetails();
  }, []);
  
  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/api/gain-access/update-social-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // User authentication
        },
        body: JSON.stringify({
          socialSecurityNumber: formData.ssn,
          homeAddress: formData.address,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Details updated successfully.");
        setIsEditing({ ssn: false, address: false }); // Disable editing after save
        // alert("details updated successfully");
        setValidate(true);
        setInformation(false);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Error updating details.");
    }
    setLoading(false);
  };

    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        if (!data?.user) {
          throw new Error("Invalid response structure");
        }
  
      
  
        // Store Google Drive token if connected
        const googleDrive = data.user.googleDrive?.[0];
        if (googleDrive?.connected && googleDrive?.accessToken) {
          localStorage.setItem("googleDriveToken", googleDrive.accessToken);
          localStorage.setItem("googleDriveConnected", true);
          setIsGoogleConnected(true);
        } else {
          localStorage.removeItem("googleDriveToken");
          localStorage.setItem("googleDriveConnected", false);
          setIsGoogleConnected(false);
        }
  

  
        // Store Dropbox token if connected
        const dropbox = data.user.dropbox?.[0];
        if (dropbox?.connected && dropbox?.accessToken) {
          localStorage.setItem("dropboxToken", dropbox.accessToken);
          localStorage.setItem("dropboxConnected", true);
          setIsConnected(true);
        } else {
          localStorage.removeItem("dropboxToken");
          localStorage.setItem("dropboxConnected", false);
          setIsConnected(false);
        } 


  console.log("helowwwww dropbox",dropbox?.connected && dropbox?.accessToken);
  console.log("helowwwww drive" ,googleDrive?.connected && googleDrive?.accessToken);
      } catch (err) {
        console.error(err.message || "Failed to fetch user data");
      }
    };
    





    const handleDropboxAuth = () => {
      const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${DROPBOX_APP_KEY}&response_type=code&redirect_uri=${encodeURIComponent(
        DROPBOX_REDIRECT_URI
      )}`;
      window.location.href = authUrl; // Redirect user to Dropbox authentication
    };
  
    // Handle Dropbox Callback to exchange code for access token
    const handleDropboxCallback = async (code) => {
      try {
        console.log("Received Dropbox authorization code:", code);
    
        const data = new URLSearchParams();
        data.append("code", code);
        data.append("grant_type", "authorization_code");
        data.append("client_id", DROPBOX_APP_KEY);
        data.append("client_secret", DROPBOX_APP_SECRET);
        data.append("redirect_uri", DROPBOX_REDIRECT_URI);
    
        const response = await axios.post(
          "https://api.dropboxapi.com/oauth2/token",
          data,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
    console.log("response",response);
        const { access_token } = response.data;
        console.log("Received Dropbox access token:", access_token);
    
        if (!access_token) {
          throw new Error("Access token is null. Check the Dropbox API response.");
        }
        updateCloudConnections("","",true,access_token);

        setIsConnected(true);
        const accessToken = localStorage.getItem("dropboxAccessToken");
        console.log("acccessssstokeeennn",accessToken);
      } catch (error) {
        console.error("Error exchanging Dropbox code for token:", error.response ? error.response.data : error.message);
      }
    };
    
    const updateCloudConnections = async (googleDriveConnected, googleDriveToken, dropboxConnected, dropboxToken) => {
      console.log("122");
      const url = `${API_URL}/api/auth/update-cloud-connections`;
      const token = localStorage.getItem("token");
      const payload = {};
    
      console.log("googleDriveConnected", googleDriveConnected);
    
      // Check if the parameter is explicitly passed, even if it's false
      if (typeof googleDriveConnected === "boolean") {
        payload.googleDriveConnected = googleDriveConnected;
      }
      
      if (googleDriveToken) {
        payload.googleDriveToken = googleDriveToken;
      }
    
      if (typeof dropboxConnected === "boolean") {
        payload.dropboxConnected = dropboxConnected;
      }
    
      if (dropboxToken) {
        payload.dropboxToken = dropboxToken;
      }
    
      console.log("payload", payload);
      console.log("token", token);
    
      try {
        const response = await axios.post(url, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        console.log("Cloud connections updated successfully:", response.data);
        getUserData();
      } catch (error) {
        console.error("Error updating cloud connections:", error.response ? error.response.data : error.message);
        getUserData();
      }
    };
    
    
    
    
    // Handle Dropbox disconnection
    const handleDropboxDisconnect = () => {
      console.log("dropbox");
      // localStorage.removeItem("dropboxToken");
      updateCloudConnections("","",false,"");
      // setIsConnected(false);
      // getUserData();
    };

    const handledriveDisconect = () => {
      console.log("drive");
      // localStorage.removeItem("googleDriveToken");
      updateCloudConnections(false,"","","");
      // setIsGoogleConnected(false);
      // getUserData();
    };
  
    // Check if Dropbox account is already connected on page load
    useEffect(() => {
      const accessToken = localStorage.getItem("dropboxToken");
      console.log("acccessssstokeeennn",accessToken);
      if (accessToken) {
        setIsConnected(true);

      }
  
      // If the page contains a "code" query parameter, handle the callback
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      if (code) {
        handleDropboxCallback(code); // Call the function to exchange code for access token
      }
    }, []);


    useEffect(() => {
      const accessgoogletoken = localStorage.getItem("googleDriveToken");
      console.log("acccessssstokeee3333nnn",accessgoogletoken);
      if (accessgoogletoken) {
        setIsGoogleConnected(true);
        setGoogleemail(googleemail);
      }
    }, []);


  const handleGoogleAuth = () => {
    if (!window.google || !window.google.accounts) {
      console.error("❌ Google Identity Services not loaded.");
      return;
    }

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: "938429058016-5msrkacu32pvubd02tpoqb6vpk23cap3.apps.googleusercontent.com",
      scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.readonly",
      callback: async (response) => {
        if (response && response.access_token) {
          console.log("✅ Auth successful:", response);
          // localStorage.setItem("googleToken", response.access_token);
          setIsGoogleConnected(true);
          updateCloudConnections(true,response.access_token,"","");
          // Fetch user profile info dynamically
          fetchGoogleUser(response.access_token);
        } else {
          console.error("❌ Auth failed:", response);
        }
      },
    });

    client.requestAccessToken();
  };

  // Fetch Google user profile info dynamically
  const fetchGoogleUser = async (accessToken) => {
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userData = await res.json();
      console.log("👤 Google User Data:", userData);
      setGoogleUser(userData);
      localStorage.setItem("googledriveemail", userData.email);
      console.log("--------------------");
      const googleemail = localStorage.getItem("googledriveemail");

      console.log("googleemail",googleemail);
    } catch (error) {
      console.error("❌ Error fetching Google user data:", error);
    }
  };



  useEffect(() => {
    // Fetch folder size from the backend API
    const fetchFolderSize = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/get-folder-size`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include JWT token if required
          },
        });

        const totalSizeKB = response.data.totalSizeKB; // Get size in KB
        let displaySize;
        let unit;

        if (totalSizeKB < 1024) {
          displaySize = totalSizeKB.toFixed(2);
          unit = 'KB';
        } else if (totalSizeKB < 1024 * 1024) {
          displaySize = (totalSizeKB / 1024).toFixed(2);
          unit = 'MB';
        } else {
          displaySize = (totalSizeKB / 1024 / 1024).toFixed(2);
          unit = 'GB';
        }

        setFolderSize({ value: displaySize, unit });
      } catch (err) {
        console.error('Error fetching folder size:', err);
        setError('Failed to retrieve folder size');
      }
    };

    fetchFolderSize();
  }, []);
 
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/auth/get-personaluser-details`, {
          headers: {
            Authorization: `Bearer ${token}`, // Assuming token is stored in localStorage
          },
        });
        setUserDetails({
          name: response.data.user.username,
          email: response.data.user.email,
          phone: response.data.user.phoneNumber,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    
// Fetch the profile picture when the component mounts
const fetchProfilePicture = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/auth/get-profile-picture`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store the token in localStorage
      },
    });
    setProfilePicture(response.data.profilePicture); // Set the profile picture URL in state
  } catch (error) {
    console.error("Error fetching profile picture:", error);
  }
};

    useEffect(() => {
  
      fetchProfilePicture();
    }, []);


  useEffect(() => {
    
    fetchUserDetails();
  }, []);


  async function logout() {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("No token found. Please log in again.");
        }

        const apiUrl = `${API_URL}/api/auth/signout`;

        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        const response = await fetch(apiUrl, { method: "POST", headers });

        if (!response.ok) {
            throw new Error("Failed to log out. Please try again.");
        }

        // Clear token from localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("googleDriveToken");
        localStorage.removeItem("dropboxToken");
        // Clear cookies if used
        Cookies.remove("token");

        // Prevent cached pages from being accessed
        window.history.pushState(null, null, window.location.href);
        window.addEventListener("popstate", () => {
            window.history.pushState(null, null, window.location.href);
        });

        // Redirect to the login page
        navigate("/Login");
    } catch (error) {
        console.error(error);
    }
}

  // Handle profile picture upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview the image locally
      setProfilePicture(URL.createObjectURL(file));

      // Prepare form data
      const formData = new FormData();
      formData.append("profilePicture", file);
      console.log("API URL:", `${API_URL}/api/auth/upload-profile-picture`);


      try {
        // Send the image to the backend
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${API_URL}/api/auth/upload-profile-picture`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`, // Add token if needed
            },
          }
        );

        if (response.status === 200) {
          // alert("Profile picture updated successfully!");
          fetchProfilePicture();
        }
        // setProfilePicture(response.data.profilePicture); // Update the state in Navbar
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        // alert("Failed to upload profile picture. Please try again.");
      }
    }
  };
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [id]: value,
    }));
  };
  const saveChanges = async () => {
    //   toggleEditMode();
    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      const response = await fetch(`${API_URL}/api/auth/update-user-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token for authentication
        },
        body: JSON.stringify({
          username: userDetails.name,
          email: userDetails.email,
          phoneNumber: userDetails.phone,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // alert(data.message); // Show success message
        setIsEditMode(false); // Exit edit mode
        fetchUserDetails();
      } else {
        // alert(data.message); // Show error message
      }
    } catch (error) {
      console.error("Error saving user details:", error);
      // alert("An error occurred while saving the details. Please try again.");
    }
  };

const convertToGB = (value, unit) => {
  switch (unit.toLowerCase()) {
    case "kb":
      return value / (1024 * 1024); // KB to GB
    case "mb":
      return value / 1024; // MB to GB
    case "gb":
      return value; // Already in GB
    default:
      return 0; // Default for unknown units
  }
};
  return (
    <div className="bg-gray-50 p-6">
      <div className="mx-auto">
        {/* <div className="flex items-center mb-6">
          <i className="fas fa-arrow-left text-gray-500 mr-2"></i>
          <span className="text-[#212636]">Back</span>
        </div> */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-6 gap-4">
            {/* Profile Picture */}
            <span className="border border-[#DCDFE4] rounded-full p-2">
              <div className="relative w-16 h-16 group">
                <div className="w-full h-full rounded-full overflow-hidden">
                  {/* Display the profile picture if available */}
        {profilePicture ? (
          <img
            src={profilePicture}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white">No Image</div> // Fallback if no image
        )}
                </div>
                <div
                  className="absolute cursor-pointer inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <div className="rounded-full p-4 relative">
                    <img
                      src={editicon}
                      alt="Edit Profile"
                      className="w-full h-full object-cover"
                    />
                    {/* Hidden file input */}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              </div>
            </span>
            {/* Edit Button */}
            {/* <button
              className="absolute top-0 right-0 p-2 bg-gray-700 text-white rounded-full cursor-pointer hover:opacity-100 transition-opacity"
              onClick={() => setIsEditing(true)} 
            >
              <i className="fas fa-pencil-alt"></i>
            </button> */}
            {/* File Input for Image Upload */}
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-24 h-24 opacity-0 cursor-pointer z-10" // Ensure z-index is high enough
                onChange={handleImageChange}
                onClick={(e) => e.stopPropagation()} // Prevent click event from closing the input
              />
            )}
            <div>
              <h1 className="text-3xl font-semibold capitalize text-[#212636]">{userDetails.name}</h1>
              <p className="text-[#667085] text-base">{userDetails.email}</p>
            </div>
          </div>
          <div className="md:flex md:flex-row flex-col gap-6">
            <div className="md:w-2/5 flex flex-col w-full gap-6">
              <div className="bg-white rounded-[20px] border-2 border-[#ececec]">
                <div className="flex justify-between px-6 mt-4">
                  <div className="flex items-center justify-start mb-4">
                    <span className="rounded-full p-2 bg-white shadow-md">
                      <img src={avatar} alt="" className="h-[25px]" />
                    </span>
                    <h2 className="text-lg font-semibold ml-2">Basic Details</h2>
                    {/* <i
                    className="fa-light fa-pen text-gray-500 cursor-pointer"
                    onClick={toggleEditMode}
                  ></i> */}
                  </div>
                  <img src={profileicon} className="h-[37px] mt-1" alt="" onClick={toggleEditMode} />
                </div>
                <div className="px-6 py-3 border-b-2 border-[#ececec]">
                  <p className="text-gray-500">Name</p>
                  {!isEditMode ? (
                    <p>{userDetails.name}</p>
                  ) : (
                    <input
                      id="name"
                      className="border border-gray-300 rounded-lg p-2 w-full"
                      type="text"
                      value={userDetails.name}
                      onChange={handleInputChange}
                    />
                  )}
                </div>
                <div className="px-6 py-3 border-b-2 border-[#ececec]">
                  <p className="text-gray-500">Email</p>
                  {!isEditMode ? (
                    <p>{userDetails.email}</p>
                  ) : (
                    <input
                      id="email"
                      className="border border-gray-300 rounded-lg p-2 w-full"
                      type="email"
                      value={userDetails.email}
                      onChange={handleInputChange}
                    />
                  )}
                </div>
                <div className="mb-4 px-6 py-3">
                  <p className="text-gray-500">Phone number</p>
                  {!isEditMode ? (
                    <p>{userDetails.phone}</p>
                  ) : (
                    <input
                      id="phone"
                      className="border border-gray-300 rounded-lg p-2 w-full"
                      type="text"
                      value={userDetails.phone}
                      onChange={handleInputChange}
                    />
                  )}
                </div>
                <div className="mb-4 px-6 pb-3">
                  {isEditMode && (
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                      onClick={saveChanges}>
                      Save
                    </button>
                  )}
                </div>
              </div>
              <div className="bg-white p-6 rounded-[20px] border-2 border-[#ececec]">
      {/* Header Section */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gray-200 p-2 rounded-full">
        <img
            src={profile}
            alt="Google Drive"
            className="w-8 h-8"
          />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Accounts</h2>
      </div>

      {/* Google Drive Account */}
      <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-4">
    <div className="flex items-center space-x-3">
      <img src={googledrive} alt="Google Drive" className="w-8 h-8" />
      <div>
        <p className="text-gray-900 font-medium">Google Drive</p>
    <p className="text-sm text-gray-500">{googleemail ? googleemail : ""}</p>

      </div>
    </div>

    {/* Toggle Button */}
    <label className="relative inline-flex items-center cursor-pointer">
  <input
    type="checkbox"
    className="sr-only peer"
    checked={isGoogleConnected}
    onChange={() => {
      if (isGoogleConnected) {
        handledriveDisconect();
      } else {
        handleGoogleAuth();
      }
    }}
  />
  <div className="w-10 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-green-500 transition-all"></div>
  <span className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 peer-checked:translate-x-4 transition-transform"></span>
</label>

  </div>

      {/* DropBox Account */}
      <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img src={dropbox} alt="" className="w-8 h-8" />
        <p className="text-gray-900 font-medium">Dropbox</p>
      </div>
      {isConnected ? (
        <button
          className="text-sm font-medium text-gray-600 bg-gray-100 px-4 py-1 rounded-full border border-gray-300 hover:bg-gray-200 transition hover:text-red-500"
          onClick={handleDropboxDisconnect} // Disconnect Dropbox
        >
          Disconnect
        </button>
      ) : (
        <button
          className="text-sm font-medium text-gray-600 bg-gray-100 px-4 py-1 rounded-full border border-gray-300 hover:bg-gray-200 transition  hover:text-green-500"
          onClick={handleDropboxAuth}
        >
          Connect
        </button>
      )}
    </div>
    </div>
    {validate && (
      //         <div className="bg-white p-6 rounded-[20px] border-2 border-[#ececec]">
      //           <div className="flex items-center justify-start mb-4">
      //             <span className="rounded-full p-2 bg-white shadow-md">
      //               <img src={key} alt="" className="h-[25px]" />
      //             </span>
      //             <h2 className="text-lg font-semibold ml-2">Secure Personal Information</h2>
      //           </div>
      //           <p className="text-gray-500 mb-4">
      //             Please re-enter your password to view or edit this information.
      //           </p>
      //           {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
      //             Gain Access
      //           </button> */}
      //           <button className="text-blue-600 border w-full 2xl:w-4/12 font-medium hover:border-green-400 border-[#0067FF] px-4 py-2 rounded-lg text-sm hover:text-green-500" onClick={handleGainAccess}>Gain Access</button>
      //           {showPopup && (
      //   <GainAccess onClose={() => setShowPopup(false)} onVerified={() => setShowPopup(false)} />
      // )}
      //         </div>

      <></>
    )}
              {status && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-11/12 max-w-md rounded-lg shadow-lg p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Sensitive Personal Information</h2>
          <button className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-times" onClick={() => {setStatus(false)
              setSocialSecurityPass("");
            }}></i>
          </button>
        </div>
        <p className="text-gray-600 mb-4">An extra layer of password protection for added security</p>
        <label className="block text-gray-700 mb-2">Enter Social Security Pass</label>
        <input
          type="password"
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
          value={socialSecurityPass}
          onChange={(e) => setSocialSecurityPass(e.target.value)}
        />
        <button
          className="w-full bg-blue-600 text-white rounded-lg py-2 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={loading}
        >
          Submit
        </button>
      </div>
    </div>
 )}
 {information && (
  <div className="">
  <div className="flex items-center mb-4">
    <img
      src="https://storage.googleapis.com/a1aa/image/dAx-e24EbgXzqmzZ8lUNBHQtNAzj3eYYasPS1I7Em3Q.jpg"
      alt="Key icon"
      className="w-6 h-6 mr-2"
    />
    <h2 className="text-lg font-semibold">Sensitive Personal Information</h2>
  </div>
  {/* Social Security Number */}
  <div className="mb-4">
    <div className="flex items-center justify-between mb-1">
      <label className="text-gray-700">Social Security Number</label>
      <FaPen
        className="text-gray-400 cursor-pointer"
        onClick={() => toggleEdit("ssn")}
      />
    </div>
    <input
      className="bg-blue-100 text-blue-600 p-2 rounded w-full"
      id="ssn"
      type="text"
      value={formData.ssn}
      onChange={handleChange}
      disabled={!isEdditing.ssn}
    />
  </div>
  {/* Home Address */}
  <div>
    <div className="flex items-center justify-between mb-1">
      <label className="text-gray-700">Home Address</label>
      <FaPen
        className="text-gray-400 cursor-pointer"
        onClick={() => toggleEdit("address")}
      />
    </div>
    <input
      className="bg-blue-100 text-blue-600 p-2 rounded w-full"
      id="address"
      type="text"
      value={formData.address}
      onChange={handleChange}
      disabled={!isEdditing.address}
    />
  </div>
  {/* Save Button */}
  {(isEdditing.ssn || isEdditing.address) && (
    <button className="bg-blue-500 text-white p-2 rounded mt-4 w-full" onClick={handleSave}>
      Save
    </button>
  )}
</div>
 )}
            </div>
            
            <div className="md:w-3/5 flex flex-col w-full gap-6">
              <div className="bg-white p-6 rounded-[20px] border-2 border-[#ececec]">
                <div className="p-6  rounded-[8px] border-2 border-[#ececec]">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width:
                          folderSize && folderSize.value
                            ? `${Math.min(
                                (convertToGB(folderSize.value, folderSize.unit) / 20) * 100,
                                100
                              )}%`
                            : "0%", 
                      }}
                    ></div>
                  </div>
                  {/* <p className="text-gray-500">10.47 GB of 20 GB</p> */}
                  {error ? (
        <p className="text-red-500">{error}</p>
      ) : folderSize !== null ? (
        <p className="text-gray-500">
          {folderSize.value} {folderSize.unit} of 20 GB
        </p>
      ) : (
        <p className="text-gray-500">Loading...</p>
      )}
                  <div className="flex items-center justify-between ">
                    <h2 className="text-lg font-semibold">Storage Used</h2>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[20px] border-2 border-[#ececec]">
                <div className="flex flex-col lg:flex-row md:justify-between lg:items-center mb-4">
                  <div className="flex items-center justify-start mt-2 mb-4">
                    <span className="rounded-full p-2 bg-white shadow-md">
                      <img src={file} alt="" className="h-[25px]" />
                    </span>
                    <h2 className="text-lg font-semibold ml-2">Subscription Plan</h2>
                  </div>
                  {/* <button className="text-blue-600 border font-medium border-[#0067FF] bg-[#0067FF14] px-4 py-2 rounded-lg text-sm">Deactivate Subscription</button> */}
                </div>
                <div className="border-2 border-blue-600 rounded-lg p-8 mb-4">
                  <p className="text-black text-xs mb-1 font-semibold">STANDARD</p>
                  <div className="flex justify-between md:mr-3 items-center flex-col lg:flex-row">
                    <div className="flex items-center">
                      <h1 className="text-5xl font-semibold">$4.99</h1>
                      <span className="text-4xl text-gray-500 ml-2">/mo</span>
                    </div>
                    <img src={filefolder} alt="Subscription plan icon" className="mt-4 w-28" />
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
                onClick={()=>setMemb(true)}>
                  Upgrade Plan
                </button>
              </div>
              <div className="bg-white p-6 rounded-[20px] border-2 border-[#ececec]">
                <div className="flex items-center mb-4">
                  <span className="rounded-full p-2 bg-white shadow-md">
                    <img src={security} alt="" className="h-[25px]" />
                  </span>
                  <h2 className="text-lg font-semibold ml-2">Log Out of Your Account</h2>
                </div>
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg my-2 hover:text-red-500" onClick={logout}>
                  Log Out
                </button>
                <p className="text-gray-500 my-2">
                  Click to securely log out of your account. We'll save all your
                  progress for when you return.
                </p>
              </div>
              
            </div>
          </div>
        </div>
        {memb && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6">
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-3xl w-full m-4 md:m-6">
      <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-left">Upgrade Plan</h1>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        {/* Legacy Plan */}
        <div className="border rounded-lg p-4 sm:p-6 flex flex-col">
          <div className="flex items-center mb-3 sm:mb-4">
            <img src={plans} alt="Legacy Plan Icon" className="mr-2 sm:mr-3 h-8 sm:h-10 w-8 sm:w-10" />
            <div>
              <p className="text-xl sm:text-2xl font-bold">
                $99 <span className="text-sm sm:text-lg font-normal">/Year</span>
              </p>
              <p className="text-md sm:text-lg">Legacy</p>
            </div>
          </div>
          <ul className="space-y-1 sm:space-y-2 flex-1 text-sm sm:text-base">
            {[
              "50 GB Storage",
              "Enhanced Encryption",
              "Advanced Sharing Controls",
              "Advanced Nominee Assignment",
              "Google Drive, Dropbox Integration",
              "Automatic Photo Upload",
              "Priority Support",
              "Voice Memo"
            ].map((feature, index) => (
              <li key={index} className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-1 sm:mr-2"></i>{feature}
              </li>
            ))}
          </ul>
        </div>
        {/* Heritage Plan */}
        <div className="border rounded-lg p-4 sm:p-6 flex flex-col">
          <div className="flex items-center mb-3 sm:mb-4">
            <img src={plans} alt="Heritage Plan Icon" className="mr-2 sm:mr-3 h-8 sm:h-10 w-8 sm:w-10" />
            <div>
              <p className="text-xl sm:text-2xl font-bold">Custom Pricing</p>
              <p className="text-md sm:text-lg">Heritage</p>
            </div>
          </div>
          <ul className="space-y-1 sm:space-y-2 flex-1 text-sm sm:text-base">
            {[
              "Custom Storage Options",
              "Top Compliance Level Encryption",
              "Full Sharing & Customization",
              "Custom Inheritance Options",
              "Full Suite of Integrations",
              "Automatic Photo Upload",
              "24/7 Dedicated Support",
              "Voice Memo, Notepad",
              "Customizable Solutions"
            ].map((feature, index) => (
              <li key={index} className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-1 sm:mr-2"></i>{feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex justify-end mt-4 sm:mt-6">
        <button className="text-gray-500 mr-3 sm:mr-4 text-xs sm:text-sm" onClick={() => setMemb(false)}>
          Cancel
        </button>
        <button className="bg-blue-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-600 transition-colors">
          Upgrade
        </button>
      </div>
    </div>
  </div>
)}

      
      </div>

     

    </div>
  );
};
export default Profile;