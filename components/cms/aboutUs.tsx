"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


export default function About() {
  const [loading, setLoading] = useState(false);

   const [terms, setTerms] = useState({
    _id: "dummy-id",
    title: { en: "About Us", ar: "معلومات عنا" },
    subtitle: { en: "Who we are", ar: "من نحن" },
    sections: [
      {
        _id: "section1",
        title: { en: "Our Mission", ar: "مهمتنا" },
        content: { en: "To provide quality services.", ar: "تقديم خدمات عالية الجودة." },
      },
      {
        _id: "section2",
        title: { en: "Our History", ar: "تاريخنا" },
        content: { en: "Founded in 2020.", ar: "تأسست في عام 2020." },
      },
    ],
    vision: {
      title: { en: "Vision", ar: "الرؤية" },
      description: { en: "To be the best.", ar: "أن نكون الأفضل." },
    },
    values: {
      title: { en: "Values", ar: "القيم" },
      description: { en: "Integrity and trust.", ar: "النزاهة والثقة." },
    },
    team: {
      title: { en: "Team", ar: "الفريق" },
      description: { en: "Our skilled professionals.", ar: "فريقنا من المحترفين." },
    },
  });

  const [activeLang, setActiveLang] = useState(() => {
    return terms.sections?.reduce((acc, _, index) => {
      acc[index] = "en"; // Default all sections to English
      return acc;
    }, {});
  });

  const [firstActiveLang,setFirstActiveLang]=useState({
  })

  // useEffect(() => {
  //   setLoading(true);
  //   axios
  //     .get(
  //       `${
  //         process.env.NEXT_PUBLIC_URL_SERVER
  //       }/api/terms/getTerm/${"67e195d141ec37c818912593"}`
  //     )
  //     .then((res) => {
  //       if (res.data) {
  //         setTerms(res.data);
  //         console.log("terms", res.data);
  //       }
  //     })
  //     .catch((err) => console.error("Error fetching terms:", err))
  //     .finally(() => {
  //       setLoading(false);
  //       // Adjust all textareas after the data is loaded
  //       setTimeout(() => {
  //         document.querySelectorAll("textarea").forEach(adjustTextareaHeightt);
  //       }, 100);
  //     });
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split("."); // Split field name into parts

    setTerms((prevTerms) => {
      const updatedTerms = { ...prevTerms };
      let currentLevel = updatedTerms;

      // Traverse the object until the second-last key
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        currentLevel[key] = { ...currentLevel[key] }; // Ensure immutability
        currentLevel = currentLevel[key]; // Move deeper
      }

      // Set the new value at the final key
      currentLevel[keys[keys.length - 1]] = value;

      return updatedTerms;
    });
  };

  // incremnt index tiem 2
  const handleSectionChange = (index, field, value) => {
    setTerms((prevTerms) => {
      const updatedSections = [...prevTerms.sections];
      updatedSections[index][field] = value;
      return { ...prevTerms, sections: updatedSections };
    });
  };

  const handleAddSection = () => {
    setTerms((prevTerms) => ({
      ...prevTerms,
      sections: [
        ...prevTerms.sections,
        {
          _id: `section${prevTerms.sections.length + 1}`,
          title: { en: "", ar: "" },
          content: { en: "", ar: "" },
        },
      ],
    }));
  };

  const adjustTextareaHeight = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const adjustTextareaHeightt = (textarea) => {
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const error =
    terms.title.en === "" ||
    terms.title.ar === "" ||
    terms.subtitle.en === "" ||
    terms.subtitle.ar === "" ||
    (terms.sections.length > 0 &&
      terms.sections.some(
        (section) =>
          section.title.en === "" ||
          section.title.ar === "" ||
          section.content.en === "" ||
          section.content.ar === ""
      ));

  const handleDeleteSection = async (sectionId, index) => {
    console.log("sectionId", sectionId);

    if (sectionId === undefined) {
      setTerms((prevTerm) => ({
        ...prevTerm,
        sections: prevTerm.sections.filter((sec, i) => i !== index),
      }));
      return;
    }

    setTerms((prevTerms) => ({
      ...prevTerms,
      sections: prevTerms.sections.filter((sec) => sec._id !== sectionId),
    }));

    try {
  //  await axios.delete(
  //       `${process.env.NEXT_PUBLIC_URL_SERVER}/api/terms/${terms._id}/sections/${sectionId}`
  //     );

      toast("Section deleted successfully", {
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error("Error deleting section:", error);

      toast("Failed to delete section", {
        className: "bg-red-500 text-white",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("terms", terms);

    if (error) {
      console.log("error", error);

      toast("Please fill in all fields.", {
        className: "bg-red-500 text-white",
      });
      return;
    }

    try {
      // Update existing terms
      // await axios.put(
      //   `${
      //     process.env.NEXT_PUBLIC_URL_SERVER
      //   }/api/terms/${"67e195d141ec37c818912593"}`,
      //   terms
      // );

      toast("Terms updated successfully!", {
        className: "bg-green-500 text-white",
      });
    } catch (err) {
      console.error("Error updating terms:", err);
      toast("Failed to update terms.", {
        className: "bg-red-500 text-white",
      });
    }
  };

  const toggleLanguage = (index) => {
    setActiveLang((prev) => {
      const currentLang = prev[index] || "en"; // Default to "en" if undefined
      const newLang = currentLang === "en" ? "ar" : "en";
      return { ...prev, [index]: newLang };
    });
  };


  const toggleLanguageFirst = (index) => {
    setFirstActiveLang((prev) => {
      const currentLang = prev[index] || "en"; // Default to "en" if undefined
      const newLang = currentLang === "en" ? "ar" : "en";
      return { ...prev, [index]: newLang };
    });
  };

  return (
    <div className="Cms ">
          <h2 className="text-xl font-bold mb-3 text-center">Edit About Us</h2>
      
      {loading ? (
        <div className="flex items-center justify-center h-screen">
              <div className="flex items-center justify-center h-32">Loading...</div>
        </div>
      ) : (
     
          <form onSubmit={handleSubmit}>
            <div className="w-full flex ">
              <div className="w-1/2 mr-2">
                <label className="block  mb-2 font-medium">Title </label>
                <Input
                  type="text"
                  name="title.en"
                  value={terms.title.en}
                  onChange={handleChange}
                  className="border  w-full rounded-md mb-4"
                />
              </div>

              <div className="w-1/2 ml-2">
                <label className="block  mb-2 text-right">العنوان </label>
                <Input
                  dir="rtl"
                  type="text"
                  name="title.ar"
                  value={terms.title.ar}
                  onChange={handleChange}
                  className="border  w-full rounded-md mb-4"
                />
              </div>
            </div>

            <div className="w-full flex ">
              <div className="w-1/2 mr-2">
                <label className="block mb-2 font-medium">Subtitle </label>
                <Input
                  type="text"
                  name="subtitle.en"
                  value={terms.subtitle.en}
                  onChange={handleChange}
                  className="border p-3 w-full rounded-md mb-4"
                />
              </div>
              <div className="w-1/2 ml-2">
                <label className="block mb-2 text-right">العنوان الفرعي</label>
                <Input
                  dir="rtl"
                  type="text"
                  name="subtitle.ar"
                  value={terms.subtitle.ar}
                  onChange={handleChange}
                  className="border p-3 w-full rounded-md mb-4 text-right"
                />
              </div>
            </div>

            {["vision", "values", "team"].map((item, index) => (
              <motion.div
                key={index + terms._id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="cmsSection"
              >
                <h3 className="text-lg font-semibold text-secondary">{item}</h3>
                <motion.div
                  key={firstActiveLang[index] || "en"}
                  initial={{
                    opacity: 0,
                    x: (firstActiveLang[index] || "en") === "en" ? -50 : 50,
                  }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{
                    opacity: 0,
                    x: (firstActiveLang[index] || "en") === "en" ? 50 : -50,
                  }}
                  transition={{ duration: 0.3 }}
                >


                  <label
                     className={`block mb-1 mt-2  text-base  ${
                      (firstActiveLang[index] || "en") === "en"
                        ? "text-left"
                        : "text-right"
                    }`}
                  >
                    {(firstActiveLang[index] || "en") === "en" ? "Title" : "العنوان"}
                  </label>
                  <Input
                    type="text"
                    dir={`${
                      (firstActiveLang[index] || "en") === "en" ? "ltr" : "rtl"
                    }`}
                    value={terms[item]?.title[firstActiveLang[index] || "en"]}
                    name={`${item}.title.${firstActiveLang[index] || "en"}`}
                    onChange={handleChange}
                    className={`border p-2 w-full ${
                      (firstActiveLang[index] || "en") === "ar" ? "text-right" : ""
                    }`}
                  />




                  <label
                    className={`block mb-1 mt-2  text-base  ${
                      (firstActiveLang[index] || "en") === "en"
                        ? "text-left"
                        : "text-right"
                    }`}
                  >
                    {(firstActiveLang[index] || "en") === "en"
                      ? "Content "
                      : " المحتوي"}
                  </label>
                  <Textarea
                    dir={`${
                      (firstActiveLang[index] || "en") === "en" ? "ltr" : "rtl"
                    }`}
                    value={terms[item]?.description[firstActiveLang[index] || "en"]}
                    name={`${item}.description.${firstActiveLang[index] || "en"}`}
                    onChange={handleChange}
                    onInput={adjustTextareaHeight}
                    className={`border border-gray-200 p-2 w-full ${
                      (firstActiveLang[index] || "en") === "ar" ? "text-right" : ""
                    }`}
                    rows={1}
                    style={{ overflow: "hidden" }}
                  />





                </motion.div>

                {/* Toggle Button */}
                <button
                  type="button"
                  onClick={() => toggleLanguageFirst(index)}
                  className="mt-4 text-xs mr-2 px-2 py-1  rounded border border-gray-300 text-gray-700 hover:bg-gray-100  font-medium transition"
                >
                  {(firstActiveLang[index] || "en") === "en"
                    ? "Switch to Arabic"
                    : "التبديل إلى الإنجليزية"}
                </button>
              </motion.div>
            ))}

            <AnimatePresence>
              {terms.sections?.map((section, index) => (
                <motion.div
                  key={section._id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="cmsSection"
                >
                  <h3 className="text-lg font-semibold text-secondary">
                    Section {index + 1}
                  </h3>
                  <motion.div
                    key={activeLang[index] || "en"}
                    initial={{
                      opacity: 0,
                      x: (activeLang[index] || "en") === "en" ? -50 : 50,
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{
                      opacity: 0,
                      x: (activeLang[index] || "en") === "en" ? 50 : -50,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <label
                      className={`block mb-1 mt-2  text-base  ${
                        (activeLang[index] || "en") === "en"
                          ? "text-left"
                          : "text-right"
                      }`}
                    >
                      {(activeLang[index] || "en") === "en"
                        ? "Title"
                        : "العنوان"}
                    </label>
                    <Input
                      type="text"
                      dir={`${
                        (activeLang[index] || "en") === "en" ? "ltr" : "rtl"
                      }`}
                      value={section.title[activeLang[index] || "en"]}
                      onChange={(e) =>
                        handleSectionChange(index, "title", {
                          ...section.title,
                          [activeLang[index] || "en"]: e.target.value,
                        })
                      }
                      className={`border p-2 w-full ${
                        (activeLang[index] || "en") === "ar" ? "text-right" : ""
                      }`}
                    />

                    <label
                      className={`block mb-1 mt-2  text-base  ${
                        (activeLang[index] || "en") === "en"
                          ? "text-left"
                          : "text-right"
                      }`}
                    >
                      {(activeLang[index] || "en") === "en"
                        ? "Content "
                        : " المحتوي"}
                    </label>
                    <Textarea
                      dir={`${
                        (activeLang[index] || "en") === "en" ? "ltr" : "rtl"
                      }`}
                      value={section.content[activeLang[index] || "en"]}
                      onChange={(e) =>
                        handleSectionChange(index, "content", {
                          ...section.content,
                          [activeLang[index] || "en"]: e.target.value,
                        })
                      }
                      onInput={adjustTextareaHeight}
                      className={`border border-gray-200 p-2 w-full ${
                        (activeLang[index] || "en") === "ar" ? "text-right" : ""
                      }`}
                      rows={1}
                      style={{ overflow: "hidden" }}
                    />
                  </motion.div>

                  {/* Toggle Button */}
                  <button
                    type="button"
                    onClick={() => toggleLanguage(index)}
                    className="mt-4 text-xs mr-2 px-2 py-1  rounded border border-gray-300 text-gray-700 hover:bg-gray-100  font-medium transition"
                  >
                   {(activeLang[index] || "en") === "en"
                      ? "Switch to Arabic"
                      : "التبديل إلى الإنجليزية"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteSection(section._id, index)}
                    className="mt-2 px-2 py-1 rounded border-red-300 border text-red-700 hover:bg-red-50 text-xs font-medium transition"
                  >
                    Delete
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="flex gap-2 mt-5">
              <button
                type="button"
                onClick={handleAddSection}
                className="addSection"
              >
                Add Section
              </button>

              <button
                type="submit"
                className="saveSection"
              >
                Save Changes
              </button>
            </div>
          </form>
       
      )}
 </div>
  );
}
