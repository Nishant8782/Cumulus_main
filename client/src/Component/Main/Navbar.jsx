
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Search, Bell, ZapIcon, LogOut, Trash2 } from "lucide-react";
import ClockClockwise from "../../assets/ClockClockwise.png";
import { API_URL } from "../utils/Apiconfig";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { motion,AnimatePresence  } from "framer-motion";
import profile from "../../assets/profile.jpg";
import MobileSidebar from "../../Component/Main/MobileSidebar";
import fetchUserData from "./fetchUserData";
import { UserContext } from '../utils/UserContext';
import { ProfileContext } from '../utils/ProfileContext';
import profile1 from '../../assets/profile.png'
import { images } from "mammoth";
const Navbar = ({ onFolderSelect, setSearchQuery }) => {
    const [notificationbar, setNotifiationbar] = useState(false);
    const notificationRef = useRef(null);
    const [showSearch, setShowSearch] = useState(false);
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [isMembershipActive, setIsMembershipActive] = useState(false);
    // const [username, setUsername] = useState("");
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
    const { username } = useContext(UserContext);
    const { profilePicture } = useContext(ProfileContext);
    const [notification, setNotification] = useState([]);
    const navigate = useNavigate();
    const handlenotificationbar = () => {
        setNotifiationbar((prevState) => !prevState);
    };
    const gotoprofile = () => {
        navigate("/my-profile"); // Navigate to the "About" page
    };
    const dropdownVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
    };
    // const getUserData = async () => {
    //     try {
    //         const data = await fetchUserData();
    //         if (!data?.user) {
    //             throw new Error("Invalid response structure");
    //         }
    //         setUserData(data);
    //         setIsMembershipActive(data.user.activeMembership);
    //         // setUsername(data.user.username);
    //     } catch (err) {
    //         setError(err.message || "Failed to fetch user data");
    //     }
    // };
    // Fetch the profile picture when the component mounts
    // const fetchProfilePicture = async () => {
    //     try {
    //       const response = await axios.get(`${API_URL}/api/auth/get-profile-picture`, {
    //         headers: {
    //           Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store the token in localStorage
    //         },
    //       });
    //     //   setProfilePicture(response.data.profilePicture); // Set the profile picture URL in state
    //     } catch (error) {
    //       console.error("Error fetching profile picture:", error);
    //     }
    //   };
    // useEffect(() => {
    //     // getUserData();
    //     fetchProfilePicture();
    //   }, []); 
    const handleMarkAsRead = () => {
        setHasUnreadNotifications(false); // Mark all as read

        setNotifiationbar(false);
    };
    const handleWatchClick = () => {
        navigate('/activity');
    };
    async function logout() {
        try {
            // const token = Cookies.get("token");
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found. Please log in again.");
            }
            const apiUrl = `${API_URL}/api/auth/signout`;
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };
            const response = await fetch(apiUrl, { method: "POST", headers });
            if (!response.ok) {
                throw new Error("Failed to log out. Please try again.");
            }
            Cookies.remove("token");
            navigate("/Login");
        } catch (error) {
            // console.error(error);
        }
    }
    // const toggleDropdown = () => {
    //     setIsProfileDropdownOpen(!isProfileDropdownOpen);
    // };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target) &&
                !event.target.closest(".bell-button")
            ) {
                setNotifiationbar(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem("token"); // Assuming you store the JWT in localStorage
                const response = await fetch(`${API_URL}/api/history/history-details`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // Send token for authentication
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setNotification(data.history);
                } else {
                    // console.error("Error fetching history:", data.message);
                }
            } catch (error) {
                // console.error("Failed to fetch history:", error);
            }
        };
        fetchHistory();
    }, []);
    return (
        <nav className="flex items-center justify-between px-0 md:px-8 py-3 bg-white shadow-md relative">
            <div className="md:hidden">
                <MobileSidebar onFolderSelect={onFolderSelect} />
            </div>
            <div className="flex-grow md:mx-4">
                <div className="hidden md:flex items-center">
                    <Search className="text-gray-500 ml-2" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="flex-grow px-3 py-2 rounded-md focus:outline-none"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4 px-3 relative">
                {isMembershipActive && (
                    <Link to="/subscription">
                        <span className="flex border-2 border-blue-500 p-0.5 rounded-sm cursor-pointer">
                            <ZapIcon className="h-5 w-5 md:h-6 md:w-6 fill-blue-500 stroke-none" />
                            <button className="text-blue-500 text-xs md:text-sm">
                                Subscribe
                            </button>
                        </span>
                    </Link>
                )}
                <span
                    onClick={handleWatchClick}
                    className="cursor-pointer"
                >
                    <img src={ClockClockwise} alt="Clock Icon" className="h-7 w-7" />
                </span>
                <div className="relative">
            {/* Bell Icon */}
            <motion.button
                onClick={handlenotificationbar}
                className="p-2 rounded-full hover:bg-gray-200 focus:outline-none bell-button"
                whileTap={{ scale: 0.9 }}  
                initial={{ scale: 1 }}
                animate={{ scale: notificationbar ? 1.2 : 1 }}
                transition={{ type: "spring", stiffness: 500 }}
            >
                <Bell className="text-gray-700 w-6 h-6" />
                {/* Red Dot for Unread Notifications */}
    {hasUnreadNotifications && (
        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
    )}
            </motion.button>
            
              <AnimatePresence>
                {notificationbar && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 bg-gray-800 z-40"
                    />
                )}
            </AnimatePresence>
             
            {/* Notification Dropdown */}
            {notificationbar && (
                <motion.div
                    ref={notificationRef}
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-10 -right-10 sm:right-0 bg-gray-100 shadow-lg rounded-lg w-[23rem] sm:w-[30rem] py-3 z-50"
                >
                    <h2 className="text-xl font-semibold p-1 ml-2">Notifications</h2>
                    {notification.slice(0, 4).map((notify, index) => (
                <ul
                    key={index}
                    className="mt-2 flex justify-between hover:bg-gray-100 cursor-pointer"
                >
                    <div className="flex">
                        <div>
                            <li>
                            <img
                                            src={profile1}
                                            alt="Profile"
                                            className="w-12 sm:w-16 sm:h-12 rounded-full"
                                        />
                            </li>
                        </div>
                        <div>
                            <li className="text-black text-sm sm:text-lg">
                                {notify.type === "session" ? "New Session Started" : "Activity Logged"}
                            </li>
                            <li className="text-gray-500 text-sm">
                                {notify.type === "session"
                                    ? `Logged in from ${notify.location} (${notify.ip})`
                                    : notify.fileActivities.length > 0
                                    ? `File Activity: ${notify.fileActivities[0].action}`
                                    : `Voice Activity: ${notify.voiceActivities[0].action}`}
                            </li>
                        </div>
                    </div>
                    <div className="pr-4 text-sm text-gray-500">
                        <li>{new Date(notify.createdAt).toLocaleString()}</li>
                    </div>
                </ul>
            ))}
                    <hr className="mt-4 mb-1" />
                    <div className="flex justify-around">
                        <p className="text-blue-500 cursor-pointer" onClick={handleMarkAsRead}>Mark All as Read</p>
                        {/* <p className="flex text-red-500 cursor-pointer">
                            Delete All
                            <Trash2 className="h-5 mt-[0.2rem] text-red-500" />
                        </p> */}
                    </div>
                </motion.div>
            )}
        </div>
                <p className="hidden md:block">|</p>
                <div className="relative">
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={gotoprofile}
                    >
                        <img
                            src={profilePicture || 'default-profile-pic.png'}
                            alt="User"
                            className="h-8 w-8 rounded-full object-cover"
                        />
                        <p className="text-black mt-1 ml-1 hidden md:block">
                            {username ? username : 'Guest'}
                        </p>
                    </div>
                    {/* {isProfileDropdownOpen && ( */}
                    {/* <motion.div
                            className="absolute right-0 mt-2  border border-gray-200 rounded-md py-2 bg-blue-500 text-white shadow-lg w-28 z-10"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={dropdownVariants}
                        >
                            <button
                                onClick={logout}
                                className="flex items-center justify-between  hover:text-red-600  cursor-pointer font-medium rounded-md px-4 py-2 w-full transition duration-300"
                            >
                                
                                <span>Sign Out</span>
                            </button>
                            <button
                                onClick={gotoprofile}
                                className="flex items-center justify-between  hover:text-red-600  cursor-pointer font-medium rounded-md px-4 py-2 w-full transition duration-300"
                            >
                                
                                <span>My Profile</span>
                            </button>
                        </motion.div> */}
                    {/* // )} */}
                </div>
            </div>
        </nav>
    );
};
Navbar.propTypes = {
    onFolderSelect: PropTypes.func,
};
export default Navbar;