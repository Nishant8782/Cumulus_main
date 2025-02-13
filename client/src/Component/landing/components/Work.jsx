import React, { useState } from 'react';
import { Upload, UserPlus, Users, Share2, BadgeCheckIcon, ChevronRight } from 'lucide-react';
import worksimg from "../Assets/work.png"
import asistance from "../Assets/asistance-right.png"
import nominee from "../Assets/Nominee.png"
import signup from "../Assets/Signup.png"
import upload from "../Assets/Upload.png"
import nominees from "../Assets/Nominees.png"
import transfer from "../Assets/Transfer.png"
import { Link as ScrollLink } from "react-scroll";

const Work = () => {
    const [activeTab, setActiveTab] = useState('upload');

    const tabs = [
        { id: 'signup', label: 'Sign Up', icon: <UserPlus />, content: { heading: 'Sign Up', to: 'subscription', text: 'Getting started with Cumulus is simple—sign up to create your secure digital vault. Choose the plan that fits your needs and set up your account with ease, ensuring your documents are protected by Top-grade encryption.', button: 'Get Started', image: signup } },
        { id: 'upload', label: 'Upload Document', icon: <Upload />, content: { heading: 'Upload Document', to: 'subscription', text: 'Easily upload your important documents, such as wills, insurance policies, or personal notes, to your Cumulus vault. Organize them efficiently with custom folders and rest assured they are securely stored in the cloud.', button: 'Get Started', image: upload } },
        { id: 'nominee', label: 'Assign Nominee', icon: <Users />, content: { heading: 'Assign Nominees', to: 'subscription', text: 'Assign trusted nominees to your documents. Whether it’s a family member or a legal representative, you control who can view or manage your files now or in the future, with clear and secure access rights.', button: 'Get Started', image: nominees } },
        { id: 'transfer', label: 'Transfer Access', icon: <Share2 />, content: { heading: 'Transfer Access', to: 'subscription', text: 'Ensure your legacy is preserved by setting up After-Life Access. Seamlessly transfer document access to your nominees when needed, providing peace of mind for you and your loved ones.', button: 'Get Started', image: transfer } },
    ];

    const activeContent = tabs.find(tab => tab.id === activeTab)?.content;

    return (

        <>
            <div className='w-full max-w-9xl bg-[#F5F5F5] py-4'>
                <div className="flex flex-col max-w-7xl w-full mx-auto p-4 items-center justify-center sm:justify-between">

                    <div className='p-2 rounded-xl '>
                        <span className='flex text-blue-700 font-serif text-lg gap-x-1'>  <BadgeCheckIcon /> How Cumulus Works! </span>
                    </div>

                    <div className='space-y-3 mt-2 py-3'>
                        <h2 className=' text-3xl text-center md:text-5xl font-serif '>Customer journey, from start to finish</h2>
                    </div>


                    <div className="w-full flex flex-row  items-center justify-center">
                        <ul className=" flex gap-4 flex-wrap items-center justify-center mt-10">
                            {tabs.map(tab => (
                                <li
                                    key={tab.id}
                                    className={`flex items-center space-x-1 sm:space-x-2 cursor-pointer p-0 sm:p-2 text-xs sm:text-sm rounded-md ${activeTab === tab.id
                                        ? 'relative text-gray-900 after:content-[""] after:absolute after:w-full  after:h-[2px] after:bg-blue-600 after:bottom-[-2px] after:left-0'
                                        : 'text-gray-800'
                                        }`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='flex flex-col sm:flex-row  py-4   items-center w-[99%] sm:justify-around  md:justify- mt-2 md:mt-6'>
                        <div className=" max-w-7xl text-center md:text-left sm:w-[35vw]">
                            <h2 className="text-2xl font-bold mb-4">{activeContent.heading}</h2>
                            <p className="text-gray-600 mb-6 ">{activeContent.text}</p>
                            <ScrollLink
                                  className='flex justify-center md:justify-start'
                                to={activeContent.to} // Target the "to" property dynamically
                                smooth={true}
                                duration={500}
                                offset={-50}
                            >
                                <button className="px-3 py-2 mb-4 md:mb-0 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 flex  justify-center md:justify-start items-center">
                                    {activeContent.button}

                                    <ChevronRight className='h-5' />
                                </button>
                            </ScrollLink>
                        </div>
                        {/* Right Content */}
                        <div className=''>
                            <div className="w-full">
                                <img
                                    src={activeContent.image}
                                    alt={activeContent.heading}
                                    className="rounded-lg shadow-lg object-fit h-40 md:h-52 lg:h-80 w-full"
                                />
                            </div> 

                        </div>
                    </div>

                    {/* Text and Button */}


                </div>
            </div>

        </>

    );
};

export default Work;
