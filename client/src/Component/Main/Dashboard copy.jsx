import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import AsyncSelect from "react-select/async";
import fetchUserData from "./fetchUserData";
import { API_URL } from "../utils/Apiconfig";
import shareicon from "../../assets/ShareIcon.png";
import fileupload from "../../assets/fileupload.png";
import editicon from "../../assets/editicon.png";
import shareicondesignee from "../../assets/shareicondesignee.png";
import foldericon from "../../assets/foldericon.png";
import eyeicon from "../../assets/eyeicon.png";
import trashicon from "../../assets/trashicon.png";
import downloadicon from "../../assets/downloadicon.png";
import usePopupStore from "../../store/DesigneeStore";
import DesignerPopup from "../Main/Designeepopup";
import useFolderDeleteStore from "../../store/FolderDeleteStore";
import google from "../../assets/google.png"
import dropbox from "../../assets/logos_dropbox.png"
import { useNavigate } from "react-router-dom";
import GoogleDrivePicker from "../utils/GoogleDrivePicker";
import DropboxPicker from "../utils/GoogleDropboxPicker";
import {
  ArrowRight,
  Trash2,
  UploadCloud,
  X,
  Eye,
  Edit,
  Folder,
  Users,
  ChevronDown,
  Camera,
  Download,
  Loader2,
  EllipsisVertical,
  Grid,
  Menu,
  LayoutGrid,
  Share2Icon,
  Search,
  Check,
  FileClock,
  FilePenLine,
} from "lucide-react";

import upload from "../../assets/upload.png";

import axios from "axios";

import mammoth from "mammoth";

import { useParams, NavLink, Navigate } from "react-router-dom";

import useLoadingStore from "../../store/UseLoadingStore";
import VersionHistory from "./VersionHistory";

