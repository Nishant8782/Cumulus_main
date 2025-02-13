import { NavLink } from "react-router-dom";
import Allfiles from "../../assets/Allfiles.png";
import blackallfiles from "../../assets/blackallfiles.png";
import logo from "../../assets/logo.png";
import box from "../../assets/Box.png"
import React, { useState } from "react";
import {Menu, X } from "lucide-react";
const PublicSidebar = () => {
  const [deletebutton2, setDeletebutton2] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  return (
    <>
    <div className="hidden md:flex flex-col min-h-screen w-64 bg-gray-100 p-3 space-y-4 overflow-hidden">
      {/* Logo Section */}
      <div className="mb-4" style={{ width: "25vw" }}>
        <img
          src={logo}
          alt="Cumulus Logo"
          style={{ width: "100%", height: "auto" }}
        />
      </div>

      {/* Navigation Links */}
      <NavLink
        to="SharedFiles"
        className={({ isActive }) =>
          `flex items-center cursor-pointer p-2 rounded ${
            isActive ? "bg-blue-500 text-white" : "text-[#434A60]"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <img
              src={isActive ? Allfiles : blackallfiles}
              alt="Shared Files Icon"
              className="h-6"
            />
            <h2 className="ml-3 font-semibold">Shared Files</h2>
          </>
        )}
      </NavLink>

      <NavLink
        to="aboutCumulus"
        className={({ isActive }) =>
          `flex items-center cursor-pointer p-2 rounded ${
            isActive ? "bg-blue-500 text-white" : "text-[#434A60]"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <img
              src={isActive ? Allfiles : blackallfiles}
              alt="Cumulus Info Icon"
              className="h-6"
            />
            <h2 className="ml-3 font-semibold">What is Cumulus</h2>
          </>
        )}
      </NavLink>

      <div className="h-96 w-56">
       <img src={box} />
      </div>

      <div onClick={()=>setDeletebutton2(true)} >
      <button className="p-2 px-3 bg-blue-500 text-white rounded-lg">Upgrade to Share</button>
      </div>
      {deletebutton2 && (
        <div
          className="fixed inset-0 -top-4 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
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
                onClick={() => setDeletebutton2(false)}
                className="border-2 border-blue-500 text-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <NavLink to="/login">
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => setDeletebutton2(false)}
                >
                  Take Membership
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </div>

    <div className={`inline md:hidden ${sidebar ? 'hidden' : 'inline'}`}>
     <button onClick={() => setSidebar(!sidebar)} className="fixed m-2 z-50"><Menu className="h-8 w-8 ml-1 mt-1"/></button>
    </div>

   
          <div className={` ${sidebar ? 'fixed z-50 flex-col min-h-screen w-48 bg-gray-100 p-1 space-y-2 overflow-auto' : 'hidden'} md:hidden`}>
      {/* Logo Section */}
      <div className="mb-4 w-36 flex justify-between" 
      >
        <img
          src={logo}
          alt="Cumulus Logo"
          // style={{ width: "100%", height: "auto" }}
          className="mt-3 ml-1 h-5"
        />
        <button onClick={() => {setSidebar(false)}}><X className="mt-1 mr-1 border-2 border-blue-500 bg-blue-100 rounded-lg h-8 w-8"/></button>
      </div>

      {/* Navigation Links */}
      <NavLink
        to="/shared/SharedFiles/"
        className={({ isActive }) =>
          `flex items-center cursor-pointer p-2 rounded ${
            isActive ? "bg-blue-500 text-white" : "text-[#434A60]"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <img
              src={isActive ? Allfiles : blackallfiles}
              alt="Shared Files Icon"
              className="h-6"
            />
            <h2 className="ml-2 text-sm font-semibold" onClick={() => {setSidebar(false)}}>Shared Files</h2>
          </>
        )}
      </NavLink>

      <NavLink
        to="/shared/aboutCumulus/"
        className={({ isActive }) =>
          `flex items-center cursor-pointer p-2 rounded ${
            isActive ? "bg-blue-500 text-white" : "text-[#434A60]"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <img
              src={isActive ? Allfiles : blackallfiles}
              alt="Cumulus Info Icon"
              className="h-6"
            />
            <h2 className="ml-1 text-sm font-semibold" onClick={() => {setSidebar(false)}}>What is Cumulus</h2>
          </>
        )}
      </NavLink>

      <div className="h-80 w-42">
       <img src={box} />
      </div>

      <div onClick={()=>setDeletebutton2(true)} >
      <button className="p-2 px-3 bg-blue-500 text-white rounded-lg">Upgrade to Share</button>
      </div>
      {deletebutton2 && (
        <div
          className="fixed inset-0 -top-2 w-full h-screen bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
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
                onClick={() => setDeletebutton2(false)}
                className="border-2 border-blue-500 text-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <NavLink to="/login">
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => setDeletebutton2(false)}
                >
                  Take Membership
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </div>
        

</>
  );
};

export default PublicSidebar;
