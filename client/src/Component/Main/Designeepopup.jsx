import { useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/Apiconfig";
const DesignerPopup = ({ isVisible, onClose }) => {
  // Declare hooks at the top level
  const [designeeName, setDesigneeName] = useState(""); // Input for designee name
  const [designeePhone, setDesigneePhone] = useState(""); // Input for designee phone number
  const [designeeEmail, setDesigneeEmail] = useState(""); 
  const [showDesignerPopup, setShowDesignerPopup] = useState(false);
  const [designers, setDesigners] = useState([]);// Input for designee email
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
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
    const token = localStorage.getItem("token");
    if (!designeeName || !designeePhone || !designeeEmail) {
      alert("Please fill in all fields.");
      return;
    }
    const formData = new FormData();
    formData.append("profilePicture", file);
    formData.append("designeeName", designeeName);
    formData.append("designeePhone", designeePhone);
    formData.append("designeeEmail", designeeEmail);
    
    try {
      const response = await axios.post(`${API_URL}/api/designee/add-designee`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          
        },
      });
      if (response.status === 200) {
        alert(response.data.message);
        setShowDesignerPopup(false); // Close the popup on success
      } else {
        alert("Error: " + response.data.message);
      }
    } catch (error) {
      // console.error("Error adding designee:", error);
      alert("Error adding designee. Please try again later.");
    } finally {
  
    }
  };
  // Return null early if not visible
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-semibold">Add Designee</h3>
          <button onClick={onClose} className="text-gray-500">
            ✕
          </button>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-24 h-24 rounded-full border-dashed border-2 flex items-center justify-center text-gray-500"
            onClick={() => document.getElementById("file-input").click()}>
              {preview ? (
          // Display the preview image if available
          <img
            src={preview}
            alt="Selected Preview"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          // Show the camera icon or 📷 emoji when no image is selected
          <span>📷</span>
        )}
              <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  className="hidden" // Hide the input element
                  onChange={handleFileChange} // Handle file change event
                />
            </div>
          </div>
          <label className="block mb-2 text-sm font-medium">Enter Designee Name</label>
          <input
            type="text"
            placeholder="Designee Name"
            value={designeeName}
            onChange={(e) => setDesigneeName(e.target.value)}
            className="border p-2 rounded w-full mb-3"
          />
          <label className="block mb-2 text-sm font-medium">Enter Designee Phone Number</label>
          <input
            type="text"
            placeholder="Designee Phone Number"
            value={designeePhone}
            onChange={(e) => setDesigneePhone(e.target.value)}
            className="border p-2 rounded w-full mb-3"
          />
          <label className="block mb-2 text-sm font-medium">Enter Designee Email</label>
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
  );
};
export default DesignerPopup;

