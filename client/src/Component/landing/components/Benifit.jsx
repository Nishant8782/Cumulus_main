import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, ChevronLeft, PartyPopper } from "lucide-react";
import nominee from "../Assets/Nominee.png";
import Benifitfamily1 from "../Assets/ITALY.png"
import Benifitfamily from "../Assets/benifitfamily1.png";
import frame from "../Assets/framebackground.png";

import { Link as ScrollLink } from "react-scroll";


const Benifit = () => {
  const [index, setIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("families");

  const content = {
    families: [
      {
        to: "subscription",
        title: "Ease of access",
        description:
          "Securely store and share your family documents with your chosen nominees. Securely store and share your family documents with your chosen nominees.",
        buttonText: "Get Started",
        image: Benifitfamily,
      },
      {
        to: "features",
        title: "Security",
        description: "Enhance business productivity with secure document sharing.",
        buttonText: "Explore",
        image: Benifitfamily,
      },
    ],
    business: [
      {
        to: "features",
        title: "Efficiency",
        description: "Enhance business productivity with secure document sharing.",
        buttonText: "Explore",
        image: nominee,
        onclick: (() => {
          return (<> <ScrollLink
            to={currentContent.to} // Target the "to" property dynamically
            smooth={true}
            duration={500}
            offset={-50}
          ></ScrollLink> </>)
        }),
      },
      {
        to: "subscription",
        title: "Collaboration",
        description: "Collaborate with your team efficiently and securely.",
        buttonText: "Learn More",
        image: nominee,
        onclick: (() => {
          return (<> <ScrollLink
            to={currentContent.to} // Target the "to" property dynamically
            smooth={true}
            duration={500}
            offset={-50}
          ></ScrollLink> </>)
        }),

      },
      {
        to: "features",
        title: "Security",
        description: "Ensure your sensitive data is secure and accessible only to trusted members.",
        buttonText: "Start Now",
        image: nominee,
        onclick: (() => {
          return (<> <ScrollLink
            to={currentContent.to} // Target the "to" property dynamically
            smooth={true}
            duration={500}
            offset={-50}
          ></ScrollLink> </>)
        }),

      },
      {
        to: "work",
        title: "Control",
        description: "Maintain control over document access and permissions.",
        buttonText: "Discover",
        image: nominee,
        onclick: (() => {
          return (<> <ScrollLink
            to={currentContent.to} // Target the "to" property dynamically
            smooth={true}
            duration={500}
            offset={-50}
          ></ScrollLink> </>)
        }),
      },
    ],
  };

  const maxSlides = activeTab === "families" ? content.families.length : content.business.length;

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % maxSlides);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + maxSlides) % maxSlides);
  };

  const currentContent = activeTab === "families" ? content.families[index] : content.business[index];

  return (
    <div
      className="flex flex-col items-center justify-center min-h-full bg-[#2E2E2E] text-white px-2 overflow-hidden"
      style={{
        backgroundImage: `url(${frame})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* Tabs */}
      <div className="p-1 rounded-lg text-white my-1 font-serif flex items-center">
        <PartyPopper className="text-white mr-1 h-5" />
        <p className="text-white text-sm md:text-base mt-2">Benefits For You</p>
      </div>

      {/* Title Section */}
      <div className="text-center mb-6 ">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Benefits you can expect</h1>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => {
              setActiveTab("families");
              setIndex(0);
            }}
            className={`text-base md:text-lg px-4 py-2 ${activeTab === "families" ? "border-b-2 border-blue-500 text-white" : "text-gray-400"
              }`}
          >
            For Families
          </button>
          <button
            onClick={() => {
              setActiveTab("business");
              setIndex(0);
            }}
            className={`text-base md:text-lg px-4 py-2  ${activeTab === "business" ? "border-b-2 border-blue-500 text-white" : "text-gray-400"
              }`}
          >
            For Business
          </button>
        </div>
      </div>
      <p className="text-gray-300">Ensure important documents are accessible </p>

      {/* Content Slider */}
      <div className="relative w-full max-w-full mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Main Content with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index} // Important for triggering animation
            className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#2E2E2E] p-4 md:p-6 rounded-lg w-full"
            initial={{ opacity: 0, x: 0, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.8 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="flex-1 hidden lg:inline ">
              <img
                src={currentContent.image}
                alt={currentContent.title}
                className="w-full max-w-sm md:max-w-72 h-auto rounded-md opacity-30  shadow-lg object-contain"
              />
            </div>



            {/* Text Section */}
            <div className="flex-1 h-72 md:min-w-96 min-w-full text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-bold mb-4">{currentContent.title}</h2>
              <p className="text-gray-300 text-sm md:text-base mb-4">{currentContent.description}</p>


              {/* Navigation Buttons */}
              {/* Navigation Buttons */}
              <div className="md:hidden flex justify-between items-center w-full max-w-sm md:max-w-xl mx-auto mt-4">
                {/* ChevronLeft on the left side, triggering handlePrev */}
                <button
                  onClick={handlePrev} // Call handlePrev for previous action
                  className="px-2 py-1 rounded-full hover:bg-gray-600 transition flex justify-between items-center"
                >
                  <ChevronLeft size={24} />
                </button>

                {/* ScrollLink button to navigate */}
                <ScrollLink
                  to={currentContent.to} // Target the "to" property dynamically
                  smooth={true}
                  duration={500}
                  offset={-50}
                >
                  <button className="bg-blue-500 px-2 md:px-4 py-2 rounded-md hover:bg-blue-600 transition flex justify-between items-center mx-auto md:mx-0">
                    <span className="ml-1"> {currentContent.buttonText}</span>
                    <ChevronRight className="h-5 mt-1" />
                  </button>
                </ScrollLink>

                {/* ChevronRight on the right side, triggering handleNext */}
               
                  <button

                    onClick={handleNext} // Call handleNext for next action
                    className="px-2 py-1 rounded-full hover:bg-gray-600 transition flex justify-between items-center"
                  >
                    <ChevronRight size={24} />
                  </button>
                
              </div>


              {/* Button Text */}
              <ScrollLink
                  to={currentContent.to} // Target the "to" property dynamically
                  smooth={true}
                  duration={500}
                  offset={-50}
                >
              <button className="hidden  bg-blue-500 px-2 md:px-4 py-2 rounded-md hover:bg-blue-600 transition md:flex justify-between items-center mx-auto md:mx-0">
                <span className="ml-1"> {currentContent.buttonText}</span>
              </button>
             </ScrollLink>

            </div>



            {/* Image Section */}
            <div className="flex-1 h-auto w-96 pt-3  px-5 lg:px-0 lg:pr-3 rounded-md items-center rounded-tr-2xl lg:bg-gray-500 bg-transparent">
              <img
                src={currentContent.image}
                alt={currentContent.title}
                className="w-full max-w-sm md:max-w-full h-auto rounded-md shadow-lg object-contain"
              />
            </div>
            <div className="flex-1 h-12 w-12 text-center opacity-25  md:text-left hidden xl:inline">

              <p className="text-gray-300 text-sm md:text-base mb-4">{currentContent.description}</p>

              <button className="bg-blue-500 px-4 py-1 rounded-md hover:bg-blue-600 transition  flex justify-between items-center mx-auto md:mx-0">
                Get Started
                <ChevronRight className="h-5" />
              </button>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Navigation Buttons */}
      <div className="hidden  md:flex justify-between items-center w-full max-w-sm md:max-w-xl mx-auto mt-4">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full hover:bg-gray-600 transition"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          className="p-2 rounded-full hover:bg-gray-600 transition"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>

  );
};

export default Benifit;
