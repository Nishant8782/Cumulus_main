import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Component/Auth/Login';
import Signup from './Component/Auth/Signup';
import Updatepassword from './Component/Auth/Updatepassword';
import Enterdashboard from './Component/Auth/Enterdashboard';
import Mainlayout from './layout/Mainlayout';
import Thankyou from './Component/Auth/Thankyou';
import Subscription from './Component/Main/Subscription';
import PublicLayout from './layout/Publiclayout';
import Hero from '../src/Component/landing/components/Hero'
import PrivateRoute from './layout/PrivateRoute';
const App = () => {
  const token = localStorage.getItem("token");
  // console.log("this is token" , token);
  const isAuthenticated = (token)?true:false;
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);
  const [originalContent, setOriginalContent] = useState("");


  useEffect(() => {
    if (!originalContent) {
      setOriginalContent(document.body.innerHTML);
    }
    document.addEventListener("contextmenu", (event) => event.preventDefault());
    const disableShortcuts = (event) => {
      if (
        event.keyCode === 123 || // F12
        (event.ctrlKey && event.shiftKey && (event.keyCode === 73 || event.keyCode === 74)) || // Ctrl+Shift+I / Ctrl+Shift+J
        (event.ctrlKey && event.keyCode === 85) // Ctrl+U
      ) {
        event.preventDefault();
      }
    };
    document.addEventListener("keydown", disableShortcuts);
    const blankOutEverything = () => {
      document.body.innerHTML =
        "<h1 style='text-align:center; margin-top:20%; font-size:3rem;'>DevTools Detected!<br>Page is blank.</h1>";
      console.log = console.warn = console.error = console.info = () => {};
      Object.defineProperty(console, "_commandLineAPI", { get: () => { throw "DevTools detected!"; } });
      window.XMLHttpRequest = class extends XMLHttpRequest {
        open() {
          console.warn("Blocked request due to DevTools detection.");
          return false;
        }
      };
      window.fetch = () => Promise.reject("Blocked due to DevTools detection.");
    };

    const restorePage = () => {
      if (originalContent) {
        document.body.innerHTML = originalContent;
        window.location.reload(); 
      }
    };

    const detectDevTools = setInterval(() => {
      const threshold = 160;
      if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
        if (!isDevToolsOpen) {
          setIsDevToolsOpen(true);
          blankOutEverything();
        }
      } else {
        if (isDevToolsOpen) {
          setIsDevToolsOpen(false);
          restorePage();
        }
      }
    }, 500);

    // Detect DevTools (for mobile)
    const detectMobileDevTools = () => {
      let before = performance.now();
      debugger;
      let after = performance.now();
      if (after - before > 200) { // DevTools causes debugger to delay execution
        setIsDevToolsOpen(true);
        blankOutEverything();
      }
    };
    const mobileCheckInterval = setInterval(detectMobileDevTools, 1000);

    return () => {
      document.removeEventListener("contextmenu", (event) => event.preventDefault());
      document.removeEventListener("keydown", disableShortcuts);
      clearInterval(detectDevTools);
      clearInterval(mobileCheckInterval);
    };
  }, [isDevToolsOpen, originalContent]);

  return (
    <div style={{ display: isDevToolsOpen ? "none" : "block" }}>
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Subscription" element={<Subscription />} />
        <Route path="/updatepassword" element={<Updatepassword />} />
        <Route path="/enterdashboard" element={<Enterdashboard />} />
        <Route path="/updatepassword" element={<Updatepassword />} />
        <Route path="/Thankyou" element={<Thankyou />} />

        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Mainlayout />
            </PrivateRoute>
          }
        />

        {/* <Route path="/SharedFiles" element={<PublicLayout />} /> */}

        <Route path="/shared*" element={<PublicLayout />} />
      </Routes>
    </Router>
    </div>
  );
};
export default App;