import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import profile1 from "../Assets/profile1.jpeg"
import profile2 from "../Assets/profile2.jpeg"
import profile4 from "../Assets/Julie.jpg"
import profile5 from "../Assets/Johnny.jpeg"
import profile6 from "../Assets/James.jpg"
import profile7 from "../Assets/William.jpeg"
import profile8 from "../Assets/Hanry.png"
import profile9 from "../Assets/Olivia.jpg"
import frame from "../Assets/framebackground.png";
const testimonials = {
    "Family Members": [
        {
            id: 1,
            name: "Joseph",
            role: "Brother",
            image: profile1, // Replace with the actual image path
            review: "Cumulus gave me peace of mind knowing my family’s most important documents are secure and accessible when needed.",
        },
        {
            id: 2,
            name: "Sarah",
            role: "Sister",
            image: profile2, // Replace with the actual image path
            review: "Sharing important memories and legal documents with my loved ones has never been easier. Cumulus is a lifesaver!",
        },
        // {
        //     id: 3,
        //     name: "John",
        //     role: "Brother",
        //     image: profile3, // Replace with the actual image path
        //     review: "The platform’s simplicity and efficiency are unmatched. I was able to assign important documents to my family in just a few clicks. Now, I feel relieved knowing everything is in place for my loved ones.",
        // },

    ],
    "Business Owners": [
        {
            id: 1,
            name: "Julie ",
            role: "Small Business Owner",
            image: profile4,
            review: "With Cumulus, I can securely store and share business-critical files with my team, ensuring smooth operations and peace of mind.",
        },
        {
            id: 2,
            name: "Johnny ",
            role: "large Business Owner",
            image: profile5,
            review: "Cumulus simplifies document management, giving me more time to focus on growing my business.",
        },
        // {
        //     id: 3,
        //     name: "James",
        //     role: "extralarge Business Owner",
        //     image: profile6,
        //     review:"As a startup owner, efficiency is everything. This platform simplified my document organization and gave me peace of mind knowing everything is securely stored. Highly recommend it!",
        // },

    ],
    "Working Professionals": [
        {
            id: 1,
            name: "William",
            role: "Marketing",
            image: profile7,
            review: "Managing my personal and work documents is a breeze with Cumulus. I can access what I need anytime, anywhere.",
        },
        {
            id: 2,
            name: "Hanry",
            role: "Developer",
            image: profile8,
            review:"Cumulus makes staying organized effortless. I trust it for both my personal and professional needs.",
        },
        // {
        //     id: 3,
        //     name: "Olivia ",
        //     role: "Teacher",
        //     image: profile9,
        //     review: " I needed a tool to manage my documents seamlessly. This platform has been a lifesaver! needed a tool to manage my documents seamlessly",
        // },

    ],
};

function Testimonial() {
    const [activeCategory, setActiveCategory] = useState("Family Members");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [direction, setDirection] = useState('right');
    const [isHovered, setIsHovered] = useState(false);


    const handleNext = () => {
        setDirection("right");
        setCurrentIndex((prevIndex) =>
            prevIndex === testimonials[activeCategory].length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrev = () => {
        setDirection("left")
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? testimonials[activeCategory].length - 1 : prevIndex - 1
        );
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 3000);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        let interval;
        if (isMobile && !isHovered) {
            interval = setInterval(handleNext, 5000);
        }

        return () => clearInterval(interval);
    }, [isMobile, isHovered, activeCategory]);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);



    return (
        <>
            <div className='w-full max-w-9xl bg-[#2E2E2E] py-4 '
                style={{
                    backgroundImage: `url(${frame})`,
                    backgroundSize: "cover",

                    backgroundPosition: "center",
                }}
            >
                <div className="w-full   max-w-7xl mx-auto p-6  rounded-lg shadow-md   ">
                    <div className='flex justify-center pb-4'><span className='inline-flex justify-center p-2 bg-white rounded-2xl '>
                        <Users className="h-5" /> <span className='font-sm'>Testimonial</span>
                    </span></div>

                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 mt-2 text-white">What Our Users Say</h2>

                    {/* Tabs */}
                    <div className="flex justify-center space-x-4  md:mb-6">
                        {Object.keys(testimonials).map((category) => (
                            <button
                                key={category}
                                className={`px-4 py-2 rounded ${activeCategory === category
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-700"
                                    } `}
                                onClick={() => {
                                    setActiveCategory(category);
                                    setCurrentIndex(0);
                                }}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Review Slider */}
                    <div className="flex items-center justify-center cursor-pointer"
                     onMouseEnter={handleMouseEnter} // Stop on hover
                     onMouseLeave={handleMouseLeave} // Resume on mouse leave
                    >
                        <div className="flex flex-col items-center text-center mx-4 p-6 rounded-lg">

                            <AnimatePresence mode='wait'>
                                <motion.div
                                    key={currentIndex}
                                    initial={{
                                        opacity: 0,
                                        x: direction === "right" ? 50 : -50, // Animation based on direction
                                    }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{
                                        opacity: 0,
                                        x: direction === "right" ? -100 : 100, // Exit animation based on direction
                                    }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <p className="text-white  font-serif mb-4">
                                        {testimonials[activeCategory][currentIndex].review}
                                    </p>
                                    <div className='inline-flex p-2 pb-1 px-8 rounded-xl mt-4 justify-center bg-gray-700 items-center'>
                                        <img
                                            src={testimonials[activeCategory][currentIndex].image}
                                            alt={testimonials[activeCategory][currentIndex].name}
                                            className="w-16 h-16 rounded-full  bg-slate-500 object-cover "
                                        />
                                        <div className='ml-1 items-centr'>

                                            <p className="text-white text-md ml-2 font-semibold">
                                                {testimonials[activeCategory][currentIndex].name}
                                            </p>

                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                    </div>

                    <div className='flex justify-between md:justify-around'>
                        <button
                            className="text-white"
                            // onClick={handlePrev(left)}
                            onClick={handlePrev}
                        >
                            <ChevronLeft size={32} />
                        </button>

                        <button
                            className="text-white"
                            onClick={handleNext}
                        >
                            <ChevronRight size={32} />
                        </button>
                    </div>
                </div>
            </div>

        </>

    );
}

export default Testimonial;
