import React, { useState, useEffect,useRef } from "react";
import DropboxChooser from "react-dropbox-chooser";
import dropbox from "../../assets/logos_dropbox.png";
import axios from "axios";
import { API_URL } from "./Apiconfig.jsx";

const DROPBOX_APP_KEY = "oy5t6b3unmpbk0b";

const DropboxPicker = ({ folderId, fetchFiles, setShowLoadingIndicator , setDropBox }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const dropboxRef = useRef(null);
  // Retrieve the stored Dropbox access token
  const accessToken = localStorage.getItem("dropboxToken");

  useEffect(() => {
    if (!accessToken) {
console.log("accesstoken",accessToken);
    }
  }, []);



  const handleClick = () => {
    if (dropboxRef.current) {
      dropboxRef.current.querySelector("button")?.click();
    }
  };
  const onCancel = () => {
    console.log("⚠️ User canceled the operation.");
    setShowLoadingIndicator(false);
  };

  const onSuccess = async (selectedFiles) => {

    console.log("📁 Selected files:", selectedFiles);
    const fileId = selectedFiles[0].id;
    console.log("Selected file ID:", fileId);
    
    try {
      const metadataResponse = await axios.post(
        "https://api.dropboxapi.com/2/files/get_metadata",
        { path: `id:${fileId.replace("id:", "")}` },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const filePath = metadataResponse.data.path_display;
      console.log("Resolved file path:", filePath);
      const dropboxApiArg = JSON.stringify({ path: filePath });
      const response = await axios.post(
        "https://content.dropboxapi.com/2/files/download",
        null,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Dropbox-API-Arg": dropboxApiArg,
            "Content-Type": "application/octet-stream",
          },
          responseType: "blob",
        }
      );
      const fileBlob = response.data;
      const fileObject = new File([fileBlob], selectedFiles[0].name, {
        type: selectedFiles[0].icon.split(":")[1] || "application/octet-stream",
      });
      setSelectedFile(fileObject);
      console.log("📁 File ready for upload:", fileObject);
      uploadFileToServer(fileObject);
    } catch (err) {
      console.error("Error retrieving file:", err.response?.data || err.message);
      setUploadStatus("Error downloading file from Dropbox.");
    }
  };

  const uploadFileToServer = async (file) => {
    setShowLoadingIndicator(true);
    const tokenn = localStorage.getItem("token");
    
    if (!file) {
      setUploadStatus("No file selected for upload.");
      return;
    }
    if (!folderId) {
      setUploadStatus("Folder ID is required.");
      return;
    }

    setIsUploading(true);
    setUploadStatus("Uploading file...");

    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("folder_id", folderId);
      formData.append("tags", JSON.stringify(["dropbox-upload"]));
      formData.append("description", "");

      const response = await axios.post(`${API_URL}/api/upload-file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${tokenn}`,
        },
      });

      if (response.status === 201) {
        console.log("✅ File uploaded successfully:", response.data);
        setUploadStatus("File uploaded successfully!");
        fetchFiles();
      } else {
        console.error("❌ Upload failed:", response.data);
        setUploadStatus("File upload failed.");
        alert("File upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      setUploadStatus("Error uploading file.");
    } finally {
      setIsUploading(false);
      setShowLoadingIndicator(false);
    }
  };

  return (
    <> 

  {accessToken ?
  <div className="flex border border-slate-500 rounded-lg p-1 px-4 md:px-2 md:p-2 text-xs md:text-sm font-semibold cursor-pointer text-gray-500"  onClick={handleClick} >
   <DropboxChooser
    appKey={DROPBOX_APP_KEY} 
    success={onSuccess} 
    cancel={onCancel}   
    multiselect={false} 
  >
    
    <div className="flex items-center">
      <img src={dropbox} className="h-5 w-5 mr-2 mt-2" alt="Dropbox" />
      <h1 className="text-sm font-semibold hidden sm:inline mt-1">Dropbox</h1>
    </div>
  
  </DropboxChooser>
  </div>

  :
  <div className="flex border border-slate-500 rounded-lg p-1 md:p-2 text-xs md:text-sm font-semibold cursor-pointer text-gray-500" >
  <div className="flex items-center" onclick={()=>setDropBox(true)}>
    <img src={dropbox} className="h-6 w-6 mr-2" alt="Dropbox" />
    <h1 className="text-sm font-semibold hidden sm:inline">Dropbox</h1>
  </div>
  </div>
}


{/* {uploadStatus && <p className="mt-2">{uploadStatus}</p>} */}
</>
  );
};
export default DropboxPicker;