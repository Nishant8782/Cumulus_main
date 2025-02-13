import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, Grid, List, Loader2 } from "lucide-react";
import {
  ArrowRight,
  Menu,
  LayoutGrid,
  X,
  Users,
  Camera,
  Edit,
  Eye,
  Trash2,
  EllipsisVertical,
  Download,
  Search,
  ChevronRight,
  FilePenLine,
  FolderOpen,
  CircleHelp,
} from "lucide-react";
import axios from "axios";
import play from "../../assets/Play.png";
import { useLocation } from "react-router-dom";
import { API_URL } from "../utils/Apiconfig";
import ShareIcon from "../../assets/ShareIcon.png";
import editicon from "../../assets/editicon.png";
import arrowdown from "../../assets/arrowdown.png";
import WhiteFolderNotch from "../../assets/WhiteFolderNotch.png";
import FileText from "../../assets/FileText.png";
import foldericon from "../../assets/foldericon.png";
import hariom from "../../assets/hariom.png";
import useLoadingStore from "../../store/UseLoadingStore";
import files_icon from "../../assets/files-icon.png";
import voice_icon from "../../assets/voice.png";
import usePopupStore from "../../store/DesigneeStore";
import DesignerPopup from "./Designeepopup";
import useFolderDeleteStore from "../../store/FolderDeleteStore";
const Afterlifeaccess = ({ searchQuery = "" }) => {
  const [folders, setFolders] = useState([]);
  const { isLoading, showLoading, hideLoading } = useLoadingStore();
  const [isGridView, setIsGridView] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [queryParams, setQueryParams] = useState({ email: "", otp: "" });
  const [expandedItemId, setExpandedItemId] = useState(null);
  const location = useLocation();
  const [fileData, setFileData] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isMembershipActive, setIsMembershipActive] = useState(false);
  const [showafterlifePopup, setAfterlifePopup] = useState(false); // Toggles the popup visibility
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [userFoldersAndFiles, setUserFoldersAndFiles] = useState({});
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [MobilesearchQuery, MobilesetsearchQuery] = useState("");
  const [editAccess, setEditAccess] = useState("");
  const [preview, setPreview] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // const [selectedFiles, setSelectedFiles] = useState(() =>
  //   Object.keys(userFoldersAndFiles).reduce((acc, category) => {
  //     acc[category] = [];
  //     return acc;
  //   }, {})
  // );
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileShares, setFileShares] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [designees, setDesignees] = useState([]);
  const [selectedDesignee, setSelectedDesignee] = useState("");
  const [selectionData, setSelectionData] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState({});
  const [selectedVoiceFolders, setSelectedVoiceFolders] = useState({});
  const [selectedVoiceMemos, setSelectedVoiceMemos] = useState({});
  const [addedVoiceMemos, setAddedVoiceMemos] = useState([]);
  const [voiceMemos, setVoiceMemos] = useState({});
  const [expandedRows, setExpandedRows] = useState({});
  const [addedFiles, setAddedFiles] = useState([]);
  const [selectedDesigneeEmails, setSelectedDesigneeEmails] = useState([]);
  const [openDropdown, setOpenDropdown] = useState({});
  const [popupIndex, setPopupIndex] = useState(null);
  const [dropdownItem, setDropdownItem] = useState(null);
  const isToggling = useRef(false);
  const dropdownRef = useRef([]);
  const [file, setFile] = useState(null);
  const [innerPopupIndex, setInnerPopupIndex] = useState(null);

  const {
    deletebuttonfolder,
    setDeletebuttonfolder,
    setSelectedFolder,
    selectedFolder,
    deleteFolder,
    openMenufolderId,
    setOpenMenufodlerId,
  } = useFolderDeleteStore();

  useEffect(() => {
    const initialFiles = {};
    const initialFolders = {};

    // Initialize files and folders to false (unselected)
    Object.keys(userFoldersAndFiles).forEach((category) => {
      userFoldersAndFiles[category].forEach((file) => {
        initialFiles[file.file_id] = false;
      });
      initialFolders[category] = false;
    });

    setSelectedFiles(initialFiles);
    setSelectedFolders(initialFolders);
  }, [userFoldersAndFiles]);

  const handleSelectAllToggle = () => {
    const newSelectAllState = !selectAllChecked;

    // Prepare updated files and folders
    const updatedFiles = {};
    const updatedFolders = {};

    // Apply the new state across all files and folders
    Object.keys(userFoldersAndFiles).forEach((category) => {
      userFoldersAndFiles[category].forEach((file) => {
        // Disable selection for already added files
        if (
          !addedFiles.some((addedFile) => addedFile.file_id === file.file_id)
        ) {
          updatedFiles[file.file_id] = newSelectAllState;
        } else {
          updatedFiles[file.file_id] = false; // Keep it unchecked for already added files
        }
      });

      updatedFolders[category] = userFoldersAndFiles[category].some(
        (file) =>
          !addedFiles.some((addedFile) => addedFile.file_id === file.file_id)
      )
        ? newSelectAllState
        : false;
    });

    // Update state
    setSelectAllChecked(newSelectAllState);
    setSelectedFiles(updatedFiles);
    setSelectedFolders(updatedFolders);
  };

  const toggleFolderSelection = (category) => {
    const isFolderSelected = userFoldersAndFiles[category].every(
      (file) => selectedFiles[file.file_id]
    );

    const updatedFiles = { ...selectedFiles };

    userFoldersAndFiles[category].forEach((file) => {
      if (isFolderSelected) {
        updatedFiles[file.file_id] = false; // Unselect all files in the folder
      } else {
        updatedFiles[file.file_id] = true; // Select all files in the folder
      }
    });

    setSelectedFiles(updatedFiles);
    setSelectedFolders((prevFolders) => ({
      ...prevFolders,
      [category]: !isFolderSelected, // Toggle folder's selection state
    }));
  };

  useEffect(() => {
    // Check if selectedFiles or selectedFolders are already initialized
    if (
      Object.keys(selectedFiles).length === 0 &&
      Object.keys(selectedFolders).length === 0
    ) {
      const initialFiles = {};
      const initialFolders = {};

      // Initialize files and folders based on userFoldersAndFiles
      Object.keys(userFoldersAndFiles).forEach((category) => {
        userFoldersAndFiles[category].forEach((file) => {
          initialFiles[file.file_id] = false; // Set all files as unselected initially
        });
        initialFolders[category] = false; // Set all folders as unselected initially
      });

      setSelectedFiles(initialFiles);
      setSelectedFolders(initialFolders);
    }
  }, [userFoldersAndFiles]); // Dependencies remain the same

  // const toggleFolderSelection = (category) => {
  //   // Check if it's voice memos or a regular folder
  //   const isVoiceMemoCategory = category === "voiceMemos";

  //   if (isVoiceMemoCategory) {
  //     // If it's the voice memo folder, toggle all voice memos
  //     const areAllVoiceMemosSelected = voiceMemos.every((memo) => selectedVoiceMemos[memo.id]);
  //     const updatedVoiceMemos = {};

  //     // Toggle selection for all voice memos
  //     voiceMemos.forEach((memo) => {
  //       updatedVoiceMemos[memo.id] = !areAllVoiceMemosSelected;
  //     });

  //     // Update the state for voice memos and their folder
  //     setSelectedVoiceMemos(updatedVoiceMemos);
  //     setSelectedVoiceFolders((prevFolders) => ({
  //       ...prevFolders,
  //       voiceMemos: !areAllVoiceMemosSelected, // Toggle the voice memo folder state
  //     }));
  //   } else {
  //     // For regular folders, toggle files
  //     const isFolderSelected = userFoldersAndFiles[category]?.every(
  //       (file) => selectedFiles[file.file_id]
  //     );

  //     const updatedFiles = { ...selectedFiles };

  //     // Toggle selection for all files in the folder
  //     userFoldersAndFiles[category]?.forEach((file) => {
  //       updatedFiles[file.file_id] = !isFolderSelected; // Toggle file selection
  //     });

  //     setSelectedFiles(updatedFiles);

  //     // Update folder selection state
  //     setSelectedFolders((prevFolders) => ({
  //       ...prevFolders,
  //       [category]: !isFolderSelected, // Toggle folder selection
  //     }));
  //   }
  // };

  // const toggleFile = (fileId) => {
  //   setSelectedFiles((prevState) => ({
  //     ...prevState,
  //     [fileId]: !prevState[fileId],
  //   }));
  // };

  // const toggleVoiceMemo = (memoId) => {
  //   setSelectedVoiceMemos((prevState) => ({
  //     ...prevState,
  //     [memoId]: !prevState[memoId],
  //   }));
  //

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
        `${API_URL}/api/after-life/delete-voice-file-data`,
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
        alert("Access removed successfully!");
        fetchDesignees();
        fetchSharedFiles();
        // Optionally update the UI here (e.g., removing the file or voice from the list)
      } else {
        alert(data.message || "Failed to remove access");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while removing access");
    }
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

  const handleAddDesignee = async () => {
    showLoading();
    const token = localStorage.getItem("token");
  
    if (!designeeName || !designeePhone || !designeeEmail) {
      alert("Please fill in all fields.");
      hideLoading();
      return;
    }
  
    const formData = new FormData();
    if (file) {
      formData.append("profilePicture", file);
    }
    formData.append("designeeName", designeeName);
    formData.append("designeePhone", designeePhone);
    formData.append("designeeEmail", designeeEmail);
    formData.append("sendEmailFlag", "false");
  
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
  
      if (response.status === 200) {
        alert(response.data.message);
        closePopup();
        setIsOpen(false);
      } else {
        alert("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("Error adding designee:", error);
  
      if (error.response) {
        if (error.response.status === 409) {
          alert("Designee already exists, please check.");
        } else {
          alert("Error: " + (error.response.data?.message || "An unexpected error occurred."));
        }
      } else {
        alert("Network error. Please check your connection.");
      }
    } finally {
      hideLoading();
    }
  };
  

  let {
    showDesignerPopup,
    openPopup,
    closePopup,
    designeeName,
    setDesigneeName,
    designeePhone,
    setDesigneePhone,
    designeeEmail,
    setDesigneeEmail,
  } = usePopupStore();

  const togglePopup = (index) => {
    // If the popup is already open for this file, close it (set popupIndex to null)
    if (popupIndex === index) {
      setPopupIndex(null);
      setOpenDropdownIndex(null);
    } else {
      setPopupIndex(index); // Open the popup for the clicked file
      setOpenDropdownIndex(null);
    }
  };
  const toggleInnerPopup = (fileIndex) => {
    if (innerPopupIndex === fileIndex) {
      setInnerPopupIndex(null); // Close popup
    } else {
      setInnerPopupIndex(fileIndex); // Open popup
      // setOuterPopupIndex(null);
    }
  };

  useEffect(() => {
    if (dropdownVisible) {
      setSelectedFiles({});
    }
  }, [dropdownVisible]);
  const [designers, setDesigners] = useState([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentSelection, setCurrentSelection] = useState("Only View");

  const dropdownChoices = ["Only View", "Edit Access", "Remove Access"];

  const handleSelection = (choice) => {
    setCurrentSelection(choice);
    setDropdownOpen(false);
  };

  const handlesharedaccessOption = async (
    accessLevel,
    toEmailId,
    fileId = null
  ) => {
    setLoading(true); // Set loading to true before making the request
    try {
      // Validate that to_email_id is provided
      if (!toEmailId) {
        throw new Error("to_email_id is required to update access.");
      }

      // Prepare the request body
      const requestBody = {
        to_email_id: toEmailId,
        edit_access: accessLevel,
      };

    
      if (fileId) {
        requestBody.file_id = fileId;
      }

      // Make API request to update access
      const response = await fetch(`${API_URL}/api/after-life/update-access`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is in localStorage
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      setLoading(false); // Set loading to false once the request is done

      if (response.ok) {
        // Success: Access updated successfully
        console.log("Access updated successfully:", data.message);
        setPopupIndex(null); // Close the popup after a successful update
      } else {
        // Error: Display the error message
        throw new Error(data.message || "Failed to update access");
      }
    } catch (error) {
      setLoading(false); // Stop loading
      setError(error.message || "An error occurred while updating access");
      console.error("Error updating access:", error);
    }
  };

  // Function to fetch designees from the backend
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
      setDesigners(response.data.designees); // Assuming response contains designees
    } catch (error) {
      console.error("Error fetching designees:", error);
    }
  };
  useEffect(() => {
    fetchDesignees();
  }, []);

  const fetchSharedFiles = async () => {
    try {
      // Add your token to the request headers (if using JWT authentication)
      const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
      const response = await fetch(
        `${API_URL}/api/after-life/getting-all-shared-files`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Add token in Authorization header
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch shared files");
      }

      const data = await response.json();
      setFileShares(data); // Updated state variable
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  console.log("files to sahre ", fileShares);

  useEffect(() => {
    fetchSharedFiles();
  }, []);

  const removeAccess = async (to_email_id) => {
    try {
      const response = await fetch(
        `${API_URL}/api/after-life/delete-shared-data`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store the token in localStorage
          },
          body: JSON.stringify({
            to_email_id,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Shared data deleted successfully.");
        fetchSharedFiles();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting shared data:", error);
      alert("Failed to delete shared data.");
    }
  };

  console.log("files to shared............................. ", fileShares);
  const toggleshared = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const handlesharedoption = (option) => {
    setSelectedOption(option);
    setIsPopupOpen(false);
    // setPopupIndex(null);
  };
  const handlesharedOption = (option) => {
    console.log(option); // Handle the selected option
    setPopupIndex(null); // Close the popup after option is selected
  };
  // console.log(designers);

  // Fetch designees on component mount
  useEffect(() => {
    fetchDesignees();
  }, []);

  const togglesharedPopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  // Handle designee selection change
  const handleDesigneeChange = (event) => {
    const selectedEmail = event.target.value;

    // Ensure the selected email is valid and not already added
    if (selectedEmail && !selectedDesigneeEmails.includes(selectedEmail)) {
      setSelectedDesigneeEmails((prev) => [...prev, selectedEmail]);
      console.log("Selected Designees:", [
        ...selectedDesigneeEmails,
        selectedEmail,
      ]); // For debugging
    }

    // Clear the select input field
    event.target.value = "";
  };

  console.log(selectedDesigneeEmails);

  const fetchFoldersAndFiles = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${API_URL}/api/auth/get-user-folders-and-files`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        const { folders, voice_memos } = response.data;

        // Process folders and files
        if (folders) {
          const foldersWithFiles = folders.reduce((acc, folder) => {
            acc[folder.folder_name] = folder.files || []; // Assuming files are part of the response
            return acc;
          }, {});

          setUserFoldersAndFiles(foldersWithFiles); // Setting the folders with files in state

          // Initialize selected files state based on the fetched data
          const initialSelectedFiles = folders.reduce((acc, folder) => {
            acc[folder.folder_name] = []; // Empty initially
            return acc;
          }, {});

          setSelectedFiles(initialSelectedFiles);
        }

        // Process voice memos
        if (voice_memos) {
          const processedVoiceMemos = voice_memos.map((memo) => ({
            id: memo.voice_id,
            name: memo.voice_name,
            link: memo.aws_file_link,
            duration: memo.duration,
            size: memo.file_size,
            uploadedAt: memo.date_of_upload,
          }));

          setVoiceMemos(processedVoiceMemos); // Assuming you have a state for voice memos
        }
      }
    } catch (error) {
      console.error("Error fetching folders, files, and voice memos", error);
    }
  };

  console.log(voiceMemos);

  console.log(userFoldersAndFiles);

  useEffect(() => {
    fetchFoldersAndFiles();
  }, []);

  const GridView = () => {
    setIsGridView(!isGridView);
    setOpenDropdownIndex(null);
    setPopupIndex(null);
  };

  const toggleDropdownVisibility = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleCategoryExpansion = (category) => {
    setExpandedCategories((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  const toggleSharedItem = (index, e) => {
    // Prevent multiple state updates in quick succession
    if (isToggling.current) return;
    e.stopPropagation();

    isToggling.current = true;
    setOpenDropdownIndex((prevIndex) => {
      // Close if the same dropdown is clicked; otherwise, open the clicked one
      const newIndex = prevIndex === index ? null : index;
      setTimeout(() => {
        isToggling.current = false; // Reset toggle flag after debounce
      }, 100); // Adjust debounce timing as needed
      return newIndex;
    });
    setPopupIndex(null);
    setInnerPopupIndex(null);
  };

  const toggleCategorySelection = (category) => {
    setSelectedFiles((prevSelectedFiles) => {
      const categoryFiles = userFoldersAndFiles[category] || [];
      const allFilesSelected =
        categoryFiles.length === (prevSelectedFiles[category] || []).length;

      if (allFilesSelected) {
        // Deselect all files in this category
        const updatedSelectedFiles = { ...prevSelectedFiles };
        delete updatedSelectedFiles[category];
        return updatedSelectedFiles;
      } else {
        // Select all files in this category
        const updatedSelectedFiles = {
          ...prevSelectedFiles,
          [category]: categoryFiles.map((file) => file.id),
        };
        return updatedSelectedFiles;
      }
    });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isOutside = !dropdownRef.current.some((ref) =>
        ref && ref.contains(e.target)
      );
      if (isOutside) {
        setOpenDropdownIndex(null);
        setPopupIndex(null)

      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handlePlay = async (file) => {
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

  const toggleFileSelection = (fileId) => {
    const updatedSelection = { ...selectedFiles };
    updatedSelection[fileId] = !updatedSelection[fileId]; // Toggle the selection of this specific file
    setSelectedFiles(updatedSelection); // Update the selected files state
  };

  const handleSelectAll = () => {
    const newSelectedFiles = Object.keys(userFoldersAndFiles).reduce(
      (acc, category) => {
        acc[category] = userFoldersAndFiles[category].map((file) => file.id);
        return acc;
      },
      {}
    );

    setSelectedFiles(newSelectedFiles);
    setSelectionData(
      Object.keys(userFoldersAndFiles).reduce((acc, category) => {
        return [
          ...acc,
          ...userFoldersAndFiles[category].map((file) => file.id),
        ];
      }, [])
    );
  };

  // Handle Add button click
  const handleAddButton = () => {
    console.log("Selected files to add:", selectionData);
  };

  // const toggleFileSelection = (category, file) => {
  //   setSelectedFiles((previousState) => {
  //     const isFileSelected = previousState[category]?.includes(file.id);

  //     const newSelection = isFileSelected
  //       ? previousState[category].filter((f) => f !== file.id)  // Deselect the file
  //       : [...previousState[category], file.id];  // Select the file

  //     return {
  //       ...previousState,
  //       [category]: newSelection,
  //     };
  //   });
  // };

  // Handle file selection (select or deselect a specific file)

  const selectAllFiles = () => {
    const newSelectedFiles = Object.keys(userFoldersAndFiles).reduce(
      (acc, category) => {
        acc[category] = userFoldersAndFiles[category].map((file) => file.id);
        return acc;
      },
      {}
    );
    setSelectedFiles(newSelectedFiles);
  };

  const deselectAllFiles = () => {
    setSelectedFiles(
      Object.keys(userFoldersAndFiles).reduce((acc, category) => {
        acc[category] = [];
        return acc;
      }, {})
    );
  };

  const fileCategories = {
    "Legal Documents": ["Estate 4.pdf", "Estate 4.pdf", "Estate 4.pdf"],
    Insurance: [],
    "Education Documents": [],
    "Property Documents": [],
  };

  // const togglePopup = (e) => {
  //   const rect = e.target.getBoundingClientRect();
  //   setPopupPosition({});
  //   setIsPopupOpen(!isPopupOpen);
  // };

  const handleOption = (option) => {
    console.log(`${option} selected`);
    setIsPopupOpen(false); // Close the popup
  };

  const [isOpen, setIsOpen] = useState(false);

  const togglePopupD = () => {
    setDropdownOpen(false);
    setIsOpen(!isOpen);
    setOpenDropdownIndex(null);
    setPopupIndex(null);
    setDropdownVisible(null);
  };

  const isFileAdded = (fileId) => {
    return addedFiles.some((file) => file.file_id === fileId);
  };

  const sharedAllFiles = async (email) => {
    const token = localStorage.getItem("token");

    try {
      const payload = { to_email_id: email };
      const headers = token
        ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
        : { "Content-Type": "application/json" };

      const response = await axios.post(
        `${API_URL}/api/designee/get-shared-voices-cumulus`,
        payload,
        { headers }
      );

      if (response.data && Array.isArray(response.data.voices)) {
        const filesWithUsers = response.data.voices.map((voice) => {
          const fromUser = voice.from_user;
          const sharedVoices = voice.shared_voices || [];
          return sharedVoices.map((file) => ({
            ...file,
            from_user: fromUser,
            created_at: voice.created_at, // Attach the shared date from the main object
          }));
        });

        const allSharedFiles = filesWithUsers.flat();
        setSharedFiles(allSharedFiles);
      } else {
        setSharedFiles([]);
      }
    } catch (error) {
      console.error("Error fetching shared files:", error.message);
      setSharedFiles([]);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailFromUrl = queryParams.get("email");
    if (emailFromUrl) {
      setQueryParams((prevParams) => ({ ...prevParams, email: emailFromUrl }));
      setEmail(emailFromUrl);
    }
  }, [location]);

  useEffect(() => {
    sharedAllFiles(email);
  }, [email]);

  const togglesharedDropdown = (index) => {
    setOpenDropdown((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // Toggle visibility for the clicked fileShare
    }));
  };
  const toggleDropdown = (username, accessType) => {
    const key = `${username}-${accessType}`;
    setExpandedItemId(expandedItemId === key ? null : key);
  };

  const groupedFiles = sharedFiles.reduce((acc, file) => {
    const username = file?.from_user?.username || "Unknown User";
    const accessType = file.access || "view";

    if (!acc[username]) {
      acc[username] = { username, files: { view: [], Edit: [] } };
    }

    acc[username].files[accessType].push(file);
    return acc;
  }, {});

  // const isCategorySelected = (category) =>
  //   selected[category].length === files[category].length &&
  //   files[category].length > 0;

  const isCategoryFullySelected = (category) => {
    const categoryFiles = userFoldersAndFiles[category] || [];
    const selectedCategoryFiles = selectedFiles[category] || [];
    return categoryFiles.length === selectedCategoryFiles.length;
  };

  const isSelectAllChecked = (category) => {
    const categoryFiles = userFoldersAndFiles[category] || []; // Default to empty array if undefined
    const selectedCategoryFiles = selectedFiles[category] || []; // Default to empty array if undefined

    // If categoryFiles is an empty array, return true (nothing to select).
    return (
      categoryFiles.length > 0 &&
      categoryFiles.length === selectedCategoryFiles.length
    );
  };

  // Log selectedFiles state to check its type
  useEffect(() => {
    console.log("selectedFiles:", selectedFiles);
  }, [selectedFiles]);

  // Toggle folder visibility (expand/collapse)
  const toggleRow = (category) => {
    setExpandedRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [category]: !prevExpandedRows[category],
    }));
  };
  const handleOpenPopup = () => {
    showDesignerPopup();
  };
  const toggleFile = (fileId) => {
    setSelectedFiles((prevSelectedFiles) => {
      const newSelectedFiles = { ...prevSelectedFiles };

      // Toggle the selection of the file
      if (newSelectedFiles[fileId]) {
        delete newSelectedFiles[fileId]; // Deselect the file
      } else {
        newSelectedFiles[fileId] = true; // Select the file
      }

      return newSelectedFiles;
    });
  };
  const closeModal = () => {
    setOpenDropdownIndex(null);
  };

  console.log(designers);

  const handleAdd = () => {
    // For files

    const selectedFilesArray = [];

    setDropdownVisible(false);

    // Loop through selected files and collect the ones that are selected
    Object.keys(selectedFiles).forEach((fileId) => {
      for (const category in userFoldersAndFiles) {
        const file = userFoldersAndFiles[category].find(
          (f) => f.file_id === fileId
        );
        if (file) {
          selectedFilesArray.push({ ...file, type: "file" }); // Mark as file and add to the list
        }
      }
    });

    // Add selected files to addedFiles
    setAddedFiles((prevAddedFiles) => [
      ...prevAddedFiles,
      ...selectedFilesArray,
    ]);

    // For voice memos
    const selectedVoiceMemosArray = [];

    // Loop through selected voice memos and collect the ones that are selected
    Object.keys(selectedVoiceMemos).forEach((voiceId) => {
      const voiceMemo = voiceMemos.find((memo) => memo.id === voiceId);
      if (voiceMemo) {
        selectedVoiceMemosArray.push({ ...voiceMemo, type: "voiceMemo" }); // Add to voice memos array
      }
    });

    // Add selected voice memos to addedVoiceMemos
    setAddedVoiceMemos((prevAddedVoiceMemos) => [
      ...prevAddedVoiceMemos,
      ...selectedVoiceMemosArray,
    ]);
  };

  const handleShareNow = async () => {
    if (!selectedDesigneeEmails.length) {
      console.error("No designees selected.");
      return;
    }

    if (!addedFiles.length && !addedVoiceMemos.length) {
      console.error("No files or voice memos selected to share.");
      return;
    }

    const fileIds = addedFiles.map((file) => file.file_id);
    const voiceIds = addedVoiceMemos.map((memo) => memo.id);

    const payload = {
      to_email_id: selectedDesigneeEmails,
      file_ids: fileIds,
      voice_ids: voiceIds,
      access: "view",
      notify: true,
    };

    try {
      showLoading();
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/after-life/share-items`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Response from API:", response.data);
      console.log("Items shared successfully!");
      setIsSubmitted(true); // Mark as submitted
      fetchSharedFiles();

      // Reset `isSubmitted` and optionally close modal after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setIsOpen(false); // Close the modal
      }, 3000);
    } catch (error) {
      console.error("Error sharing items:", error);
      console.log("Failed to share items. Please try again.");
    } finally {
      setSelectedDesigneeEmails([]);
      setAddedFiles([]);
      setAddedVoiceMemos([]);
      hideLoading();
    }
  };

  console.log("Selected designee emails:", selectedDesigneeEmails);
  console.log("Added files:", addedFiles);

  // Find a file by its ID (helper function)
  const findFileById = (fileId) => {
    for (const category in userFoldersAndFiles) {
      const file = userFoldersAndFiles[category].find((f) => f.id === fileId);
      if (file) return file;
    }
    return null;
  };

  const safeSearchQuery = (searchQuery || "").trim().toLowerCase();
  const safeMobilesearchQuery = (MobilesearchQuery || "").trim().toLowerCase();

  const filteredFiles = fileShares.filter((fileShare) => {
    const designeeName = fileShare?.designee?.name || "";
    return designeeName.toLowerCase().includes(safeSearchQuery);
  });

  const filteredMobileFiles = fileShares.filter((fileShare) => {
    const designeeName = fileShare?.designee?.name || "";
    return designeeName.toLowerCase().includes(safeMobilesearchQuery);
  });

  // Debugging: Check the updated search queries and filtered results
  console.log("Search Query:", searchQuery);
  console.log("Filtered Files:", filteredFiles);

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
  return (
    <div className="">
      <div className="p-6">
        <div className="md:hidden h-14 p-2 w-full border-2 border-gray-200 rounded-xl md:mt-4 mb-3 flex">
          <Search className="mt-1.5 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="w-full h-full p-4 outline-none"
            value={MobilesearchQuery}
            onChange={(e) => MobilesetsearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl">After Life Access</h1>
        </div>

        <div>
          <div
            className="bg-[#0067FF] w-60 rounded-2xl my-2 px-2 py-4 cursor-pointer space-y-0 sm:space-y-1 flex flex-col gap-3"
            onClick={togglePopupD}
          >
            <button className="flex items-center  text-white px-2">
              {/* <img src={VoiceLogo} alt="" className="h-12 w-12" /> */}
              <img
                src={ShareIcon}
                alt=""
                className="h-8 bg-white mr-3 p-1 rounded-full"
              />
              <p className="text-xl">Share File</p>
            </button>
            <div className="flex justify-between items-center">
              <p className="text-white  text-xs ml-1">
                Click to Share File/Doc Now
              </p>
              <ArrowRight className="mr-2 text-white w-5 h-5" />
            </div>
          </div>
          {/* <div className="flex">
                <h1 className="text-lg font-semibold text-blue-600 border-b-4 border-blue-500 py-4">Lists of Shared Items</h1>
              </div> */}
          <div className="flex gap-6">
            <div class="flex justify-between w-full items-center mt-8 md:px-0 border-gray-300">
              <div class="text-sm">
                <div class="flex items-center md:gap-x-2 border-b-4 border-blue-600 text-blue-600">
                  <span class=" font-semibold pb-2 mr-2">
                    List of shared items
                  </span>
                  <span className="text-black rounded-lg text-sm mt-1 mb-2 px-2.5 bg-[#EEEEEF]">
                    {`${fileShares?.length || 0}`}
                  </span>
                </div>
                <div class=""></div>
              </div>
              <div>
                <button
                  onClick={GridView}
                  className="p-2 gap-2 rounded-md  md:hidden flex"
                >
                  {isGridView ? (
                    <>
                      {" "}
                      <Grid size={20} className="mt-0.5" />
                      <span>Grid View</span>{" "}
                    </>
                  ) : (
                    <>
                      {" "}
                      <List size={20} className="mt-0.5" />
                      <span>List View</span>{" "}
                    </>
                  )}
                </button>
              </div>
            </div>
            {/* Popup */}
            {isOpen && (
              <div className="flex flex-col items-center justify-center z-40 bg-gray-100">
                {/* Trigger Button */}
                {/* <button
                      onClick={togglePopup}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      Click to Share File/Doc Now
                    </button> */}

                {/* Popup */}
                {isOpen && (
                  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 overflow-auto flex items-center justify-center z-50">
                    <div className="mt-4 bg-white p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-300">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">
                          Share <span className="text-blue-600">Items</span>
                        </h2>
                        <button onClick={togglePopupD}>
                          <X className="w-5 h-5 text-gray-700 hover:text-red-500" />
                        </button>
                      </div>

                      {/* File Input */}
                      <div className="mb-4">
                        <div className="relative w-full">
                          {/* Dropdown Trigger */}
                          <div
                            onClick={toggleDropdownVisibility}
                            className="flex items-center text-sm font-semibold justify-between text-gray-400 px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-blue-500 focus-visible:border-[#0067ff] hover:border-[#0067ff] rounded-xl w-full text-left"
                          >
                            <button>Add Files, Documents</button>
                            <img className="w-3" src={arrowdown} alt="" />
                          </div>

                          <div>
                            <h1 className="text-lg font-semibold py-1 px-1">
                              File with Access
                            </h1>
                          </div>

                          {addedFiles.length === 0 && (
                            <div className="flex px-2 py-3 border-b-2 border-t-2 border-gray-100">
                              <CircleHelp className="mr-4 mt-0.5 " />
                              <span className="font-semibold">Add</span>
                            </div>
                          )}

                          {dropdownVisible && (
                            <>
                              <div className="absolute top-12 left-0  border shadow-lg rounded-lg w-full z-50 bg-white">
                                <div className="overflow-y-scroll max-h-52 bg-white mt-2">
                                  <div className="p-4">
                                    <div className="flex justify-between items-center">
                                      <span className="font-bold">
                                        Select Files, Documents
                                      </span>
                                      <span className="flex justify-between items-center">
                                        {/* Select All Checkbox */}
                                        <input
                                          type="checkbox"
                                          className="form-checkbox mr-3"
                                          checked={selectAllChecked}
                                          onChange={handleSelectAllToggle}
                                        />
                                        <span className="text-[#0067ff] text-xs">
                                          Select All
                                        </span>
                                      </span>
                                    </div>

                                    {/* Folder and File List */}
                                    <>
                                      {Object.keys(userFoldersAndFiles).map(
                                        (category) => (
                                          <div key={category} className="mt-4">
                                            {userFoldersAndFiles[category]
                                              ?.length > 0 && (
                                                <div className="flex justify-between items-center">
                                                  <div className="flex items-center justify-between gap-3">
                                                    {/* Folder Checkbox */}
                                                    <input
                                                      type="checkbox"
                                                      className="form-checkbox"
                                                      checked={
                                                        userFoldersAndFiles[
                                                          category
                                                        ].every(
                                                          (file) =>
                                                            selectedFiles[
                                                            file.file_id
                                                            ]
                                                        ) // Folder is checked only if all files are selected
                                                      }
                                                      onChange={() =>
                                                        toggleFolderSelection(
                                                          category
                                                        )
                                                      }
                                                    />
                                                    <FolderOpen />
                                                    <span
                                                      className="ml-2 cursor-pointer"
                                                      onClick={() =>
                                                        toggleRow(category)
                                                      }
                                                    >
                                                      {category}
                                                    </span>
                                                  </div>
                                                  <button
                                                    onClick={() =>
                                                      toggleRow(category)
                                                    }
                                                    className="text-[#0067ff]"
                                                  >
                                                    <img
                                                      className={`w-3 transform transition-transform ${expandedRows[category]
                                                        ? "rotate-180"
                                                        : ""
                                                        }`}
                                                      src={FileText}
                                                      alt="expand/collapse"
                                                    />
                                                  </button>
                                                </div>
                                              )}

                                            {/* Files in Folder */}
                                            {expandedRows[category] && (
                                              <div className="mt-2 bg-[#eff5ff] py-3 border-b px-2">
                                                {userFoldersAndFiles[
                                                  category
                                                ].map((file) => (
                                                  <div
                                                    key={file.file_id}
                                                    className="mt-2 flex items-center gap-3"
                                                  >
                                                    <input
                                                      type="checkbox"
                                                      className="form-checkbox"
                                                      checked={
                                                        selectedFiles[
                                                        file.file_id
                                                        ] || false
                                                      } // Check if the file is selected
                                                      onChange={() =>
                                                        toggleFile(file.file_id)
                                                      } // Update selectedFiles state
                                                    />
                                                    <img
                                                      className="w-8 bg-white p-1 rounded-full"
                                                      src={FileText} // Replace with your file icon
                                                      alt="file"
                                                    />
                                                    <span className="ml-2">
                                                      {file.file_name}
                                                    </span>
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        )
                                      )}
                                    </>
                                  </div>
                                </div>

                                <div className="px-3 pb-3">
                                  <button
                                    className="text-[#0067ff] text-sm px-2 py-2 rounded-lg font-semibold w-full inline border hover:bg-[#0067ff] hover:text-white"
                                    onClick={handleAdd} // Handle add action
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Files with Access */}
                      {/* Files with Access */}
                      <div
                        className={`${addedFiles.length === 0
                          ? "hidden"
                          : "overflow-y-scroll mt-2 bg-white max-h-40 border p-1"
                          }`}
                      >
                        {addedFiles.length > 0 && (
                          <div className="mt-2">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                              Files with access
                            </h3>
                            {[
                              ...new Map(
                                addedFiles.map((file) => [file.file_id, file])
                              ).values(),
                            ].map((file) => (
                              <div
                                key={file.file_id}
                                className="flex items-center ml-3 mb-4 mt-2"
                              >
                                <img
                                  className="w-7 h-7 bg-[#DCDFE4] p-1 ring-2 ring-[#c6c9cd] -ml-2 mr-3 rounded-full"
                                  src={FileText} // Replace with your file icon
                                  alt=""
                                />
                                <div className="flex items-start justify-start flex-col">
                                  <p className="font-semibold mb-1">
                                    {file.file_name}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {addedVoiceMemos.length > 0 && (
                          <div className="mt-4 mb-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                              Voice Memos with access
                            </h3>
                            {[
                              ...new Map(
                                addedVoiceMemos.map((memo) => [memo.id, memo])
                              ).values(),
                            ].map((memo) => (
                              <div
                                key={memo.id}
                                className="flex items-center gap-3"
                              >
                                <img
                                  className="w-8 h-8 bg-[#DCDFE4] p-1 rounded-full"
                                  src={FileText} // Replace with your voice memo icon
                                  alt="voice memo"
                                />
                                <div className="flex items-start justify-start flex-col">
                                  <p className="font-semibold mb-1">
                                    {memo.name}
                                  </p>
                                  <p className="text-xs text-blue-500 font-semibold">
                                    Duration: {memo.duration} seconds
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Add Existing Designee */}
                      <div className="mb-4 mt-4">
                        <select
                          className="w-full border rounded-xl text-sm font-semibold px-2 py-3 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                          onChange={handleDesigneeChange}
                        >
                          <option className="max-w-40" value="">
                            Select Designee
                          </option>
                          {designers.map((designee) => (
                            <option key={designee._id} value={designee.email}>
                              {designee.name} - {designee.email}
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedDesigneeEmails.length === 0 && (
                        <>
                          {" "}
                          <div className="text-lg font-semibold">
                            <h1>Designee Assigned</h1>
                          </div>
                          <div className="flex mt-3 px-2 py-3 border-b-2 border-t-2 border-gray-100">
                            <CircleHelp className="mr-4 mt-0.5 " />
                            <span className="font-semibold">Add</span>
                          </div>{" "}
                        </>
                      )}
                      {/* Display Selected Designees before "People With Access" */}
                      {selectedDesigneeEmails.length > 0 && (
                        <div className="mt-2 bg-white max-h-20 overflow-y-scroll">
                          <h2 className="text-sm font-semibold text-gray-600 mb-3">
                            Selected Designees:
                          </h2>
                          <div className="flex flex-wrap gap-y-4">
                            {selectedDesigneeEmails.map((email, index) => (
                              <div
                                key={index}
                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-xl text-sm"
                              >
                                {email}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="p-2 flex justify-between mt-2">
                        <button
                          className="bg-blue-100 text-blue-600 font-semibold border-2 border-blue-500 text-sm px-2 py-2 rounded-lg w-32 text-center"
                          onClick={() => {
                            openPopup();
                            // setIsOpen(false)
                            setIsOpen(!isOpen);
                          }}
                        >
                          Invite Designee
                        </button>

                        {isLoading ? (
                          <button className="bg-blue-500 flex justify-between items-center cursor-not-allowed text-white font-semibold text-sm px-2 py-2 rounded-lg w-20">
                            <Loader2 className="animate-spin h-4 w-4" />
                          </button>
                        ) : isSubmitted ? (
                          <button className="bg-green-500 text-center text-white font-semibold text-sm px-2 py-2 rounded-lg w-20">
                            Sent
                          </button>
                        ) : (
                          <button
                            className={`${!selectedDesigneeEmails.length ||
                              (!addedFiles.length && !addedVoiceMemos.length)
                              ? "bg-blue-500 hover:bg-blue-600 cursor-not-allowed"
                              : "bg-blue-500 hover:bg-blue-600"
                              } text-center text-white font-semibold text-sm px-2 py-2 rounded-lg w-20`}
                            onClick={handleShareNow}
                            disabled={
                              !selectedDesigneeEmails.length ||
                              (!addedFiles.length && !addedVoiceMemos.length)
                            }
                          >
                            Send
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="hidden md:inline">
            <table className="w-full table-auto ">
              <thead>
                <tr className="bg-gray-200 py-4">
                  <th className="px-2 py-4 text-slate-500 text-left font-semibold">
                    Shared User
                  </th>
                  <th className="px-2 py-2 text-slate-500 text-left font-semibold">
                    Shared Date
                  </th>
                  <th className="px-2 py-2 text-slate-500 text-left font-semibold">
                    Shared Item
                  </th>
                  <th className="px-2 py-2 text-slate-500 text-left font-semibold">
                    Access
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((fileShare, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-2 py-3 w-[20%]">
                      <div className="py-2">
                        <span className="ml-3 bg-gray-100 rounded-lg py-2 px-2 font-semibold text-sm">
                          {fileShare.designee.name}
                        </span>
                      </div>
                    </td>
                    <td className="font-semibold text-slate-500 w-[22%] text-sm">
                      {fileShare.created_at && !isNaN(new Date(fileShare.created_at))
                        ? new Date(fileShare.created_at).toLocaleString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })
                        : "Invalid Date"}
                    </td>
                    <td className="w-[30%] text-sm">
                      <div className="flex items-center cursor-pointer relative">
                        <div className="flex">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-chevron-down text-gray-500 mr-1 mt-1 cursor-pointer"
                            onClick={(e) => toggleSharedItem(index, e)}
                          >
                            <path d="m6 9 6 6 6-6"></path>
                          </svg>
                          <div>
                            <p className="font-semibold mb-1">
                              {fileShare.files[0]?.file_name?.length > 30
                                ? `${fileShare.files[0]?.file_name.substring(0, 30)}...`
                                : fileShare.files[0]?.file_name}
                            </p>
                            <p className="text-xs text-blue-500 font-semibold">
                              +
                              {fileShare.files.length + fileShare.voices.length}{" "}
                              Items
                            </p>
                          </div>

                          {/* Dropdown menu */}
                          {openDropdownIndex === index && (
                            <div
                              ref={(el) => (dropdownRef.current[index + 1] = el)}
                              className="absolute right-10 mt-2 min-w-96 bg-white z-20 shadow-lg rounded-2xl border border-gray-200 top-8 overflow-y-scroll h-64"
                            >
                              <div className="p-4">
                                <h3 className="text-lg font-semibold">
                                  Shared Items
                                </h3>
                              </div>
                              <ul className="divide-y divide-gray-200">
                                {/* Shared Files */}
                                {fileShare.files?.length > 0 ? (
                                  fileShare.files.map((file, fileIndex) => (
                                    <li
                                      key={`file-${fileIndex}`}
                                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-100"
                                    >
                                      <div className="flex items-center justify-between w-full space-x-3">
                                        <div className="flex gap-x-4">
                                          <div
                                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                                            onClick={() => {
                                              fetchFileContent(file.file_id);
                                            }}
                                          >
                                            <img
                                              src={files_icon}
                                              alt="File Icon"
                                            />
                                          </div>

                                          <span> {file.file_name?.length > 30
                                            ? `${file.file_name.substring(0, 30)}...`
                                            : file.file_name}</span>
                                        </div>
                                        <div className="flex flex-end ml-4">
                                          {/* innner edit icon */}
                                          <div className="relative">
                                            <img
                                              src={editicon} // Replace with actual edit icon path
                                              alt=""
                                              className="h-8 bg-white mr-3 p-1 rounded-full cursor-pointer"
                                              onClick={() =>
                                                toggleInnerPopup(fileIndex)
                                              }
                                            />
                                            {/* Popup inner */}
                                            {innerPopupIndex === fileIndex && (

                                              <div
                                                ref={(el) => (dropdownRef.current[fileIndex + 1] = el)}
                                                className="absolute bg-white border text-gray-400 border-gray-300 rounded-lg shadow-xl z-10 right-0 w-40">
                                                <ul className="text-sm">
                                                  <li
                                                    className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                                    onClick={
                                                      () =>
                                                        handlesharedaccessOption(
                                                          "view",
                                                          fileShare.to_email_id,
                                                          file.file_id
                                                        ) // Update access for file with ID 12345
                                                    }
                                                  >
                                                    <span>
                                                      <Eye ref={(el) => (dropdownRef.current[index] = el)} className="h-5 w-5 mr-2" />
                                                    </span>
                                                    Only View
                                                  </li>
                                                  <li
                                                    className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                                    onClick={() =>
                                                      handlesharedaccessOption(
                                                        "edit",
                                                        fileShare.to_email_id,
                                                        file.file_id
                                                      )
                                                    }
                                                  >
                                                    <span>
                                                      <FilePenLine className="h-5 w-5 mr-2" />
                                                    </span>
                                                    Edit Access
                                                  </li>
                                                  <li
                                                    className=" flex px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 hover:text-red-600"
                                                    onClick={() =>
                                                      removefileAccess(
                                                        fileShare.to_email_id,
                                                        file.file_id,
                                                        null
                                                      )
                                                    }
                                                  >
                                                    <span>
                                                      <Trash2 className="h-5 w-5 mr-2" />
                                                    </span>
                                                    Remove Access
                                                  </li>
                                                </ul>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  ))
                                ) : (
                                  <li className="px-4 py-3 text-gray-500">
                                    No files shared
                                  </li>
                                )}
                                {/* Shared Voices */}
                                {fileShare.voices.map((voice, voiceIndex) => (
                                  <li
                                    key={`voice-${voiceIndex}`}
                                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-100"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="flex items-center">
                                        <img
                                          src={play}
                                          alt=""
                                          className="h-5 ml-2"
                                          onClick={() => {
                                            setOpenDropdownIndex(null);
                                            handlePlay(voice.voice_id);
                                          }}
                                        />
                                        <span className="text-sm ml-4 mt-1">
                                          {voice.voice_name}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-x-2">
                                      <img
                                        className="h-8 bg-white mr-3 p-1 rounded-full cursor-pointer"
                                        src={editicon}
                                        alt="Edit Icon"
                                      // onClick={() => handleEditIconClick(voice)}
                                      />
                                    </div>

                                    {/* Popup specific to this voice */}
                                    {isPopupOpen &&
                                      selectedItemId === voice.voice_id && (
                                        <div className="absolute bg-white border border-gray-300 rounded-lg shadow-lg z-50 right-4 top-14 w-56">
                                          <ul className="text-sm">
                                            <li
                                              className="px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                              onClick={() =>
                                                setIsPopupOpen(false)
                                              }
                                            >
                                              Only View
                                            </li>
                                            <li
                                              className="px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                              onClick={() =>
                                                setIsPopupOpen(false)
                                              }
                                            >
                                              Edit Access
                                            </li>
                                            <li
                                              className="px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 hover:text-red-600"
                                              onClick={() =>
                                                setIsPopupOpen(false)
                                              }
                                            >
                                              Remove Access
                                            </li>
                                          </ul>
                                          <ul className="text-sm">
                                            <li
                                              className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                              onClick={
                                                () =>
                                                  handlesharedaccessOption(
                                                    "view",
                                                    fileShare.to_email_id,
                                                    file.file_id
                                                  ) // Update access for file with ID 12345
                                              }
                                            >
                                              <span>
                                                <Eye className="h-5 w-5 mr-2" />
                                              </span>
                                              Only View
                                            </li>
                                            <li
                                              className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                              onClick={() =>
                                                handlesharedaccessOption(
                                                  "edit",
                                                  fileShare.to_email_id,
                                                  file.file_id
                                                )
                                              }
                                            >
                                              <span>
                                                <FilePenLine className="h-5 w-5 mr-2" />
                                              </span>
                                              Edit Access
                                            </li>
                                            <li
                                              className=" flex px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 hover:text-red-600"
                                              onClick={() =>
                                                removefileAccess(
                                                  fileShare.to_email_id,
                                                  file.file_id,
                                                  null
                                                )
                                              }
                                            >
                                              <span>
                                                <Trash2 className="h-5 w-5 mr-2" />
                                              </span>
                                              Remove Access
                                            </li>
                                          </ul>
                                        </div>
                                      )}
                                  </li>
                                ))}
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
                        </div>
                      </div>
                    </td>
                    <td
                      className="font-medium text-gray-400 pl-2 w-[22%] relative"
                      onClick={() => togglePopup(index)} // Pass the index of the clicked file
                    >
                      <img
                        src={editicon} // Replace with actual edit icon path
                        alt=""
                        className="h-8 bg-white mr-3 p-1 rounded-full cursor-pointer"
                      />
                      {/* Popup */}
                      {popupIndex === index && ( // Only show the popup for the selected index
                        <div
                          ref={(el) => (dropdownRef.current[index] = el)}
                          className="absolute bg-white border border-gray-300 rounded-lg shadow-xl z-10 right-24 w-40">
                          <ul className="text-sm">
                            <li
                              className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                              onClick={() =>
                                handlesharedaccessOption(
                                  "View",
                                  fileShare.to_email_id
                                )
                              }
                            >
                              <span>
                                <Eye className="h-5 w-5 mr-2" />
                              </span>
                              Only View
                            </li>
                            <li
                              className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                              onClick={() =>
                                handlesharedaccessOption(
                                  "Edit",
                                  fileShare.to_email_id
                                )
                              }
                            >
                              <span>
                                <FilePenLine className="h-5 w-5 mr-2" />
                              </span>
                              Edit Access
                            </li>
                            <li
                              className=" flex px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 hover:text-red-600"
                              onClick={() =>
                                removeAccess(fileShare.to_email_id)
                              }
                            >
                              <span>
                                <Trash2 className="h-5 w-5 mr-2" />
                              </span>
                              Remove Access
                            </li>
                          </ul>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="md:hidden">
          {!isGridView ? (
            <>
              <div className="grid grid-cols-2 mt-2 gap-x-4">
                {filteredMobileFiles.map((fileShare, index) => (
                  <>
                    <div className="border-2 border-[#f0f0f0] rounded-xl mt-2">
                      <div
                        key={index}
                        className="flex flex-col justify-between min-h-full min-w-full p-2"
                      >
                        <div className="w-full relative">
                          <p className="font-semibold text-sm py-2">
                            {fileShare.files[0]?.file_name}
                          </p>
                          <p
                            onClick={() => toggleSharedItem(index)}
                            className="text-sm font-semibold text-blue-600 flex"
                          >
                            +{fileShare.files.length + fileShare.voices.length}{" "}
                            items{" "}
                            <ChevronRight className="text-black ml-3 h-5 w-5 mt-0.5" />
                          </p>
                        </div>

                        {/* Dropdown menu */}
                        {/* Dropdown menu */}
                        {openDropdownIndex === index && (
                          <div className="fixed inset-0 h-full px-3 w-full backdrop-blur-[2px] flex items-center justify-center z-50">
                            <div
                              ref={(el) => (dropdownRef.current[index] = el)}
                              className="absolute h-80 overflow-y-auto w-[350px] md:w-96 bg-white  z-20 shadow-2xl rounded-2xl border border-gray-200 "
                            >
                              <div className="p-4 sticky top-0 flex justify-between bg-white z-50 border-b-2">
                                <h3 className="text-lg font-semibold">
                                  Shared Items
                                </h3>
                                <p onClick={() => setOpenDropdownIndex(null)}>
                                  <X className="h-7 w-7 text-gray-500" />
                                </p>
                              </div>
                              <ul className="divide-y divide-gray-200">
                                {/* Shared Files */}
                                {fileShare.files?.length > 0 ? (
                                  fileShare.files.map((file, fileIndex) => (
                                    <li
                                      key={`file-${fileIndex}`}
                                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-100"
                                    >
                                      <div className="flex items-center justify-between w-full space-x-3">
                                        <div className="flex gap-x-4">
                                          <div
                                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                                            onClick={() => {
                                              fetchFileContent(file.file_id);
                                            }}
                                          >
                                            <img
                                              src={files_icon}
                                              alt="File Icon"
                                            />
                                          </div>

                                          <span>{file.file_name}</span>
                                        </div>
                                        <div className="flex flex-end ml-4">
                                          <img
                                            src={editicon} // Replace with actual edit icon path
                                            alt=""
                                            className="h-8 bg-white mr-3 p-1 rounded-full cursor-pointer"
                                            onClick={() =>
                                              toggleInnerPopup(fileIndex)
                                            }
                                          />

                                          {innerPopupIndex === fileIndex && (
                                            <div className="absolute bg-white border text-gray-400 border-gray-300 rounded-lg shadow-xl z-10 right-0 w-40">
                                              <ul className="text-sm">
                                                <li
                                                  className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                                  onClick={
                                                    () =>
                                                      handlesharedaccessOption(
                                                        "view",
                                                        fileShare.to_email_id,
                                                        file.file_id
                                                      ) // Update access for file with ID 12345
                                                  }
                                                >
                                                  <span>
                                                    <Eye className="h-5 w-5 mr-2" />
                                                  </span>
                                                  Only View
                                                </li>
                                                <li
                                                  className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                                  onClick={() =>
                                                    handlesharedaccessOption(
                                                      "edit",
                                                      fileShare.to_email_id,
                                                      file.file_id
                                                    )
                                                  }
                                                >
                                                  <span>
                                                    <FilePenLine className="h-5 w-5 mr-2" />
                                                  </span>
                                                  Edit Access
                                                </li>
                                                <li
                                                  className=" flex px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 hover:text-red-600"
                                                  onClick={() =>
                                                    removefileAccess(
                                                      fileShare.to_email_id,
                                                      file.file_id,
                                                      null
                                                    )
                                                  }
                                                >
                                                  <span>
                                                    <Trash2 className="h-5 w-5 mr-2" />
                                                  </span>
                                                  Remove Access
                                                </li>
                                              </ul>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </li>
                                  ))
                                ) : (
                                  <li className="px-4 py-3 text-gray-500">
                                    No files shared
                                  </li>
                                )}
                                {/* Shared Voices */}
                                {fileShare.voices.map((voice, voiceIndex) => (
                                  <li
                                    key={`voice-${voiceIndex}`}
                                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-100"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="flex items-center">
                                        <img
                                          src={play}
                                          alt=""
                                          className="h-5 ml-2"
                                          onClick={() => {
                                            setOpenDropdownIndex(null);
                                            handlePlay(voice.voice_id);
                                          }}
                                        />
                                        <span className="text-sm ml-4 mt-1">
                                          {voice.voice_name}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-x-2">
                                      <img
                                        className="h-8 bg-white mr-3 p-1 rounded-full cursor-pointer"
                                        src={editicon}
                                        alt="Edit Icon"
                                      // onClick={() => handleEditIconClick(voice)}
                                      />
                                    </div>

                                    {/* Popup specific to this voice */}
                                    {isPopupOpen &&
                                      selectedItemId === voice.voice_id && (
                                        <div className="absolute bg-white border border-gray-300 rounded-lg shadow-lg z-50 right-4 top-14 w-56">
                                          <ul className="text-sm">
                                            <li
                                              className="px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                              onClick={() =>
                                                setIsPopupOpen(false)
                                              }
                                            >
                                              Only View
                                            </li>
                                            <li
                                              className="px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                              onClick={() =>
                                                setIsPopupOpen(false)
                                              }
                                            >
                                              Edit Access
                                            </li>
                                            <li
                                              className="px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 hover:text-red-600"
                                              onClick={() =>
                                                setIsPopupOpen(false)
                                              }
                                            >
                                              Remove Access
                                            </li>
                                          </ul>
                                        </div>
                                      )}
                                  </li>
                                ))}
                                {popupIndex === index && ( // Only show the popup for the selected index
                                  <div className="absolute bg-white border border-gray-300 rounded-lg shadow-xl z-10 right-24 w-40">
                                    <ul className="text-sm">
                                      <li
                                        className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                        onClick={() =>
                                          handlesharedaccessOption(
                                            "View",
                                            fileShare.to_email_id
                                          )
                                        }
                                      >
                                        <span>
                                          <Eye className="h-5 w-5 mr-2" />
                                        </span>
                                        Only View
                                      </li>
                                      <li
                                        className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                        onClick={() =>
                                          handlesharedaccessOption(
                                            "Edit",
                                            fileShare.to_email_id
                                          )
                                        }
                                      >
                                        <span>
                                          <FilePenLine className="h-5 w-5 mr-2" />
                                        </span>
                                        Edit Access
                                      </li>
                                      <li
                                        className=" flex px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 hover:text-red-600"
                                        onClick={() =>
                                          removeAccess(fileShare.to_email_id)
                                        }
                                      >
                                        <span>
                                          <Trash2 className="h-5 w-5 mr-2" />
                                        </span>
                                        Remove Access
                                      </li>
                                    </ul>
                                  </div>
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

                        <div className="mt-8 relative">
                          <p className="font-semibold bg-slate-100 text-center rounded-md py-1">
                            {fileShare.designee.name}
                          </p>
                          <p className="font-semibold text-gray-600 text-sm flex justify-between mt-3">
                            {fileShare.created_at && !isNaN(new Date(fileShare.created_at))
                              ? new Date(fileShare.created_at).toLocaleString("en-US", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              })
                              : "Invalid Date"}
                            <EllipsisVertical
                              onClick={() => togglePopup(index)}
                            />
                          </p>
                        </div>
                        {popupIndex === index && ( // Only show the popup for the selected index
                          <div className="absolute mt-[22px] min-[500px]:ml-18 min-[600px]:ml-24 min-[650px]:ml-28  min-[700px]:ml-36 bg-white border border-gray-300 rounded-lg shadow-xl z-10 w-40">
                            <ul className="text-sm">
                              <li
                                className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                onClick={() =>
                                  handlesharedaccessOption(
                                    "View",
                                    fileShare.to_email_id
                                  )
                                }
                              >
                                <span>
                                  <Eye className="h-5 w-5 mr-2" />
                                </span>
                                Only View
                              </li>
                              <li
                                className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                onClick={() =>
                                  handlesharedaccessOption(
                                    "edit",
                                    fileShare.to_email_id
                                  )
                                }
                              >
                                <span>
                                  <FilePenLine className="h-5 w-5 mr-2" />
                                </span>
                                Edit Access
                              </li>
                              <li
                                className=" flex px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 hover:text-red-600"
                                onClick={() =>
                                  removeAccess(fileShare.to_email_id)
                                }
                              >
                                <span>
                                  <Trash2 className="h-5 w-5 mr-2" />
                                </span>
                                Remove Access
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:hidden">
              {sharedFiles.map((file, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-100 rounded-md shadow-md"
                >
                  <p>
                    <strong>Username:</strong>{" "}
                    {file.from_user?.username || "Unknown"}
                  </p>
                  <p>
                    <strong>Voice Name:</strong> {file.voice_name || "Unknown"}
                  </p>
                  <p>
                    <strong>Access:</strong> {file.access}
                  </p>
                  <p>
                    <strong>Shared At:</strong>{" "}
                    {new Date(file.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div> */}
              <div>
                {filteredMobileFiles.map((fileShare, index) => (
                  <>
                    <div
                      key={index}
                      className="border-2 border-[#f0f0f0] rounded-2xl mt-2"
                    >
                      <div className="flex h-full w-full p-2">
                        <div className="w-full relative">
                          <p className="text-sm font-semibold py-1">
                            {fileShare.files[0]?.file_name}
                          </p>
                          <p
                            onClick={() => toggleSharedItem(index)}
                            className="text-sm font-semibold text-blue-600 flex"
                          >
                            +{fileShare.files.length + fileShare.voices.length}{" "}
                            Items{" "}
                            <ChevronRight className="text-black h-5 w-5 ml-2 mt-1" />
                          </p>
                        </div>
                        {/* Dropdown menu */}
                        {/* Dropdown menu */}
                        {openDropdownIndex === index && (
                          <div className="fixed inset-0 h-full px-3 w-full backdrop-blur-[2px] flex items-center justify-center z-50">
                            <div
                              ref={(el) => (dropdownRef.current[index] = el)}
                              className="absolute  w-[350px] md:w-96 h-80 overflow-y-auto bg-white z-50 shadow-2xl rounded-2xl border border-gray-200 "
                            >
                              <div className="p-4 sticky top-0 flex justify-between bg-white z-50 border-b-2">
                                <h3 className="text-lg font-semibold">
                                  Shared Items
                                </h3>
                                <p onClick={() => setOpenDropdownIndex(null)}>
                                  <X className="h-7 w-7 text-gray-500" />
                                </p>
                              </div>
                              <ul className="divide-y divide-gray-200">
                                {fileShare.files?.length > 0 ? (
                                  fileShare.files.map((file, fileIndex) => (
                                    <li
                                      key={`file-${fileIndex}`}
                                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 "
                                    >
                                      <div className="flex items-center justify-between w-full space-x-3">
                                        <div className="flex gap-x-4">
                                          <div
                                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                                            onClick={() => {
                                              fetchFileContent(file.file_id);
                                            }}
                                          >
                                            <img
                                              src={files_icon}
                                              alt="File Icon"
                                            />
                                          </div>

                                          <span>{file.file_name}</span>
                                        </div>
                                        <div className="flex flex-end ml-4">
                                          <img
                                            src={editicon} // Replace with actual edit icon path
                                            alt=""
                                            className="h-8 bg-white mr-3 p-1 rounded-full cursor-pointer"
                                            onClick={() =>
                                              toggleInnerPopup(fileIndex)
                                            }
                                          />

                                          {innerPopupIndex === fileIndex && (
                                            <div className="absolute bg-white border text-gray-400 border-gray-300 rounded-lg shadow-xl z-10 right-0 w-40">
                                              <ul className="text-sm">
                                                <li
                                                  className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                                  onClick={
                                                    () =>
                                                      handlesharedaccessOption(
                                                        "view",
                                                        fileShare.to_email_id,
                                                        file.file_id
                                                      ) // Update access for file with ID 12345
                                                  }
                                                >
                                                  <span>
                                                    <Eye className="h-5 w-5 mr-2" />
                                                  </span>
                                                  Only View
                                                </li>
                                                <li
                                                  className=" flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                                  onClick={() =>
                                                    handlesharedaccessOption(
                                                      "edit",
                                                      fileShare.to_email_id,
                                                      file.file_id
                                                    )
                                                  }
                                                >
                                                  <span>
                                                    <FilePenLine className="h-5 w-5 mr-2" />
                                                  </span>
                                                  Edit Access
                                                </li>
                                                <li
                                                  className=" flex px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 hover:text-red-600"
                                                  onClick={() =>
                                                    removefileAccess(
                                                      fileShare.to_email_id,
                                                      file.file_id,
                                                      null
                                                    )
                                                  }
                                                >
                                                  <span>
                                                    <Trash2 className="h-5 w-5 mr-2" />
                                                  </span>
                                                  Remove Access
                                                </li>
                                              </ul>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </li>
                                  ))
                                ) : (
                                  <li className="px-4 py-3 text-gray-500">
                                    No files shared
                                  </li>
                                )}
                                {/* Shared Voices */}
                                {fileShare.voices.map((voice, voiceIndex) => (
                                  <li
                                    key={`voice-${voiceIndex}`}
                                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-100"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="flex items-center">
                                        <img
                                          src={play}
                                          alt=""
                                          className="h-5 ml-2"
                                          onClick={() => {
                                            setOpenDropdownIndex(null);
                                            handlePlay(voice.voice_id);
                                          }}
                                        />
                                        <span className="text-sm ml-4 mt-1">
                                          {voice.voice_name}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-x-2">
                                      <img
                                        className="h-8 bg-white mr-3 p-1 rounded-full cursor-pointer"
                                        src={editicon}
                                        alt="Edit Icon"
                                      // onClick={() => handleEditIconClick(voice)}
                                      />
                                    </div>

                                    {/* Popup specific to this voice */}
                                    {isPopupOpen &&
                                      selectedItemId === voice.voice_id && (
                                        <div className="absolute bg-white border border-gray-300 rounded-lg shadow-lg z-50 right-4 top-14 w-56">
                                          <ul className="text-sm">
                                            <li
                                              className="px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                              onClick={() =>
                                                setIsPopupOpen(false)
                                              }
                                            >
                                              Only View
                                            </li>
                                            <li
                                              className="px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                              onClick={() =>
                                                setIsPopupOpen(false)
                                              }
                                            >
                                              Edit Access
                                            </li>
                                            <li
                                              className="px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 hover:text-red-600"
                                              onClick={() =>
                                                setIsPopupOpen(false)
                                              }
                                            >
                                              Remove Access
                                            </li>
                                          </ul>
                                        </div>
                                      )}
                                  </li>
                                ))}
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

                        <div>
                          <div className="flex justify-between">
                            <p className="text-lg font-semibold bg-slate-100 text-center w-28 rounded-md py-1">
                              {fileShare.designee.name}
                            </p>
                            <span>
                              <EllipsisVertical
                                onClick={() => togglePopup(index)}
                                className="h-6 w-6 text-gray-500 mt-1 font-thin ml-2"
                              />
                            </span>
                          </div>
                          <p className="font-semibold text-gray-600 flex justify-end text-sm mt-4">
                            {fileShare.created_at && !isNaN(new Date(fileShare.created_at))
                              ? new Date(fileShare.created_at).toLocaleString("en-US", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              })
                              : "Invalid Date"}
                          </p>
                        </div>

                        {popupIndex === index && ( // Only show the popup for the selected index
                          <div className="absolute bg-white border border-gray-300 rounded-lg shadow-xl z-10 right-24 w-40">
                            <ul className="text-sm">
                              <li
                                className="flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                onClick={() =>
                                  handlesharedaccessOption(
                                    "View",
                                    fileShare.to_email_id
                                  )
                                }
                              >
                                <span>
                                  <Eye className="h-5 w-5 mr-2" />
                                </span>
                                Only View
                              </li>
                              <li
                                className="flex px-4 py-2 cursor-pointer hover:bg-gray-100 hover:text-[#0067FF]"
                                onClick={() =>
                                  handlesharedaccessOption(
                                    "edit",
                                    fileShare.to_email_id
                                  )
                                }
                              >
                                <span>
                                  <FilePenLine className="h-5 w-5 mr-2" />
                                </span>
                                Edit Access
                              </li>
                              <li
                                className="flex px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-100 hover:text-red-600"
                                onClick={() =>
                                  removeAccess(fileShare.to_email_id)
                                }
                              >
                                <span>
                                  <Trash2 className="h-5 w-5 mr-2" />
                                </span>
                                Remove Access
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {showDesignerPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-semibold">Add Designee</h3>
              <button
                onClick={() => {
                  closePopup();
                  setIsOpen(true);
                }}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-center mb-4">
                <div
                  className="w-24 h-24 rounded-full border-dashed border-2 flex items-center justify-center text-gray-500"
                  onClick={() => document.getElementById("file-input").click()}
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
      {/* {loading && <p>Loading...</p>} */}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {showOverlay && renderOverlay()}
    </div>
  );
};

export default Afterlifeaccess;
