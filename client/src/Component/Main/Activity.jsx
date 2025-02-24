import React, { useEffect, useState, useRef } from "react";
import { Search, FileText } from "lucide-react";
import { API_URL } from "../utils/Apiconfig";
import axios from "axios";


function Activity({ searchQuery,setSearchQuery }) {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem("token"); // Get JWT token from local storage
                const response = await axios.get(`${API_URL}/api/history/history-details`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                let formattedData = [];

                response.data.history.forEach((item) => {
                    if (item.type === "session") {
                        formattedData.push({
                            type: "session",
                            title: `logged in from ${item.location || "Unknown"}`,
                            description: `IP: ${item.ip}, Device: ${item.deviceId || "Unknown"}`,
                            time: new Date(item.createdAt).toLocaleString(),
                            timeAgo: new Date(item.createdAt).toDateString(),
                            sortTime: new Date(item.lastActivityAt).getTime() // Sorting by lastActivityAt for sessions
                        });
                    } else if (item.type === "activity") {
                        item.fileActivities.forEach((fa) => {
                            formattedData.push({
                                type: "activity",
                                title: "File Activity",
                                description: `${fa.action} (BY: ${fa.toEmail})`,
                                time: new Date(fa.timestamp).toLocaleString(),
                                timeAgo: new Date(fa.timestamp).toDateString(),
                                sortTime: new Date(fa.timestamp).getTime() // Sorting by timestamp for activities
                            });
                        });

                        item.voiceActivities.forEach((va) => {
                            formattedData.push({
                                type: "activity",
                                title: "Voice Activity",
                                description: `${va.action} (BY: ${va.toEmail})`,
                                time: new Date(va.timestamp).toLocaleString(),
                                timeAgo: new Date(va.timestamp).toDateString(),
                                sortTime: new Date(va.timestamp).getTime() // Sorting by timestamp for activities
                            });
                        });
                    }
                });

                // Sort history from latest to oldest
                formattedData.sort((a, b) => b.sortTime - a.sortTime);

                setHistoryData(formattedData);
            } catch (error) {
                // console.error("Error fetching history details:", error);
                setError("Failed to load activity history.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const filteredHistory = historyData.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <p>Loading history...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className=" lg:px-10 px-2 sm:px-2 md:px-4 py-6">
        {/* Search Bar */}
        <div className="md:hidden h-14 p-2 w-full border-2 border-gray-200 rounded-xl md:mt-4 mb-3 flex">
            <Search className="mt-1.5 text-gray-500" />
            <input
                type="text"
                placeholder="Search"
                className="w-full h-full p-4 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>

        <h2 className="text-3xl font-serif mb-4">See All Activity</h2>

        <div className="space-y-4 max-h-[90vh] mt-2 bg-white overflow-y-scroll">
            {filteredHistory.map((item, index) => (
                <div
                    key={index}
                    className="flex flex-col md:flex-row items-start justify-between border rounded-lg p-4 shadow-sm bg-white"
                >
                    <div>
                        <h3 className="text-lg font-medium mb-1 flex items-center gap-2">
                            <FileText className="text-blue-500 w-5 h-5" /> {item.title}
                        </h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <p className="hidden md:block text-[0.9rem] text-gray-500">{item.timeAgo}</p>
                    </div>

                    <div className="flex gap-2">
                        <p className="block md:hidden text-[0.9rem] text-gray-500">{item.timeAgo}</p>
                        <p className="text-gray-800 md:text-sm text-[0.9rem] font-medium">{item.time}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
    );
}

export default Activity;