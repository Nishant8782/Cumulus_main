import React, { useEffect, useState } from "react";
import { API_URL } from "./Apiconfig.jsx";
import google from "../../assets/google.png";

const CLIENT_ID = "938429058016-5msrkacu32pvubd02tpoqb6vpk23cap3.apps.googleusercontent.com";
const API_KEY = "AIzaSyDer1GWtMzvobF0OMzqRCYUlUR5dzWIKtk";
const SCOPES = "https://www.googleapis.com/auth/drive.readonly";
const GoogleDrivePicker = ({ folderId, fetchFiles, setShowLoadingIndicator ,setGoogleDrive }) => {
  const [token, setToken] = useState(localStorage.getItem("googleDriveToken"));
  const [pickerLoaded, setPickerLoaded] = useState(false);




 

  useEffect(() => {
    loadPickerAPI();
  }, []);

  useEffect(() => {
    const remove =  localStorage.removeItem("googleToken");
    console.log("tokeeenn",remove);
  }, []);

  const loadPickerAPI = async () => {
    if (window.google && window.google.picker) {
      setPickerLoaded(true);
      return;
    }
  
    if (!document.getElementById("google-picker-script")) {
      const script = document.createElement("script");
      script.id = "google-picker-script";
      script.src = "https://apis.google.com/js/api.js";
      script.onload = () => {
        window.gapi.load("picker", () => {
          console.log("✅ Google Picker API loaded.");
          setPickerLoaded(true);
        });
      };
      script.onerror = () => {
        console.error("❌ Failed to load Google Picker API script.");
        setPickerLoaded(false);
      };
      document.body.appendChild(script);
    } else {
      console.log("⚠️ Google Picker API script already loading.");
    }
  };
  
  

  const handleAuth = () => {
    console.log("1");
    if (!pickerLoaded) {
      console.error("❌ Google Picker API is not loaded yet.");
      return;
    }
    console.log("tokeeenn",token);
    console.log("2");
    if (token) {
      console.log("3");
      setShowLoadingIndicator(false);
      openPicker(token);
    } else {
      console.log("4");
      setShowLoadingIndicator(false);
      setGoogleDrive(true);
   
    }
  };
  
  
  const fetchFileFromGoogleDrive = async (fileId, accessToken, mimeType) => {
    try {
      let driveUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
      const googleDocsFormats = {
        "application/vnd.google-apps.document": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.google-apps.spreadsheet": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.google-apps.presentation": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.google-apps.drawing": "image/png",
      };
      if (googleDocsFormats[mimeType]) {
        driveUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=${encodeURIComponent(googleDocsFormats[mimeType])}`;
      }
      const response = await fetch(driveUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) {
        console.error("❌ Failed to fetch file:", await response.text());
        return null;
      }
      return await response.blob();
    } catch (error) {
      console.error("🚨 Error fetching file:", error);
      return null;
    }
    finally{
      setShowLoadingIndicator(false);
    }
  };
  
  const uploadFileToSystem = async (fileBlob, fileName) => {
    setShowLoadingIndicator(true);
    const tokenn = localStorage.getItem("token");
    try {
      const formData = new FormData();
      if (folderId === "1" ||folderId === "0" ) {
        setShowLoadingIndicator(false);
        alert("No Folder is selected");

        return;
      }
      formData.append("files", fileBlob, fileName);
      formData.append("folder_id", folderId);
      formData.append("tags", JSON.stringify(["google-drive-upload"]));
      formData.append("description", "");
      const response = await fetch(`${API_URL}/api/upload-file`, {
        method: "POST",
        headers: { Authorization: `Bearer ${tokenn}` },
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        console.log("✅ File uploaded successfully:", result);
        setShowLoadingIndicator(false);
        fetchFiles();
      } else {
        console.error("❌ Upload failed:", result);
        alert(`File upload failed: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("🚨 Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    } finally {
      setShowLoadingIndicator(false);
    }
  };
  
  const openPicker = (accessToken) => {
    if (!pickerLoaded) {
      console.error("❌ Google Picker API not loaded yet.");
      return;
    }
    
    const picker = new window.google.picker.PickerBuilder()
      .addView(window.google.picker.ViewId.DOCS)
      .setOAuthToken(accessToken)
      .setDeveloperKey(API_KEY)
      .setCallback(async (data) => {
        // Hide loading indicator when picker is closed (canceled)
        if (data.action === window.google.picker.Action.CANCEL) {
          console.log("📂 Picker was closed without selecting a file.");
          setShowLoadingIndicator(false);
          return;
        }
  
        if (data.action === window.google.picker.Action.PICKED) {
          const selectedFile = data.docs[0];
          console.log("📂 Selected file:", selectedFile);
          const fileId = selectedFile.id;
          const originalFileName = selectedFile.name;
          const mimeType = selectedFile.mimeType;
  
          const googleDocsFormats = {
            "application/vnd.google-apps.document": "docx",
            "application/vnd.google-apps.spreadsheet": "xlsx",
            "application/vnd.google-apps.presentation": "pptx",
            "application/vnd.google-apps.drawing": "png",
          };
          const fileExtension = googleDocsFormats[mimeType] || mimeType.split("/")[1] || "";
          const finalFileName = fileExtension ? `${originalFileName}.${fileExtension}` : originalFileName;
          const fileBlob = await fetchFileFromGoogleDrive(fileId, accessToken, mimeType);
          if (!fileBlob) {
            console.error("❌ Failed to download file from Google Drive.");
            setShowLoadingIndicator(false);
            return;
          }
          await uploadFileToSystem(fileBlob, finalFileName);
        }
      })
      .build();
    
    picker.setVisible(true);
  };
  

  return (
    <div>
      <div className="flex border border-slate-500 rounded-lg p-2 md:p-2 text-sm md:text-sm font-semibold cursor-pointer text-gray-500" onClick={handleAuth}>
        <img src={google} className="h-6 w-6 mr-2 mt-0.5 ml-1" />
        <button >
          <h1 className="mt-1 md:mt-0 sm:inline hidden">Google Drive</h1>
        </button>
      </div>
    
    </div>
  );
};


export default GoogleDrivePicker;
