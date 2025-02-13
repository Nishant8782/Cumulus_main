import { useEffect, useState } from "react";
import { Menu, MousePointerClickIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../Assets/logo.png";
import bgimage from "../Assets/desktopbg2.png";
import heroimage from "../Assets/heroimg.png";
import Box1 from "../Assets/Box1.png";
import mobileBox from "../Assets/Mobile-[Box-1].png";
import mobileBox4 from "../Assets/mobileBox-4.png";
import Box2 from "../Assets/Box2.png";
import box2 from "../Assets/Box-2.png"
import box3 from "../Assets/Box -3.png"
import Box3 from "../Assets/Box3.png";
import Box4 from "../Assets/Box4.png";
import reviews from "../Assets/Reviews.png"
import Subscription from "./Subscription";
import Work from "./Work";
import Testimonial from "./Testimonial";
import Faq from "./Faq";
import Assistance from "./Assistance";
import Footer from "./Footer";
import Benifit from "./Benifit";
import { Link as ScrollLink } from "react-scroll";
import { Link, useNavigate } from "react-router-dom";


function Hero() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  // const [loaded, setLoaded] = useState(false);
  const menuVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "15rem", opacity: 1 },
    exit: { height: 0, opacity: 0 },
  };
  // useEffect(() => {
  //     setLoaded(true);
  // }, []);

  return (
    <>
      {/* Background Section */}
      <nav className="fixed top-0 left-0 w-full text-white shadow z-50 bg-[#2e2e2e]">
        <div className=" w-full mx-auto md:px-1 py-3 flex px-1 sm:px-2 lg:px-10 justify-between md:justify-between lg:justify-between  items-center">
          {/* Logo */}
          <div>
            <ScrollLink
              to="home"
              smooth={true}
              duration={500}
              offset={0}
              className=" cursor-pointer text-lg"
            >
              <img src={logo} alt="Logo" className="h-10" />
            </ScrollLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:space-x-3 lg:space-x-8">
            <ScrollLink
              to="features"
              smooth={true}
              duration={500}
              offset={-50}
              className="hover:underline cursor-pointer text-lg"
            >
              Features
            </ScrollLink>
            <ScrollLink
              to="subscription"
              smooth={true}
              duration={500}
              offset={-50}
              className="hover:underline cursor-pointer text-lg"
            >
            Pricing
            </ScrollLink>
            <ScrollLink
              to="work"
              smooth={true}
              duration={500}
              offset={-50}
              className="hover:underline cursor-pointer text-lg"
            >
              How it Works
            </ScrollLink>
            <ScrollLink
              to="testimonial"
              smooth={true}
              duration={500}
              offset={-50}
              className="hover:underline cursor-pointer text-lg"
            >
              Testimonials
            </ScrollLink>

            <ScrollLink
              to="subscription"
              className="cursor-pointer text-lg p-1 px-2 border text-blue-600 bg-white rounded-lg hover:font-semibold"
              smooth={true}
              duration={500}
              offset={-50}
            >
              Get Started
            </ScrollLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-8 h-8" />
            ) : (
              <Menu className="w-8 h-8" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              // initial="hidden"
              // animate="visible"
              // exit="exit"
              // variants={menuVariants}
              // transition={{ duration: 0.5, ease: "easeInOut" }}
              // className="sm:hidden bg-[#2e2e2e] text-white space-y-1 overflow-hidden"
            >
              <ScrollLink
                to="features"
                smooth={true}
                duration={900}
                offset={-50}
                className="hover:bg-gray-700 cursor-pointer block px-4 py-2"
              >
                Features
              </ScrollLink>
              <ScrollLink
                to="subscription"
                smooth={true}
                duration={900}
                offset={-50}
                className="block px-4 py-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </ScrollLink>
              <ScrollLink
                to="work"
                smooth={true}
                duration={900}
                offset={-50}
                className="block px-4 py-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How it Works
              </ScrollLink>
              <ScrollLink
                to="testimonial"
                smooth={true}
                duration={900}
                offset={-50}
                className="block px-4 py-2 hover:bg-gray-700 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Testimonials
              </ScrollLink>

              <div className="flex items-end p-2">
                <ScrollLink
                  to="subscription"
                  className="w-full text-center text-xl py-2 px-4 border text-blue-600 bg-white rounded-lg hover:font-semibold"
                  smooth={true}
                  duration={500}
                  offset={-50}
                >
                  Get Started
                </ScrollLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>



      <div id="home" className="font-sans  min-w-screen pt-1 md:pt-20"
        style={{
          backgroundImage: `url(${bgimage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          //borderradius: "0% 0% 100% 100%",
          // borderBottomLeftRadius: "30%",
          // borderBottomRightRadius: "30%",

          // transform: loaded ? "scale(1)" : "scale(1.5)",
          // transition: "transform 0.6s ease-in-out",
        }}
      >
        {/* Navbar */}


        {/* Hero Section */}
        

<div className=" relative p-6">
        <div className="py-[46%] min-[360px]:py-[46%] md:py-[28%]  lg:py-[26%] xl:py-[20%] z-0">
        <div className="h-12 w-full flex justify-center items-center mb-10">
        <div className="h-12 w-48">
          <img src={reviews} className="absolute top-14 md:top-5 h-12 w-48"/></div></div>
          <header className="  text-white  flex flex-col justify-center items-center text-center font-serif ">
            
            <h1 className="text-2xl absolute top-32 md:text-5xl font-bold md:w-[80%] p-1 flex items-center justify-center">
              The Secure Digital Vault for Your Life and Beyond
            </h1>
            <p className="text-lg absolute top-60 md:top-72 md:text-xl mb-6 flex justify-center">
              Securely store and share your important documents with your chosen
              nominees.
            </p>
            <div className="flex absolute top-80 md:top-96 space-x-4 justify-center">
              
            <ScrollLink
            to="subscription"
            smooth={true}
            duration={500}
            offset={-50}
            >

            <button className="bg-blue-600  px-6 py-3 rounded-lg text-white font-semibold hover:bg-blue-700 font-sans">
                Secure Your Legacy
              </button>
            </ScrollLink>

            <ScrollLink
            to="benifit"
            smooth={true}
            duration={500}
            offset={-50}
            >
            <button className="bg-transparent border px-6 py-3 rounded-lg text-white font-semibold hover:bg-blue-700 font-sans">
                Benefits
              </button>
              </ScrollLink>

             
            </div>
          </header>

          {/* desktop image */}

        </div>
        </div>



      </div>
      {/* <div className="h-[28vh] sm:h-[40vh] md:h-[70vh]  lg:h-[110vh]  bg-[#f5f5f5] z-20"></div> */}
      {/* Features Section */}

      <div className="relative flex items-center justify-center w-full min-[400px]:-mt-[rem] -mt-[2.5rem] sm:-mt-[16rem] md:-mt-[7rem] lg:-mt-[14rem] xl:-mt-[12rem] 2xl:-mt-[19rem] z-30">
        <img
          src={heroimage}
          alt="heroimage"
          className="h-full min-w-[100%] object-contain mx-auto"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F5F5F5] via-[#F5F5F5]/50  md:via-[#F5F5F5]/50 to-transparent blur-sm pointer-events-none"></div>
      </div>


      <div id="features" className="relative flex flex-col justify-center items-center -mt-[5rem] sm:-mt-[6rem] md:-mt[15rem] lg:-mt-[18rem] text-center bg-[#F5F5F5] pt-4 z-30 ">
        <div className="flex  p-1 text-blue-700 font-serif text-lg px-2 rounded-lg gap-x-1">
          <MousePointerClickIcon /> Cumulus's Features
        </div>
        <div className="mt-2 p-1 sm:p-4">
          <h2 className="text-3xl sm:text-5xl font-serif font-semibold">
            Secure Your Legacy With Cumulus
          </h2>
        </div>
        <div className="w-[95%] sm:w-1/2">
          <p className="text-lg text-gray-500">
            Securely store and share your family documents with your chosen
            nominees.
          </p>
        </div>
        <div className="mt-2 h-12 w-32 bg-blue-500 text-lg text-white rounded-lg hover:bg-blue-600">
        <ScrollLink
            to="subscription"
            smooth={true}
            duration={500}
            offset={-50}
            > <button className="mt-2">Get Started</button></ScrollLink>
         
        </div>
        {/* Images Section */}

        <div className="w-full max-w-9xl bg-[#F5F5F5]">
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-[80%]  mx-auto bg-[#F5F5F5]">
            {/* First Image (66% width - spans 2 columns) */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex flex-col md:hidden bg-gradient-to-b from-gray-50 via-gray-50 to-gray-50 p-3 rounded-3xl border-2 shadow-lg">
                <p className="text-xl font-semibold mt-4">End-to-End Encrypted Storage </p>
                <p className="text-xs font-semibold text-slate-400 my-4">Easily upload, categorize, and retrieve your files.
                </p>
                <img
                src={mobileBox}
                alt="Feature 1"
                className=""
              />
                
              </div>

              <img
                src={Box1}
                alt="Feature 1"
                className="rounded-3xl shadow-lg w-full h-full object-cover hidden md:inline"
              />
            </div>

            {/* Second Image (33% width - spans 1 column) */}
            <div className="col-span-1">
              <img
                src={box2}
                alt="Feature 2"
                className="rounded-3xl shadow-lg w-full h-full object-cover"
              />
            </div>

            {/* Third Image (Full Width Below) */}
            <div className="col-span-1 ">
              <img
                src={box3}
                alt="Feature 3"
                className="rounded-3xl shadow-lg w-full h-full object-cover"
              />
            </div>

            {/* Fourth Image (Full Width Bottom) */}
            <div className="col-span-1 md:col-span-2">
            <div className="flex flex-col md:hidden bg-gradient-to-b from-gray-50 via-gray-50 to-gray-50 p-3 rounded-3xl border-2 shadow-lg">
                <p className="text-xl font-semibold mt-4">Digital Vault with Advanced Encryption</p>
                <p className="text-xs font-semibold text-slate-400 my-4">Assign trusted nominees to access your documents after life.
                </p>
                <img
                src={mobileBox4}
                alt="Feature 1"
                className=""
              />
                
              </div>
              <img
                src={Box4}
                alt="Feature 4"
                className="rounded-3xl shadow-lg w-full h-full object-cover hidden md:inline"
              />
            </div>
          </div>
        </div>
      </div>



      <div id="subscription">
        <Subscription />
      </div>
      <div id="benifit">
        <Benifit />
      </div>
      <div id="work">
        <Work />
      </div>

      <div id="testimonial">
        <Testimonial />
      </div>

      <div id="faq">
        <Faq />
      </div>

      <div id="assistance">
        <Assistance />
      </div>

      <div id="footer">
        <Footer />
      </div>
    </>
  );
}

export default Hero;
