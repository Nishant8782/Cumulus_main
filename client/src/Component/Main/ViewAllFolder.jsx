import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
import { API_URL } from '../utils/Apiconfig';
import { useNavigate } from "react-router-dom";
import { Trash, PencilLine, EllipsisVertical, Check, X, Plus, ListOrdered } from "lucide-react"
import e from 'cors';


function ViewAllFolder({ searchQuery, onFolderSelect }) {
  const [loading, setLoading] = useState(false);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [deletebutton, setDeletebutton] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const dropdownRef = useRef([]);
  const [editFolderName, setEditFolderName] = useState(""); // State for folder name being edited
  const [editingFolderId, setEditingFolderId] = useState(null); // State to track which folder is being edited
  const [error, setError] = useState(null); // For handling errors
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [editable, setEditable] = useState(null);
  const [message, setMessage] = useState(null); // Added for feedback messages
  const [createFolder, setCreateFolder] = useState(false);
  const [newFolder, setNewFolder] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const inputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
         // Close editing mode if clicked outside
      }
    }
    if (editable !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editable]);

  const fetchFolders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in again.");

      const response = await axios.get(`${API_URL}/api/get-folders`, {
        headers: { Authorization: `Bearer ${token}` },
      });


      const foldersData = response.data.map((folder) => ({
        id: folder._id,
        name: folder.folder_name,
        created: folder.created_at,
        updated: folder.updated_at,
        fileCount: folder.file_count || 0,
      }));

      const sortedFoldersData = foldersData.sort((a, b) => new Date(b.created) - new Date(a.created));
      console.log("sorted files by created_at:", sortedFoldersData);

      setFolders(sortedFoldersData);
      console.log("shdfhasgdfhgdfhgsafdashgdfasghdafhgdafdhgadfsaghdsahgfsadasfh", foldersData)
    } catch (error) {
      console.error("Error fetching folders:", error);
    } finally {
      setLoading(false);
    }
  };

  const addFolder = () => {
    setCreateFolder(true);
  }


  const deleteFile = async (folder) => {
    // const token = Cookies.get('token');
    const token = localStorage.getItem("token");
    const selectedFolder = folder; // Ensure folderId is set correctly

    console.log("Token:", token);
    console.log("Selected Folder ID:", selectedFolder);

    if (!token) {
      setMessage("No token found. Please log in.");
      console.error("Missing token");
      return;
    }

    if (!selectedFolder) {
      setMessage("No folder selected.");
      console.error("Missing folderId");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/delete-folder`,
        { folder_id: selectedFolder },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setOpenMenuId(false);
        fetchFolders();
        setMessage(response.data.message || "Folder deleted successfully.");
      } else {
        setMessage(response.data.message || "Failed to delete the folder.");
        setErrorMessage(
          response.data.message || "Failed to delete the folder."
        );
        setOverlayVisible(true);
      }
      setDeletebutton(false);
    } catch (error) {
      console.error("Error deleting folder:", error?.response?.data || error);
      setErrorMessage(
        error.response?.data?.message ||
        "An error occurred while deleting the folder."
      );
      alert(
        error.response?.data?.message ||
        "An error occurred while deleting the folder."
      );
      setOverlayVisible(true);
    }
  };
  const handleFolderSelect = (folderId) => {
    console.log("Selected Folder:", folderId);
    if (onFolderSelect) {
      onFolderSelect(folderId); // Pass folder ID to MainLayout
    }
    navigate(`/folder/${folderId}`); // Navigate to the folder page
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const handlePopup = (id) => {
    if (popUp === id) {
      setPopUp(null);
    } else {
      setPopUp(id);
    }
  }


  const handleAddFolder = async () => {
    if (newFolder.trim()) {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in again.");
        }

        const response = await axios.post(
          `${API_URL}/api/create-folder`,
          { folder_name: newFolder },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const newFolderData = response.data.folder;
        setFolders([
          ...folders,
          { id: newFolderData._id, name: newFolderData.folder_name },
        ]);
        setNewFolder("");
        fetchFolders();
        setCreateFolder(null);
      } catch (error) {
        if (error.response?.status === 400) {
          alert(error.response?.data?.message || "A folder with the same name already exists.");
        } else {
          setError(error.response?.data?.message || "Error creating folder.");
        }
      } finally {
        setLoading(false);

      }
    }
  };


  const handleEditable = (id, name) => {
    if (editable === id) {
      setEditable(null);

    } else {
      setEditable(id);
      setEditFolderName(name);
      setPopUp(null)
    }
  };

  const handleEditFolder = async () => {
    if (!editFolderName) {
      setError("New folder name is required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await axios.post(
        `${API_URL}/api/edit-folder-name`,
        {
          folder_id: editable,
          new_folder_name: editFolderName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditable(null); // Close edit mode
      setEditFolderName(""); // Clear input
      fetchFolders(); // Refresh folder list
    } catch (err) {
      setError("Error updating folder name.");
      console.error(err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isOutside = !dropdownRef.current.some((ref) =>
        ref && ref.contains(e.target)
      );
      if (isOutside) {
        setPopUp(null);
        setCreateFolder(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  console.log("this is search query", searchQuery);

  const sortedFolders = [...folders].sort((a, b) => {
    if (!a.created || !b.created) return 0; // Handle missing dates

    return sortOrder === "asc"
      ? new Date(a.created) - new Date(b.created)
      : new Date(b.created) - new Date(a.created);
  });

  const filteredFolders = sortedFolders.filter((folder) =>
    (folder?.name || "").toLowerCase().includes((searchQuery || "").toLowerCase())
  );


  return (
    <div className='p-6'>
      <div className=''>
        <div className='flex justify-between pr-4'>
          <p className='text-2xl font-semibold pb-2'>All Folders</p>

        </div>
        {
          createFolder && (
            <>
              <div
               
                className="fixed inset-0 z-50 flex justify-center items-center bg-gray-800 bg-opacity-50">
                <div 
                 ref={(el) => (dropdownRef.current[1] = el)}
                className="h-auto w-96 bg-white rounded-lg shadow-xl p-6">
                  <div className='flex justify-between'>
                    <p></p>
                    <p ><X
                      onClick={() => setCreateFolder(false)}
                      className='text-red-500 cursor-pointer' /></p>
                  </div>
                  <p className="text-center text-blue-600 font-semibold text-xl mb-6">Create New Folder</p>

                  <label className="block text-gray-700 mb-2 text-sm">Enter folder name</label>

                  <input
                  
                    type="text"
                    value={newFolder}
                    onChange={(e) => setNewFolder(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ease-in-out duration-300 mb-4"
                  />

                  <button
                    onClick={handleAddFolder}
                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-300">
                    Create Folder
                  </button>
                </div>
              </div>

            </>
          )
        }

        <div className="flex justify-between pb-2">
          <div className="flex">
            <span className="text-sm font-semibold text-blue-500 py-1 border-b-4 border-blue-500">
              List of All folders
            </span>
            <div className="bg-gray-100 rounded-full text-lg font-semibold h-8 w-8 p-0.5 px-2.5 ml-2 mb-1">
              {folders.length}
            </div>
          </div>
          <div className="flex items-center gap-2">
          <button
  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
  className="px-2 py-2 rounded-md group relative"
>
  <span className="">{sortOrder === "asc" ? <ListOrdered /> : <ListOrdered />}</span>
  
  <span className="hidden md:inline absolute w-28 bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-sm bg-white text-black px-2 py-1 rounded-md transition-opacity">
    Sorting Order
  </span>
</button>

            <button
              onClick={() => addFolder()}
              className="px-2 py-2 pt-2 bg-[#0067FF] hover:bg-blue-600 flex text-white rounded-lg"
            >
              <Plus className="" />
              <span className="hidden md:inline">Add Folder</span>
              <span className="inline sm:hidden">Create</span>
            </button>
          </div>
        </div>
      </div>

      <div className='mt-2 bg-white hidden md:flex text-left border-collapse overflow-y-scroll max-h-[80vh] pb-[20px]'>
        <table className='w-full text-left '>
          <thead className='sticky top-0'>
            <tr>
              <th className='font-semibold text-gray-500 bg-gray-100 p-2'>Folder Name</th>
              <th className='font-semibold text-gray-500 bg-gray-100 p-2'>Created</th>
              <th className='font-semibold text-gray-500 bg-gray-100 p-2'>Last Modified</th>
              <th className='font-semibold text-gray-500 bg-gray-100 p-2'>Modify</th>
            </tr>
          </thead>
          <tbody className='text-center'>
            {filteredFolders.map((folder, folderindex) => (
              <tr className='border-b-2 text-left' key={folder.id}>
                <td className='p-4  min-w-20'>
                  <span
                    onClick={() => handleFolderSelect(folder.id)}
                    className={`${editable === folder.id ? 'hidden' : 'inline bg-gray-100 cursor-pointer text-black font-semibold rounded p-2 text-sm'}`}
                  >
                    {folder.name}
                    <span className="text-gray-500 ml-2">({folder.fileCount} files)</span>
                  </span>
                  <div ref={inputRef} className="flex gap-x-2">
                    <input
                      type="text"
                      value={editFolderName}
                      onChange={(e) => setEditFolderName(e.target.value)}
                      className={`${editable === folder.id ? 'inline text-gray-700 outline-blue-600 font-semibold outline-2 p-2 border-2 rounded-lg' : 'hidden'}`}
                    />
                    <div className={`${editable === folder.id ? 'flex ' : 'hidden'}`}>
                      <Check className='m-2 text-green-500' onClick={handleEditFolder} />
                      <X className='m-2 text-red-500' onClick={() => setEditable(null)} />
                    </div>
                  </div>
                </td>
                <td>
                  <p className='text-sm text-gray-600'>   {folder.created ? new Date(folder.created).toLocaleString() : 'Undefined'}</p>
                </td>
                <td>
                  <p className='text-sm text-gray-600'>   {folder.updated ? new Date(folder.updated).toLocaleString() : 'Undefined'}</p>
                </td>
                <td>
                  <div className='flex'>
                    <button>
                      <PencilLine
                        onClick={() => handleEditable(folder.id, folder.name)}
                        className='h-5 w-5 ml-4 text-blue-600'
                      />
                    </button>

                    <div>
                      <button onClick={() => {
                        setDeletebutton(true); // Open Delete Confirmation Modal
                        console.log("heloo ", folder.id);
                        setSelectedFolder(folder.id); // Set Selected Folder
                        setOpenMenuId(null);

                      }}><Trash className='h-5 w-5 ml-5 text-red-600' /></button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='inline md:hidden'>
        <div className='mt-4'>
          {filteredFolders.map((folder, index) => (

            <div key={folder.id} className='flex justify-between p-3 border-2 border-gray-200 rounded-lg relative mb-2'>
              <div className=''>
                <span
                  onClick={() => handleFolderSelect(folder.id)}
                  className={`${editable === folder.id ? 'hidden' : 'inline bg-gray-100 p-2 cursor-pointer text-black font-semibold rounded  text-sm'}`}
                >
                  {folder.name}
                  <span className="text-gray-500 ml-2">({folder.fileCount} files)</span>
                </span>

                <div 
                
                className='flex gap-x-2'>
                  <input
                  ref={(el) => (dropdownRef.current[folder.id] = el)}
                    type="text"
                    value={editFolderName}
                    onChange={(e) => setEditFolderName(e.target.value)}
                    className={`${editable === folder.id ? 'inline  p-2 border-b-2 outline-none border-blue-500 text-gray-700 font-semibold w-full' : 'hidden'}`}
                  />
                  <div className={`${editable === folder.id ? 'flex ' : 'hidden'}`}>
                    <Check className='m-2 text-green-600' onClick={handleEditFolder} />
                    <X className='m-2 text-red-600' onClick={() => setEditable(null)} />
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-2 flex flex-col gap-y-2 ">
                  <span className="font-medium text-black">Created: <span className="text-gray-500 font-normal">{folder.created ? new Date(folder.created).toLocaleString() : 'Undefined'}</span></span>
                  <span className="font-medium text-black">Updated: <span className="text-gray-500  font-normal">{folder.updated ? new Date(folder.updated).toLocaleString() : 'Undefined'}</span></span>
                </div>
                
              </div>
              <button onClick={() => handlePopup(folder.id)}>
                <EllipsisVertical className='relative' />
              </button>
              {
                popUp === folder.id && (
                  <div
                    ref={(el) => (dropdownRef.current[index + 1] = el)}
                    className='absolute z-50 shadow-md bg-white h-30 w-40 border-2 rounded mt-14 right-0'>
                    <p
                      onClick={() => { handleEditable(folder.id, folder.name) }}

                      className='p-2 px-4'>Edit</p>
                    <p onClick={() => {
                      setDeletebutton(true); // Open Delete Confirmation Modal
                      console.log("heloo ", folder.id);
                      setSelectedFolder(folder.id); // Set Selected Folder
                      setOpenMenuId(null);
                      setPopUp(null)

                    }} className='p-2 px-4'>Delete</p>
                  </div>
                )
              }
            </div>
          )
          )
          }
        </div>
      </div>
      {deletebutton && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="deleteModalLabel"
          aria-describedby="deleteModalDescription"
        >
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full m-2">
            <div className="flex justify-between items-center mb-4">
              <h2 id="deleteModalLabel" className="text-lg font-semibold">
                Are you sure to delete this folder?
              </h2>
            </div>
            <div
              id="deleteModalDescription"
              className="text-sm text-gray-600 mb-4"
            >
              This action cannot be undone. Please confirm if you'd like to
              proceed.
            </div>
            <div className="flex justify-end gap-2 my-2">
              <button
                onClick={() => setDeletebutton(false)}
                className="border-2 border-blue-500 text-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteFile(selectedFolder); // Pass Selected Folder ID
                  setDeletebutton(false);
                }}
                className="bg-blue-500 text-white px-6 py-2 rounded flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewAllFolder;
