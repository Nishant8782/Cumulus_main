import React, {useState} from "react";
import { Routes, Route } from "react-router-dom";
import PublicSidebar from "../Component/Main/PublicSidebar";
import PublicNavbar from "../Component/Main/PublicNavbar";
import SharedFiles from "../Component/Main/SharedFiles";
import Dashboard from "../Component/Main/Dashboard";
const PublicLayout = () => {

  const [selectedFolder, setSelectedFolder] = useState();
  const [searchQuery, setSearchQuery] = useState('');

  const handleFolderSelect = (folderId) => {

    setSelectedFolder(folderId);
  };
  return (
    <div className="flex">
      <PublicSidebar />
      <div className="flex-grow">
        <PublicNavbar />
        <Routes>
          <Route path="/SharedFiles" element={<SharedFiles />} />
          <Route path="aboutCumulus" element={<Dashboard folderId={selectedFolder} onFolderSelect={handleFolderSelect} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
        </Routes>
      </div>
    </div>
  );
};
export default PublicLayout;