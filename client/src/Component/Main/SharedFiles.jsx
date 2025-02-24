import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, ChevronRight, Grid, List, EllipsisVertical, Search, Camera, Download, FilePenLine, X } from "lucide-react";
import axios from "axios";
import { useLocation, NavLink } from 'react-router-dom';
import { API_URL } from "../utils/Apiconfig";
import doc from "../../assets/Document.png";
import voiceIcon from '../../assets/voice.png'
import editicon from "../../assets/editicon.png";
import play from "../../assets/Play.png";
import usePopupStore from "../../store/DesigneeStore";
import DesignerPopup from "./Designeepopup";
import downloadicon from "../../assets/downloadicon.png";
import fetchUserData from "./fetchUserData";
import useFolderDeleteStore from "../../store/FolderDeleteStore";
const SharedFiles = () => {
  const [isGridView, setIsGridView] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [users, setUsers] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [afterfile, setAfterfile] = useState([]);
  const [queryParams, setQueryParams] = useState({ email: "", otp: "" });
  const [expandedItemId, setExpandedItemId] = useState(null); // Track dropdown visibility
  const dropdownRef = useRef([]); // Reference for dropdown positioning
  const location = useLocation();
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [sharedUser, setsharedUser] = useState(true);
  const [afteruser, setAfteruser] = useState(true);
  const [sharedItem, setsharedItem] = useState(false);
  const [SharedVoices, setSharedVoices] = useState([]);
  const [afteruserVoice, setAfteruserVoice] = useState([]);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [designers, setDesigners] = useState([]);
  const [filename, setfilename] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [fileId, setfileId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newFileName, setNewFileName] = useState(fileName);
  const [files, setFiles] = useState([]);
  const [fileaccess, setFileAccess] = useState([]);
  const [tempFName, setTempFName] = useState(fileName);
  const [deletebutton2, setDeletebutton2] = useState(false);
  const [extension, setExtension] = useState("");
  const [sharedemail, setSharedemail] = useState("");
  const [length, setLength] = useState(false);
  const [access, setAccess] = useState(false);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);
  const {
    showDesignerPopup,
    closePopup,
    designeeName,
    setDesigneeName,
    designeePhone,
    setDesigneePhone,
    designeeEmail,
    setDesigneeEmail,
  } = usePopupStore();

  const {
    deletebuttonfolder,
    setDeletebuttonfolder,
    setSelectedFolder,
    selectedFolder,
    deleteFolder,
    openMenufolderId,
    setOpenMenufodlerId,
  } = useFolderDeleteStore();

  // const handleClickOutside = (event) => {

  //   if (dropdownRef.current[openDropdownIndex] && !dropdownRef.current[openDropdownIndex].contains(event.target)) {
  //     setExpandedItemId(null);
  //   }
  // };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        if (!data?.user) {
          throw new Error("Invalid response structure");
        }

        // console.log("data", data);
        // console.log("data user", data.user.email);
        // console.log("data user email", email);
        setSharedemail(data.user.email); // Update email state here

      } catch (err) {
        // console.log(err.message || "Failed to fetch user data");
      }
    };
    getUserData();
  }, []);

  // Use another useEffect to track state changes
  useEffect(() => {
    // console.log("Updated sharedemail:", sharedemail);
  }, [sharedemail]);



  const fetchUsersWithFileAccess = async (fileId) => {
    // console.log("1");
    try {
      // console.log("2");
      setLoading(true);
      setError(null); // Reset error before making request
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token is missing");

      const response = await axios.post(
        `${API_URL}/api/designee/assignments`,
        { file_id: fileId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // console.log("3");
      // console.log("heeelooo i am with r3esponse", response);
      const designees = response.data.data;
      const filteredUsers = designees.map((user) => ({
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        permission: user.access,
        role: user.role || "Viewer", // Assuming you might get role from the API
        avatar: user.avatar || "https://placehold.co/40", // Use real avatar if available
      }));

      setAccess(true);
      setUsers(filteredUsers);
    } catch (error) {
      // console.log("Failed to fetch data. Please try again.");
      setAccess(true);
    } finally {
      setLoading(false);
    }
  };


  const handleEditClick = () => {

    if (!token || token.trim() === '') {  // Check for null, undefined, or empty string
      setShowOverlay(false);
      setIsEditing(false);
      setDeletebutton2(true);
      // console.log("yyyyeeee, token", token);
    } else {
      setIsEditing(true);
    }
    const filenameEdit = tempFName;
    const extensionedit = filenameEdit.includes('.')
      ? filename.slice(filename.lastIndexOf('.') + 1)
      : '';
    const fileWithoutExtension = filename.slice(0, filename.lastIndexOf('.'));
    setExtension(extensionedit);

    setTempFName(fileWithoutExtension);

    // console.log(extension);
    // console.log(fileWithoutExtension)
  };

  // useEffect(() => {

  //   handleClickOutside();
  // }, []);

  const handleSaveEdit = async (fileId) => {
    // console.log("helooooooo", email);
    // console.log("helooooooo", sharedemail);
    const finalEmail = email || sharedemail;
    // console.log("Saving File Name:", tempFName, "for File ID:", fileId);
    // console.log("Saving File filename:", filename, "for File ID:", fileId);

    // Ensure the filename is not empty
    if (!filename.trim()) {
      // console.error("Filename cannot be empty.");
      return;
    }

    // const savefile = newFileName;
    // const extensionSave = extension;
    // const originalFileSave = savefile + '.' + extensionSave;

    // console.log("dhjdbjdbjbcjsdbcdbcdbcsackjsncjsncdscscjksdcs", originalFileSave);

    // console.log("savefiles", savefile);
    // console.log("extension of that file", extensionSave)


    // Check if fileName is available and has a valid extension
    const originalFileName = filename || ""; // Provide a fallback in case fileName is null
    const fileExtension =
      originalFileName.includes(".") && originalFileName.lastIndexOf(".") > 0
        ? originalFileName.slice(originalFileName.lastIndexOf("."))
        : "";
    // console.log("extenstion", fileExtension);
    // console.log("tempFName", tempFName);
    // Ensure the edited file name ends with the correct extension
    const newFileName = tempFName.endsWith(fileExtension)
      ? tempFName
      : tempFName + fileExtension;

    // console.log("Final File Name with Extension:", newFileName);

    try {
      const response = await axios.post(`${API_URL}/api/edit-file-name`, {
        file_id: fileId,
        new_file_name: newFileName,
        email: finalEmail
      });

      // console.log("Response:", response);

      if (response.data.message === "File name updated successfully.") {
        setIsEditing(false);
        setFileName(newFileName);
        setTempFName(""); // Reset temp file name
        // console.log("fileeeee nameeeee", newFileName);
        // console.log("fileeeeeeeeee id", fileId);
        sharedAllFiles(); // Refresh file list
        fetchFileContent(fileId);
      }
    } catch (error) {
      // console.error("Error updating file name:", error);
    }
  };



  const handleEditIconClick = (item) => {
    setSelectedItemId(item.file_id || item.voice_id); // Set the ID of the clicked item
    setIsPopupOpen(true); // Open the popup
  };

  const calculateTotalFileSize = (files) => {
    // Deduplicate files based on unique file_id
    const deduplicateFiles = (items) => {
      const seen = new Set();
      return items.filter((item) => {
        const itemId = item.file_id;
        if (seen.has(itemId)) {
          return false;
        }
        seen.add(itemId);
        return true;
      });
    };

    // Deduplicate the files
    const uniqueFiles = deduplicateFiles(files);

    // Calculate the total size of unique files
    let totalSize = 0;

    uniqueFiles.forEach(file => {
      if (file.file_size) {
        totalSize += file.file_size; // Assuming file_size is in bytes
      }
    });

    return totalSize;
  };

  // Sample usage inside your Afterlife function

  const Afterlife = async (email) => {
    const token = localStorage.getItem("token");

    try {
      let response;
      const payload = { to_email_id: email };

      if (token) {
        response = await axios.post(
          `${API_URL}/api/after-life/get-shared-cumulus`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        response = await axios.post(
          `${API_URL}/api/after-life/get-shared-files-nc`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }
      // console.log("hekkkooooooooooo", response);
      // console.log("data user email", email);

      const deduplicateItems = (items) => {
        const seen = new Set();
        return items.filter((item) => {
          const itemId = item.file_id || item.voice_id || item.id;
          if (seen.has(itemId)) {
            return false;
          }
          seen.add(itemId);
          return true;
        });
      };

      if (response.data) {
        const filesWithUsers = response.data.files || [];
        const voicesWithUsers = response.data.voices || [];

        const allFiles = filesWithUsers.flatMap((userFiles) => {
          const create = userFiles.created_at;
          const fromUser = userFiles.from_user;
          const sharedFiles = userFiles.shared_files || [];
          return sharedFiles.map((file) => ({
            ...file,
            from_user: fromUser,
            created_at: create
          }));
        });

        const allVoices = voicesWithUsers.flatMap((userVoices) => {
          const create = userVoices.created_at;
          const fromUser = userVoices.from_user;
          const sharedVoices = userVoices.shared_voices || [];
          return sharedVoices.map((voice) => ({
            ...voice,
            from_user: fromUser,
            created_at: create
          }));
        });

        const uniqueFiles = deduplicateItems(allFiles);
        const uniqueVoices = deduplicateItems(allVoices);

        setAfterfile(uniqueFiles);
        setAfteruserVoice(uniqueVoices);

        // Calculate total file size
        const totalFileSize = calculateTotalFileSize(uniqueFiles);
        // console.log("Total File Size in bytes:", totalFileSize);
      }
    } catch (error) {
      // console.error("Error fetching shared files: ", error);
    }
  };






  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const email = params.get("email");
    sharedAllFiles(email);
  }, []);



  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const email = params.get("email");
    Afterlife(email);
  }, []);

  const sharedAllFiles = async (email) => {
    const token = localStorage.getItem("token");

    try {
      let response;
      const payload = { to_email_id: email };

      if (token) {
        response = await axios.post(
          `${API_URL}/api/designee/get-shared-cumulus`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }

        );
        // console.log("responsee", response)
      } else {
        response = await axios.post(
          `${API_URL}/api/designee/get-shared-files-nc`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }

      const deduplicateItems = (items) => {
        const seen = new Set();
        return items.filter((item) => {
          const itemId = item.file_id || item.voice_id || item.id; // Adjust based on schema
          if (seen.has(itemId)) {
            return false;
          }
          seen.add(itemId);
          return true;
        });
      };

      if (response.data) {
        // console.log("responseeeeeeeeeeeeeeeeeeeee", response)
        // Separate files and voices
        const filesWithUsers = response.data.files || [];
        const voicesWithUsers = response.data.voices || [];

        const allFiles = filesWithUsers.flatMap((userFiles) => {
          const create = userFiles.created_at;

          const fromUser = userFiles.from_user;
          const sharedFiles = userFiles.shared_files || [];
          return sharedFiles.map((file) => ({
            ...file,
            from_user: fromUser,
            created_at: create
          }));
        });
        // console.log("shareddddddddddddddddddddddddddd", allFiles)

        const allVoices = voicesWithUsers.flatMap((userVoices) => {
          const fromUser = userVoices.from_user;
          const sharedVoices = userVoices.shared_voices || [];
          return sharedVoices.map((voice) => ({
            ...voice,
            from_user: fromUser,

          }));
        });

        // Remove duplicates from both files and voices
        const uniqueFiles = deduplicateItems(allFiles);
        const uniqueVoices = deduplicateItems(allVoices);

        // Store these in separate states
        setSharedFiles(uniqueFiles);
        setSharedVoices(uniqueVoices);

        // console.log("Shared Files: ", uniqueFiles); // Log files for debugging
        // console.log("Shared Voices: ", uniqueVoices); // Log voices for debugging
      }
    } catch (error) {
      // console.error("Error fetching shared files: ", error);
    }
  };
  // console.log(SharedVoices);
  // Group voices by voice_name

  const handlePlay = async (file) => {
    // console.log("styarting playing", file);
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
      // console.log("response ", response.data);
      const { audio_url, voice_name } = response.data;

      if (!audio_url) {
        // console.error("Audio URL is missing");
        return;
      }

      // Set the current audio for the popup without playing it
      setCurrentAudio({ url: audio_url, name: voice_name });
      // console.log("currentAudio ", currentAudio);
    } catch (err) {
      // console.error("Error fetching audio:", err);
    }
  };

  const handleAddDesignee = () => {
    if (designeeName && designeePhone && designeeEmail) {
      setDesigners([...designers, designeeName]); // Add the new designer to the list
      closePopup(); // Close the popup
      setDesigneeName(""); // Reset the input fields
      setDesigneePhone("");
      setDesigneeEmail("");
    } else {
      setError("Please fill out all fields before inviting a designee.");
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailFromUrl = queryParams.get('email');
    if (emailFromUrl) {
      setQueryParams((prevParams) => ({
        ...prevParams,
        email: emailFromUrl,
      }));
      setEmail(emailFromUrl);
    }
  }, [location]);

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const email = params.get("email");
    sharedAllFiles(email);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const guest_token = localStorage.getItem("guest_token");
    if (token) {
      setShowPopup(false);
    } else {
      setShowPopup(!guest_token);
    }
  }, []);

  const toggleDropdown = (username, accessType, e) => {
    e.stopPropagation();

    const key = `${username}-${accessType}`; // Create a unique key for each dropdown
    setExpandedItemId(expandedItemId === key ? null : key); // Toggle only if the same key is clicked
  };

  // Group by username and access type
  const groupedFiles = sharedFiles.reduce((acc, file) => {
    // Check that file and file.from_user exist
    if (!file || !file.from_user || !file.created_at) return acc;
    const create = file.created_at || "undefined"
    const username = file.from_user.username || "Unknown User";
    const accessType = file.access || "view" || "View" || "read-only";

    if (!acc[username]) {
      acc[username] = {
        username,
        files: { view: [], Edit: [] },
        create
      };
    }

    acc[username].files[accessType]?.push(file); // Safe push operation

    return acc;
  }, {});



  const afterfiles = afterfile.reduce((acc, file) => {
    if (!file || !file.from_user || !file.created_at) return acc;
    const create = file.created_at || "undefined"
    const username = file.from_user.username || "Unknown User";
    const accessType = file.access || "view" || "View" || "read-only";

    if (!acc[username]) {
      acc[username] = {
        username,
        files: { view: [], Edit: [] },
        create
      };
    }

    if (!acc[username].files[accessType]) {
      acc[username].files[accessType] = [];
    }

    acc[username].files[accessType].push(file);

    return acc;
  }, {});


  const getUniqueFilesLength = (afterfiles) => {
    return Object.values(afterfiles).reduce((total, user) => {
      // Count unique files for 'view' and 'Edit' access types
      const viewFiles = user.files.view.filter(file => file && !user.uniqueFiles.has(file.id));
      const editFiles = user.files.Edit.filter(file => file && !user.uniqueFiles.has(file.id));

      // Add unique files to the set
      viewFiles.forEach(file => user.uniqueFiles.add(file.id));
      editFiles.forEach(file => user.uniqueFiles.add(file.id));

      return total + viewFiles.length + editFiles.length;
    }, 0);
  };

  const groupedVoices = SharedVoices.reduce((acc, voice) => {

    if (!voice || !voice.from_user) return acc;

    const username = voice.from_user.username || "Unknown User";
    const accessType = voice.access || "view" || "View" || "read-only";

    if (!acc[username]) {
      acc[username] = {
        username,
        voices: { view: [], Edit: [] },
      };
    }

    acc[username].voices[accessType]?.push(voice); // Safe push operation

    return acc;
  }, {});


  const aftervoice = afteruserVoice.reduce((acc, voice) => {

    if (!voice || !voice.from_user) return acc;

    const username = voice.from_user.username || "Unknown User";
    const accessType = voice.access || "view" || "View" || "read-only";

    if (!acc[username]) {
      acc[username] = {
        username,
        voices: { view: [], Edit: [] },
      };
    }

    acc[username].voices[accessType]?.push(voice); // Safe push operation

    return acc;
  }, {});


  useEffect(() => {


    // console.log("Grouped Files: ", groupedFiles);
    // console.log("Grouped Voices: ", groupedVoices);
    // console.log("Grouped afterfiles: ", afterfiles);
    // console.log("Grouped aftervoice: ", aftervoice);

  }, [])




  const handlesharedUser = () => {
    setsharedUser(true);
    setsharedItem(false);
    setExpandedItemId(null);
  }

  const handlesharedItem = () => {
    setsharedUser(false);
    setsharedItem(true);
    setExpandedItemId(null);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = queryParams.email.trim();
    const trimmedPassword = password.trim();

    try {
      const response = await fetch(`${API_URL}/api/designee/nc-designee-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setLoginError('Login failed. Please check your credentials.');
        return;
      }
      if (response.status === 200) {
        setEmail(email);
        setShowPopup(false);
        setLoginError('');
        sharedAllFiles(email);
      }
    } catch (error) {
      setLoginError('An error occurred. Please try again later.');
    }
  };

  const fetchFileContent = async (fileId) => {
    // console.log("helooooooo", email);
    // console.log("helooooooo", sharedemail);
    const finalEmail = email || sharedemail;
    try {
      setLoading(true);
      setError("");
      // console.log("defaultttttttttttttt", fileId);
      const response = await axios.post(
        `${API_URL}/api/view-file-content`,
        {
          fileId: fileId,
          email: finalEmail
        },
      );

      // console.log("xknwjxbexnbc", response);

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

  const handleDownloadFile = async (file_id) => {
    try {
      // const token = Cookies.get('token');
      const token = localStorage.getItem("token");

      // Get the download link from the server

      const response = await axios.post(
        `${API_URL}/api/download-file`, // Backend endpoint

        { file_id },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { download_url } = response.data;

      // Programmatically trigger the file download

      const link = document.createElement("a");

      link.href = download_url;

      link.setAttribute("download", ""); // Let the browser infer the filename

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
    } catch (error) {
      // console.error("Error preparing file download:", error);

      // alert('Error preparing file download. Please try again.');
    }
  };









  const closeModal = () => {
    setExpandedItemId(null);
  };

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (
  //       openDropdownIndex !== null &&
  //       dropdownRef.current[openDropdownIndex] &&
  //       !dropdownRef.current[openDropdownIndex].contains(event.target)
  //     ) {
  //       setOpenDropdownIndex(null); // Close dropdown if clicked outside
  //     }
  //   };

  //   document.addEventListener("click", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, [openDropdownIndex]);


  useEffect(() => {
    const handleClickOutside = (e) => {
      const isOutside = !dropdownRef.current.some((ref) =>
        ref && ref.contains(e.target)
      );
      if (isOutside) {
        setExpandedItemId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);


  const handleDropdown = () => {
    setExpandedItemId(null)
  }

  const renderFileContent = () => {
    if (!fileData || !fileData.fileUrl) return null;

    const { mimeType, fileUrl } = fileData; // Destructuring to get mimeType and fileUrl from state

    // console.log("MIME Type:", mimeType); // Log MIME type to check if it is image-related

    // console.log("File URL:", fileUrl); // Log the File URL to check

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
            // style={{ width: "100%", maxHeight: "500px" }}
            className="min-w-full max-h-[80vh] object-contain rounded-md"
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
          style={{ width: "90vw", height: "90vh", border: "none" }}
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
      <div className="h-10 px-10 w-screen pr-2  mb-4 fixed top-0 flex justify-between">
        <div className={`${isEditing ? "inline" : "hidden"}`}>
          {isEditing ? (
            <input
              type="text"
              value={tempFName}
              onChange={(e) => setTempFName(e.target.value)}
              className={` text-black p-4 ${isEditing ? "inline text-white outline-none p-2  bg-transparent border-b-4 border-blue-500 " : "hidden"}`}

            />
          ) : (
            <p className="p-4">{newFileName}</p>
          )}
          {isEditing && (
            <button onClick={() => handleSaveEdit(fileId)}>
              <span className="text-green-500 font-semibold p-2">Save</span>
            </button>
          )}
          {isEditing && (
            <button onClick={() => setIsEditing(false)}>
              <span className="text-red-500 font-semibold p-2">Cancel</span>
            </button>
          )}
        </div>

        <div className={`p-4 ${isEditing ? "" : "flex"}`}>
          <p >{filename}</p>
        </div>

        <div className="flex gap-x-4 md:gap-x-10 p-4">
          {fileaccess === 'Edit' && (
            <>
              <button
                className="hidden w-40 h-10 rounded bg-blue-500 md:flex p-2 text-white"
                onClick={handleEditClick}
              >
                Edit document <FilePenLine className="ml-3" />
              </button>
              <button className="w-14 md:hidden h-10 rounded bg-blue-500 flex p-2 text-white">
                <FilePenLine className="ml-3" />
              </button>
              <button onClick={() => handleDownloadFile(fileId)}>
                <Download className="mt-2 cursor-pointer" />
              </button>
            </>
          )}
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
  return (
    <div className="p-6">
      {showPopup && (
        <form onSubmit={handleSubmit}>
          <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-black bg-opacity-40">
            <div className="bg-white  p-5 rounded-lg shadow-lg min-w-[60%]  md:min-w-[40%] mx-4">
              <div className="flex justify-between border-b-2 border-slate-300 min-w-full">
                <h2 className="font-bold py-2 border-slate-500">For File Access</h2>
              </div>
              <p className="text-sm font-semibold text-slate-400 mb-6 mt-4">
                Enter your email and OTP to verify your identity.
              </p>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email ID</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={queryParams.email}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  readOnly
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="otp" className="block text-sm font-semibold text-gray-700">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. 1234"
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <button></button>
                <button className="bg-blue-500 text-white px-10 py-2 rounded-lg text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700">
                  Done
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      <div className="">
        <div className="flex items-center justify-between mb-4 flex-col">
          <div className="md:hidden h-14 p-2 w-full border-2 border-gray-300 rounded-xl md:mt-4 flex">
            <Search className="mt-1.5 text-gray-500" />
            <input type="text" placeholder="Search" className="w-full h-full p-4 outline-none" />
          </div>
          <div className="flex justify-between h-10 w-full mt-4 md:mt-0">
            <h1 className="text-2xl font-semibold">Shared With Me</h1>
            <button
              onClick={() => {
                setIsGridView(!isGridView)
                setExpandedItemId(null);
              }
              }
              className="p-2 rounded-md  md:hidden flex space-x-2"
            >
              {isGridView ? <> <List size={20} className="mt-0.5 text-sm" /> <span className="text-sm">List View</span></> : <> <Grid size={20} className="mt-0.5" />  <span className="text-sm">Grid View</span> </>}
            </button>
          </div>
        </div>

        <div className="">
          <div className="flex gap-4">
            <div className="flex md:px-0 border-gray-300">
              <div className="text-sm">
                <div onClick={handlesharedUser} className={`${sharedUser ? 'flex items-center md:gap-x-2 border-b-4 border-blue-600 text-blue-600' : 'flex items-center md:gap-x-2'}`} >
                  <span className="font-semibold cursor-pointer pb-2 mr-2">Shared Files</span>
                  <span className="text-black rounded-lg text-sm mt-1 mb-2 px-2.5 bg-[#EEEEEF]">{sharedFiles?.length}</span>
                </div>
                <div className=""></div>
              </div>
            </div>
            <div className="flex justify-between items-center md:px-0 border-gray-300">
              <div className="text-sm">
                <div onClick={handlesharedItem} className={`${sharedItem ? 'flex items-center md:gap-x-2 border-b-4 border-blue-600 text-blue-600' : 'flex items-center md:gap-x-2'}`}>
                  <span className="font-semibold cursor-pointer pb-2 mr-2">After life Sharing</span>
                  <span className="text-black rounded-lg text-sm mt-1 mb-2 px-2.5 bg-[#EEEEEF]">
                    {afterfile?.length - 1 ?? 0}
                  </span>

                </div>
                <div className=""></div>
              </div>
            </div>
          </div>

        </div>
        {
          sharedUser === true ? (
            // console.log("Rendering groupedFiles life groupedFiles", groupedFiles),
            // console.log("Rendering Shared Users", sharedFiles),
            <>
              <div className="hidden md:inline">

                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-200 py-4">
                      <th className="px-2 py-4 text-slate-500 text-left font-semibold">Shared User</th>
                      <th className="px-2 py-2 text-slate-500 text-left font-semibold">Shared Date</th>
                      <th className="px-2 py-2 text-slate-500 text-left font-semibold">Shared Item</th>
                      <th className="px-2 py-2 text-slate-500 text-left font-semibold">Access</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(groupedFiles).length > 0 ? (
                      Object.keys(groupedFiles).map((username) => {


                        const userFiles = groupedFiles[username];

                        const userVoices = groupedVoices[username] || { voices: { view: [], Edit: [] } }; // Fallback if no voices for this user

                        return (
                          <>
                            {["view", "Edit"].map((accessType, index) => {
                              const files = userFiles.files[accessType];
                              const create = userFiles.create;

                              const voices = userVoices.voices[accessType];
                              const totalItems = [...files, ...voices]; // Combine files and voices

                              if (totalItems.length > 0) {
                                return (
                                  <tr key={`${username}-${accessType}`} className="border-b hover:bg-gray-50">
                                    <td className="px-2 py-3 w-[20%]">
                                      <div className="py-2">
                                        <span className="ml-3 bg-gray-100 rounded-lg py-2 px-2 font-semibold">
                                          {username}
                                        </span>
                                      </div>
                                    </td>
                                    <td className=" text-sm text-slate-500 w-[22%]">

                                      {create ? new Date(create).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                      }) + ', ' + new Date(create).toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true
                                      }) : 'Undefined'}

                                    </td>
                                    <td className="w-[30%]">
                                      <div className="flex items-center cursor-pointer relative">
                                        <div className="flex">
                                          <ChevronDown
                                            size={24}
                                            className="text-gray-500 mr-5 mt-4 cursor-pointer"
                                            onClick={(e) => {


                                              toggleDropdown(username, accessType, e) // Toggle dropdown

                                            }
                                            }
                                          />
                                          <div>
                                            <p className="font-semibold mb-1"> {(totalItems[0]?.file_name || totalItems[0]?.voice_name)?.length > 20
                                              ? `${(totalItems[0]?.file_name || totalItems[0]?.voice_name).substring(0, 20)}...`
                                              : totalItems[0]?.file_name || totalItems[0]?.voice_name
                                            }</p>
                                            <p className="text-xs text-blue-500 font-semibold">+{totalItems.length} Items</p>
                                          </div>
                                        </div>
                                      </div>



                                      {expandedItemId === `${username}-${accessType}` && (
                                        <div
                                          ref={(el) => (dropdownRef.current[index + 1] = el)}
                                          className="absolute md:left-[400px] lg:left-[550px] xl:left-[650px] mt-2 h-80 overflow-y-auto p-4 bg-white border-2 border-gray-200 rounded-2xl w-80"
                                          style={{ zIndex: 10 }}
                                        >
                                          <h1 className="text-xl font-semibold mx-2 my-4">Shared Items</h1>

                                          {/* Display files */}
                                          {files.map((file, index) => (
                                            <div
                                              key={file._id}
                                              className="py-2 text-sm text-gray-600 cursor-pointer"
                                              onClick={() => {
                                                setfilename(file.file_name);
                                                setTempFName(file.file_name);
                                                setfileId(file.id || file.file_id);
                                                setFileAccess(file.id || file.access);
                                                fetchFileContent(file.id || file.file_id)
                                              }}
                                            >
                                              <div className="flex items-center" >
                                                <img
                                                  ref={(el) => (dropdownRef.current[index + 1] = el)}
                                                  src={doc} alt={file.file_name} className="w-10 h-10" />
                                                <p className="text-sm font-semibold ml-4 mt-1"> {file.file_name.length > 20 ? `${file.file_name.substring(0, 230)}...` : file.file_name}</p>
                                                {/* <img
                                                  className="w-5 h-5"
                                                  src={editicon}
                                                  alt="Edit Icon"
                                                // onClick={() => handleEditIconClick(voice)}
                                                /> */}
                                                {/* <img
                className="w-5 h-5"
                src={editicon}
                alt="Edit Icon"
                onClick={() => handleEditIconClick(voice)}
              /> */}
                                              </div>

                                            </div>
                                          ))}

                                          {voices.map((voice) => (
                                            <li key={`voice-${voice.voice_id}`} className="flex items-center justify-between py-3">
                                              <div className="flex items-center space-x-3" >
                                                <div className="flex items-center">
                                                  <img src={play} alt="" className="h-5 gap-1" onClick={() => handlePlay(voice.voice_id)} />
                                                  <span className="text-sm font-semibold ml-4 mt-1">{voice.voice_name}</span>
                                                </div>

                                              </div>
                                              <div className="flex items-center justify-between gap-x-2">

                                                {/* <img
                                                  className="w-5 h-5"
                                                  src={editicon}
                                                  alt="Edit Icon"
                                                // onClick={() => handleEditIconClick(voice)}
                                                /> */}
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
                                          ))}

                                        </div>
                                      )}
                                    </td>
                                    <td className="font-medium text-gray-400 pl-2 w-[22%]">{accessType}</td>
                                  </tr>
                                );
                              }
                            })}
                          </>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-slate-400">
                          No files available.
                        </td>
                      </tr>
                    )}
                  </tbody>


                </table>
              </div>
            </>
          ) : (
            // console.log("Rendering After life Sharing", afterfiles),
            <>
              <div className="hidden md:inline">

                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-200 py-4">
                      <th className="px-2 py-4 text-slate-500 text-left font-semibold">Shared User</th>
                      <th className="px-2 py-2 text-slate-500 text-left font-semibold">Shared Date</th>
                      <th className="px-2 py-2 text-slate-500 text-left font-semibold">Shared Item</th>
                      <th className="px-2 py-2 text-slate-500 text-left font-semibold">Access</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(afterfiles).length > 0 ? (
                      Object.keys(afterfiles).map((username) => {
                        const userFiles = afterfiles[username];
                        const create = userFiles.create;
                        const userVoices = aftervoice[username] || { voices: { view: [], Edit: [] } }; // Fallback if no voices for this user

                        return (
                          <>
                            {["view", "Edit"].map((accessType, index) => {
                              const files = userFiles.files[accessType];
                              const voices = userVoices.voices[accessType];
                              const totalItems = [...files, ...voices]; // Combine files and voices

                              if (totalItems.length > 0) {
                                return (
                                  <tr key={`${username}-${accessType}`} className="border-b hover:bg-gray-50">
                                    <td className="px-2 py-3 w-[20%]">
                                      <div className="py-2">
                                        <span className="ml-3 bg-gray-100 rounded-lg py-2 px-2 font-semibold">
                                          {username}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="text-sm text-slate-500 w-[22%]">

                                      {create ? new Date(create).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                      }) + ', ' + new Date(create).toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true
                                      }) : 'Undefined'}

                                    </td>
                                    <td className="w-[30%]">
                                      <div className="flex items-center cursor-pointer relative">
                                        <div className="flex">
                                          <ChevronDown
                                            size={24}
                                            className="text-gray-500 mr-5 mt-4 cursor-pointer"
                                            onClick={(e) => {
                                              toggleDropdown(username, accessType, e)
                                            }
                                            } // Toggle dropdown
                                          />
                                          <div>
                                            <p className="font-semibold mb-1">{(totalItems[0]?.file_name || totalItems[0]?.voice_name)?.length > 20
                                              ? `${(totalItems[0]?.file_name || totalItems[0]?.voice_name).substring(0, 20)}...`
                                              : totalItems[0]?.file_name || totalItems[0]?.voice_name
                                            }</p>
                                            <p className="text-xs text-blue-500 font-semibold">+{totalItems.length} Items</p>
                                          </div>
                                        </div>
                                      </div>



                                      {expandedItemId === `${username}-${accessType}` && (

                                        <div
                                          ref={(el) => (dropdownRef.current[index] = el)}
                                          className="absolute md:left-[400px] lg:left-[550px] xl:left-[650px] mt-2 p-4 h-80 overflow-y-auto bg-white border-2 border-gray-200 rounded-2xl w-80"
                                          style={{ zIndex: 10 }}
                                        >
                                          <h1 className="text-xl font-semibold mx-2 my-4">Shared Items</h1>

                                          {/* Display files */}
                                          {files.map((file, index) => (
                                            <div
                                              key={file._id}
                                              className="py-2 text-sm text-gray-600 cursor-pointer"
                                              onClick={() => {
                                                setfilename(file.file_name);
                                                setTempFName(file.file_name);
                                                setfileId(file.id || file.file_id);
                                                setFileAccess(file.id || file.access);
                                                fetchFileContent(file.id || file.file_id)
                                              }}
                                            >
                                              <div className="flex items-center" >

                                                <img
                                                  ref={(el) => (dropdownRef.current[index + 1] = el)}
                                                  src={doc} alt={file.file_name} className="w-10 h-10" />

                                                <p className="text-sm font-semibold ml-4 mt-1">{file.file_name.length > 20 ? `${file.file_name.substring(0, 20)}...` : file.file_name}</p>
                                                {/* <img
                                                className="w-5 h-5"
                                                src={editicon}
                                                alt="Edit Icon"
                                              // onClick={() => handleEditIconClick(voice)}
                                              /> */}
                                                {/* <img
              className="w-5 h-5"
              src={editicon}
              alt="Edit Icon"
              onClick={() => handleEditIconClick(voice)}
            /> */}
                                              </div>

                                            </div>
                                          ))}

                                          {voices.map((voice) => (
                                            <li key={`voice-${voice.voice_id}`} className="flex items-center justify-between py-3">
                                              <div className="flex items-center space-x-3" >
                                                <div className="flex items-center">
                                                  <img src={play} alt="" className="h-5 gap-1" onClick={() => handlePlay(voice.voice_id)} />
                                                  <span className="text-sm font-semibold ml-4 mt-1">{voice.voice_name}</span>
                                                </div>

                                              </div>
                                              <div className="flex items-center justify-between gap-x-2">

                                                {/* <img
                                                className="w-5 h-5"
                                                src={editicon}
                                                alt="Edit Icon"
                                              // onClick={() => handleEditIconClick(voice)}
                                              /> */}
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
                                          ))}

                                        </div>

                                      )}
                                    </td>
                                    <td className="font-medium text-gray-400 pl-2 w-[22%]">{accessType}</td>
                                  </tr>
                                );
                              }
                            })}
                          </>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-slate-400">
                          No files available.
                        </td>
                      </tr>
                    )}
                  </tbody>


                </table>
              </div>
            </>
          )
        }


        <div className="md:hidden">
          {sharedUser &&
            <>
              {isGridView ? (
                <>
                  <div className="grid grid-cols-2 mt-4 gap-3">
                    {Object.keys(groupedFiles).length > 0 ? (
                      Object.keys(groupedFiles).map((username, index) => {
                        const userFiles = groupedFiles[username];
                        const userVoices = groupedVoices[username] || { voices: { view: [], Edit: [] } }; // Fallback for no voices

                        return (
                          <>
                            {["view", "Edit"].map((accessType) => {
                              const files = userFiles.files[accessType];
                              const voices = userVoices.voices[accessType];
                              const totalItems = [...files, ...voices]; // Combine files and voices

                              if (totalItems.length > 0) {
                                return (
                                  <div key={`${username}-${accessType}`} className="border-2 border-[#f0f0f0] rounded-xl">
                                    <div className="flex flex-col justify-between min-h-full min-w-full p-2">
                                      <div className="w-full relative">
                                        <p className="font-semibold text-sm py-2"> {(totalItems[0]?.file_name || totalItems[0]?.voice_name)
                                          ? (totalItems[0]?.file_name?.length > 15
                                            ? `${totalItems[0].file_name.substring(0, 15)}...`
                                            : totalItems[0]?.file_name) ||
                                          (totalItems[0]?.voice_name?.length > 20
                                            ? `${totalItems[0].voice_name.substring(0, 15)}...`
                                            : totalItems[0]?.voice_name)
                                          : "No file or voice available"}</p>
                                        <p
                                          onClick={(e) => toggleDropdown(username, accessType, e)}
                                          className="text-xs font-semibold text-blue-600 flex"
                                        >
                                          +{totalItems.length} Items <ChevronRight className="text-black ml-3" />
                                        </p>
                                      </div>
                                      {expandedItemId === `${username}-${accessType}` && (
                                        <div className="fixed inset-0 h-full px-3 w-full bg-black bg-opacity-40 flex items-center justify-center z-50">
                                          <div
                                            ref={(el) => (dropdownRef.current[index] = el)}
                                            className="absolute px-2 shadow-2xl h-80 overflow-y-auto bg-white border-2 border-gray-200 rounded-2xl w-72"
                                            style={{ zIndex: 10 }}
                                          >
                                            <div className="p-4 sticky top-0 flex justify-between bg-white z-50 border-b-2">
                                              <h3 className="text-lg font-semibold">
                                                Shared Items
                                              </h3>
                                              <p onClick={() => setExpandedItemId(null)} ><X className="h-7 w-7 text-gray-500" /></p>
                                            </div>

                                            {/* Display files */}
                                            {files.map((file) => (
                                              <div
                                                key={file._id}
                                                className="py-2 text-sm text-gray-600 cursor-pointer"
                                                onClick={() => {
                                                  // console.log("heooooooodcdcdc");
                                                  setfilename(file.file_name);
                                                  setfileId(file.id || file.file_id);
                                                  setTempFName(file.file_name);
                                                  setFileAccess(file.id || file.access);
                                                  setfileId(file.id || file.file_id);
                                                  fetchFileContent(file.id || file.file_id || file._id)
                                                }}
                                              >
                                                <div className="flex items-center">
                                                  <img src={doc} alt={file.file_name} className="w-10 h-10" />
                                                  <p className="text-sm font-semibold ml-4 mt-1">{file.file_name}</p>
                                                  {/* <img
                                              className="w-5 h-5"
                                              src={editicon}
                                              alt="Edit Icon"
                                            // onClick={() => handleEditIconClick(voice)}
                                            /> */}

                                                  {/* <img
                className="w-5 h-5"
                src={editicon}
                alt="Edit Icon"
                onClick={() => handleEditIconClick(voice)}
              /> */}
                                                </div>

                                              </div>
                                            ))}

                                            {voices.map((voice) => (
                                              <li key={`voice-${voice.voice_id}`} className="flex items-center justify-between py-3">
                                                <div className="flex items-center space-x-3" >
                                                  <div className="flex items-center">
                                                    <img src={play} alt="" className="h-5 gap-1" onClick={() => {
                                                      setExpandedItemId(null);
                                                      handlePlay(voice.voice_id);
                                                    }} />
                                                    <span className="text-sm font-semibold ml-4 mt-1">{voice.voice_name}</span>
                                                  </div>

                                                </div>
                                                <div className="flex items-center justify-between gap-x-2">

                                                  {/* <img
                                              className="w-5 h-5"
                                              src={editicon}
                                              alt="Edit Icon"
                                            // onClick={() => handleEditIconClick(voice)}
                                            /> */}
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
                                            ))}
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

                                      <div className="mt-8">
                                        <p className="font-semibold bg-slate-100 text-center rounded-md py-1">{username}</p>
                                        <p className="font-semibold text-gray-600 text-sm flex justify-end mt-3">
                                          feb 6, 2024
                                          {/* <EllipsisVertical /> */}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            })}
                          </>
                        );
                      })
                    ) : (
                      <>
                        {/* Fallback for no files */}
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className={`w-full mt-4 min-h-28 ${sharedItem ? '' : ''}`}>
                    {Object.keys(groupedFiles).length > 0 ? (
                      Object.keys(groupedFiles).map((username) => {
                        const userFiles = groupedFiles[username];
                        const userVoices = groupedVoices[username] || { voices: { view: [], Edit: [] } }; // Fallback for no voices

                        return (
                          <>
                            {["view", "Edit"].map((accessType, index) => {
                              const files = userFiles.files[accessType];
                              const voices = userVoices.voices[accessType];
                              const totalItems = [...files, ...voices]; // Combine files and voices

                              if (totalItems.length > 0) {
                                return (
                                  <div key={`${username}-${accessType}`} className="border-2 mb-2 border-[#f0f0f0] rounded-2xl">
                                    <div className="flex h-full w-full p-2">
                                      <div className="w-full">
                                        <p className="text-sm font-semibold py-1">
                                          {(totalItems[0]?.file_name || totalItems[0]?.voice_name)
                                            ? (totalItems[0]?.file_name?.length > 10
                                              ? `${totalItems[0].file_name.substring(0, 15)}...`
                                              : totalItems[0]?.file_name) ||
                                            (totalItems[0]?.voice_name?.length > 10
                                              ? `${totalItems[0].voice_name.substring(0, 15)}...`
                                              : totalItems[0]?.voice_name)
                                            : "No file or voice available"}

                                        </p>
                                        <p
                                          onClick={(e) => toggleDropdown(username, accessType, e)}
                                          className="text-xs font-semibold text-blue-600 flex"
                                        >
                                          +{totalItems.length} Items <ChevronRight className="text-black ml-3" />
                                        </p>
                                      </div>
                                      {expandedItemId === `${username}-${accessType}` && (
                                        <div className="fixed inset-0 h-full px-3 w-full bg-black bg-opacity-40 flex items-center justify-center z-50">
                                          <div
                                            ref={(el) => (dropdownRef.current[index] = el)}
                                            className="absolute px-2 shadow-2xl h-80 overflow-y-auto  bg-white border-2 border-gray-200 rounded-2xl w-72"
                                            style={{ zIndex: 10 }}
                                          >
                                            <div className="p-4 sticky top-0 flex justify-between bg-white z-50 border-b-2">
                                              <h3 className="text-lg font-semibold">
                                                Shared Items
                                              </h3>
                                              <p onClick={() => setExpandedItemId(null)} ><X className="h-7 w-7 text-gray-500" /></p>
                                            </div>

                                            {/* Display files */}
                                            {files.map((file) => (
                                              <div
                                                key={file._id}
                                                className="py-2 text-sm text-gray-600 cursor-pointer"
                                                onClick={() => {
                                                  // console.log("heooooooodcdcdc");
                                                  setfilename(file.file_name);
                                                  setFileAccess(file.id || file.access);
                                                  setfileId(file.id || file.file_id);
                                                  setTempFName(file.file_name);
                                                  setfileId(file.id || file.file_id);
                                                  fetchFileContent(file.id || file.file_id || file._id)
                                                }}
                                              >
                                                <div className="flex items-center">
                                                  <img src={doc} alt={file.file_name} className="w-10 h-10" />
                                                  <p className="text-sm font-semibold ml-4 mt-1">{file.file_name}</p>
                                                  {/* <img
                className="w-5 h-5"
                src={editicon}
                alt="Edit Icon"
                onClick={() => handleEditIconClick(voice)}
              /> */}
                                                </div>

                                              </div>
                                            ))}

                                            {voices.map((voice) => (
                                              <li key={`voice-${voice.voice_id}`} className="flex items-center justify-between py-3">
                                                <div className="flex items-center space-x-3" >
                                                  <div className="flex items-center">
                                                    <img src={play} alt="" className="h-5 gap-1" onClick={() => {
                                                      setExpandedItemId(null);
                                                      handlePlay(voice.voice_id);
                                                    }} />
                                                    <span className="text-sm font-semibold ml-4 mt-1">{voice.voice_name}</span>
                                                  </div>

                                                </div>
                                                <div className="flex items-center justify-between gap-x-2">

                                                  {/* <img
                                              className="w-5 h-5"
                                              src={editicon}
                                              alt="Edit Icon"
                                              onClick={() => handleEditIconClick(voice)}
                                            /> */}
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
                                            ))}
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
                                      <div>
                                        <p className="text-lg font-semibold bg-slate-100 text-center w-28 rounded-md py-1">{username}</p>
                                        <p className="font-semibold text-gray-600 flex justify-end text-sm mt-4">
                                          feb 6, 2024
                                          {/* <EllipsisVertical /> */}
                                        </p>
                                      </div>
                                    </div>

                                  </div>
                                );
                              }
                            })}
                          </>
                        );
                      })
                    ) : (
                      <>
                        {/* Fallback for no files */}
                      </>
                    )}
                  </div>
                </>
              )}
            </>
          }


          {sharedItem &&
            <>
              {isGridView ? (
                <>
                  <div className="grid grid-cols-2 mt-4 gap-3">
                    {Object.keys(afterfiles).length > 0 ? (
                      Object.keys(afterfiles).map((username) => {
                        const userFiles = afterfiles[username];
                        const userVoices = aftervoice[username] || { voices: { view: [], Edit: [] } }; // Fallback if no voices for this user

                        return (
                          <>
                            {["view", "Edit"].map((accessType, index) => {
                              const files = userFiles.files[accessType];
                              const voices = userVoices.voices[accessType];
                              const totalItems = [...files, ...voices]; // Combine files and voices

                              if (totalItems.length > 0) {
                                return (
                                  <div key={`${username}-${accessType}`} className="border-2 border-[#f0f0f0] rounded-xl">
                                    <div className="flex flex-col justify-between min-h-full min-w-full p-2">
                                      <div className="w-full relative">
                                        <p className="font-semibold text-sm py-2">{(totalItems[0]?.file_name || totalItems[0]?.voice_name)
                                          ? (totalItems[0]?.file_name?.length > 15
                                            ? `${totalItems[0].file_name.substring(0, 15)}...`
                                            : totalItems[0]?.file_name) ||
                                          (totalItems[0]?.voice_name?.length > 20
                                            ? `${totalItems[0].voice_name.substring(0, 15)}...`
                                            : totalItems[0]?.voice_name)
                                          : "No file or voice available"}
                                        </p>
                                        <p
                                          onClick={(e) => toggleDropdown(username, accessType, e)}
                                          className="text-xs font-semibold text-blue-600 flex"
                                        >
                                          +{totalItems.length} Items <ChevronRight className="text-black ml-3" />
                                        </p>
                                      </div>
                                      {expandedItemId === `${username}-${accessType}` && (
                                        <div className="fixed inset-0 h-full px-3 w-full bg-black bg-opacity-40 flex items-center justify-center z-50">
                                          <div
                                            ref={(el) => (dropdownRef.current[index] = el)}
                                            className="absolute h-80 overflow-y-auto shadow-2xl px-2 bg-white border-2 border-gray-200 rounded-2xl w-72"
                                            style={{ zIndex: 10 }}
                                          >
                                            <div className="p-4 sticky top-0  flex justify-between bg-white z-50 border-b-2">
                                              <h3 className="text-lg font-semibold">
                                                Shared Items
                                              </h3>
                                              <p onClick={() => setExpandedItemId(null)} ><X className="h-7 w-7 text-gray-500" /></p>
                                            </div>

                                            {/* Display files */}
                                            {files.map((file) => (
                                              <div
                                                key={file._id}
                                                className="py-2 text-sm text-gray-600 cursor-pointer"
                                                onClick={() => {
                                                  // console.log("heooooooodcdcdc");
                                                  setfilename(file.file_name);
                                                  setfileId(file.id || file.file_id);
                                                  setTempFName(file.file_name);
                                                  setFileAccess(file.id || file.access);
                                                  setfileId(file.id || file.file_id);
                                                  fetchFileContent(file.id || file.file_id || file._id)
                                                }}
                                              >
                                                <div className="flex items-center">
                                                  <img src={doc} alt={file.file_name} className="w-10 h-10" />
                                                  <p className="text-sm font-semibold ml-4 mt-1">{file?.file_name?.length > 20
                                                    ? `${file.file_name.substring(0, 20)}...`
                                                    : file?.file_name || "No file available"}
                                                  </p>
                                                  {/* <img
                                              className="w-5 h-5"
                                              src={editicon}
                                              alt="Edit Icon"
                                            // onClick={() => handleEditIconClick(voice)}
                                            /> */}

                                                  {/* <img
                className="w-5 h-5"
                src={editicon}
                alt="Edit Icon"
                onClick={() => handleEditIconClick(voice)}
              /> */}
                                                </div>

                                              </div>
                                            ))}

                                            {voices.map((voice) => (
                                              <li key={`voice-${voice.voice_id}`} className="flex items-center justify-between py-3">
                                                <div className="flex items-center space-x-3" >
                                                  <div className="flex items-center">
                                                    <img src={play} alt="" className="h-5 gap-1" onClick={() => {
                                                      setExpandedItemId(null);
                                                      handlePlay(voice.voice_id);
                                                    }} />
                                                    <span className="text-sm font-semibold ml-4 mt-1">{voice.voice_name}</span>
                                                  </div>

                                                </div>
                                                <div className="flex items-center justify-between gap-x-2">

                                                  {/* <img
                                              className="w-5 h-5"
                                              src={editicon}
                                              alt="Edit Icon"
                                            // onClick={() => handleEditIconClick(voice)}
                                            /> */}
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
                                            ))}
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

                                      <div className="mt-8">
                                        <p className="font-semibold bg-slate-100 text-center rounded-md py-1">{username}</p>
                                        <p className="font-semibold text-gray-600 text-sm flex justify-end mt-3">
                                          feb 6, 2024

                                          {/* <EllipsisVertical /> */}
                                        </p>
                                      </div>
                                    </div>

                                  </div>
                                );
                              }
                            })}
                          </>
                        );
                      })
                    ) : (
                      <>
                        {/* Fallback for no files */}
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className={`w-full mt-4 min-h-28 ${sharedItem ? '' : ''}`}>
                    {Object.keys(afterfiles).length > 0 ? (
                      Object.keys(afterfiles).map((username) => {
                        const userFiles = afterfiles[username];
                        const userVoices = aftervoice[username] || { voices: { view: [], Edit: [] } }; // Fallback if no voices for this user

                        return (
                          <>
                            {["view", "Edit"].map((accessType, index) => {
                              const files = userFiles.files[accessType];
                              const voices = userVoices.voices[accessType];
                              const totalItems = [...files, ...voices]; // Combine files and voices

                              if (totalItems.length > 0) {
                                return (
                                  <div key={`${username}-${accessType}`} className="border-2 mb-2 border-[#f0f0f0] rounded-2xl">
                                    <div className="flex h-full w-full p-2">
                                      <div className="w-full">
                                        <p className="text-sm font-semibold py-1">{(totalItems[0]?.file_name || totalItems[0]?.voice_name)
                                          ? (totalItems[0]?.file_name?.length > 15
                                            ? `${totalItems[0].file_name.substring(0, 15)}...`
                                            : totalItems[0]?.file_name) ||
                                          (totalItems[0]?.voice_name?.length > 20
                                            ? `${totalItems[0].voice_name.substring(0, 15)}...`
                                            : totalItems[0]?.voice_name)
                                          : "No file or voice available"}
                                        </p>
                                        <p
                                          onClick={(e) => toggleDropdown(username, accessType, e)}
                                          className="text-xs font-semibold text-blue-600 flex"
                                        >
                                          +{totalItems.length} Items <ChevronRight className="text-black ml-3" />
                                        </p>
                                      </div>
                                      {expandedItemId === `${username}-${accessType}` && (
                                        <div className="fixed inset-0 h-full px-3 w-full bg-black bg-opacity-40 flex items-center justify-center z-50">
                                          <div
                                            ref={(el) => (dropdownRef.current[index] = el)}
                                            className="absolute  mt-20 px-2 shadow-2xl h-80 overflow-y-auto bg-white border-2 border-gray-200 rounded-2xl w-72"
                                            style={{ zIndex: 10 }}
                                          >
                                            <div className="p-4 sticky top-0 flex justify-between bg-white z-50 border-b-2">
                                              <h3 className="text-lg font-semibold">
                                                Shared Items
                                              </h3>
                                              <p onClick={() => setExpandedItemId(null)} ><X className="h-7 w-7 text-gray-500" /></p>
                                            </div>

                                            {/* Display files */}
                                            {files.map((file) => (
                                              <div
                                                key={file._id}
                                                className="py-2 text-sm text-gray-600 cursor-pointer"
                                                onClick={() => {
                                                  // console.log("heooooooodcdcdc");
                                                  setfilename(file.file_name);
                                                  setFileAccess(file.id || file.access);
                                                  setfileId(file.id || file.file_id);
                                                  setTempFName(file.file_name);
                                                  setfileId(file.id || file.file_id);
                                                  fetchFileContent(file.id || file.file_id || file._id)
                                                }}
                                              >
                                                <div className="flex items-center">
                                                  <img src={doc} alt={file.file_name} className="w-10 h-10" />
                                                  <p className="text-sm font-semibold ml-4 mt-1">{file?.file_name?.length > 20
                                                    ? `${file.file_name.substring(0, 20)}...`
                                                    : file?.file_name || "No file available"}
                                                  </p>
                                                  {/* <img
                className="w-5 h-5"
                src={editicon}
                alt="Edit Icon"
                onClick={() => handleEditIconClick(voice)}
              /> */}
                                                </div>

                                              </div>
                                            ))}

                                            {voices.map((voice) => (
                                              <li key={`voice-${voice.voice_id}`} className="flex items-center justify-between py-3">
                                                <div className="flex items-center space-x-3" >
                                                  <div className="flex items-center">
                                                    <img src={play} alt="" className="h-5 gap-1" onClick={() => {
                                                      setExpandedItemId(null);
                                                      handlePlay(voice.voice_id);
                                                    }} />
                                                    <span className="text-sm font-semibold ml-4 mt-1">{voice.voice_name}</span>
                                                  </div>

                                                </div>
                                                <div className="flex items-center justify-between gap-x-2">

                                                  {/* <img
                                              className="w-5 h-5"
                                              src={editicon}
                                              alt="Edit Icon"
                                              onClick={() => handleEditIconClick(voice)}
                                            /> */}
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
                                            ))}
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
                                      <div>
                                        <p className="text-lg font-semibold bg-slate-100 text-center w-28 rounded-md py-1">
                                          {username}
                                        </p>
                                        <p className="font-semibold text-gray-600 flex justify-end text-sm mt-4">
                                          feb 6, 2024

                                          {/* <EllipsisVertical /> */}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            })}
                          </>
                        );
                      })
                    ) : (
                      <>
                        {/* Fallback for no files */}
                      </>
                    )}
                  </div>
                </>
              )}
            </>
          }
        </div>
      </div>
      {currentAudio && (
        <div className="absolute top-1/2 md:top-2/3 right-1/2 md:right-[25%] transform translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-lg rounded-lg w-80">
          <h2 className="text-lg font-bold mb-4 text-black">{currentAudio.name}</h2>

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
      {deletebutton2 && (
        <div
          className="fixed inset-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="deleteModalLabel"
          aria-describedby="deleteModalDescription"
        >
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full m-2">
            <div className="flex justify-between items-center mb-4">
              <h2 id="deleteModalLabel" className="text-lg font-semibold">
                You have no active membership
              </h2>
            </div>

            <div
              id="deleteModalDescription"
              className="text-sm text-gray-600 mb-4"
            >
              Take a membership to access this feature.
            </div>

            <div className="flex justify-end gap-2 my-2">
              <button
                onClick={() => setDeletebutton2(false)}
                className="border-2 border-blue-500 text-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <NavLink to="/login">
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => setDeletebutton2(false)}
                >
                  Take Membership
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      )}
      {showDesignerPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-semibold">Add Designee</h3>
              <button
                onClick={closePopup}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-24 h-24 rounded-full border-dashed border-2 flex items-center justify-center text-gray-500">
                  <Camera className="h-4 w-6" />
                </div>
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
            <button
              onClick={handleAddDesignee}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Invite to Cumulus
            </button>
          </div>
        </div>
      )}

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
      {loading && <p>Loading...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {showOverlay && renderOverlay()}
    </div>
  );
};

export default SharedFiles;