import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import axios from "axios";
// import { Link as ScrollLink } from "react-scroll";
import { Link as ScrollLink } from "react-scroll";
import tic from "../Assets/tick.png"
import { API_URL } from "../../utils/Apiconfig";
import { Link, useNavigate } from "react-router-dom";
function CompareTable({ onClose }) {

  useEffect(() => {
    // Disable background scrolling when the component is mounted
    document.body.style.overflow = "hidden";

    // Re-enable background scrolling when the component is unmounted
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  const tableData = [
    { feature: "Storage", plans: ["20 GB", "50 GB", "Custom Storage"] },
    { feature: "Advanced Encryption", plans: [true, true, true] },
    { feature: "Basic Document Sharing", plans: [true, true, true] },
    { feature: "Basic Inheritance", plans: [true, true, true] },
    { feature: "Google Drive Integration", plans: [true, true, true] },
    { feature: "Standard Support", plans: [true, true, true] },
    { feature: "Top Compliance Level Encryption", plans: [false, true, true] },
    { feature: "Advanced Sharing Controls", plans: [false, true, true] },
    { feature: "Advanced Inheritance Options", plans: [false, true, true] },
    { feature: "Full Suite of Integrations", plans: [false, true, true] },
    { feature: "Automatic Photo Upload", plans: [false, true, true] },
    { feature: "Priority Support", plans: [false, false, true] },
    { feature: "Voice Memo", plans: [false, false, true] },
    { feature: "Notepad", plans: [false, false, true] },
    { feature: "Dropbox Integration", plans: [false, false, true] },
    { feature: "Customizable Solutions", plans: [false, false, true] },
  ];


  const planNames = [
    "Foundation (Standard)",
    "Legacy (Premium)",
    "Heritage (Enterprise)",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-2">
      <div className=" rounded-lg shadow-lg max-w-[90%] w-full">

        <div className="h-10 w-full flex justify-end min-[600px]:hidden">
          <h1 className=""><button

            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-8 h-8 text-white"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 7.586l4.293-4.293a1 1 0 111.414 1.414L11.414 9l4.293 4.293a1 1 0 11-1.414 1.414L10 10.414l-4.293 4.293a1 1 0 11-1.414-1.414L8.586 9 4.293 4.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button></h1>
        </div>
        <div className="overflow-y-auto bg-white rounded-xl overflow-x-auto md:max-h-[80vh] max-h-[80vh]">

          <table className="table-auto w-[100%] text-sm sm:text-xs md:text-sm lg:text-base z-50">
            <thead className="sticky top-0 z-50 ">
              <tr>
                <th className="sticky left-0 rounded-tl-xl border-r-1 p-4 md:p-8 border-white sm:p-2 text-center bg-black text-white w-[10%] md:w-[25%]">
                  Features
                </th>
                {planNames.map((plan, index) => (
                  <th
                    key={index}
                    className={` border-r-2 border-white p-4 md:p-8 text-center bg-black text-white ${index === planNames.length - 1 ? 'rounded-tr-xl w-[25%]' : ''
                      } ${index === 0 ? 'border-l-2' : ""}`}
                    style={{
                      position:
                        index === 0 ? "sticky" : "",
                      left:
                        index === 0 ? "119px" : "",
                      zIndex:
                        index === 0 ? "50" : "",
                    }}
                  >
                    <div className="flex items-center justify-center relative">
                      <div className="">
                        {plan}</div>
                      {index === planNames.length - 1 && (

                        <div className=" h-5 w-10 max-[600px]:hidden">
                          <button
                            className="text-white text-sm absolute -top-6 -right-6"
                            onClick={onClose}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="w-8 h-8"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 7.586l4.293-4.293a1 1 0 111.414 1.414L11.414 9l4.293 4.293a1 1 0 11-1.414 1.414L10 10.414l-4.293 4.293a1 1 0 11-1.414-1.414L8.586 9 4.293 4.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>

                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="border-2 sticky left-0 z-20 bg-white font-semibold border-gray-300 p-4 sm:p-2 md:py-6 w-[10%] md:w-[25%] ">{row.feature}</td>
                  {row.plans.map((plan, planIndex) => (
                    <td
                      key={planIndex}
                      className="border-2 border-gray-300 p-2 sm:p-1 text-center"
                      style={{
                        backgroundColor:
                          planIndex === 0
                            ? '#F9FAFB' // 1st column (lightest white)
                            : planIndex === 1
                              ? '#eef8ff' // 2nd column (lightest red)
                              : planIndex === 2
                                ? '#F9FAFB' // 3rd column (lightest green)
                                : '#F9FAFB', // 4th column (lightest red)

                        position:
                          planIndex === 0 ? "sticky" : "",

                        left:
                          planIndex === 0 ? "119px" : "",

                        zIndex:
                          planIndex === 0 ? "40" : planIndex === 1 ? "40" : "",


                      }}
                    >
                      {plan === true ? (
                        <span className="text-blue-100 flex items-center justify-center"><img src={tic} className="h-8 w-8" /></span>
                      ) : plan === false ? (
                        <span></span>
                      ) : (
                        plan
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>

    </div>

  );
}

function SubscriptionCard({ type, data, isActive, onHover }) {
  const navigate = useNavigate();
  return (
    <div
      className={`bg-white shadow-lg rounded-lg p-4 border-2 ${isActive ? "border-blue-500" : "border-transparent"
        } hover:border-blue-500 transition-all`}
      onMouseEnter={() => onHover(type)}
      onMouseLeave={() => onHover(null)}
    >
      <h2 className="text-xl font-semibold mb-4">
        {data.subscription_name}
        {/* {data.recommended && (
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full ml-2">
            Recommended
          </span>
        )} */}
      </h2>
      <p className="text-2xl font-bold mb-4">
        {data.price === "Custom Pricing" ? data.price : `$${data.price}`}
        {data.period && <span className="text-sm"> {data.period}</span>}
      </p>



      <div className="plan">
        {data.buttonLabel === "Contact Us" ? (
          <ScrollLink
            to="assistance" // ID of the target section
            smooth={true}
            duration={500}
            className="w-full bg-blue-500 text-white py-2 rounded-lg mb-4 cursor-pointer block text-center"
          >
            {data.buttonLabel}
          </ScrollLink>
        ) : (
          <button
            className="w-full bg-blue-500 text-white py-2 rounded-lg mb-4"
            onClick={() => navigate('/Signup')} // Redirect to /Signup
          >
            {data.buttonLabel}
          </button>
        )}
      </div>




      <ul className="space-y-2">
        {data.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="text-green-500 mr-2" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Subscription() {
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [isYearly, setIsYearly] = useState(false);


  const togglePlan = () => {
    setIsYearly((prev) => !prev);
    setPlans((prevPlans) =>
      prevPlans.map((plan) => {
        if (plan.subscription_name === "Foundation (Standard)") {
          return {
            ...plan,
            price: isYearly ? "4.99" : "4.99",
            period: isYearly ? "/month" : "/month",
          };
        } else if (plan.subscription_name === "Legacy (Premium)") {
          return {
            ...plan,
            price: isYearly ? "9.99" : "9.99",
            period: isYearly ? "/month" : "/month",
          };
        }
        return plan;
      })
    );
  };

  const response = [
    {
      cost: {
        monthly: "4.99",
        yearly: "49",
        custom_pricing: false
      },
      features: {
        storage: "20 GB",
        encryption: "Advanced Encryption",
        document_sharing: "Standard",
        inheritance_features: "Basic Inheritance",
        integrations: ["Google Drive"],
        automatic_photo_upload: false,
        support: "Standard Support",
        extra_features: []
      },
      _id: "6749711c3d3e25604853e8a5",
      subscription_name: "Foundation (Standard)",
      created_at: "2024-11-29T07:45:32.196Z",
      __v: 0
    },
    {
      cost: {
        monthly: "9.99",
        yearly: "99",
        custom_pricing: false
      },
      features: {
        storage: "50 GB",
        encryption: "Enhanced Encryption",
        document_sharing: "Advanced Sharing Controls",
        inheritance_features: "Advanced Nominee Assignment",
        integrations: ["Google Drive", "Dropbox Integration"],
        automatic_photo_upload: true,
        support: "Priority Support",
        extra_features: ["Voice Memo"]
      },
      _id: "674971b63d3e25604853e8a8",
      subscription_name: "Legacy (Premium)",
      created_at: "2024-11-29T07:48:06.190Z",
      __v: 0
    },
    {
      cost: {
        monthly: null,
        yearly: null,
        custom_pricing: true
      },
      features: {
        storage: "Custom Storage Options",
        encryption: "Top Compliance Level Encryption",
        document_sharing: "Full Sharing & Customization",
        inheritance_features: "Custom Inheritance Options",
        integrations: ["Full Suite of Integrations"],
        automatic_photo_upload: true,
        support: "24/7 Dedicated Support",
        extra_features: ["Voice Memo", "Notepad", "Customizable Solutions"]
      },
      _id: "6749728b3d3e25604853e8ab",
      subscription_name: "Heritage (Enterprise)",
      created_at: "2024-11-29T07:51:39.477Z",
      __v: 0
    }
  ];

  useEffect(() => {
    const formattedPlans = response.map((plan) => ({
      subscription_name: plan.subscription_name,
      price: plan.cost.monthly || "Custom Pricing",
      period: plan.cost.monthly ? "/month" : null,
      features: [
        plan.features.storage,
        plan.features.encryption,
        plan.features.document_sharing,
        plan.features.inheritance_features,
        ...plan.features.integrations,
        ...plan.features.extra_features
      ],
      buttonLabel: plan.cost.custom_pricing ? "Contact Us" : "Try Now",
      to: plan.cost.custom_pricing ? "assistance" : "/signup",
      recommended: plan.subscription_name === "Legacy (Premium)"
    }));

    setPlans(formattedPlans);
  }, []);
  



  return (
    <div className="bg-gray-100 py-10">
      <h1 className="text-3xl font-bold font-serif text-center mb-6">
        Cumulus Subscription
      </h1>

      <p className="text-center text-gray-600 mb-4">
        Upgrade to Cumulus Premium for exclusive features, advanced tools, and
        priority support!
      </p>

      <div className="flex justify-center items-center flex-row py-2 mb-2">
        {/* Monthly Section */}
        <span className="px-2 font-semibold">Monthly</span>

        {/* Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer mx-2">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isYearly}
            onChange={togglePlan}
          />
          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
        </label>

        {/* Yearly Section */}
        <div className="flex pt-4 flex-col items-start">
          <span className="px-3 font-semibold">Yearly</span>
          <span className=" text-blue-500 text-[0.7rem]">
            (Save Upto 60%)
          </span>
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <SubscriptionCard
            key={index}
            type={plan.subscription_name}
            data={plan}
            isActive={hoveredPlan === plan.subscription_name}
            onHover={setHoveredPlan}
          >

          </SubscriptionCard>
        ))}
      </div>


      <p
        className="text-blue-500 cursor-pointer underline mt-6 text-center"
        onClick={() => setShowTable(true)}
      >
        Compare All Subscription Prices
      </p>
      {showTable && <CompareTable onClose={() => setShowTable(false)} />}
    </div>
  );
}

export default Subscription;
