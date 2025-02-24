import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../Component/Main/Sidebar";
import Dashboard from "../Component/Main/Dashboard";
import Subscription from "../Component/Main/Subscription";
import Navbar from "../Component/Main/Navbar";
import Voicememo from "../Component/Main/Voicememo";
import Help from "../Component/Main/Help";
import SharedFiles from "../Component/Main/SharedFiles";
import Profile from "../Component/Main/Profile";
import { UserProvider } from '../Component/utils/UserContext';
import { ProfileProvider } from "../Component/utils/ProfileContext";
import Afterlifeaccess from "../Component/Main/Afterlifeaccess";
import Desineedashboard from "../Component/Main/Desineedashboard";
import Activity from "../Component/Main/Activity";
import TermCodition from "../Component/Main/TermCodition";
import ViewAllFolder from "../Component/Main/ViewAllFolder";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Designee from "../Component/Main/Designee";

const MainLayout = () => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
 
  

  // Folder selection function
  const handleFolderSelect = (folderId) => {
    setSelectedFolder(folderId);
  };

  const CLIENT_ID = "938429058016-5msrkacu32pvubd02tpoqb6vpk23cap3.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <UserProvider>
        <ProfileProvider>
          <div className="flex">
            {/* Pass onFolderSelect to Sidebar */}
            <Sidebar onFolderSelect={handleFolderSelect} />
            <div className="flex-grow">
              <Navbar onFolderSelect={handleFolderSelect} setSearchQuery={setSearchQuery} />
              
              <Routes>
                {/* Pass both folderId and onFolderSelect to Dashboard */}
                <Route
                  path="/folder/:id"
                  element={
                    <Dashboard folderId={selectedFolder} onFolderSelect={handleFolderSelect} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                  }
                />
                <Route path="/Activity" element={<Activity searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
                <Route path="/SharedFiles" element={<SharedFiles />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/Afterlifeaccess" element={<Afterlifeaccess searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
                <Route path="/Voicememo" element={<Voicememo searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
                <Route path="/my-profile" element={<Profile />} />
                <Route
                  path="/designee/:email"
                  element={
                    <Designee folderId={selectedFolder} onFolderSelect={handleFolderSelect} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                  }
                />
                <Route path="/help" element={<Help />} />
                <Route path="/termconditions" element={<TermCodition />} />
                {/* Pass onFolderSelect to ViewAllFolder */}
                <Route path="/viewall" element={<ViewAllFolder searchQuery={searchQuery} setSearchQuery={setSearchQuery} onFolderSelect={handleFolderSelect} />}  />
                <Route path="/designee-dashboard" element={<Desineedashboard searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
              </Routes>
            </div>
          </div>
        </ProfileProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  );
};

export default MainLayout;
