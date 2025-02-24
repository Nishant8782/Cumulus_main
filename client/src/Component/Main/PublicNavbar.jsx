import React, { useState } from "react";
import { NavLink } from 'react-router-dom';
const PublicNavbar = () => {
  const [deletebutton2, setDeletebutton2] = useState(false);

  return (
    <div>
      {deletebutton2 && (
        <div
          className="fixed inset-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
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
      <nav className="flex items-center justify-end px-2 md:px-8 py-3 bg-white shadow-md relative">
        <button onClick={() => setDeletebutton2(true)} className="p-2 px-3 bg-blue-500 text-white rounded-lg">Upgrade to Share</button>

        
      </nav>
    </div>

  );
};




export default PublicNavbar;







