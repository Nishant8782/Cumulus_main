import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, Grid, List } from "lucide-react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { API_URL } from "../utils/Apiconfig";


const Afterlifeaccess = () => {
  const [isGridView, setIsGridView] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [queryParams, setQueryParams] = useState({ email: "", otp: "" });
  const [expandedItemId, setExpandedItemId] = useState(null);
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const closePopup = () => {
    setShowPopup(false);
  };

  const sharedAllFiles = async (email) => {
    const token = localStorage.getItem("token");

    try {
      const payload = { to_email_id: email };
      const headers = token
        ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        : { 'Content-Type': 'application/json' };

      const response = await axios.post(`${API_URL}/api/designee/get-shared-voices-cumulus`, payload, { headers });

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
    const emailFromUrl = queryParams.get('email');
    if (emailFromUrl) {
      setQueryParams((prevParams) => ({ ...prevParams, email: emailFromUrl }));
      setEmail(emailFromUrl);
    }
  }, [location]);

  useEffect(() => {
    sharedAllFiles(email);
  }, [email]);

  const toggleDropdown = (username, accessType) => {
    const key = `${username}-${accessType}`;
    setExpandedItemId(expandedItemId === key ? null : key);
  };

  const groupedFiles = sharedFiles.reduce((acc, file) => {
    const username = file?.from_user?.username || "Unknown User";
    const accessType = file.access || "view";

    if (!acc[username]) {
      acc[username] = { username, files: { view: [], edit: [] } };
    }

    acc[username].files[accessType].push(file);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl">After Life Access</h1>
          <button
            onClick={() => setIsGridView(!isGridView)}
            className="p-2 bg-gray-200 rounded-md hover:bg-gray-300 sm:hidden"
          >
            {isGridView ? <List size={20} /> : <Grid size={20} />}
          </button>
        </div>

        <div className="sm:block">
          {!isGridView ? (
            <div>
              <div className="flex">
                <h1 className="text-lg font-semibold text-blue-600 border-b-4 border-blue-500 py-4">Shared Users</h1>
                <span className="ml-2 py-2 px-4 mt-3 mb-2 bg-gray-200 rounded-full text-xl">
                  {sharedFiles?.length}
                </span>
              </div>

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
                  {Object.values(groupedFiles).map(({ username, files }) =>
                    Object.entries(files).map(([accessType, files]) =>
                      files.map((file, index) => (
                        <tr key={`${username}-${accessType}-${index}`}>
                          <td className="px-2 py-2">{username}</td>
                          <td className="px-2 py-2">{new Date(file.created_at).toLocaleString()}</td>
                          <td className="px-2 py-2">{file.voice_name || "Unknown"}</td>
                          <td className="px-2 py-2">{accessType}</td>
                        </tr>
                      ))
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {sharedFiles.map((file, index) => (
                <div key={index} className="p-4 bg-gray-100 rounded-md shadow-md">
                  <p><strong>Username:</strong> {file.from_user?.username || "Unknown"}</p>
                  <p><strong>Voice Name:</strong> {file.voice_name || "Unknown"}</p>
                  <p><strong>Access:</strong> {file.access}</p>
                  <p><strong>Shared At:</strong> {new Date(file.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Afterlifeaccess;
