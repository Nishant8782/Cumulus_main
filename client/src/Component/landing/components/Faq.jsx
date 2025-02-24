import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { API_URL } from "../../utils/Apiconfig";

function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("General Questions");
  const [categories, setCategories] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryMap, setCategoryMap] = useState({});

  // Fetch categories on initial render
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/faq/topics`);
        const data = await response.json();

        // Assuming the API returns topics inside a "topics" array
        const fetchedCategories = data.topics.map((topic) => topic.topic);
        const categoryMap = data.topics.reduce((map, topic) => {
          map[topic.topic] = topic._id; // Map topic names to topic IDs
          return map;
        }, {});

        setCategories(fetchedCategories);
        setCategoryMap(categoryMap); // Store the category to topic_id mapping
      } catch (error) {
        // console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch FAQs for the selected category (by topic_id)
  useEffect(() => {
    const fetchFaqs = async () => {
      if (!selectedCategory || !categoryMap[selectedCategory]) return;

      setLoading(true);

      try {
        const topicId = categoryMap[selectedCategory]; // Get the topic_id for the selected category

        const response = await fetch(`${API_URL}/api/faq/topics/questions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
          topic_id: topicId, // Send the correct topic_id to the API
          }),
        });

        const data = await response.json();
        if (data && data.topic && data.topic.questions) {
          setFaqs(data.topic.questions); // Set the questions for the selected category
        } else {
          setFaqs([]); // No questions found
        }
      } catch (error) {
        // console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [selectedCategory, categoryMap]); // Trigger this effect when category changes

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-9xl px-4 py-6  bg-[#f5f5f5]">
      <div className="lg:px-28">
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-800">
            FAQ
          </h2>
          <p className="text-gray-600 mt-2">
            Have another question you do not see here? Contact us by{" "}
            <a href="mailto:" className="text-blue-500">
              email
            </a>
            .
          </p>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-6 ">
          {categories.length > 0 ? (
            categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                } hover:bg-blue-500 hover:text-white transition`}
                onClick={() => setSelectedCategory(category)} // Update selected category
              >
                {category}
              </button>
            ))
          ) : (
            <p className="text-gray-500">Loading categories...</p>
          )}
        </div>

        {/* FAQs */}
        <div className="bg-gray-50 rounded-lg shadow-md divide-y divide-gray-200">
          {loading ? (
            <p className="text-gray-500 text-center p-4">Loading FAQs...</p>
          ) : faqs.length > 0 ? (
            faqs.map((item, index) => (
              <div key={item._id}>
                <button
                  className="flex justify-between items-center w-full p-4 text-left text-gray-800 hover:bg-gray-100"
                  onClick={() => toggleFaq(index)} // Toggle the FAQ answer
                >
                  <span className="font-medium">{item.question}</span>
                  {activeIndex === index ? (
                    <ChevronUp className="text-blue-500 w-5 h-5" />
                  ) : (
                    <ChevronDown className="text-blue-500 w-5 h-5" />
                  )}
                </button>
                {activeIndex === index && (
                  <div className="px-4 p-4 text-gray-800 text-sm border-t-2">{item.answer}</div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center p-4">No FAQs found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Faq;
