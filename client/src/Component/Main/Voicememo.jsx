import React, { useState, useRef, useEffect } from 'react';
import { motion } from "framer-motion";
import { ArrowRight, Camera, Menu, LayoutGrid, X, FileClock, ChevronDown, Users, Edit, Eye, Trash2, EllipsisVertical, Download, Search, Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';
import fetchUserData from './fetchUserData';
import play from "../../assets/Play.png"
import { NavLink } from "react-router-dom";
// import VoiceLogo from '../../assets/VoiceLogo.png';
// import voicepage from '../../assets/voicepage.png';
import mainmic from "../../assets/mainmic.png"
import editicon from "../../assets/editicon.png";
import shareicondesignee from "../../assets/shareicondesignee.png";
import foldericon from "../../assets/foldericon.png";
import eyeicon from "../../assets/eyeicon.png";
import trashicon from "../../assets/trashicon.png";
import downloadicon from "../../assets/downloadicon.png";
import DesignerPopup from './Designeepopup';
import { API_URL } from '../utils/Apiconfig';
import axios from 'axios'; // For API integration
import { faBedPulse } from '@fortawesome/free-solid-svg-icons';
import usePopupStore from '../../store/DesigneeStore';
import useFolderDeleteStore from '../../store/FolderDeleteStore';
import VersionHistory from './VersionHistory';
import useLoadingStore from "../../store/UseLoadingStore";
const Voicememo = ({ searchQuery }) => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [username, setUsername] = useState("");
  // const [isRecording, setIsRecording] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Toggle for popup
  const [popupIndex, setPopupIndex] = useState(null);
  const popupRef = useRef(null);
  const dropdownRef = useRef([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isLoading, showLoading, hideLoading } = useLoadingStore();
  const [audioURL, setAudioURL] = useState(null);
  const [audioName, setAudioName] = useState('');
  const [audioFiles, setAudioFiles] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [frequencyData, setFrequencyData] = useState([]);
  const [isStopped, setIsStopped] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null); // Reference to the audio element
  const [expandedRow, setExpandedRow] = useState(null);
  const [message, setMessage] = useState(null); // Added for feedback messages
  const [deletebutton, setDeletebutton] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const [elapsedTime, setElapsedTime] = useState(0); // Timer state
  const startTimeRef = useRef(null); // Ref to track recording start time
  const durationRef = useRef(null); // Ref to track duration
  const timerRef = useRef(null); // Reference to the timer
  const [designee, setDesignee] = useState("");
  const [share, setShare] = useState("");
  const [notify, setNotify] = useState(true);
  const [people, setPeople] = useState([]);
  const [isMembershipActive, setIsMembershipActive] = useState(false);
  const [membershipDetail, setMembershipDetail] = useState(null);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null); // For handling errors
  const [deletebutton1, setDeletebutton1] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [users, setUsers] = useState([]);
  const [MobilesearchQuery, MobilesetSearchQuery] = useState("");
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [designees, setDesignees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editsMode, setEditsMode] = useState(null);
  const [versionHistory, setVirsonHistory] = useState(false);
  const [file, setFile] = useState([]);
  const [designers, setDesigners] = useState([]);
  const [permission, setPermission] = useState(null);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [fileId, setFileId] = useState([]);
  const [access, setAccess] = useState(false);
  const [newVoicesName, setNewVoicesName] = useState("");
  const [shareFolderModal, setShareFolderModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);
  const [emailfunc, setEmailfunc] = useState("");
  const [editFileId, setEditFileId] = useState(null);
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

  const intervalRef = useRef(null); // Store the interval ID for the timer

  useEffect(() => {
    // Start the timer interval only when recording is happening and it's not stopped
    if (isRecording && !isStopped) {
      intervalRef.current = setInterval(() => {
        setDuration((prevDuration) => prevDuration + 1); // Increment the timer every second
      }, 1000);
    }

    // Clean up the interval when the recording is stopped or component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current); // Clear the timer interval when stopped
        intervalRef.current = null;
      }
    };
  }, [isRecording, isStopped]);// Runs when `isRecording` or `isStopped` changes

  useEffect(() => {
    const audioElement = document.getElementById("audio-player");
  
    if (audioElement) {
      const handleAudioEnd = () => {
        setCurrentAudio(null); // Close the popup when audio finishes
      };
  
      audioElement.addEventListener("ended", handleAudioEnd);
  
      return () => {
        audioElement.removeEventListener("ended", handleAudioEnd);
      };
    }
  }, [currentAudio]); // Runs whenever `currentAudio` changes
  

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = () => {
        // Clean up and reset states related to the recording
        audioChunks.current = []; // Clear recorded chunks
        mediaRecorderRef.current = null; // Reset media recorder
        startTimeRef.current = null; // Reset start time
        setAudioURL(null); // Clear audio URL
        setAudioName(''); // Reset the audio name
        setDuration(0); // Reset duration to 0
        setIsRecording(false); // Set the recording status to false
        setIsStopped(true); // Mark recording as stopped


        if (intervalRef.current) {
          clearInterval(intervalRef.current); // Stop the timer interval
          intervalRef.current = null; // Reset the interval reference
        }
      };
    }

    // Stop the microphone stream
    if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }

    // Close the audio context if it exists
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Stop the frequency analysis animation frame if it's running
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Reset any other states
    setAudioURL(null); // Ensure the audio URL is cleared
    setDuration(0); // Ensure the timer resets to 0
    setIsStopped(true); // Mark as stopped
    setIsRecording(false); // Set the recording status to false
    setAudioName(''); // Reset audio name
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Close the popup

    if (isRecording) {
        // Stop the recording and reset states
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.onstop = () => {
                mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
                setIsRecording(false);
                setIsStopped(false); // Ensure "Start" is displayed
                setAudioURL(null); // Reset audio URL
            };
        }
    } else {
        setIsStopped(false); 
    }

    // Clear the timer interval
    clearInterval(timerRef.current);
    timerRef.current = null;

    // Reset duration
    setDuration(0);
    setAudioName('');
};





  const handleEdits = (id, currentName) => {
    setEditsMode(id);
    setNewVoicesName(currentName);
    setPopupIndex(null);
  };

  useEffect(() => {
    fetchDesignees();
  }, []);
  const handleSaveEdits = async (id) => {
    try {
      const email = users[0]?.email; // Fetch the user's email from `users`

      if (!email) {
        // console.log("User email not found. Cannot proceed.");
        return;
      }

      if (!newVoicesName?.trim()) {
        // console.log("Voice name cannot be empty.");
        return;
      }

      const response = await fetch(`${API_URL}/api/voice-memo/edit-voice-name`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voice_id: id, // Voice memo ID
          new_voice_name: newVoicesName, // Updated voice memo name
          email, // User email for activity logging
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // console.log("Voice memo name updated successfully");
        setEditsMode(null); // Exit edit mode
        fetchAudioFiles(); // Refresh the list of voice memos
      } else {
        alert(result.error || "Failed to update voice memo name");
      }
    } catch (error) {
      // console.error("Error updating voice memo name:", error);
      alert("Error updating voice memo name");
    }
  };



  const filteredDesignees = designees.filter((designee) =>
    designee.name?.toLowerCase().includes(MobilesearchQuery.toLowerCase())
  );

  const handleClick = () => {
    // console.log("file hdbjcbhbckdnchbcb", file);
    shareFile(file); // Calling the share function after setting the file ID
  };

  const handleEllipsisClick = (index) => {
    setPopupIndex(index);
    setIsPopupOpen((prev) => (popupIndex === index ? !prev : true));
    setShowPopup(null)
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        if (!data?.user) {
          throw new Error("Invalid response structure");
        }

        setUserData(data);
        // console.log("data", data);
        // console.log("data user", data.user);
        // console.log("user name ");
        setIsMembershipActive(data.user.activeMembership);
        setMembershipDetail(data.user.memberships);
        setUsername(data.user.username);
        setEmailfunc(data.user.email); // Update email state here
        // console.log("username email ", emailfunc);
        // console.log("user name ", data.user.username);
        // console.log("details", data.user.membershipDetail);
        // console.log("membership", data.user.isMembershipActive);
      } catch (err) {
        // console.log(err.message || "Failed to fetch user data");
      }
    };
    getUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isOutside = !dropdownRef.current.some((ref) =>
        ref && ref.contains(e.target)
      );
      if (isOutside) {
        // setExpandedRow(null)
        setEditsMode(null)
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      // console.error("Error fetching designees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedEmail = localStorage.getItem("email");

    // console.log("krcnjrncirc", storedUser);
    // console.log("krcnjrncirc", storedEmail);

    setPeople([{ name: `${username} (you)`, email: storedEmail, role: "Owner" }]);
    setUsers([{ name: `${username} (you)`, email: storedEmail, role: "Owner" }]);
  }, []);

  const handleToggleRecording = () => {
    if (!isRecording && !isStopped) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 256;
            
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;

            const updateFrequencyData = () => {
                analyser.getByteFrequencyData(dataArray);
                setFrequencyData([...dataArray]);  // Update state with real-time data
                requestAnimationFrame(updateFrequencyData);
            };

            updateFrequencyData();

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();
            if (!audioChunks.current) {
                audioChunks.current = [];
            }
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };

            startTimeRef.current = Date.now();
            setIsRecording(true);
            setShowPopup(true);


            if (timerRef.current) {
              clearInterval(timerRef.current);
          }

          timerRef.current = setInterval(() => {
              setDuration((prevTime) => prevTime);
          }, 1000);
        });
    } else if (isRecording) {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/mp3' });
                const url = URL.createObjectURL(audioBlob);
                setAudioURL(url);
                durationRef.current += Math.round((Date.now() - startTimeRef.current) / 1000);
                setIsRecording(false);
                setIsStopped(true);
                cancelAnimationFrame(animationFrameRef.current);

                if (audioContextRef.current) {
                    audioContextRef.current.close();
                }

                if (timerRef.current) {
                  clearInterval(timerRef.current);
                  timerRef.current = null; 
              }
            };
        }
    } else if (isStopped) {
        setIsStopped(false);
        setDuration((prevTime) => prevTime + 1);
    } else {
        clearInterval(timerRef.current);
    }
};

  const handleSubmit = () => {
    // alert(`Designee: ${designee}\nMessage: ${message}\nNotify: ${notify}`);
    setShare(false);
  };

  const handleDesigneeChange = (e) => setDesignee(e.target.value);
  const handleMessageChange = (e) => setMessage(e.target.value);
  const handleNotifyChange = () => setNotify(!notify);
  const fetchAudioFiles = async () => {
    try {
      // const token = Cookies.get('token');
      const token = localStorage.getItem("token");

      if (!token) {
        // console.log("No token found. Please log in.");
        return;
      }

      const response = await axios.get(`${API_URL}/api/voice-memo/get-recordings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setAudioFiles(response.data);
      }
    } catch (error) {
      // console.error('Error fetching audio files:', error);
    }
  };

  // const handlePlay = (audio) => {
  //   if (audioRef.current) {
  //     audioRef.current.src = audio.url;
  //     audioRef.current.play();
  //     setCurrentAudio(audio); // Set the current audio being played
  //   }
  // };

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
  const handlePlay = async (file) => {
    try {
      // const token = Cookies.get('token');
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/voice-memo/listen-recording`,
        { voice_id: file._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowPopup(null)

      const { audio_url, voice_name } = response.data;

      if (!audio_url) {
        // console.error("Audio URL is missing");
        return;
      }

      // Set the current audio for the popup without playing it
      setCurrentAudio({ url: audio_url, name: voice_name });
    } catch (err) {
      // console.error("Error fetching audio:", err);
    }
  };



  const handleDownloadFile = async (fileId) => {
    try {
      const email = users[0]?.email; // Fetch the user's email from `users`

      if (!email) {
        // console.log("User email not found. Cannot proceed.");
        return;
      }

      // Find the file object from the list of files
      const file = audioFiles.find((f) => f._id === fileId);
      if (!file) {
        // console.error("File not found");
        return;
      }
      // Make the API request to get the signed URL for download
      const response = await fetch(`${API_URL}/api/voice-memo/download-voice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voice_id: file._id,
          email: email, // Send the email in the request body
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to get download URL");
      }
      const data = await response.json();
      const { downloadUrl } = data;
      if (downloadUrl) {
        // Trigger the download by creating a link and simulating a click
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = file.voice_name || "download";  // Use the voice name as the file name
        // console.log(file.voice_name);
        link.click();
      } else {
        // console.error("Download URL not found in response");
      }
    } catch (error) {
      // console.error("Error during download:", error);
    }
  };



  const saveRecording = async () => {
    setError("");
    if (audioName.trim() === '') {
        setError('Please enter a name for the recording.');
        return;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        setError('Please stop the recording before saving.');
        return;
    }
    try {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/mp3' }); // Ensure all chunks are merged
        const token = localStorage.getItem("token");
        if (!token) {
            alert('No token found. Please log in.');
            return;
        }
        if (isNaN(duration) || duration <= 0) {
            setError('Invalid audio duration.');
            return;
        }
        const formData = new FormData();
        formData.append('voice_name', audioName);
        formData.append('voice_file', audioBlob);
        formData.append('duration', duration);
        const response = await axios.post(
            `${API_URL}/api/voice-memo/upload-voice`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.status === 200 || response.status === 201) {
            const { fileName, size, date } = response.data;
            setAudioFiles((prev) => [
                ...prev,
                { name: fileName, size, date, url: audioURL },
            ]);
            // Resetting after save
            setAudioURL(null);
            setAudioName('');
            setShowPopup(false);
            setDuration(0);
            audioChunks.current = []; 
            setIsStopped(false);
            setIsRecording(false);
            mediaRecorderRef.current = null;
            startTimeRef.current = null;
            fetchAudioFiles();
        } else {
            // console.error(`Unexpected response: ${response.status}`);
        }
    } catch (error) {
      // console.error('Error saving recording:', error.response || error.message);
        

      if (error.response && error.response.status === 400 && error.response.data.error) {
          alert(error.response.data.error);
      } else {
          alert('Failed to save recording. Please try again.');
      }
    }
};
  // Fetch audio files on component mount
  useEffect(() => {
    fetchAudioFiles();
  }, []);

  const deleteFile = async (folderId) => {
    // const token = Cookies.get('token');
    const token = localStorage.getItem("token");
    const selectedvoice = folderId;

    // console.log("Token:", token);
    // console.log("File ID to delete:", selectedvoice);

    if (!token) {
      setMessage("No token found. Please log in.");
      // console.error("Missing token");
      return;
    }

    if (!selectedvoice) {
      setMessage("No file selected to delete.");
      // console.error("Missing selectedvoice");
      return;
    }

    try {
      // Send the voice_id in the JSON body
      const response = await axios.delete(`${API_URL}/api/voice-memo/delete-voice`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // JSON content type
        },
        data: {
          voice_id: selectedvoice, // Add the voice_id in the body
        },
      });

      setMessage(response.data.message || "File deleted successfully.");
      fetchAudioFiles();
      setDeletebutton(false);
    } catch (error) {
      // console.error("Error response:", error.response || error);
      setMessage(error.response?.data?.message || "Error deleting file.");
    }
  };




  // Helper function to calculate the duration of the audio (returns a number)
  // async function calculateAudioDuration(audioBlob) {
  //   return new Promise((resolve, reject) => {
  //     const audio = new Audio(URL.createObjectURL(audioBlob));
  //     audio.onloadedmetadata = () => {
  //       // Ensure duration is a number before returning it
  //       const duration = audio.duration;
  //       if (!isNaN(duration)) {
  //         resolve(duration);
  //       } else {
  //         reject('Invalid audio duration');
  //       }
  //     };
  //     audio.onerror = (e) => reject('Error loading audio');
  //   });
  // }
  const handleCheckboxChange = (email) => {
    setSelectedEmails((prevSelectedEmails) => {
      if (prevSelectedEmails.includes(email)) {
        return prevSelectedEmails.filter((e) => e !== email); // Unselect if already selected
      } else {
        return [...prevSelectedEmails, email]; // Select if not selected
      }
    });
  };

  const shareFile = async (voice_id) => {
    showLoading();
    if (!selectedEmails.length) {
      // console.error("No designees selected.");
      return;
    }
    const token = localStorage.getItem("token");
    // console.log("token", token);
    // console.log("to_email_id", selectedEmails);
    // console.log("voice_id", voice_id);
    // console.log("notify", notify);
    // console.log("message", message);
    if (!selectedEmails || !token) {
      // console.error("Missing required fields: to_email_id or token.");
      return;
    }


    const data = {
      voice_id,
      to_email_id: selectedEmails, // Pass the array of selected emails  message
      access: "view",
      notify: notify,
      message: message, // Adjust as per your API's requirements
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/designee/share-voices`, // Backend endpoint
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle the response, if needed
      // console.log("File shared successfully:", response.data);
    } catch (error) {
      // console.error("Error sharing file:", error);
    } finally {
      hideLoading();
      setShareFolderModal(false);
    }
  };

  useEffect(() => {
    if (canvasRef.current && frequencyData.length) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);
      frequencyData.forEach((value, index) => {
        const barWidth = (width / frequencyData.length) * 1.5;
        const barHeight = (value / 255) * height;
        const x = index * barWidth;
        ctx.fillStyle = '#4A90E2';
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      });
    }
  }, [frequencyData]);


  // const getAudioDuration = (url) => {
  //   return new Promise((resolve) => {
  //     const audio = new Audio(url);
  //     audio.onloadedmetadata = () => {
  //       resolve(audio.duration); // Get the duration of the audio file
  //     };
  //   });
  // };

  // useEffect(() => {
  //   const fetchDurations = async () => {
  //     const durations  = {};
  //     for (let file of audioFiles) {
  //       const duration = await getAudioDuration(file.url);
  //       durations[file.url] = duration;
  //     }
  //     setAudioDurations(durations);
  //   };

  //   fetchDurations();
  // }, [audioFiles]);

  const handleToggleRow = (_id) => {
    // console.log("Toggling row with id:", _id); // Log the ID when toggling the row
    setExpandedRow((prev) => {
      const newExpandedRow = prev === _id ? null : _id;
      // console.log("Updated expandedRow:", newExpandedRow); // Log the new expandedRow value
      return newExpandedRow;
    });
    setCurrentAudio(null)
    setEditsMode(null)

  };
  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        if (!data?.user) {
          throw new Error("Invalid response structure");
        }

        setUserData(data);
        // console.log("data", data);
        // console.log("data user", data.user);
        setIsMembershipActive(data.user.activeMembership);
        setMembershipDetail(data.user.memberships);
        // console.log("details", data.user.membershipDetail);
        // console.log("membership", data.user.isMembershipActive);
      } catch (err) {
        setError(err.message || "Failed to fetch user data");
      }
    };
    getUserData();
  }, []);

  // const handleMobileSearchChange = (e) => {
  //   MobilesetSearchQuery(e.target.value.toLowerCase());
  // };
  // console.log(audioFiles);
  const filteredMobileFiles = audioFiles.filter((file) =>
    (file.voice_name || '').toLowerCase().includes(MobilesearchQuery.toLowerCase())
  );

  const sortedAudioFiles = audioFiles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  // console.log("sorted files by created_at:", sortedFoldersData);

  const filteredFiles = sortedAudioFiles.filter((file) =>
    (file.voice_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsPopupOpen(false);
        setPopupIndex(null);
        setExpandedRow(null)
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);




  const fetchUsersWithFileAccess = async (fileId) => {
    try {

      setLoading(true);
      setError(null); // Reset error before making request

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token is missing");

      const response = await axios.post(
        `${API_URL}/api/designee/assignments`,
        { voice_id: fileId },
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
      // console.log("userrr", filteredUsers);
    } catch (error) {
      // setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
      setAccess(true);
    }
  };

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
          voice_id: voiceId,   // Include voice_id in the request
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Add token to Authorization header
          },
        }
      );

      if (response.status === 200) {
        // Update the permission locally after a successful API response
        const updatedUsers = [...users];
        updatedUsers[index].permission = permission;
        setUsers(updatedUsers);
        setShowDropdown(false);
        alert("Access level updated successfully");
      }
    } catch (error) {
      // console.error("Error updating permission:", error);
      alert("Failed to update permission. Please try again.");
      setShowDropdown(false);
    }
  };

  const removeUser = async (voiceId, index) => {
    const user = users[index];
    // console.log("fgyuioiuytrertyuio");
    // console.log("idddddddddddddddddddddddddddddd", voiceId);
    // console.log("emailllllllllllllllllllllll", user.email);
    // console.log("edit_access", user.permission);
  
    try {
      const token = localStorage.getItem("token");
  
      // Prepare the data for the DELETE request to the API
      const response = await axios.delete(`${API_URL}/api/designee/delete-voice-file-data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          to_email_id: user.email,  // Pass the email address of the user
          voice_id: voiceId,         // Pass the file_id (you already have this value)
          file_id: null,           // Pass null for the voice_id, as per your API requirements
        },
      });

 
      if (response.status === 200) {
        // Remove the user from the list if the access is removed successfully
        const updatedUsers = users.filter((_, i) => i !== index);
        setUsers(updatedUsers);
        // alert('Access removed successfully');
      }
    } catch (error) {
      // console.error('Error removing user access:', error);
      // alert('Failed to remove access. Please try again.');
    }
  };



  // const updatePermission = (index, permission) => {
  //   const updatedUsers = [...users];
  //   updatedUsers[index].permission = permission;
  //   setUsers(updatedUsers);
  // };

  // const removeUser = (index) => {
  //   const updatedUsers = users.filter((_, i) => i !== index);
  //   setUsers(updatedUsers);
  // };

  return (
    <div className="mt-1 p-2 sm:p-4 max-h-screen bg-white overflow-hidden">

      <div className="w-full mt-2 flex items-center border border-gray-300 rounded-lg p-2 md:hidden">
        <Search className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search"
          className="w-full p-1 bg-transparent outline-none text-black"
          onChange={(e) => MobilesetSearchQuery(e.target.value)}

        />
      </div>

      <div className="flex flex-col ">
        <h1 className="text-2xl font-normal text-[#1F1F1F]">Your Voice Memo</h1>
        <div
          className="bg-[#0067FF] w-52 rounded-2xl my-2 p-2 cursor-pointer space-y-0 sm:space-y-1"


          onClick={() => {
            if (isMembershipActive) {
              setShowPopup(true);
              setCurrentAudio(null)
              setExpandedRow(null)
              setEditsMode(null)
            } else {
              setDeletebutton1(true);
              setCurrentAudio(null)
              setEditsMode(null)
            }
          }}
        >
          <button className="flex items-center  text-white px-2">
            {/* <img src={VoiceLogo} alt="" className="h-12 w-12" /> */}
            <img src={mainmic} alt="" className='h-10' />
            <p className="text-xl">Record Now</p>
          </button>
          <div className="flex justify-between">
            <p className="text-white  text-sm ml-1">Click to record now</p>
            <ArrowRight className="mr-2 text-white" />
          </div>
        </div>
      </div>

      {showPopup && (
        <div className='h-screen w-screen bg-black bg-opacity-40 flex items-center justify-center fixed inset-0 z-20'>
        <div className=" z-40 bg-white p-3 sm:p-6 shadow-lg rounded-lg w-2/3 sm:w-[25%]">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold">
              {isRecording ? 'Recording in Progress' : 'Ready to Record'}
            </h2>
            <div className="cursor-pointer" onClick={handleClosePopup}>
              <X />
            </div>



          </div>
          <p className="mt-2 text-gray-600">
            {isStopped ? 'Click Re-Record to Restart the Recording.' : isRecording ? 'Recording in progress...' : 'Click Start to begin recording.'}
          </p>

          {/* {isRecording && (
            
          )} */}

          {isRecording && (
            <div className="mt-3">
              <canvas ref={canvasRef} className="w-full h-24 bg-gray-100 rounded-md"></canvas>
            </div>
          )}

          <p className="mt-2 text-gray-600">
            Time: {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')}
          </p>

          <button
            onClick={handleToggleRecording}
            className={`mt-4 px-4 py-2 rounded-md text-white w-full ${isRecording || isStopped ? 'bg-[#0067FF]' : 'bg-[#0067FF]'}`}
          >
            {isStopped ? 'Resume' : isRecording ? 'Stop' : 'Start'}
          </button>


          <div className="mt-4">
            <label htmlFor="voice">Enter voice name</label>
            <input
              type="text"
              placeholder="Enter voice memo name"
              value={audioName}
              onChange={(e) => setAudioName(e.target.value)}
              className="p-2 border rounded-md w-full"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>} {/* Inline error message */}
            <button
              onClick={saveRecording}
              className="mt-4 px-4 py-2 bg-[#0067FF] text-white rounded-md w-full"
            >
              Save
            </button>
          </div>

          {/* {!isRecording &&  (
            <div className="mt-4">
              <label htmlFor="voice">Enter voice name</label>
              <input
                type="text"
                placeholder="Enter voice memo name"
                value={audioName}
                onChange={(e) => setAudioName(e.target.value)}
                className="p-2 border rounded-md w-full"
              />
              <button
                onClick={saveRecording}
                className="mt-4 px-4 py-2 bg-[#0067FF] text-white rounded-md w-full"
              >
                Save
              </button>
            </div>
          )} */}
        </div>
        </div>
      )}

      <div className=" block mt-2">
        <h2 className="text-xl font-bold">Voices Library</h2>
      </div>


      <div className=" justify-between items-center mt-8 hidden">
        <h2 className="text-xl font-bold">Voices Library</h2>
        {/* <button
          onClick={() => setViewMode((prev) => (prev === 'list' ? 'grid' : 'list'))}
          className="px-4 py-2 bg-[#0067FF] text-white rounded-md flex"
        >
          {viewMode === 'list' ? <LayoutGrid className="h-5" /> : <Menu className="h-6" />}
          {viewMode === 'list' ? 'Grid View' : 'List View'}
        </button> */}
      </div>


      {/* view voice  */}
      <>
        <div
          ref={(el) => (dropdownRef.current[0] = el)}
          className="mt-2 bg-white hidden md:flex text-left border-collapse overflow-y-scroll max-h-[70vh] pb-[20px]">
          <table className="w-full">
            <thead className='sticky top-0'>
              <tr className="border-t border-b bg-gray-100 text-left text-[0.8rem] md:text-lg">
                <th className="p-3 font-semibold text-[#667085] text-sm">Voice Name</th>
                <th className="p-2 font-semibold text-[#667085] text-sm">Duration</th>
                <th className="p-2 font-semibold text-[#667085] text-sm">Date Uploaded</th>
                <th className="p-2 font-semibold text-[#667085] text-sm">File Size</th>
                <th className="p-2 font-semibold text-[#667085] text-sm"></th>
              </tr>
            </thead>
            <tbody>

              {filteredFiles.map((file, index) => (
                <React.Fragment key={file._id}>
                  {/* Main Row */}
                  <tr
                    className={`text-xs text-[#212636] font-medium sm:text-sm border-b-2 ${expandedRow === file._id ? "bg-blue-100 border-blue-100" : ""
                      } transition-all duration-100`}
                  >
                    <td className="p-0 md:p-4 flex items-center gap-0 md:gap-2">
                      <button
                        className="text-gray-500 hover:text-gray-800"
                        onClick={() => handleToggleRow(file._id)}
                      >
                        <ChevronDown
                          className={`${expandedRow === file._id ? "rotate-180" : ""
                            } h-5 transition-transform`}
                        />
                      </button>

                      {editsMode === file._id ? (
                        <div 
                        ref={(el) => (dropdownRef.current[1] = el)}
                        className="flex items-center  gap-2 border-b-2 border-blue-500 pt-2">
                          <input
                            type="text"
                            value={newVoicesName}
                            onChange={(e) => setNewVoicesName(e.target.value)}
                            className=" rounded px-2 py-1 text-sm w-full bg-transparent outline-none"
                          />
                          <button
                            className="text-blue-500  hover:text-blue-700 px-3 py-1 bg-gray-100 rounded-md bg-transparent"
                            onClick={() => handleSaveEdits(file._id)}
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <h2 className='text-sm font-normal'> {file.voice_name}</h2>

                      )}
                    </td>
                    <td className="p-0 md:p-4 text-sm text-[#212636]">
                      <div
                        className={`bg-[#EEEEEF] rounded-md px-3 py-1 text-sm text-[#212636] inline-block transition-all duration-300 ${expandedRow ? "bg-white" : "bg-[#EEEEEF]"
                          }`}
                      >
                        {file.duration} sec
                      </div>
                    </td>
                    <td className="p-0 md:p-4">
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {file.date_of_upload && !isNaN(new Date(file.date_of_upload))
                          ? new Date(file.date_of_upload).toLocaleString("en-US", {
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
                    </td>
                    <td className="p-0 md:p-4">
                      <span
                        className={`bg-[#EEEEEF] p-2 rounded-md ${expandedRow ? "bg-white" : "bg-[#EEEEEF]"
                          }`}
                      >
                        {file.file_size} Kb
                      </span>
                    </td>
                    <td className="p-0 md:p-4">
                      <button
                        onClick={() => handlePlay(file)}
                        className={`px-2 py-1 bg-[#EEEEEF] text-black font-semibold rounded-md ${expandedRow ? "bg-white" : "bg-[#EEEEEF]"
                          }`}
                      >
                        <span className="flex">
                          <img src={play} alt="" className="h-5 gap-1" />
                          Play
                        </span>
                      </button>
                    </td>
                  </tr>
                  {/* Expanded Row */}
                  {expandedRow === file._id && (
                    <tr className='pb-96'>
                      <td
                        colSpan="5"
                        className="px-4 pb-4  border-r border-blue-100 bg-blue-100 rounded-bl-3xl rounded-br-3xl"
                      >
                        <div className="flex gap-4 items-center">
                          <button
                            className="relative group flex items-center gap-2 text-gray-600 hover:text-blue-500"
                            onClick={() => {
                              setShareFolderModal(true);
                              setFile(file._id);
                            }}
                          >
                            <img src={shareicondesignee} alt="" className="h-4 " />

                            <span className="absolute bottom-[-46px]  left-3/4 transform -translate-x-1/2 hidden group-hover:block bg-white w-24 text-black text-xs py-1 px-2 rounded shadow">
                              Share with Designee
                            </span>
                          </button>
                          <button
                            className="relative group flex items-center gap-2 text-gray-600 hover:text-blue-500"
                            onClick={() => {
                              // console.log("helloooooooo")
                              setEditFileId(file._id);
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
                            onClick={() => handleEdits(file._id, file.voice_name)}

                          >
                            <img src={editicon} alt="" className="h-4 " />
                            {/* <Edit className="h-4" /> */}
                            <span className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-white w-24 text-black text-xs py-1 px-2 rounded shadow">
                              Edit Document
                            </span>
                          </button>
                          <button
                            className="relative group flex items-center gap-2 text-gray-600 hover:text-red-500"
                            onClick={() => {
                              setSelectedFileId(file._id);
                              setDeletebutton(true);
                            }}
                          >
                            <img src={trashicon} alt="" className="h-4 " />
                            {/* <Trash2 className="h-4 text-red-700" /> */}
                            <span className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-white text-black text-xs py-1 px-2 rounded shadow">
                              Delete
                            </span>
                          </button>

                          <button
                            className="relative group flex items-center gap-2 text-gray-600 hover:text-blue-500"
                            onClick={() => handleDownloadFile(file._id)}
                          >
                            <img src={downloadicon} alt="" className="h-4 " />
                            {/* <Download className="h-4" /> */}
                            <span className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-white text-black text-xs py-1 px-2 rounded shadow">
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
                            <FileClock className="h-4 w-4 text-black text-xs" />
                            <span className="absolute  bottom-[-46px] left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-white text-black text-xs py-1 px-2 rounded shadow z-20">
                              Version History
                            </span>
                          </button>
                        </div>


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
          <VersionHistory voiceId={file._id} />
        </div>
      </div>
    </>
  )
}
                      </td>
                    </tr>
                  )}
                </React.Fragment>

              ))}
            </tbody>
          </table>
        </div>
      </>


      <div className="md:hidden grid grid-cols-1 gap-y-3 gap-x-2 mt-2 overflow-y-scroll bg-white max-h-96 scroll-smooth">

        {filteredMobileFiles.map((file, index) => (
          <div
            key={index}
            className="border p-3 sm:p-3 rounded-md flex flex-col justify-between"
          >
            {/* File Header */}
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={play}
                  alt=""
                  className="h-6"
                  onClick={() => handlePlay(file)}
                />

                {editsMode === file._id ? (
                  <div 
                  ref={(el) => (dropdownRef.current[0] = el)}
                  className="flex items-center gap-1 border-b-2 border-blue-500 pt-2">
                    <input
                      type="text"
                      value={newVoicesName}
                      onChange={(e) => setNewVoicesName(e.target.value)}
                      className="rounded px-2 py-1 text-sm w-full bg-transparent outline-none"
                    />
                    <button
                      className="text-blue-500 hover:text-blue-700 px-1 py-1 bg-gray-100 rounded-md bg-transparent"
                      onClick={() => handleSaveEdits(file._id)}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <h3 className="font-bold text-xl">{file.voice_name}</h3>
                )}
              </div>

              {/* Ellipsis Icon */}
              <div className="relative flex">
                <p className="text-gray-700 text-sm mr-4 text-center pt-1 w-12 bg-[#EEEEEE] rounded-lg">
                  {file.file_size}
                </p>
                <button
                  className="cursor-pointer"
                  onClick={() => handleEllipsisClick(index)}
                >
                  <EllipsisVertical />
                </button>

                {/* Popup Menu */}
                {isPopupOpen && popupIndex === index && (
                  <motion.div
                    ref={popupRef}
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className="absolute top-8 right-0 z-10 bg-white shadow-md rounded-md p-2 w-40 flex flex-col gap-2"
                  >
                    <div className="flex flex-col gap-4 ">
                      <button
                        className="relative group flex items-center gap-2 text-gray-600 hover:text-blue-500"
                        onClick={() => {
                          setShareFolderModal(true);
                          setFile(file._id);
                        }}
                      >
                        <img src={shareicondesignee} alt="" className="h-4 " />

                        <span className='text-xs  font-semibold hover:text-blue-600'>
                          Share with Designee
                        </span>
                      </button>
                      <button
                        className="relative group flex items-center gap-2 text-gray-600 hover:text-blue-500"
                        onClick={() => {

                          setEditFileId(file._id);
                          fetchUsersWithFileAccess(file._id);
                          // console.log("Editing File ID:", file._id);
                        }}
                      >
                        <img
                          src={foldericon}
                          alt=""
                          className="h-4"
                        />
                        <span className='text-xs font-semibold hover:text-blue-600'>
                          Grant Access
                        </span>
                      </button>
                      <button
                        className="relative group flex items-center gap-2 text-gray-600 hover:text-blue-500"
                        onClick={() => handleEdits(file._id, file.voice_name)}

                      >
                        <img src={editicon} alt="" className="h-4 " />
                        {/* <Edit className="h-4" /> */}
                        <span className='text-xs font-semibold hover:text-blue-600'>
                          Edit Document
                        </span>
                      </button>
                      <button
                        className="relative group flex items-center gap-2 text-gray-600 hover:text-red-500"
                        onClick={() => {
                          setSelectedFileId(file._id);
                          setDeletebutton(true);
                        }}
                      >
                        <img src={trashicon} alt="" className="h-4 " />
                        {/* <Trash2 className="h-4 text-red-700" /> */}
                        <span className='text-xs font-semibold hover:text-red-600'>
                          Delete
                        </span>
                      </button>

                      <button
                        className="relative group flex items-center gap-2 text-gray-600 hover:text-blue-500"
                        onClick={() => handleDownloadFile(file._id)}
                      >
                        <img src={downloadicon} alt="" className="h-4 " />
                        {/* <Download className="h-4" /> */}
                        <span className='text-xs font-semibold hover:text-blue-600'>
                          Download
                        </span>
                      </button>

                      <button
                        className="relative group flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-blue-500"
                        onClick={() => {
                          setVirsonHistory(true);
                          // handleDownloadFile(file._id)
                        }
                        }
                      >
                        <FileClock className="h-4 w-4 text-black " />

                        Version History

                      </button>

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
                                <VersionHistory voiceId={file._id}/>
                              </div>
                            </div>
                          </>
                        )
                      }
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* File Details */}
            <div className="flex justify-around mt-3">
              <p className="text-sm text-gray-700 mt-1">
                {file.date_of_upload &&
                  !isNaN(new Date(file.date_of_upload)) ? (
                  new Date(file.date_of_upload).toLocaleString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })
                ) : (
                  "Invalid Date"
                )}
              </p>

              <p className="text-sm text-gray-700  mt-1">{file.duration} sec</p>
            </div>
          </div>
        ))}
      </div>






      {currentAudio && (
        <div className='fixed inset-0 bg-black h-screen w-screen flex justify-center items-center bg-opacity-50'>
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
                Are you sure you want to delete this Recording?
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
                  deleteFile(selectedFileId);
                  setDeletebutton(false);
                }}
                className="bg-[#0067FF] text-white px-6 py-2 rounded flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Yes
              </button>
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
                onChange={(e) => MobilesetSearchQuery(e.target.value)}
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
              <NavLink
                to="/Subscription">
                <button className="bg-[#0067FF] text-white px-6 py-2 rounded flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => setDeletebutton1(false)}>
                  Take Membership
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      )}
      {access && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 ">
          <div className="mt-4 bg-white p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">
                Share <span className="text-blue-500">File</span>
              </h2>

              <button
                onClick={() => setAccess(false)}
                className="p-2 rounded-full "
              >
                <X className="w-6 h-4 text-gray-700 hover:text-red-500" />
              </button>
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
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
                            <p
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                              onClick={() => updatePermission(editFileId, user.email, "View", index)}
                            >
                              Only View
                            </p>

                            <p
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                // Check the file._id in the console
                                // console.log("File editFileId: ", editFileId);  // Log file._id to the console
                                updatePermission(editFileId, user.email, "Edit", index);
                              }}
                            >
                              Edit Access
                            </p>

                            <p
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                              onClick={() => removeUser(editFileId, index)}
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
    </div>
  );

};
export default Voicememo;