const Dashboard = ({ folderId, onFolderSelect, searchQuery, }) => {
  const openPopup = usePopupStore((state) => state.openPopup);
  const [collabs, setCollabs] = useState("");
  const [fileId, setFileId] = useState([]);
  const [permission, setPermission] = useState(false);
  const [shareFolderModal, setShareFolderModal] = useState(false);
  const { id: routeFolderId } = useParams();
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const { isLoading, showLoading, hideLoading } = useLoadingStore();
  const [fileIds, setFileIds] = useState([]);
  const activeFolderId = folderId || routeFolderId;
  const [fileName, setFileName] = useState(null);
  const navigate = useNavigate(); // Correct usage inside a function component
  const [isUploading, setIsUploading] = useState(false);
  const [googleDrive, setGoogleDrive] = useState(false);
   const [createFolderPopuup,setCreateFolderPopuup] = useState(false);
  const [dropBox, setDropBox] = useState(false);
  const [createFolder, setCreateFolder] = useState(false);
  const [newFolder, setNewFolder] = useState("");
  const [folderLocked, setFolderLocked] = useState(false);
  const dropdownRef = useRef([]);
  const {
    deletebuttonfolder,
    setDeletebuttonfolder,
    setSelectedFolder,
    selectedFolder,
    deleteFolder,
    openMenufolderId,
    setOpenMenufodlerId,
  } = useFolderDeleteStore();
  const accessToken = localStorage.getItem("dropboxAccessToken");
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

  const addFolder = () => {
    setCreateFolder(true);
    setIsUploading(false);
  }

  const [files, setFiles] = useState([
    {
      name: "Real Estate 4.zip",

      folder: "",

      date: "Feb 6, 2024",

      contact: "rahul",

      tag: "Will",
    },
  ]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [designees, setDesignees] = useState([]);
  const [openMenuId, setOpenMenuId] = useState([]);
  const [deletebutton, setDeletebutton] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid
  const [editname, setEditname] = useState([]);
  const [fileExtension, setFileExtension] = useState(""); // Store file extension
  const [showOverlay, setShowOverlay] = useState(false);
  const [editing, setEditing] = useState(false);

  const [docContent, setDocContent] = useState(""); // Extracted Word content

  const [fileData, setFileData] = useState(null);

  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [name1, setName1] = useState("");
  const [designers, setDesigners] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState("");

  const [customFileName, setCustomFileName] = useState("");

  const [inputFileName, setInputFileName] = useState("");
  const [fileNames, setFileNames] = useState({});
  const [uploadStatus, setUploadStatus] = useState("");

  const [tags, setTags] = useState([]);

  const [message, setMessage] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);
  const [versionHistory, setVirsonHistory] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]); // Files currently uploading

  const [editFile, setEditFile] = useState(null); // File being edited

  const [expandedRow, setExpandedRow] = useState(null);

  const [selectedFileId, setSelectedFileId] = useState(null);

  const [selectedFile, setSelectedFile] = useState([]);

  const [folders, setFolders] = useState([]);

  const [name, setName] = useState([]);

  const [shareFileVisible, setShareFileVisible] = useState(null); // Track which file's ShareFile is visible

  const [designee, setDesignee] = useState("");

  const [share, setShare] = useState("");
  const [notify, setNotify] = useState(true);
  const [usernamefunc, setUsernamefunc] = useState("");
  const [emailfunc, setEmailfunc] = useState("");

  // const [deletebutton, setDeletebutton] = useState(false);
  const [file, setFile] = useState([]);
  // const [people, setPeople] = useState([

  //   { name: "Hariom Gupta (you)", email: "hg119147@gmail.com", role: "Owner" },

  //   { name: "Akash", email: "Akahs@gmail.com", role: "" },

  // ]);
  const [people, setPeople] = useState([]);
  // const [showDesignerPopup, setShowDesignerPopup] = useState(false); // Toggles the popup visibility
  // const [designeeName, setDesigneeName] = useState(""); // Holds the input for designee name
  // const [designeePhone, setDesigneePhone] = useState(""); // Holds the input for designee phone number
  // const [designeeEmail, setDesigneeEmail] = useState(""); // Holds the input for designee email

  const [need, setNeed] = useState([]);

  const [token, setToken] = useState([]);
  const [editingFileId, setEditingFileId] = useState(null); // ID of the file being edited

  const [tempFileName, setTempFileName] = useState("");
  const [MobilesearchQuery, MobilesetsearchQuery] = useState("");
  const [overlayfileId, setOverlayFileId] = useState("")

  const [users, setUsers] = useState([]);

  const [newUser, setNewUser] = useState("");

  const [showDropdown, setShowDropdown] = useState(null);

  const [editFileId, setEditFileId] = useState(null);
  const [tempFName, setTempFName] = useState("");
  const menuRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [access, setAccess] = useState(false);
  const [isMembershipActive, setIsMembershipActive] = useState(false);
  const [membershipDetail, setMembershipDetail] = useState(null);
  const [userData, setUserData] = useState(null);
  const [deletebutton1, setDeletebutton1] = useState(false);
  // const [filteredFiles, setFilteredFiles] = useState();
  const [username, setUsername] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editFileId2, setEditFileId2] = useState(null);
  const [dragError, setDragError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer?.files; // Get dropped files safely

    if (!files || files.length === 0) {
      console.error("No files found in drop event.");
      return;
    }

    // Allowed file types
    const allowedTypes = [
      "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg", "image/png", "image/gif", "image/bmp", "image/svg+xml", "image/webp"
    ];

    // Check each file type
    for (let file of files) {
      if (!allowedTypes.includes(file.type)) {
        // alert(File type not allowed: ${file.name});
        setDragError(`File type not allowed:  ${file.name}`)
        return;
      } else {
        setDragError("")
      }
    }

    handleFileUpload(files);
  };
  useEffect(() => {
    fetchFiles();
  }, [folderId]);

  const setPermission1 = async (index, data, userId) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/api/designee/set-permission`,

      { userId, data },

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setPermission({ ...permission, [index]: data });
  };

  const handleEmailSelection = (e) => {
    const selectedValues = [...e.target.selectedOptions].map(option => option.value);
    setSelectedEmails(selectedValues);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  useEffect(() => {
    // console.log("API response for fileIds (updated):", fileIds);
  }, [fileIds]);


  const handleFileSelected = (fileName) => {
    setSelectedFileName(fileName);
  };

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
      console.log("Failed to fetch data. Please try again.");
      setAccess(true);
    } finally {
      setLoading(false);
    }
  };




  useEffect(() => {
    // console.log("Updated users: ", users);
  }, [users]);


  const updatePermission = async (voiceId, email, permission, index) => {
    try {
      // console.log("Updating access for:", voiceId);
      // console.log("New permission:", permission);
      // console.log("New voice_id:", email);
      const token = localStorage.getItem("token");

      // Ensure you have the correct voice_id available in your component or state


      // Ensure `voice_id` is included in the request payload
      const response = await axios.post(
        `${API_URL}/api/designee/update-access`,
        {
          to_email_id: email,  // Pass email instead of index
          edit_access: permission,
          file_id: voiceId,   // Include voice_id in the request
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Add token to Authorization header
          },
        }
      );

      if (response.status === 200) {
        // Update the permission locally after a successful API response
        // console.log("heeeeloooo users");
        const updatedUsers = [...users];
        updatedUsers[index].permission = permission;
        setUsers(updatedUsers);
        setShowDropdown(false);
        // alert("Access level updated successfully");
      }
    } catch (error) {
      console.error("Error updating permission:", error);
      // alert("Failed to update permission. Please try again.");

      setShowDropdown(false);
    }
  };

  const removeUser = async (voiceId, index) => {
    const user = users[index];
    console.log("fgyuioiuytrertyuio");
    console.log("idddddddddddddddddddddddddddddd", voiceId);
    console.log("email", user.email);
    console.log("edit_access", user.permission);
  
    try {
      const token = localStorage.getItem("token");
  
      // Prepare the data for the DELETE request to the API
      const response = await axios.delete(`${API_URL}/api/designee/delete-voice-file-data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          to_email_id: user.email,  // Pass the email address of the user
          file_id: voiceId,         // Pass the file_id (you already have this value)
          voice_id: null,           // Pass null for the voice_id, as per your API requirements
        },
      });
  
      if (response.status === 200) {
        // Remove the user from the list if the access is removed successfully
        const updatedUsers = users.filter((_, i) => i !== index);
        setUsers(updatedUsers);
        // alert('Access removed successfully');
      }
    } catch (error) {
      console.error('Error removing user access:', error);
      // alert('Failed to remove access. Please try again.');
    }
  };

  useEffect(() => {
    // console.log("Current editing file ID:", editFileId);
  }, [editFileId]);



  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        if (!data?.user) {
          throw new Error("Invalid response structure");
        }

        setUserData(data);
        setIsMembershipActive(data.user.activeMembership);
        setMembershipDetail(data.user.memberships);
        setUsername(data.user.username);
        setEmailfunc(data.user.email);

        // Store Google Drive token if connected
        const googleDrive = data.user.googleDrive?.[0];
        if (googleDrive?.connected && googleDrive?.accessToken) {
          localStorage.setItem("googleDriveToken", googleDrive.accessToken);
          localStorage.setItem("googleDriveConnected", true);
        } else {
          localStorage.removeItem("googleDriveToken");
          localStorage.setItem("googleDriveConnected", false);
        }



        // Store Dropbox token if connected
        const dropbox = data.user.dropbox?.[0];
        if (dropbox?.connected && dropbox?.accessToken) {
          localStorage.setItem("dropboxToken", dropbox.accessToken);
          localStorage.setItem("dropboxConnected", true);
        } else {
          localStorage.removeItem("dropboxToken");
          localStorage.setItem("dropboxConnected", false);
        }


        console.log("helowwwww dropbox", dropbox?.connected && dropbox?.accessToken);
        console.log("helowwwww drive", googleDrive?.connected && googleDrive?.accessToken);
      } catch (err) {
        console.error(err.message || "Failed to fetch user data");
      }
    };

    getUserData();
  }, []);



  const handleClick = () => {
    // console.log("file hdbjcbhbckdnchbcb", file);
    shareFile(file); // Calling the share function after setting the file ID
  };

  const handleUsersClick = (fileId) => {
    setShareFileVisible((prevId) => (prevId === fileId ? null : fileId)); // Toggle visibility
  };

  const toggleAccess = () => {
    setAccess(true); // Toggle the access state when the folder button is clicked
  };

  const handleDesigneeChange = (e) => setDesignee(e.target.value);

  const handleMessageChange = (e) => setMessage(e.target.value);

  const handleNotifyChange = () => setNotify(!notify);




  const handleSaveFName = async (fileId) => {
    // console.log("Saving File Name:", tempFName, "for File ID:", fileId);
    const email = userData.user.email;
    if (!tempFName.trim()) return;
    // Prevent duplicate submissions with a loading flag
    if (handleSaveFName.isSubmitting) {
      console.warn("File name update already in progress...");
      return;
    }
    handleSaveFName.isSubmitting = true;
    // Find the file object based on the fileId
    const file = files.find((f) => f._id === fileId);
    if (!file) {
      console.error("File not found.");
      handleSaveFName.isSubmitting = false;
      return;
    }
    // Extract the file extension from the original file name (e.g., abc.docx → .docx)
    const originalFileName = file.file_name;
    const fileExtension = originalFileName.slice(originalFileName.lastIndexOf(".")); // Get the extension part (e.g., .docx)
    // Ensure the edited file name ends with the correct extension
    const newFileName = tempFName.endsWith(fileExtension)
      ? tempFName
      : tempFName + fileExtension; // Append the extension if it's missing
    // console.log("Final File Name with Extension:", newFileName);
    try {
      const response = await axios.post(`${API_URL}/api/edit-file-name`, {
        file_id: fileId,
        new_file_name: newFileName, // Send the updated file name with the extension
        email,
      });
      if (response.data.message === "File name updated successfully.") {
        // console.log("File name updated on the server:", response.data);
        // Update the file name in local state
        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file._id === fileId
              ? { ...file, file_name: response.data.newFileName } // Update the file name
              : file
          )
        );
        setEditFileId(null); // Exit edit mode
        setTempFName(""); // Reset temp file name
        await fetchFiles(); // Re-fetch files if needed
      }
    } catch (error) {
      console.error("Error updating file name:", error);
    } finally {
      handleSaveFName.isSubmitting = false; // Reset the loading flag
    }
  };

  const handleAddFolder = async () => {
    if (newFolder.trim()) {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in again.");
        }

        const response = await axios.post(
          `${API_URL}/api/create-folder`,
          { folder_name: newFolder },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const newFolderData = response.data.folder;
        setFolders([
          ...folders,
          { id: newFolderData._id, name: newFolderData.folder_name },
        ]);
        setNewFolder("");
        fetchFolders();
        setCreateFolder(null);
        setIsUploading(true);
      } catch (error) {
        if (error.response?.status === 400) {
          alert(error.response?.data?.message || "A folder with the same name already exists.");
        } else {
          setError(error.response?.data?.message || "Error creating folder.");
        }
      } finally {
        setLoading(false);

      }
    }
  };

  // useEffect(() => {
  //   fetchFolders();
  // }, []);

  // useEffect(() => {
  //   console.log("Selected folderId: 22222222222", folderId);
  // }, [folderId]);

  const toggleViewMode = () => {
    setViewMode(viewMode === "list" ? "grid" : "list");
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
      console.error("Error preparing file download:", error);

      // alert('Error preparing file download. Please try again.');
    }
  };

  const handleAddDesignee = () => {
    if (designeeName && designeePhone && designeeEmail) {
      setDesigners([...designers, designeeName]); // Add the new designer to the list

      setDesigneeName(""); // Reset the input fields
      setDesigneePhone("");
      setDesigneeEmail("");
    } else {
      setError("Please fill out all fields before inviting a designee.");
    }
  };

  const closeOverlay = () => {
    setOverlayVisible(false); // Close the overlay

    setFileData(null); // Reset file data when closing overlay
  };

  const handleSubmit = async () => {
    //alert(`Designee: ${collabs}\nMessage: ${message}\nNotify: ${notify}`);
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/api/share-files`,
      { file_id: fileId, designee: collabs, message, notify, permission },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const { success } = response.data;
    if (success) {
      // console.log("API response for folderId:", response.data);
      setTimeout(() => {
        setIsSubmitted(false);
        setShare(false); // Close the modal
      }, 3000);
      // alert("Share file successfully!");
    } else {
      // alert("You have already shared the file!");
    }
    setShare(false);
  };

  const handleSubmitFolder = async () => {
    //alert(`Designee: ${collabs}\nMessage: ${message}\nNotify: ${notify}`);
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/api/share-folder`,
      { folder_id: folderId, designee: collabs, message, notify, permission },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const { success } = response.data;
    if (success) {
      // console.log("API response for folderId:", response.data);
      // alert("Share file successfully!");
    } else {
      // alert("You have already shared the file!");
    }
    setShare(false);
  };

  const fetchDesignees = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/designee/auth-get`,
        {}, // Empty body if you don't need to send any data in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDesignees(response.data.designees); // Assuming response contains designees
    } catch (error) {
      console.error("Error fetching designees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignees();
  }, []);

  const handleCheckboxChange = (email) => {
    setSelectedEmails((prevSelectedEmails) => {
      if (prevSelectedEmails.includes(email)) {
        return prevSelectedEmails.filter((e) => e !== email); // Unselect if already selected
      } else {
        return [...prevSelectedEmails, email]; // Select if not selected
      }
    });
  };



  const clear = () => {
    setSelectedFile(null);

    setSelectedFolderId("");

    setCustomFileName("");

    setUploadQueue([]);

    setInputFileName("");

    setEditFile(null);

    setIsUploading(false);
  };

  const clear2 = () => {
    setEditFile(null);
    setIsUploading(true);
    setSelectedFolderId("");

    setCustomFileName("");

    setTags("");

  };

  const fetchFolders = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      // const token = Cookies.get('token');

      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await axios.get(
        `${API_URL}/api/get-folders`,

        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        }
      );

      const foldersData = response.data.map((folder) => ({
        id: folder._id, // Get _id for folder selection

        name: folder.folder_name,
      }));

      setFolders(foldersData); // Set fetched folders


      // Do not set selectedFolderId automatically on first load
    } catch (error) {
      // console.log(error.response?.data?.message || "Error fetching folders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();

  }, []);

  useEffect(() => {
    if (!activeFolderId) return;

    fetchFolders();

    if (onFolderSelect) {
      onFolderSelect(activeFolderId);
    }
  }, [activeFolderId, onFolderSelect]);

  const handleFolderSelect = (id) => {
    setSelectedFolderId(id); // Only set when the user selects a folder
  };

  const fetchFiles = async () => {
    setLoading(true);
    setFiles([]);
    setError(null);

    try {
      // const token = Cookies.get('token');
      const token = localStorage.getItem("token");

      // console.log("tokennnnnnn", token);

      // console.log("useerrrrrrrrid", userId);
      // if (folderId === "1" || folderId === 1) {
      //    folderId=1;
      // }
      console.log("folderrrrrid 22223333", folderId);

      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      if (folderId === "0" || folderId === 0) {
        const userId = localStorage.getItem("user");
        // console.log("User ID:", userId);

        if (!userId) {
          throw new Error("No userId found. Please log in again.");
        }

        // console.log("Folder ID is 0, fetching all files for userId:", userId);
        setFiles([]);

        try {
          const response = await axios.get(`${API_URL}/api/get-all-files`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // console.log("API response for all files and voice memos:", response.data);

          const aaple = response.data; // Ensure this is an array
          // console.log("aaple:", aaple);

          // Directly set files from response data
          setFiles(aaple);
          // console.log("aaple 4444");
          // console.log("aaple:", files);
          // Filter voice memos directly from the response
          const voiceMemos = aaple.filter(file => file.voice_name);

          // Log each voice memo
          voiceMemos.forEach(memo => {
            // console.log(`Voice Name: ${memo.voice_name}`);
            // console.log(`Duration: ${memo.duration} seconds`);
            // console.log(`File Size: ${memo.file_size} KB`);
            // console.log(`Link: ${memo.aws_file_link}`);
            // console.log("-----------------------------");
          });
          setNeed(false); // Assuming this is to indicate loading state is complete

          // Handle successful response

        } catch (error) {
          console.error("Error fetching files and voice memos:", error);

          // Handle different types of errors
          if (error.response) {
            // If there is a response from the server (non-2xx)
            console.error("Server responded with error:", error.response.data);
            // alert(`Error: ${error.response.data.message || "Failed to fetch files."}`);
          } else if (error.request) {
            // If the request was made but no response was received
            console.error("No response received:", error.request);
            // alert("No response from server. Please try again later.");
          } else {
            // Other errors like network issues, etc.
            console.error("Request setup error:", error.message);
            // alert("There was an error setting up the request. Please try again.");
          }

          setNeed(false); // Reset loading state on error
        }
      } else if (folderId === "1" || folderId === 1) {
        setFiles([]);

        // console.log("Folder ID is 0, fetching all files for userId:", userId);

        const response = await axios.get(
          `${API_URL}/api/default/default-files`
        );

        // console.log("API response for defaultttttttttttt:", response.data);

        const filesArray = response.data?.files || []; // Extract the files array

        setFiles(filesArray); // Set only the files array to the state   

        setNeed(true);
      } else {
        //  console.log("Fetching files for folderId:", folderId);
        setFiles([]);

        const response = await axios.post(
          `${API_URL}/api/get-files`,

          { folder_id: folderId },

          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = response.data || [];
        // console.log("API response for folderId:", response.data);

        setNeed(false);


        setFiles(response.data || []);
        // console.log("API response for files:", files);
        const ids = data.map(file => file._id);
        setFileIds(ids);
      }
    } catch (error) {
      console.error("Error fetching files:", error.response || error.message);

      // console.log(error.response?.data?.message || "Error fetching files.");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (fileId) => {
    setExpandedRow(expandedRow === fileId ? null : fileId); // Collapse if already expanded, otherwise expand
  };



  const handleUploadClick = () => {
    setIsUploading(true);
  };


  const handleToggleRow = (_id) => {
    // console.log("Toggling row with id:", _id); // Log the ID when toggling the row

    setExpandedRow((prev) => {
      const newExpandedRow = prev === _id ? null : _id;

      // console.log("Updated expandedRow:", newExpandedRow); // Log the new expandedRow value

      return newExpandedRow;
    });
  };





  const handleFileUpload = (input) => {
    const files = input instanceof FileList ? input : input.target.files;

    if (files && files.length > 0) {
      const fileArray = Array.from(files); // Convert FileList to an array

      const newUploadQueue = [];
      const newFiles = [];
      const selectedFilesArray = [];

      fileArray.forEach((file) => {
        const editedFileName = file.editedName || editFile?.name || file.name; // ✅ Ensuring latest edited name is used
        const fileExtension = file.name.split(".").pop();

        newUploadQueue.push({
          id: editedFileName,
          name: editedFileName,
          isUploading: false,
          progress: 0,
        });

        newFiles.push({
          name: editedFileName,
          description: "",
          tag: "",
        });

        selectedFilesArray.push({
          id: editedFileName, // ✅ Ensuring ID matches for updates
          name: file.name,
          extension: fileExtension,
          file: file,
          editedName: editedFileName, // ✅ Storing edited name
        });
      });

      setSelectedFile(selectedFilesArray); // Store multiple files
      setUploadQueue((prevQueue) => [...prevQueue, ...newUploadQueue]);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);

      setUploadStatus("Files are ready to upload");
    }
  };

  const handleSaveEdit = () => {
    if (!editFile) {
      console.log("🔴 handleSaveEdit: editFile is null!");
      return;
    }

    const updatedFileName = inputFileName
      ? `${inputFileName.includes(".") ? inputFileName : inputFileName + "." + editFile.extension}`
      : editFile.name;

    console.log("✅ handleSaveEdit: Final Updated File Name:", updatedFileName);

    // ✅ Update Files List
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.map((file) =>
        file.name === editFile.name || file.name === `${editFile.name}.${editFile.extension}`
          ? { ...file, name: updatedFileName, editedName: updatedFileName }
          : file
      );
      console.log("🟢 Updated Files List:", updatedFiles);
      return updatedFiles;
    });

    // ✅ Update Upload Queue
    setUploadQueue((prevQueue) => {
      const updatedQueue = prevQueue.map((file) =>
        file.id === editFile.id
          ? { ...file, name: updatedFileName, editedName: updatedFileName }
          : file
      );
      console.log("🟢 Updated Upload Queue:", updatedQueue);
      return updatedQueue;
    });

    // ✅ Update Selected Files
    setSelectedFile((prevSelected) => {
      const updatedSelected = prevSelected.map((file) =>
        file.id === editFile.id
          ? { ...file, name: updatedFileName, id: updatedFileName, editedName: updatedFileName }
          : file
      );
      console.log("🟢 Updated Selected Files:", updatedSelected);
      return updatedSelected;
    });



    setEditFile(null);
    setInputFileName("");

    // ✅ Verify Updates After React Re-renders
    setTimeout(() => {
      console.log("✅ Final Selected Files After Update:", selectedFile);
      console.log("✅ Final Files List After Update:", files);
    }, 500);
  };

  const uploadFileToServer = async () => {
    console.log("Selected Files Before Upload:", selectedFile);

    if (!selectedFile || selectedFile.length === 0) {
      setUploadStatus("Please select files.");
      return;
    }

    const folderToUpload = selectedFolderId || folderId;
    if (!folderToUpload || folderToUpload === "1" || folderToUpload === "0") {
      alert("No Folder is selected");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setUploadStatus("No token found. Please log in.");
      return;
    }

    try {
      showLoading();
      setIsUploading(true);

      const formData = new FormData();

      selectedFile.forEach((fileObj, index) => {
        const finalFileName = fileObj.editedName || fileObj.name;
        formData.append("files", fileObj.file);
        formData.append(`custom_file_names[${index}]`, finalFileName); // Ensuring array format
      });

      formData.append("folder_id", folderToUpload);
      if (tags && tags.length > 0) {
        formData.append("tags", JSON.stringify(tags)); // Ensure tags are sent if available
      }

      const response = await axios.post(`${API_URL}/api/upload-file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Uploading: ${progress}%`);
        },
      });

      if (response.status === 201) {
        setUploadStatus("Files uploaded successfully!");
        setSelectedFile([]);
        setSelectedFolderId("");
        setCustomFileName("");
        setUploadQueue([]);
        fetchFiles();
      } else {
        setUploadStatus("Error uploading files.");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      setUploadStatus(error?.response?.data?.error || "Error uploading files.");
      alert(error?.response?.data?.error || "Something went wrong.");
    } finally {
      setIsUploading(false);
      hideLoading();
    }
  };













  // useEffect(() => {
  //   console.log("Updated Selected Files:", selectedFile);
  // }, [selectedFile]);







  // const toggleEllipses = (file) => {

  //   const newOpenMenuId = openMenuId === folderId ? null : folderId;

  //   setOpenMenuId(newOpenMenuId);

  //   localStorage.setItem("openMenuId", JSON.stringify(newOpenMenuId));

  // };

  //--------------------------------------------------------

  // const uploadFileToServer = async () => {
  //   console.log("Selected Files Before Upload:", selectedFile);

  //   if (!selectedFile || selectedFile.length === 0) {
  //     setUploadStatus("Please select files.");
  //     return;
  //   }

  //   const folderToUpload = selectedFolderId || folderId;
  //   if (folderToUpload === "1" || folderToUpload === "0") {
  //     alert("No Folder is selected");
  //     return;
  //   }

  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     setUploadStatus("No token found. Please log in.");
  //     return;
  //   }

  //   try {
  //     showLoading();
  //     setIsUploading(true);

  //     const uploadPromises = selectedFile.map(async (fileObj) => {
  //       const formData = new FormData();
  //       const finalFileName = fileObj.editedName || fileObj.name;

  //       console.log("Uploading File:", finalFileName);

  //       formData.append("files", fileObj.file);
  //       formData.append("custom_file_names", finalFileName);
  //       formData.append("folder_id", folderToUpload);
  //       console.log("Uploading File:", formData);
  //       return axios.post(`${API_URL}/api/upload-file`, formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         onUploadProgress: (progressEvent) => {
  //           const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
  //           setUploadStatus(`Uploading: ${progress}%`);
  //         },
  //       });
  //     });

  //     await Promise.all(uploadPromises);

  //     setUploadStatus("Files uploaded successfully!");
  //     setIsUploading(false);
  //     setSelectedFile([]);
  //     setSelectedFolderId("");
  //     setCustomFileName("");
  //     setUploadQueue([]);
  //     fetchFiles();
  //   } catch (error) {
  //     setUploadStatus("Error uploading files.");
  //     alert(error);
  //   } finally {
  //     hideLoading();
  //   }
  // };

  //--------------------------------------------------------

  const handleEditFile = (file) => {
    setIsUploading(false);
    if (!file || typeof file.name !== "string") {
      console.error("Invalid file object:", file);
      return;
    }

    const fileExtension = file.name.split(".").pop(); // Extract the extension

    setEditFile({
      ...file,

      name: file.name.replace(`.${fileExtension}`, ""), // Remove the extension from the name

      description: file.description || "", // Provide a fallback for description

      tag: file.tag || "", // Provide a fallback for tag

      extension: fileExtension, // Store the extension
    });
  };

  const toggleEllipses = (fileId) => {
    // Toggle the menu for the specific file by comparing the IDs
    setOpenMenuId((prevId) => (prevId === fileId ? null : fileId));
  };








  const handleDeleteFile = (fileId) => {
    setUploadQueue((prevQueue) =>
      prevQueue.filter((file) => file.id !== fileId)
    );
  };

  const extractFileExtension = (fileName) => {
    const extension = fileName.split(".").pop(); // Extracts file extension

    return extension;
  };

  const deleteFile = async (file_id) => {
    // const token = Cookies.get('token');
    const token = localStorage.getItem("token");

    const selectedFolder = folderId; // Ensure folderId is set correctly

    // Debugging logs

    // console.log("Token:", token);

    // console.log("Selected Folder ID:", selectedFolder);

    // console.log("File ID to delete33333:", file_id);

    // Check for missing values

    if (!token) {
      // setMessage("No token found. Please log in.");

      console.error("Missing token");

      return;
    }

    if (!selectedFolder) {
      // setMessage("No folder selected.");

      console.error("Missing folderId");

      return;
    }

    if (!file_id) {
      // setMessage("No file selected to delete.");

      console.error("Missing file_id");

      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/delete-file`,

        { folder_id: selectedFolder, file_id },

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFiles(files.filter((file) => file._id !== file_id));

      // console.log(response.data.message || "File deleted successfully.");

      setDeletebutton(false);
    } catch (error) {
      console.log(error.response?.data?.message || "Error deleting file.");
    }
  };

  const fetchFileContent = async (fileId) => {
    try {
      setLoading(true);
      setError("");

      // const token = Cookies.get('token');
      const token = localStorage.getItem("token");

      // console.log("Retrieved Token:", token);

      if (!token) {
        setError("Token is missing. Please log in again.");
        return;
      }

      console.log("defaultttttttttttttt", fileId);

      if (folderId === 1 || folderId === "1") {
        // console.log("defaultttttttttttttttttttt", fileId);
        console.log("inside 1");
        const response = await axios.get(
          `${API_URL}/api/default/view-file/${fileId}`
        );

        if (response.status !== 200) {
          throw new Error(
            `Failed to fetch file, status code: ${response.status}`
          );
        }

        const { file_name, aws_file_link, mime_type } = response.data.file;

        if (!aws_file_link) {
          throw new Error("File URL is missing from the response.");
        }

        setFileData({
          fileName: file_name || "Unknown",
          mimeType: mime_type || "Unknown",
          fileUrl: aws_file_link,
        });

        setShowOverlay(true);
      } else {
        console.log("outside 1");
        const response = await axios.post(
          `${API_URL}/api/view-file-content`,
          { fileId: fileId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // const toggleEllipses = (fileId) => {
        //   const newOpenMenuId = openMenuId === fileId ? null : fileId; // Toggle menu
        //   setOpenMenuId(newOpenMenuId);
        // };
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
      }
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
            className="min-w-full max-h-[90vh] object-contain rounded-md"
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
          // style={{ width: "500vw", height: "500vh", border: "none" }}
          className="h-[90vh] w-[90vw]"
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
  useEffect(() => {
    // Disable right-click
    const disableContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableContextMenu);

    // Detect screenshot tools
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        document.body.style.filter = "brightness(0)"; // Make screen black
      } else {
        document.body.style.filter = "none"; // Restore visibility
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  const renderOverlay = () => {


    return (
      <div
        className="fixed top-0 pt-10 left-0 w-[100vw] h-[100%] bg-[rgba(0,0,0,0.8)] text-white z-[1000] flex justify-center items-center"
      >
        <div className="h-10 w-screen pr-2 md:pr-10 mb-4 fixed top-0 flex justify-between">
          <div>
            <p className="p-4">{fileName}</p>
          </div>

          <div className="flex gap-x-4 md:gap-x-10 p-4">
            {/* <button 
          className="hidden w-40 h-10 rounded bg-blue-500 md:flex p-2 text-white"
          onClick={() => {
            setEditFileId(file._id);
            setTempFName(fileName);
          }}
          
          >Edit document <FilePenLine className="ml-3" /></button>
          <button className="w-14  md:hidden  h-10 rounded bg-blue-500 flex p-2 text-white"><FilePenLine className="ml-3" /></button>
          <button 
          // onClick={handleDownloadFile(fileId)}
          ><p ><Download  className="mt-2 cursor-pointer"/></p></button> */}
            <button
              className="  text-white mt-2"
              onClick={() => setShowOverlay(false)}
            >
              <X />
            </button>
          </div>

        </div>
        <div
          className="text-black mt-4 flex justify-center items-center p-5 rounded-lg min-w-[20%] min-h-[90%] relative h-auto"
          style={{
            userSelect: "none", // Disable text selection if needed
            // Removed pointerEvents: "none" to allow interactions
          }}
        >

          {renderFileContent()}

        </div>
      </div>

    );
  };

  const filteredDesignees = designees.filter((designee) =>
    designee.name?.toLowerCase().includes(MobilesearchQuery.toLowerCase())
  );

  const sortedFiles = files.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  console.log("sorted files by created_at:", sortedFiles);
  
  const filteredFiles = sortedFiles.filter((file) =>
    file.file_name?.toLowerCase().includes(searchQuery)
  );
  const filteredMobileFiles = files.filter((file) =>
    file.file_name?.toLowerCase().includes(MobilesearchQuery)
  );
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null); // Close the menu
      }
    };

    // Attach event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const shareFile = async (fileId) => {
    showLoading();
    if (!selectedEmails.length) {
      console.error("No designees selected.");
      return;
    }

    const token = localStorage.getItem("token");
    // console.log("token", token);
    // console.log("notify", notify);
    // console.log("to_email_id", selectedEmails);
    // console.log("file_ids before check", fileId);  // Debugging the fileId here  
    // console.log("file_id before check", file);  // Debugging the fileId here

    if (!selectedEmails || !token || !fileId || fileId.length === 0) {
      console.error("Missing required fields: to_email_id, token, or file_id.");
      return;
    }

    // Ensure fileId is an array
    const filesToShare = Array.isArray(fileId) ? fileId : [fileId];

    // console.log("Files to share", filesToShare);  // Debugging the final files array

    const data = {
      file_id: filesToShare, // Single file ID
      to_email_id: selectedEmails, // Array of emails
      access: "view", // Adjust as needed
      notify: notify,
      message: message, // Optional, include if notifications are needed
    };
    // console.log("data before check", data);  // Debugging the fileId here
    try {
      const response = await axios.post(
        `${API_URL}/api/designee/share-files`, // Backend endpoint
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle the response, if needed
      // console.log("File shared successfully:", response.data);
      // const [shareFolderModal, setShareFolderModal] = useState(false);

    } catch (error) {
      console.error("Error sharing file:", error);
    }
    finally {
      hideLoading();
      setShareFolderModal(false);
    }
  };



  // const shareFile = async (file_id) => {
  //   const storedUser = localStorage.getItem("user");
  //   const storedEmail = localStorage.getItem("email");
  //   let set_people = [
  //     { name: `${storedUser} (you)`, email: storedEmail, role: "Owner" },
  //   ];
  //   //setPeople([{ name: `${storedUser} (you)`, email: storedEmail, role: "Owner" }]);
  //   // Get the download link from the server
  //   const token = localStorage.getItem("token");
  //   const response = await axios.post(
  //     `${API_URL}/api/get-file-data`, // Backend endpoint
  //     { file_id },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );
  //   var set_permission = {};
  //   const { userSharedFile } = response.data;
  //   userSharedFile.forEach((sharedFile, index) => {
  //     set_permission = { ...set_permission, [index + 1]: sharedFile.access };
  //     //setPermission({...permission, [index]:sharedFile.access});
  //     if (sharedFile.to_user_id) {
  //       set_people.push({
  //         user_id: `${sharedFile.to_user_id._id}`,
  //         name: `${sharedFile.to_user_id.username}`,
  //         email: sharedFile.to_user_id.email,
  //         role: sharedFile.to_user_id.roles[0].roleName,
  //       });
  //     } else {
  //       set_people.push({
  //         user_id: `${sharedFile.to_email_id}`,
  //         name: `${sharedFile.to_email_id}`,
  //         email: sharedFile.to_email_id,
  //         role: "Designee",
  //       });
  //     }
  //   });
  //   setPermission(set_permission);
  //   setPeople(set_people);
  //   setFileId(file_id);
  //   setShare(true);
  // };

  return (
    <div className=" px-4  bg-white">

      {/* delete overlay */}
      {/* {deletebutton && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="deleteModalLabel"
          aria-describedby="deleteModalDescription"
        >
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full m-2">
            <div className="flex justify-between items-center mb-4">
              <h2 id="deleteModalLabel" className="text-lg font-semibold">
                Are you sure to delete this folder?
              </h2>
            </div>

            <div
              id="deleteModalDescription"
              className="text-sm text-gray-600 mb-4"
            >
              This action cannot be undone. Please confirm if you'd like to
              proceed.
            </div>

            <div className="flex justify-end gap-2 my-2">
              <button
                onClick={() => setDeletebutton(false)}
                className="border-2 border-blue-500 text-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteFolder(selectedFolder);
                  setDeletebutton(false);
                }}
                className="bg-blue-500 text-white px-6 py-2 rounded"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* Dashboard Header */}

      <div className="w-full mt-2 flex items-center border border-gray-300 rounded-lg p-2 md:hidden">
        <Search className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search"
          className="w-full p-1 bg-transparent outline-none text-black"
          onChange={(e) => MobilesetsearchQuery(e.target.value)}
        />
      </div>

      {folderId !== 1 && folderId !== "1" && (
        <div className="flex flex-col mt-8">
          <h1 className="text-2xl font-normal text-[#1F1F1F]">Welcome to Cumulus</h1>

          <div
            className="bg-[#0067FF] w-52 rounded-2xl my-2 p-3 "
            onClick={() => {
              setInputFileName("");
              if (isMembershipActive) {
                setEditing(false);
                handleUploadClick();
                
              } else {
                setDeletebutton1(true);
                
              }
            }}
          >
            <button className="flex items-center text-white px-2">
              <img
                src={fileupload}
                alt=""
                className="w-10 mr-2 object-contain"
              />
              Upload File
            </button>

            <div className="flex justify-between">
              <p className="text-white text-sm ml-1">Click to drop file now</p>

              <ArrowRight className="ml-2 text-white" />
            </div>
          </div>
        </div>
      )}

      {/* TOGLE BTN */}

      <div className="flex justify-end  md:hidden">
        <button
          className="px-4 py-2 text-black rounded-md text-sm  flex"
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

      {/* File List */}

      {Array.isArray(files) && files.length > 0 ? (
        <div className="flex border-b-2 md:border-0 mb-0 justify-between items-center mt-2 ml-4 md:px-0 border-gray-300">
          <div className="flex justify-between items-center mt-2 md:px-0 border-gray-300">
            <div className="text-sm">
              {/* Folder Name */}
              <div className="flex items-center md:gap-x-2 border-b-4 border-blue-500 text-blue-500">
                <span className=" font-semibold pb-2 mr-2">
                  {file.folder_name ? file.folder_name : 'Cumulus'}

                </span>
                <span className="text-black rounded-lg text-sm mt-1 mb-2 px-2.5 bg-[#EEEEEF]">
                  {`${files.length}`}
                </span>
              </div>

              <div className="" />
            </div>
          </div>

          {!(folderId === "0" || folderId === 1 || folderId === "1") ? (
            <div
              className="flex items-center mb-1 bg-[#0067FF] rounded-lg cursor-pointer"
              onClick={() => {
                setFile(fileIds);
                setShareFolderModal(true);

              }}
            >
              <div className="h-7 w-7 ml-2 bg-white rounded-full flex items-center justify-center pl-1">
                <img className="h-5 w-5 mr-1 " src={shareicon} alt="" />
              </div>
              <p className="text-md  text-white rounded-md py-2 px-2">
                Share Folder
              </p>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="text-center text-gray-500"></p>
      )}

      {viewMode === "list" ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:hidden p-1 max-h-[50vh]  ">
            {Array.isArray(filteredMobileFiles) &&

              filteredMobileFiles.map((file) => (
                <div key={file._id} className="border p-2 rounded  ">
                  <div className="flex justify-between relative">
                    {/* <h3 className="text-lg font-medium">{file.file_name}</h3> */}
                    {String(editFileId) === String(file._id) ? (
                      <div className="flex items-center gap-2 border-b-2 border-blue-500 pt-2">
                        <input
                          type="text"
                          value={tempFName}
                          onChange={(e) => {
                            setTempFName(e.target.value);
                            // console.log("Temp File Name:", e.target.value);
                          }}
                          onBlur={() => handleSaveFName(file._id)} // Save the new file name when input loses focus
                          className="rounded p-1 bg-transparent outline-none"
                          autoFocus
                        />
                        <button
                          className="text-blue-500 hover:text-blue-700 px-3 py-1 bg-gray-100 rounded-md bg-transparent"
                          onClick={() => handleSaveFName(file._id)} // Save on button click
                        >
                          {/* <Check className="h-5" /> */}Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">
                          {file.file_name}
                        </h3>
                      </div>
                    )}

                    {/* Ellipsis Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleEllipses(file._id);
                      }}
                    >
                      <EllipsisVertical />
                    </button>

                    {/* Dropdown Menu */}
                    {openMenuId === file._id && (
                      <motion.div
                        ref={menuRef}
                        className="absolute top-5 right-6 mt-2 w-48 bg-white shadow-lg rounded-lg text-black flex flex-col gap-y-2 p-2 z-50 "
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                      >
                        {!need && (
                          <>
                            <button
                              className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                              onClick={() => {
                                setFile(file._id);
                                setShareFolderModal(true); // Close menu after selecting
                              }}
                            >
                              {/* <Users className="h-4" /> */}
                              <img
                                src={shareicondesignee}
                                alt=""
                                className="h-4"
                              />
                              Share
                            </button>

                            <button
                              className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                              onClick={() => {
                                setOpenMenuId(null);
                                setEditFileId2(file._id);
                                fetchUsersWithFileAccess(file._id);
                                // console.log("Editing File ID:", file._id);
                              }}
                            >
                              {/* <Folder className="h-4" /> */}
                              <img src={foldericon} alt="" className="h-4" />
                              Access
                            </button>

                            <button
                              className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                              onClick={() => {
                                handleEditFile(file);
                                setOpenMenuId(null);
                                setEditFileId(file._id);
                                setTempFName(file.file_name); // Close menu after selecting
                              }}
                            >
                              <img
                                src={editicon}
                                alt=""
                                className="h-4 "
                                onClick={() => {
                                  setEditFileId(file._id);
                                  setTempFName(file.file_name);
                                }}
                              />
                              {/* <Edit className="h-4" /> */}
                              Edit
                            </button>

                            <button
                              className="flex items-center gap-2  text-gray-600 hover:text-red-500"
                              onClick={() => {
                                setDeletebutton(true);
                                setSelectedFileId(file._id); // Set the file ID to the state
                                setOpenMenuId(null); // Close menu after selecting
                              }}
                            >
                              {/* <Trash2 className="h-4" /> */}
                              <img src={trashicon} alt="" className="h-4" />
                              Delete
                            </button>
                            <button
                              className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                              onClick={() => {
                                handleDownloadFile(file._id);
                                setOpenMenuId(null);
                              }}
                            >
                              {/* <Download className="h-4 font-extrabold" /> */}
                              <img src={downloadicon} alt="" className="h-4" />
                              Download
                            </button>

                            <button
                                      className="relative group flex items-center gap-2 text-gray-600 hover:text-blue-500"
                                      onClick={() => {
                                        setVirsonHistory(true);
                                        // handleDownloadFile(file._id)
                                      }
                                      }
                                    >
                                      <FileClock className="h-4 w-4 text-black" />
                                      
                                        Version History
                                      
                                    </button>
                          </>
                        )}

{
  versionHistory && (
    <>
      <div className="h-screen w-screen fixed pr-6 inset-0 flex justify-between items-center z-50">
        <div className="absolute inset-0 bg-black opacity-50"></div> 
        
      {/* Background div with opacity */}
      <div></div>
        <div className="mt-10 bg-white opacity-100 relative"> {/* Main content with full opacity */}
          
          <div className="w-full flex justify-between">
            <button></button>
            <button
              onClick={() => setVirsonHistory(false)}
              className="text-black hover:text-red-600">
              <X />
            </button>
          </div>
          <VersionHistory fileId={file._id} />
        </div>
      </div>
    </>
  )
}

                        <button
                          className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                          onClick={() => {
                            fetchFileContent(file._id);
                            setOpenMenuId(null); // Close menu after selecting
                          }}
                        >
                          {/* <Eye className="h-4" /> */}
                          <img src={eyeicon} alt="" className="h-4" />
                          View Content
                        </button>

                      </motion.div>
                    )}
                  </div>

                  <span className="">
                    <p className="text-lg text-gray-500">{file.date_of_upload}</p>
                  </span>

                  <span className="">
                    <p className=" text-sm text-gray-800  ">
                      {file.date_of_upload &&
                        !isNaN(new Date(file.date_of_upload))
                        ? new Date(file.date_of_upload).toLocaleString(
                          "en-US",
                          {
                            weekday: "short",

                            year: "numeric",

                            month: "short",

                            day: "numeric",

                            hour: "numeric",

                            minute: "numeric",

                            // second: 'numeric',

                            hour12: true, // for 24-hour format
                          }
                        )
                        : "Invalid Date"}
                    </p>
                  </span>

                  {/* <span className="flex justify-between">
                    <p className="text-sm text-gray-600"> */}
                  {/* Sharing contact: {file.folder_contact} */}


                  {/* </p>
                  </span> */}

                  <div className="flex  w-full justify-between h-10 relative">
                    <div></div>

                    <div className="flex">



                      {file.access_details && file.access_details.length > 0 ? (
                        file.access_details.slice(0, 3).map((detail, index) => (
                          <img
                            key={index}
                            src={detail.designee.profile_picture || "/default-profile.png"}
                            alt={detail.designee.name}
                            className={`absolute shadow-lg h-8 w-8 rounded-full ${index === 0
                              ? "z-20 right-6"
                              : index === 1
                                ? "z-10 right-10"
                                : "z-0 right-14"
                              }`}
                          />
                        ))
                      ) : (
                        <span className="text-gray-500"></span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 flex gap-2"></div>
                </div>
              ))}
          </div>

          <div className="mt-2 bg-white rounded hidden md:flex max-h-[70vh] pb-[20px] overflow-y-scroll">
            <table className="w-full">
              <thead className="sticky top-0 ">
                <tr className="bg-gray-100 text-left text-[0.8rem]  border-black">
                  <th className="p-2 md:p-4 font-medium text-[#667085] text-sm">
                    File Name
                  </th>
                  <th className="p-2 md:p-4 font-medium text-[#667085] text-sm">
                    Folder
                  </th>
                  <th className="p-2 md:p-4 font-medium text-[#667085] text-sm">
                    Date Uploaded
                  </th>
                  <th className="p-2 md:p-4 font-medium text-[#667085] text-sm">
                  {!(folderId === 1 || folderId === "1") && (
  <>
    Sharing Contact
    </>
)}
  </th>

                </tr>
              </thead>

              <tbody className="">
                {Array.isArray(filteredFiles) ? (
                  // If files is an array, use map

                  filteredFiles.map((file) => {
                    // console.log("File Object:", file); // Debugging file object

                    const isExpanded = expandedRow === file._id; // Check if the current row is expanded

                    return (
                      <React.Fragment key={file._id}>
                        {/* Main Row */}
                        <tr
                          className={`text-xs sm:text-sm border-b-2 ${isExpanded ? "bg-blue-100 border-blue-100" : ""
                            } transition-all duration-100`}
                        >
                          <td className="p-0 md:p-4 flex items-center gap-0 md:gap-2">
                            <button
                              className="text-gray-500 hover:text-gray-800"
                              onClick={() => {
                                handleToggleRow(file._id)
                                setFileName(file.file_name)
                              }
                              }

                            >
                              <ChevronDown
                                className={`${isExpanded ? "rotate-180" : ""
                                  } h-5 transition-transform`}

                              />
                            </button>

                            {String(editFileId) === String(file._id) ? (
                              <div className="flex items-center gap-2 border-b-2 border-blue-500 pt-2">
                                <input
                                  type="text"
                                  value={tempFName}
                                  onChange={(e) => {
                                    setTempFName(e.target.value);
                                    // console.log("Temp File Name:", e.target.value);
                                  }}
                                  onBlur={() => handleSaveFName(file._id)} // Save the new file name when input loses focus
                                  className="rounded p-1 bg-transparent outline-none"
                                  autoFocus
                                />
                                <button
                                  className="text-blue-500 hover:text-blue-700 px-3 py-1 bg-gray-100 rounded-md bg-transparent"
                                  onClick={() => handleSaveFName(file._id)} // Save on button click
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center font-normal text-sm gap-2">
                                {file.file_name}
                              </div>
                            )}
                          </td>

                          <td className="p-0 md:p-4">
                            <div
                              className={`bg-[#EEEEEF] rounded-lg px-3 py-1 text-[1rem] inline-block transition-all duration-300 ${isExpanded ? "bg-white" : "bg-[#EEEEEF]"
                                }`}
                            >
                              {file.folder_name ? file.folder_name : 'Cumulus'}

                            </div>
                          </td>
                          <td className="p-0 md:p-4">
                            <p className="text-xss sm:text-sm text-gray-600 mt-1">
                              {file.date_of_upload &&
                                !isNaN(new Date(file.date_of_upload))
                                ? new Date(file.date_of_upload).toLocaleString("en-US", {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true, // for 12-hour format
                                })
                                : "Invalid Date"}
                            </p>
                          </td>
                          <td className="p-0 md:p-4">
                            {/* {file.sharing_contacts} */}

                            {/* <span className="h-5 w-5 bg-slate-100 rounded-lg p-2">Nishant</span>
                            <span className="h-5 w-5 bg-slate-100 rounded-lg p-2 ml-3">+6</span> */}

                            {file.access_details && file.access_details.length > 0 ? (
                              <div className="flex items-center gap-2">
                                {/* Display the first designee's name */}
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs sm:text-sm">
                                  {file.access_details[0].designee.name}
                                </span>
                                {/* If more designees exist, show the count */}
                                {file.access_details.length > 1 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs sm:text-sm">
                                    +{file.access_details.length - 1}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-500 text-xs sm:text-sm"></span>
                            )}


                          </td>
                        </tr>

                        {/* Expanded Row */}
                        {isExpanded && (
                          <tr className="">
                            <td
                              colSpan="5"
                              className="px-4 pb-4 border-r border-blue-100 bg-blue-100 rounded-bl-3xl rounded-br-3xl"
                            >
                              <div className="flex gap-4 items-center">
                                {!need && (
                                  <>
                                    <button
                                      className="relative group flex items-center gap-2 text-gray-600 hover:text-blue-500"
                                      onClick={() => {
                                        setFile(file._id);
                                        setShareFolderModal(true);

                                      }}
                                    >
                                      <img
                                        src={shareicondesignee}
                                        alt=""
                                        className="h-4"
                                      />
                                      <span className="absolute bottom-[-45px] left-2/3 transform -translate-x-1/2 hidden min-w-[110px] group-hover:block bg-white text-black text-xs py-1 px-1 rounded shadow z-20">
                                        Share with Designee
                                      </span>
                                    </button>
                                    <button
                                      className="relative group flex items-center gap-2 text-gray-600 hover:text-blue-500"
                                      onClick={() => {
                                        setOpenMenuId(null);
                                        setEditFileId2(file._id);
                                        fetchUsersWithFileAccess(file._id);
                                        // console.log("Editing File ID:", file._id);
                                      }}
                                    >
                                      <img
                                        src={foldericon}
                                        alt=""
                                        className="h-4"
                                      />
                                      <span className="absolute bottom-[-46px] left-1/2 transform -translate-x-1/2 hidden group-hover:block min-w-[80px] bg-white text-black text-xs py-1 px-2 rounded shadow z-20">
                                        Grant Access
                                      </span>
                                    </button>
                                    <button
                                      className="relative group flex items-center gap-2 text-gray-600 hover:text-blue-500"
                                      onClick={() => {
                                        setEditFileId(file._id);
                                        setTempFName(file.file_name);
                                        // console.log("Editing File ID:", file._id);
                                      }}
                                    >
                                      <img
                                        src={editicon}
                                        alt=""
                                        className="h-4"
                                      />
                                      <span className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-white min-w-[100px] text-black text-xs py-1 px-1 rounded shadow z-20">
                                        Edit Document
                                      </span>
                                    </button>

                                    <button
                                      className="relative group flex items-center gap-2 text-gray-600 hover:text-red-500"
                                      onClick={() => {
                                        setDeletebutton(true);
                                        // console.log("Deleting file with ID:", file._id);
                                        setSelectedFileId(file._id);
                                      }}
                                    >
                                      <img
                                        src={trashicon}
                                        alt=""
                                        className="h-4"
                                      />
                                      <span className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-white text-black text-xs py-1 px-2 rounded shadow z-20">
                                        Delete
                                      </span>
                                    </button>
                                    <button
                                      className="relative group flex items-center gap-2 text-gray-600 hover:text-blue-500"
                                      onClick={() => handleDownloadFile(file._id)}
                                    >
                                      <img
                                        src={downloadicon}
                                        alt=""
                                        className="h-4"
                                      />
                                      <span className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-white text-black text-xs py-1 px-2 rounded shadow z-20">
                                        Download
                                      </span>
                                    </button>

                                    <button
                                      className="relative group flex items-center gap-2 text-gray-600 hover:text-blue-500"
                                      onClick={() => {
                                        setVirsonHistory(true);
                                        // handleDownloadFile(file._id)
                                      }
                                      }
                                    >
                                      <FileClock className="h-4 w-4 text-black" />
                                      <span className="absolute bottom-[-46px] left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-white text-black text-xs py-1 px-2 rounded shadow z-20">
                                        Version History
                                      </span>
                                    </button>


                                  </>
                                )}

{
  versionHistory && (
    <>
      <div className="h-screen w-screen fixed pr-6 inset-0 flex justify-between items-center z-50">
        <div className="absolute inset-0 bg-black opacity-50"></div> 
        
      {/* Background div with opacity */}
      <div></div>
        <div className="fixed top-0 right-0 bg-white opacity-100 "> {/* Main content with full opacity */}
          
          <div className="w-full flex justify-between p-3">
            <button></button>
            <button
              onClick={() => setVirsonHistory(false)}
              className="text-black hover:text-red-600">
              <X className=""/>
            </button>
          </div>
          <VersionHistory fileId={file._id} />
        </div>
      </div>
    </>
  )
}

                                <button
                                  className="relative group flex items-center gap-2 text-gray-600 hover:text-blue-500"
                                  onClick={() => {
                                    fetchFileContent(file._id)
                                    // setOverlayFileId(file.file._id)
                                  }



                                  }
                                >
                                  <img src={eyeicon} alt="" className="h-4" />
                                  <span className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-white text-black text-xs py-1 px-2 rounded shadow z-20">
                                    View
                                  </span>
                                </button>

                                {/* Conditionally render Files and Voice based on availability */}
                                {file.hasFile && (
                                  <div className="text-gray-600">
                                    <h3>Files:</h3>
                                    {/* Display the file content or link here */}
                                    <p>{file.fileContent || "No file content available"}</p>
                                  </div>
                                )}
                                {file.hasVoice && (
                                  <div className="text-gray-600">
                                    <h3>Voice:</h3>
                                    {/* Display the voice content or player here */}
                                    <audio controls>
                                      <source src={file.voiceUrl} type="audio/mp3" />
                                      Your browser does not support the audio element.
                                    </audio>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>

                    );
                  })
                ) : (
                  // If files is not an array (single file object), render the row without map

                  <React.Fragment key={files._id}>
                    {/* Main Row */}

                    <tr className="text-sm">
                      <td className="p-0 md:p-4 flex items-center gap-0 md:gap-2">
                        <button
                          className="text-gray-500 hover:text-gray-800"
                          onClick={() => handleToggleRow(files._id)} // Toggle specific file row
                        >
                          <ChevronDown
                            className={
                              expandedRow === files._id ? "rotate-180" : ""
                            }
                          />
                        </button>

                        {files.file_name}
                      </td>

                      <td className="p-0 md:p-4">{files.folder_name}</td>

                      <td className="p-0 md:p-4">{files.date_of_upload}</td>

                      <td className="p-0 md:p-4">{files.sharing_contacts}</td>

                      <td className="p-0 md:p-4">{files.tags}</td>
                    </tr>

                    {/* Expanded Actions */}

                    {expandedRow === files._id && (
                      <tr className="bg-white">
                        <td colSpan="5" className="p-4">
                          <div className="flex gap-4 items-center">
                            {/* Share Button */}

                            <button
                              className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                              onClick={() => setShare(true)}
                            >
                              {/* <Users className="h-4" /> */}
                              <img
                                src={shareicondesignee}
                                alt=""
                                className="h-4"
                              />
                            </button>

                            {/* Access Button */}

                            <button
                              className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                              onClick={() => setAccess(true)}
                            >
                              {/* <Folder className="h-4" /> */}

                              <img src={foldericon} alt="" className="h-6" />

                              <img src={foldericon} alt="" className="h-4" />
                            </button>

                            {/* Edit Button */}

                            <button
                              className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                              onClick={() => handleEditFile(files)}
                            >
                              {/* <Edit className="h-4" /> */}
                              <img src={editicon} alt="" className="h-4" />
                            </button>

                            {/* View Content Button */}

                            <button
                              className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                              onClick={() => fetchFileContent(files._id)}
                            >
                              {/* <Eye className="h-4" /> */}
                              <img src={eyeicon} alt="" className="h-4 " />
                            </button>

                            {/* Delete Button */}

                            <button
                              className="flex items-center gap-2 text-gray-600 hover:text-red-500"
                              onClick={() => {
                                setDeletebutton(true);


                                setSelectedFileId(files._id); // Set the file ID to the state
                              }}
                            >
                              {/* <Trash2 className="h-4" /> */}

                              <img src={trashicon} alt="" className="h-6" />

                              <img src={trashicon} alt="" className="h-4" />
                            </button>

                            {/* Download Button */}

                            <button
                              className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                              onClick={() => handleDownloadFile(files._id)}
                            >
                              {/* <Download className="h-4" /> */}

                              <img src={downloadicon} alt="" className="h-6" />

                              <img src={downloadicon} alt="" className="h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-2 gap-2 md:hidden p-2  max-h-[50vh] overflow-y-scroll">
          {Array.isArray(filteredMobileFiles) &&
            filteredMobileFiles.map((file) => (
              <div key={file._id} className="bg-white p-4 rounded border ">
                <div className="flex justify-between relative">
                  <span
                    className="block overflow-hidden"
                    style={{
                      maxWidth: "25vw", // Constrain the width
                    }}
                  >
                    {String(editFileId) === String(file._id) ? (
                      <div className="flex items-center gap-2 border-b-2 border-blue-500 pt-2">
                        <input
                          type="text"
                          value={tempFName}
                          onChange={(e) => {
                            setTempFName(e.target.value);
                            // console.log("Temp File Name:", e.target.value);
                          }}
                          onBlur={() => handleSaveFName(file._id)} // Save the new file name when input loses focus
                          className="rounded p-1 bg-transparent outline-none"
                          autoFocus
                        />
                        <button
                          className="text-blue-500 hover:text-blue-700 px-3 py-1 bg-gray-100 rounded-md"
                          onClick={() => handleSaveFName(file._id)} // Save on button click
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <p
                        className="text-lg font-bold  text-gray-600 truncate"
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "100%",
                        }}
                      >
                        {file.file_name.trim()}
                      </p>
                    )}
                  </span>

                  {/* Ellipsis Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleEllipses(file._id);
                    }}
                  >
                    <EllipsisVertical />
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuId === file._id && (
                    <motion.div
                      ref={menuRef}
                      className="absolute top-8  mt-2 w-48 bg-white shadow-lg rounded-lg text-black flex flex-col gap-y-2 p-2 z-50 "
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      {!need && (
                        <>
                          <button
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                            onClick={() => {
                              setFile(file._id);
                              setShareFolderModal(true); // Close menu after selecting
                            }}
                          >
                            {/* <Users className="h-4" /> */}
                            <img
                              src={shareicondesignee}
                              alt=""
                              className="h-4"
                            />
                            Share
                          </button>

                          <button
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                            onClick={() => {
                              setEditFileId2(file._id);
                              fetchUsersWithFileAccess(file._id);
                              // console.log("Editing File ID:", file._id);
                            }}
                          >
                            {/* <Folder className="h-4" /> */}
                            <img src={foldericon} alt="" className="h-4" />
                            Access
                          </button>

                          <button
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                            onClick={() => {
                              handleEditFile(file);
                              setOpenMenuId(null);
                              setEditFileId(file._id);
                              setTempFName(file.file_name); // Close menu after selecting
                            }}
                          >
                            {/* <Edit className="h-4" /> */}
                            <img src={editicon} alt="" className="h-4 " />
                            Edit
                          </button>

                          <button
                            className="flex items-center gap-2 text-gray-600 hover:text-red-500"
                            onClick={() => {
                              setDeletebutton(true);
                              setSelectedFileId(file._id); // Set the file ID to the state
                              setOpenMenuId(null); // Close menu after selecting
                            }}
                          >
                            {/* <Trash2 className="h-4" /> */}
                            <img src={trashicon} alt="" className="h-4" />
                            Delete
                          </button>
                          <button
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                            onClick={() => {
                              handleDownloadFile(file._id);
                              setOpenMenuId(null); // Close menu after selecting
                            }}
                          >
                            {/* <Download className="h-4" /> */}
                            <img src={downloadicon} alt="" className="h-4" />
                            Download
                          </button>

                          <button
                                      className="relative group flex items-center gap-2 text-gray-600 hover:text-blue-500"
                                      onClick={() => {
                                        setVirsonHistory(true);
                                        // handleDownloadFile(file._id)
                                      }
                                      }
                                    >
                                      <FileClock className="h-4 w-4 text-black" />
                                      
                                        Version History
                                      
                                    </button>
                        </>
                      )}
{
  versionHistory && (
    <>
      <div className="h-screen w-screen fixed pr-6 inset-0 flex justify-between items-center z-50">
        <div className="absolute inset-0 bg-black opacity-50"></div> 
        
      {/* Background div with opacity */}
      <div></div>
        <div className="mt-10 bg-white opacity-100 relative"> {/* Main content with full opacity */}
          
          <div className="w-full flex justify-between">
            <button></button>
            <button
              onClick={() => setVirsonHistory(false)}
              className="text-black hover:text-red-600">
              <X />
            </button>
          </div>
          <VersionHistory fileId={file._id} />
        </div>
      </div>
    </>
  )
}
                      <button
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                        onClick={() => {
                          fetchFileContent(file._id);
                          setOpenMenuId(null); // Close menu after selecting
                        }}
                      >
                        {/* <Eye className="h-4" /> */}
                        <img src={eyeicon} alt="" className="h-4 " />
                        View Content
                      </button>

                    </motion.div>
                  )}
                </div>

                <span
                  className="overflow-hidden"
                  style={{ maxWidth: "200px" }} // Adjust the width as needed
                >
                  <p
                    className="text-lg text-gray-600 truncate"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {file.folder_name}
                  </p>
                </span>

                <span className="">
                  <p className=" text-[1rem] text-gray-600  ">
                    {file.date_of_upload &&
                      !isNaN(new Date(file.date_of_upload))
                      ? new Date(file.date_of_upload).toLocaleString("en-US", {
                        weekday: "short",

                        year: "numeric",

                        month: "short",

                        day: "numeric",

                        hour: "numeric",

                        minute: "numeric",

                        // second: 'numeric',

                        hour12: true, // for 24-hour format
                      })
                      : "Invalid Date"}
                  </p>
                </span>

                <span className="flex items-center gap-1">
                  Contact:
                  <p className="text-xs text-gray-600">{file.folder_contact}</p>
                </span>

                <div className="mt-2 flex gap-2"></div>
              </div>
            ))}
        </div>
      )}

      {isUploading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50  pb-4">
          <div className="bg-white p-6 mx-2 rounded shadow-lg  max-w-lg w-full">
          {(!folderId === 0 || !folderId === "0") && (
            <div className="flex justify-end items-center mb-4">
              {/* <h2 className="text-lg font-semibold">Upload File</h2> */}
           
              <button onClick={() => {
                setIsUploading(false);
                clear();
                setCreateFolderPopuup(null);
              }
              }>
                <X className="w-5 h-5 text-gray-700 hover:text-red-500" />
              </button>
            
            </div>
              )}
            {(folderId === 0 || folderId === "0") && (
        <div className="mt-4 p-4 bg-white rounded-lg ">
        {loading ? (
          <p className="text-gray-500 text-center font-medium">Loading folders...</p>
        ) : error ? (
          <p className="text-red-500 text-center font-semibold">{error}</p>
        ) : (
          <div>
            {selectedFolderId && folderLocked ? (
              <div className="flex flex-col">
                <label className="block text-gray-700 font-medium mb-1">Selected Folder</label>
                <div className="flex justify-between items-center border border-gray-300 rounded-lg p-3 bg-gray-100">
                  <span className="text-gray-800 font-medium">
                    {folders.find((f) => f.id === selectedFolderId)?.name || "Unknown Folder"}
                  </span>
                  <button
                    onClick={() => {setFolderLocked(false)
                      setCreateFolderPopuup(true)
                    }}
                    className="text-blue-600 font-semibold hover:underline transition"
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <button
                  onClick={() => setCreateFolderPopuup(!createFolderPopuup)}
                  className="flex justify-between items-center cursor-pointer p-2 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                >
                  <span className="text-gray-700 font-medium">Select a Folder:</span>
                  <ChevronDown className="text-gray-600" />
                </button>
      
                {createFolderPopuup && (
                  <div className="border p-3 rounded-lg w-full max-h-40 overflow-y-auto bg-white shadow-lg mt-2">
                    <button
                      onClick={() => addFolder()}
                      className="w-full text-left p-2 text-md text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition"
                    >
                      + Create New Folder
                    </button>
                    {folders.map((folder) => (
                      <p
                        key={folder.id}
                        className="p-2 text-md text-gray-700 cursor-pointer font-semibold hover:bg-gray-200 rounded-lg transition"
                        onClick={() => {
                          handleFolderSelect(folder.id);
                          setFolderLocked(true);
                          setCreateFolderPopuup(false);
                        }}
                      >
                        {folder.name}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
          
            )}
            <div className={`items-center mb-4 text-center ${folderId === 0 || folderId === "0" ? "mt-4" : "" }`} >
              <h2 className="text-lg font-semibold">Upload File</h2>
           
            </div>
            <div
              onDragEnter={handleDragEnter}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-dashed border-2 p-4 text-center ${isDragOver ? "border-blue-700 bg-blue-50" : "border-blue-500"
                }`}
            >
              <div className="flex justify-center">
                <img src={upload} alt="" className="h-10 w-10" />
              </div>

              <label className="block text-gray-600 mb-1">
                Drag your files to start uploading
              </label>

              <div className="relative flex items-center my-2">
                <hr className="flex-grow border-gray-300" />
                <p className="px-2 text-gray-500 text-lg">or</p>
                <hr className="flex-grow border-gray-300" />
              </div>

              <input
                type="file"
                multiple
                accept=".pdf, .docx, .jpg, .jpeg, .png, .gif, .bmp, .svg, .webp"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload"
              />

              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Browse Files
              </label>
            </div>
            {dragError && (
              <p className="text-red-500 text-sm mt-2">{dragError}</p>
            )}
            <div className="text-gray-400 text-sm">
              {/* <p>Only support .jpg, .png, .svg and zip files</p> */}
            </div>

            {/* Show Progress Bar for Files Being Uploaded */}

            <div className=" space-y-2 max-h-36 bg-white mt-2 overflow-y-scroll">
              {uploadQueue.map((file) => {
                return (
                  <div key={file.id} className="flex justify-between items-center">
                    <div className="w-3/4 ">
                      <p className="font-medium">
                        {editing
                          ? (inputFileName
                            ? (inputFileName.length > 30 ? inputFileName.substring(0, 30) + '...' : inputFileName)
                            : (file.name.length > 30 ? file.name.substring(0, 30) + '...' : file.name))
                          : (file.name.length > 30 ? file.name.substring(0, 30) + '...' : file.name)}
                      </p>

                      {file.isUploading && (
                        <div className="bg-gray-200 w-full h-2 rounded overflow-hidden">
                          <div
                            className="bg-blue-500 h-2"
                            style={{ width: `${file.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {!file.isUploading && (
                        <>
                          <button
                            className="text-blue-500 border-2 border-blue-500 p-0.5 px-2 rounded-md hover:text-blue-700"
                            onClick={() => handleEditFile(file)}
                          >
                            Edit
                          </button>

                          <button
                            className="text-red-500 hover:underline"
                            onClick={() => handleDeleteFile(file.name)}
                          >
                            <img src={trashicon} alt="" className="h-6" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

            </div>
            <div className="flex justify-between gap-2 my-2">

              <div className="flex gap-x-2 md:gap-x-6" onClick={() => {
                setSelectedFile(null);
                setSelectedFolderId("");
                setShowLoadingIndicator(true);
                setCustomFileName("");
                setUploadQueue([]);
                setIsUploading(false)
              }}>
                <div
                >
                  <GoogleDrivePicker folderId={folderId} fetchFiles={fetchFiles} setShowLoadingIndicator={setShowLoadingIndicator} setGoogleDrive={setGoogleDrive} />
                </div>
              </div>
              <div
                className="flex md:gap-x-6"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click event from bubbling up
                  const accessToken = localStorage.getItem("dropboxToken");
                  console.log("accessss tokkeeenn", accessToken);
                  if (!accessToken) {
                    // setShowLoadingIndicator(true);
                    setIsUploading(false);
                    setDropBox(true);
                    console.log("1", accessToken);
                    return; // Stop execution if dropboxAccessToken is not present
                  }
                  console.log("2");
                  // This part will only run if accessToken is present
                  setSelectedFile(null);
                  setSelectedFolderId("");
                  setShowLoadingIndicator(true);
                  setCustomFileName("");
                  setUploadQueue([]);
                  setIsUploading(false);
                }}
              >
                <div className="flex md:gap-x-6">
                  <DropboxPicker
                    folderId={folderId}
                    fetchFiles={fetchFiles}
                    setShowLoadingIndicator={setShowLoadingIndicator}
                    setDropBox={setDropBox}
                  />
                </div>
              </div>


              <button
                onClick={() => clear()}
                className=" border-dashed border-2 border-blue-500 text-blue-700 px-4 py-2 rounded hover:bg-blue-500 hover:text-white"
              >
                Cancel
              </button>

              {isLoading ? (
                <button
                  type="submit"
                  className="cursor-not-allowed flex justify-center  bg-blue-400  px-7 py-2 rounded-md text-white"
                >
                  <Loader2 className="animate-spin h-4 w-6 font-bold" />
                </button>
              ) : (
                <button
                  type="submit"
                  className=" bg-blue-500 text-white  px-5 py-2 rounded-md hover:bg-blue-600 transition "
                  onClick={uploadFileToServer}
                >
                  Done
                </button>

              )}
            </div>
            
          </div>
        </div>
      )}

      {/* Edit File Modal */}

      {editFile && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full m-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Edit File</h2>

              <button onClick={() => {
                setEditFile(false);
                setIsUploading(true);
              }
              }>
                <X className="w-5 h-5 text-gray-700 hover:text-red-500" />
              </button>
            </div>

            {/* Title Field (instead of File Name) */}

            {/* File Name Input */}

            <input
              type="text"
              value={inputFileName ?? editFile?.name} // ✅ Agar input empty ho toh current file name show karega
              onChange={(e) => {
                setInputFileName(e.target.value);
                console.log("🟡 Input Box Value:", e.target.value); // 🔍 Debug input value
              }}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />


            {/* Description Field */}

            <div className="mt-2">
              <label className="block text-gray-600 mb-1">Description</label>

              <textarea
                value={editFile.description || ""} // Add description if it exists
                onChange={(e) =>
                  setEditFile({ ...editFile, description: e.target.value })
                }
                className="w-full border p-2 rounded"
                rows="1"
              ></textarea>
            </div>

            {/* Folder Dropdown */}
            {/* {folderId !== 0 || folderId !== "0" && ( */}
            <div className="mt-2">
              <label className="block text-gray-600 mb-1">Folder</label>

              {loading ? (
                <p>Loading folders...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div>
                  {/* If folder is selected, show dropdown to allow folder change */}

                  {selectedFolderId ? (
                    <div className="flex flex-col">
                      <label className="block mb-2">Selected Folder</label>

                      <select
                        value={selectedFolderId}
                        onChange={(e) => setSelectedFolderId(e.target.value)}
                        className="w-full border p-2 rounded"
                      >
                        {folders.map((folder) => (
                          <option key={folder.id} value={folder.id}>
                            {folder.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    // If no folder is selected, display buttons for folder selection

                    <div className="flex flex-col">
                      <label className="block mb-2">Select a Folder to Upload File:</label>

                      <select
                        className="border p-2 rounded w-full"
                        onChange={(e) => handleFolderSelect(e.target.value)}
                      >
                        <option value="" disabled selected>
                          Select a folder
                        </option>
                        {folders.map((folder) => (
                          <option key={folder.id} value={folder.id}>
                            {folder.name}
                          </option>
                        ))}
                      </select>
                    </div>


                  )}
                </div>
              )}
            </div>
            {/* )} */}

            <div className="flex justify-end gap-2 my-2">
              <button
                onClick={
                  () => clear2() // setSelectedFolderId('');
                }
                className="border-2 border-blue-500 text-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setEditing(true);
                  console.log("🟢 Before Save: Current File Name:", editFile?.name);
                  console.log("🟢 Before Save: Input File Name:", inputFileName);
                  const updatedFile = { ...editFile, name: inputFileName };
                  handleSaveEdit(updatedFile);
                  setIsUploading(true);
                }}
                className="bg-blue-500 text-white px-6 py-2 rounded flex items-center gap-2"
              >
                Save
              </button>



            </div>
          </div>
        </div>
      )}

      {share && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="mt-4 bg-white p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                Share <span className="text-blue-600">File</span>
              </h2>

              <button onClick={() => setShare(null)}>
                <X className="w-5 h-5 text-gray-700 hover:text-red-500" />
              </button>

              {/* <i

                                      className="fas fa-times cursor-pointer bg-black"

                                      onClick={() => setShareFileVisible(null)} // Close form

                                  ></i> */}
            </div>

            <div className="mb-4">
              <AsyncSearchBar setCollabs={setCollabs} />
              {/* <input

              type="text"

              placeholder="Add designee, members"

              className="w-full border border-blue-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

              value={designee}

              onChange={handleDesigneeChange}

            /> */}
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold">People with access</h3>

              {people.map((person, index) => (
                <div className="flex items-center mt-2" key={index}>
                  <img
                    src="https://placehold.co/40x40"
                    alt={`Profile picture of ${person.name}`}
                    className="w-10 h-10 rounded-full mr-3"
                  />

                  <div>
                    <p className="font-semibold">
                      {person.name} ({person.role && person.role})
                    </p>

                    <p className="text-sm text-gray-500">{person.email}</p>
                  </div>

                  {person.role === "Owner" ? (
                    <p className="text-gray-500 text-sm">{person.permission}</p>
                  ) : (
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowDropdown(showDropdown === index ? null : index)
                        }
                        className="text-blue-500 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      >
                        {permission[index]}
                      </button>

                      {showDropdown === index && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-70">
                          <p
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() =>
                              setPermission1(index, "view", person.user_id)
                            }
                          >
                            Only View
                          </p>

                          <p
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() =>
                              setPermission1(index, "edit", person.user_id)
                            }
                          >
                            Edit Access
                          </p>

                          <p
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() =>
                              setPermission1(index, "delete", person.user_id)
                            }
                          >
                            Remove Access
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* {person.role && (

                  <span className="ml-auto text-gray-500">{person.role}</span>

                )} */}
                </div>
              ))}
            </div>

            <div className="mb-4">
              <textarea
                placeholder="Message"
                className="w-full border border-blue-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={message}
                onChange={handleMessageChange}
              ></textarea>
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="notify"
                checked={notify}
                onChange={handleNotifyChange}
                className="mr-2"
              />

              <label htmlFor="notify" className="text-sm">
                Notify people
              </label>
            </div>

            {/* <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Send
              </button>
            </div> */}

            {isLoading ? (
              <button
                className="bg-blue-500 flex justify-center items-center cursor-not-allowed text-white font-semibold text-sm px-2 py-2 rounded-lg w-20"
                disabled
              >
                <Loader2 className="animate-spin h-4 w-4" />
              </button>
            ) : isSubmitted ? (
              <button className="bg-green-500 text-center text-white font-semibold text-sm px-2 py-2 rounded-lg w-20">
                Sent
              </button>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-center text-white font-semibold text-sm px-2 py-2 rounded-lg w-20"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                Send
              </button>
            )}


          </div>
        </div>
      )}

      {shareFolderModal && (
        <div className="fixed  inset-0 bg-gray-800 bg-opacity-50 overflow-auto flex items-center justify-center z-50">
          <div className="m bg-white p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-300">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                Share <span className="text-blue-600">Folder</span>
              </h2>
              <button onClick={() => { setFile(""); setShareFolderModal(false); }}>
                <X className="w-5 h-5 text-gray-700 hover:text-red-500" />
              </button>
            </div>

            {/* Designees Search */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Select Designees</h3>

              {/* Search Input */}
              <input
                type="text"
                placeholder="Search designees..."
                className="w-full p-2 border border-gray-300 rounded-md bg-transparent outline-none text-black"
                onChange={(e) => MobilesetsearchQuery(e.target.value)}
              />

              {/* Dropdown List (Only appears when searching) */}
              {filteredDesignees.length > 0 && (
                <div className="relative mt-2 border border-gray-300 rounded-md bg-white p-2">
                  <div className="max-h-28 bg-white mt-2 overflow-y-auto">
                    {filteredDesignees.map((designee) => (
                      <div
                        key={designee.email}
                        className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedEmails.includes(designee.email) ? "text-blue-500 font-semibold" : ""
                          }`}
                        onClick={() => handleCheckboxChange(designee.email)}
                      >
                        {designee.name} ({designee.email})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Selected Designees (Only show if user selects someone) */}
            {selectedEmails.length > 0 && (
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2">Selected Designees</h4>
                <div className="border border-gray-300 rounded-md p-3 max-h-40 bg-white mt-2 overflow-y-auto">
                  {selectedEmails.map((email, index) => (
                    <div key={index} className="flex justify-between items-center bg-blue-100 text-blue-700 px-3 py-2 rounded-md mb-2">
                      <span>{email}</span>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleCheckboxChange(email)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="mb-4">
              <textarea
                placeholder="Message"
                className="w-full border border-blue-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={message}
                onChange={handleMessageChange}
              />
            </div>

            {/* Notify Checkbox */}
            <div className="flex items-center mb-4">
              <input type="checkbox" id="notify" checked={notify} onChange={handleNotifyChange} className="mr-2" />
              <label htmlFor="notify" className="text-sm">Notify people</label>
            </div>

            {/* Send Button */}
            <div className="flex justify-end">
              {isLoading ? (
                <button className="bg-blue-500 flex justify-center items-center cursor-not-allowed text-white font-semibold text-sm px-4 py-2 rounded-lg w-24" disabled>
                  <Loader2 className="animate-spin h-4 w-4" />
                </button>
              ) : isSubmitted ? (
                <button className="bg-green-500 text-center text-white font-semibold text-sm px-4 py-2 rounded-lg w-24">
                  Sent
                </button>
              ) : (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-center text-white font-semibold text-sm px-4 py-2 rounded-lg w-24"
                  onClick={handleClick}
                  disabled={isLoading}
                >
                  Send
                </button>
              )}
            </div>
          </div>
        </div>
      )}






      {deletebutton1 && (
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
                onClick={() => setDeletebutton1(false)}
                className="border-2 border-blue-500 text-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <NavLink to="/Subscription">
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => setDeletebutton1(false)}
                >
                  Take Membership
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      )}

      {deletebutton && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="deleteModalLabel"
          aria-describedby="deleteModalDescription"
        >
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full m-2">
            <div className="flex justify-between items-center mb-4">
              <h2 id="deleteModalLabel" className="text-lg font-semibold">
                Are you sure to delete this folder?
              </h2>
            </div>
            <div
              id="deleteModalDescription"
              className="text-sm text-gray-600 mb-4"
            >
              This action cannot be undone. Please confirm if you'd like to
              proceed.
            </div>
            <div className="flex justify-end gap-2 my-2">
              <button
                onClick={() => setDeletebutton(false)}
                className="border-2 border-blue-500 text-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteFile(selectedFileId); // Pass Selected Folder ID
                  setDeletebutton(false);
                }}
                className="bg-blue-500 text-white px-6 py-2 rounded flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Yes
              </button>
            </div>
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
      {showLoadingIndicator && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
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

      {googleDrive && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="deleteModalLabel"
          aria-describedby="deleteModalDescription"
        >
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full m-2">
            <div className="flex justify-between items-center mb-4">
              <h2 id="deleteModalLabel" className="text-lg font-semibold">
                To access this feature
              </h2>
            </div>
            <div
              id="deleteModalDescription"
              className="text-sm text-gray-600 mb-4"
            >
              Connect your account to Google Drive first.
            </div>
            <div className="flex justify-between gap-2 my-2">
              <button
                onClick={() => {

                  setShowLoadingIndicator(false);
                  setGoogleDrive(false);
                  setIsUploading(true);
                }}
                className="border-2 border-blue-500 text-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // deleteFile(selectedFolder); // Pass Selected Folder ID
                  navigate("/my-profile");
                }}
                className="bg-blue-500 text-white px-6 py-2 rounded flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}
      {dropBox && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="deleteModalLabel"
          aria-describedby="deleteModalDescription"
        >
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full m-2">
            <div className="flex justify-between items-center mb-4">
              <h2 id="deleteModalLabel" className="text-lg font-semibold">
                To access this feature
              </h2>
            </div>
            <div
              id="deleteModalDescription"
              className="text-sm text-gray-600 mb-4"
            >
              Connect your account to Drop Box first.
            </div>
            <div className="flex justify-between gap-2 my-2">
              <button
                onClick={() => {
                  setIsUploading(true);
                  setShowLoadingIndicator(false);
                  setDropBox(false);

                }}
                className="border-2 border-blue-500 text-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // deleteFile(selectedFolder); // Pass Selected Folder ID
                  navigate("/my-profile");
                }}
                className="bg-blue-500 text-white px-6 py-2 rounded flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}

      {access && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="mt-4 bg-white p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">
                Share <span className="text-blue-500">File</span>
              </h2>

              <button
                onClick={() => setAccess(false)}
                className="p-2 rounded-full"
              >
                <X className="w-6 h-4 text-gray-700 hover:text-red-500" />
              </button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div>
              <h3 className="text-xl font-semibold mb-4">People with access</h3>

              {users.length > 0 ? (
                users.map((user, index) => (
                  <div key={index} className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <img
                        src={user.avatar}
                        alt="User avatar"
                        className="w-12 h-12 rounded-full mr-4"
                      />

                      <div>
                        <p className="font-semibold text-lg">{user.name}</p>
                        <p className="text-gray-600 text-sm">{user.email}</p>
                      </div>
                    </div>

                    {user.role === "Owner" ? (
                      <p className="text-gray-500 text-sm">{user.permission}</p>
                    ) : (
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowDropdown(showDropdown === index ? null : index)
                          }
                          className="text-blue-500 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        >
                          {user.permission}
                        </button>

                        {showDropdown === index && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                            <p
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                              onClick={() => updatePermission(editFileId2, user.email, "View", index)}
                            >
                              Only View
                            </p>

                            <p
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                // console.log("File editFileId: ", editFileId2);
                                updatePermission(editFileId2, user.email, "Edit", index);
                              }}
                            >
                              Edit Access
                            </p>

                            <p
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                              onClick={() => removeUser(editFileId2, index)}
                            >
                              Remove Access
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      alt="User avatar"
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-semibold text-lg">{username}</p>
                      <p className="text-gray-600 text-sm">{emailfunc}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      className="text-blue-500 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                      owner
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
      {
        createFolder && (
          <>
            <div
              ref={(el) => (dropdownRef.current[0] = el)}
              className="fixed inset-0 z-50 flex justify-center items-center bg-gray-800 bg-opacity-50">
              <div className="h-auto w-96 bg-white rounded-lg shadow-xl p-6">
                <div className='flex justify-between'>
                  <p></p>
                  <p ><X
                    onClick={() => {
                      setIsUploading(true);
                      setNewFolder("");
                      setCreateFolder(false)
                    }}
                    className='text-red-500 cursor-pointer' /></p>
                </div>
                <p className="text-center text-blue-600 font-semibold text-xl mb-6">Create New Folder</p>

                <label className="block text-gray-700 mb-2 text-sm">Enter folder name</label>

                <input
                  type="text"
                  value={newFolder}
                  onChange={(e) => setNewFolder(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ease-in-out duration-300 mb-4"
                />

                <button
                  onClick={handleAddFolder}
                  className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-300">
                  Create Folder
                </button>
              </div>
            </div>

          </>
        )
      }
      {loading && <p>Loading...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {showOverlay && renderOverlay()}

      <div>
        {/* Dashboard content */}
        <DesignerPopup
          isVisible={showDesignerPopup}
          onClose={closePopup}
          designeeName={designeeName}
          setDesigneeName={setDesigneeName}
          designeePhone={designeePhone}
          setDesigneePhone={setDesigneePhone}
          designeeEmail={designeeEmail}
          setDesigneeEmail={setDesigneeEmail}
          handleAddDesignee={handleAddDesignee}
        />
      </div>
    </div>
  );
};

export default Dashboard;

const AsyncSearchBar = ({ setCollabs }) => {
  //set default query terms
  const [query, setQuery] = useState("");

  // fetch filteres search results for dropdown
  const loadOptions = async () => {
    return new Promise((resolve, reject) => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      axios
        .get(`${API_URL}/api/auth/get-all-users?q=${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          // console.log(response.data.user);
          // Map the API response to the format expected by AsyncSelect
          const formattedOptions = response.data.user
            .map((data) => {
              if (data._id == storedUser) {
                // Skip 'admin' users
                return null;
              }
              return {
                label: data.username,
                value: data._id,
              };
            })
            .filter((item) => item !== null); // Remove any null values

          resolve(formattedOptions); // Resolve the promise with formatted data
        })
        .catch((error) => {
          reject(error); // Handle errors if necessary
        });
    });
  };

  return (
    <>
      <AsyncSelect
        cacheOptions
        isMulti
        getOptionLabel={(e) => e.label}
        getOptionValue={(e) => e.value}
        loadOptions={loadOptions}
        onInputChange={(value) => setQuery(value)}
        onChange={(value) => setCollabs(value)}
      />
    </>
  );
};