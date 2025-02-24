import { useState, useEffect } from "react";
import React from "react";
// import AsistanceRight from "../../src/Assets/asistance-right.png";
import frameasistance from "../Assets/frameassistance.png";
import frame3 from "../Assets/frame3.png";
import { API_URL } from "../../utils/Apiconfig";
import useLoadingStore from "../store/UseLoadingStore";
import { ChevronRight ,Loader2 } from "lucide-react";

function Assistance() {
  const { isLoading, showLoading, hideLoading } = useLoadingStore();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    selectQuery: "",
    describeQuery: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission status
  const [backgroundImage, setBackgroundImage] = useState(frameasistance); // Default background

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const isFormValid = () => {
    return (
      formData.username &&
      formData.email &&
      formData.describeQuery
    );
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoading();
    const requestBody = {
      username: formData.username,
      email: formData.email,
      selectQuery: formData.selectQuery,
      describeQuery: formData.describeQuery,
    };

    try {
      const response = await fetch(`${API_URL}/api/sendqueries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          username: "",
          email: "",
          selectQuery: "",
          describeQuery: "",
        });
        setTimeout(() => {
          setIsSubmitted(false);
        }, 3000);
      } else {
        alert("Failed to submit query. Please try again.");
      }
    } catch (error) {
      // console.error("Error submitting query:", error);
      alert("Error submitting query. Please check the console for more details.");
    } finally {
      hideLoading();
    }
  };

  // Update background image based on screen size
  useEffect(() => {
    const updateBackground = () => {
      if (window.innerWidth >= 1024) {
        setBackgroundImage(frame3); // For large screens
      } else {
        setBackgroundImage(frameasistance); // For small and medium screens
      }
    };

    updateBackground(); // Set initial background
    window.addEventListener("resize", updateBackground);

    return () => window.removeEventListener("resize", updateBackground);
  }, []);

  return (
    <div className="p- sm:pl-0 md:p-10 lg:py-24 lg:px-2 2xl:p-32 rounded-md ">
      <div
        className="text-white  flex flex-row items-center justify-center md:justify-center lg:justify-between  overflow-hidden 2xl:min-h-[75vh]"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Left Form Section */}
        <div className=" px-5 md:px-10 lg:px-20  py-20 lg:w-1/2 flex justify-center  ">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold mb-4 p-1">Need Assistance? Let's Connect!</h1>
            <p className="text-gray-400 mb-6">
              Use the form below or email us at{" "}
              <a href="mailto:support@cumulus.com" className="text-blue-500">
                support@cumulus.com
              </a>{" "}
              for any inquiries.
            </p>
            <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
  <input
    type="text"
    name="username"
    placeholder="Enter your name"
    className="w-full mb-2 p-4 rounded-lg bg-[#585858]/40 border border-gray-500 text-white placeholder-white focus:outline-none focus:ring-1 focus:ring-white backdrop-blur-sm"
    onChange={handleInputChange}
    value={formData.username}
  />
</div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full mb-2 p-4 rounded-lg bg-[#585858]/40 border border-gray-500 text-white placeholder-white focus:outline-none focus:ring-1 focus:ring-white backdrop-blur-sm"
                  onChange={handleInputChange}
                  value={formData.email}
                />
              </div>
              {/* <div className="relative">
                <select
                  name="selectQuery"
                  className="w-full mb-2 p-4 rounded-lg bg-[#585858]/40 border border-gray-500 text-white placeholder-white focus:outline-none focus:ring-1 focus:ring-white backdrop-blur-sm"
                  onChange={handleInputChange}
                  value={formData.selectQuery}
                >
                  <option value="" className="bg-[#585858] font-semibold">Select your Query</option>
                  <option value="Support"  className="bg-[#585858] font-semibold">Support</option>
                  <option value="Sales"  className="bg-[#585858] font-semibold">Sales</option>
                  <option value="General Questions"  className="bg-[#585858] font-semibold">General Questions</option>
                </select>
              </div> */}
              <div>
                <textarea
                  name="describeQuery"
                  rows="4"
                  placeholder="How can we help ?"
                  className= "w-full mb-2 p-4 rounded-lg bg-[#585858]/40 border border-gray-500 text-white placeholder-white focus:outline-none focus:ring-1 focus:ring-white backdrop-blur-sm"
                  onChange={handleInputChange}
                  value={formData.describeQuery}
                ></textarea>
              </div>
              {isLoading ? (
                <button
                  type="submit"
                  className="bg-blue-500 flex justify-between items-center cursor-not-allowed text-white text-xl font-semibold py-3 px-6 rounded-lg transition"
                >
                  <Loader2 className="animate-spin h-6 w-6" />
                </button>
              ) : isSubmitted ? (
                <button
                  type="submit"
                  className="bg-green-500 text-white text-xl font-semibold py-3 px-6 rounded-lg transition"
                >
                  Submitted
                </button>
              ) : (
                <button
                  type="submit"
                  className={`${
                    isFormValid() ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-500 hover:bg-blue-600 cursor-not-allowed"
                  } flex justify-between items-center text-white text-xl font-semibold py-3 px-6 rounded-lg transition`}
                  disabled={!isFormValid()}
                >
                  Submit
                  <ChevronRight />
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Assistance;


// import  { useState } from "react";
// import React from "react";
// import { ChevronDown } from "lucide-react";
// import AsistanceRight from "../../src/Assets/asistance-right.png"
// import frame from "../Assets/framebackground.png";
// import frameasistance from "../Assets/frameasistance.png"
// // import frame3 from "../Assets/frame3.png"
// import { API_URL } from "./utiles/api";


// function Assistance() {
//     const [formData, setFormData] = useState({
//         username: "",
//         email: "",
//         selectQuery: "",
//         describeQuery: "",
//     });

//     const [isSubmitted, setIsSubmitted] = useState(false); // Track submission status

//     // Handle input changes
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({
//             ...prevData,
//             [name]: value,
//         }));
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault(); // Prevent default form submission behavior

//         const requestBody = {
//             username: formData.username,
//             email: formData.email,
//             selectQuery: formData.selectQuery,
//             describeQuery: formData.describeQuery,
//         };

//         try {
//             const response = await fetch(`${API_URL}/api/queries`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(requestBody),
//             });

//             if (response.ok) {
//                 setIsSubmitted(true); // Set the submission state to true

//                 // Clear the form (optional)
//                 setFormData({
//                     username: "",
//                     email: "",
//                     selectQuery: "",
//                     describeQuery: "",
//                 });

//                 // Reset button state after 3 seconds
//                 setTimeout(() => {
//                     setIsSubmitted(false);
//                 }, 3000); // Adjust time as needed
//             } else {
//                 alert("Failed to submit query. Please try again.");
//             }
//         } catch (error) {
//             console.error("Error submitting query:", error);
//             alert("Error submitting query. Please check the console for more details.");
//         }
//     };
//     return (
//         <div className="bg-[#f5f5f5] p-2 sm:p-8  md:p-10 lg:p-16  px-2 sm:px-2 md:px-16 lg:px-24 lg:h-screen">
//             <div className=" text-white flex flex-col justify-around items-center md:flex-row rounded-xl  "
//              style={{
//                         backgroundImage: `url(${frameasistance})`,
//                         backgroundSize: "cover",
//                         backgroundRepeat: "no-repeat",
//                         backgroundPosition: "center",
//                     }}
//             >
//                 {/* Left Form Section */}
//                 <div className="w-full max-w-lg px-6 py-12 md:p-8 lg:p-10  md:w-1/2">
//                     <h1 className="text-2xl font-bold mb-4">Need Assistance? Let's Connect!</h1>
//                     <p className="text-gray-400 mb-6">
//                         Use the form below or email us at <a href="mailto:support@cumulus.com" className="text-blue-500">support@cumulus.com</a> for any inquiries.
//                     </p>
//                     <form className="space-y-4" onSubmit={handleSubmit}>
//                         {/* Name Input */}
//                          <div>
//                              <input
//                                  type="text"
//                                  name="username"
//                                  value={formData.username}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter your name"
//                                 className="w-full p-3 rounded-md bg-gray-800 bg-opacity-50 backdrop-blur-lg  text-white focus:outline-none focus:ring-2 focus:ring-white"
//                             />
//                         </div>
//                         {/* Email Input */}
//                         <div>
//                             <input
//                                 type="email"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleInputChange}
//                                 placeholder="Enter your email"
//                                 className="w-full p-3 rounded-md bg-gray-800 bg-opacity-50 backdrop-blur-lg  text-white focus:outline-none focus:ring-2 focus:ring-white"
//                             />
//                         </div>
//                         {/* Select Dropdown */}
//                         <div className="relative">
//                             <select
//                                 name="selectQuery"
//                                 value={formData.selectQuery}
//                                 onChange={handleInputChange}
//                                 className="w-full p-3 rounded-md bg-gray-800 bg-opacity-50 backdrop-blur-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-white"
//                             >
//                                 <option value="">Select your Query</option>
//                                 <option value="Support">Support</option>
//                                 <option value="Sales">Sales</option>
//                                 <option value="General Questions">General Questions</option>
//                             </select>
//                             <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
//                         </div>
//                         {/* Textarea */}
//                         <div>
//                             <textarea
//                                 name="describeQuery"
//                                 value={formData.describeQuery}
//                                 onChange={handleInputChange}
//                                 rows="4"
//                                 placeholder="Describe your query"
//                                 className="w-full p-3 rounded-md bg-gray-800 bg-opacity-50 backdrop-blur-lg  text-white focus:outline-none focus:ring-2 focus:ring-white"
//                             ></textarea>
//                         </div>
//                         {/* Submit Button */}
//                         <button
//                             type="submit"
//                             className={`${
//                                 isSubmitted
//                                     ? "bg-green-500 hover:bg-green-600"
//                                     : "bg-blue-500 hover:bg-blue-600"
//                             } text-white text-xl font-semibold p-2 w-full rounded-md transition`}
//                          >
//                              {isSubmitted ? "Submitted" : "Submit"}
//                          </button>
//                     </form>
//                 </div>

//                 {/* Right Image Section */}
//                 <div className=" md:w-[50%] md:w-1/2 relative">
//                     <div className="relative w-full hidden md:flex items-end bg-gradient-to-br from-transparent via-transparent to-blue-900">
//                         <img
//                             src={AsistanceRight}
//                             alt="Assistance"
//                             className="object-contain relative z-10 "
//                         />
                     
//                         {/* <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-900 pointer-events-none"></div> */}
//                     </div>
//                 </div>
//             </div>
//         </div>

//     );
// }

// export default Assistance;
