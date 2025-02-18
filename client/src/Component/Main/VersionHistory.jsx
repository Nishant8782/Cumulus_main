import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileText } from "lucide-react";
import { API_URL } from "../utils/Apiconfig";
const VersionHistory = ({ fileId, voiceId }) => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
//   console.log("version file iddddddddddddd", fileId);
  useEffect(() => {
    const fetchActivityDetails = async () => {
      try {
        const response = await axios.post(`${API_URL}/api/history/activity-details`, {
          fileId,
          voiceId,
        });
        const { activities } = response.data;
        // Convert response to match the existing UI format

        const sortedActivities = activities.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        const formattedData = sortedActivities.map((activity, index) => ({
          id: index + 1,
          title: activity.type === "file" ? "File Activity" : "Voice Activity",
          description: `${activity.userEmail} performed ${activity.action}`,
          timeAgo: new Date(activity.timestamp).toLocaleString(),
          timestamp: new Date(activity.timestamp).toLocaleTimeString(),
          image: "https://storage.googleapis.com/a1aa/image/default-user.png",
        }));
        setHistoryData(formattedData);
      } catch (err) {
        console.error("Error fetching activity details:", err);
        setError("Failed to load activity history.");
      } finally {
        setLoading(false);
      }
    };
    fetchActivityDetails();
  }, [fileId, voiceId]);
  return (
    <div className="bg-white mt-2 min-h-[90vh] max-h-[50vh] mb-10 md:max-h-screen flex md:max-w-[500px] max-w-80 md:max-w-screen overflow-y-scroll p-6">
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold text-blue-600">Version History</h1>
          <div className="flex items-center bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-sm">
            {historyData.length}
          </div>
        </div>
        {loading ? (
          <p className="text-gray-500">Loading activity history...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : historyData.length === 0 ? (
          <p className="text-gray-500">No activity found.</p>
        ) : (
          <div className="space-y-4 md:w-[400px]">
            {historyData.map((item) => (
              <div key={item.id} className="bg-white border overflow-hidden md:w-[400px] rounded-lg p-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  {/* <img src={item.image} alt="User profile" className="w-10 h-10 rounded-full" /> */}
                  
                  <div>
                    <div className="flex">
                    <FileText className="w-5 h-5 mb-2 mt-1 mr-3 rounded-full"/>
                    <h2 className="font-semibold mb-2">{item.title}</h2></div>
                    <p className="text-gray-600 max-w-32  ">{item.description}</p>
                  </div>
                </div>
                <div className="text-right mt-12 md:mt-6">
                  <p className="text-gray-500 max-w-24">{item.timeAgo}</p>
                  {/* <p className="text-gray-500">{item.timestamp}</p> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default VersionHistory;