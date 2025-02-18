import { useState, useEffect } from "react";
import { API_URL } from "../utils/Apiconfig";
import { FaPen } from "react-icons/fa";

const GainAccess = ({ onClose, onVerified }) => {
  const [socialSecurityPass, setSocialSecurityPass] = useState("");
  const [socialSecurityNumber, setSocialSecurityNumber] = useState("");
  const [socialSecurityPass2, setSocialSecurityPass2] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!socialSecurityPass) {
      setMessage("Provide Social Security Pass");
      return;
    }
    
    if (socialSecurityPass !== socialSecurityPass2) {
      setMessage("Please Confirm Social Security Pass");
      return; // Ensure the function stops execution if passwords don't match
    }
  
    setLoading(true);
    setMessage("");
  
    try {
      const response = await fetch(`${API_URL}/api/gain-access/set-social-info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          socialSecurityPass,
          socialSecurityNumber,
          homeAddress,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage("Social info updated successfully.");
        setTimeout(() => {
          onVerified(); // Trigger success callback
          onClose(); // Close modal
        }, 1500);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Error updating information.");
    }
  
    setLoading(false);
  };
  

  return (
    <div>

    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-11/12 max-w-md rounded-lg shadow-lg p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Sensitive Personal Information</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-times"></i>
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
  <label className="block text-gray-700 mb-2">Confirm your  Social Security Pass</label>
        <input
          type="password"
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
          value={socialSecurityPass2}
          onChange={(e) => setSocialSecurityPass2(e.target.value)}
        />
        <label className="block text-gray-700 mb-2">Enter Social Security Number</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
          value={socialSecurityNumber}
          onChange={(e) => setSocialSecurityNumber(e.target.value)}
        />

        <label className="block text-gray-700 mb-2">Enter Home Address</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
          value={homeAddress}
          onChange={(e) => setHomeAddress(e.target.value)}
        />

        {message && <p className="text-red-500 mb-2">{message}</p>}

        <button
          className="w-full bg-blue-600 text-white rounded-lg py-2 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Updating..." : "Confirm"}
        </button>
      </div>
    </div>
</div>
  );
};

export default GainAccess;
