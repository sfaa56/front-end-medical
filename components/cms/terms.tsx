"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Terms() {
  const [loading, setLoading] = useState(false);

  // Dummy data for local development
  const [terms, setTerms] = useState({
    _id: "dummy-id",
    title: { en: "Terms & Conditions", ar: "الشروط والأحكام" },
    subtitle: { en: "Please read carefully", ar: "يرجى القراءة بعناية" },
    sections: [
      {
        _id: "section1",
        title: { en: "General Terms", ar: "الشروط العامة" },
        content: {
          en: "These are the general terms and conditions.",
          ar: "هذه هي الشروط والأحكام العامة.",
        },
      },
      {
        _id: "section2",
        title: { en: "User Obligations", ar: "التزامات المستخدم" },
        content: {
          en: "Users must comply with all rules.",
          ar: "يجب على المستخدمين الالتزام بجميع القواعد.",
        },
      },
    ],
  });

  const [activeLang, setActiveLang] = useState(() => {
    return terms.sections?.reduce((acc, _, index) => {
      acc[index] = "en";
      return acc;
    }, {});
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [field, lang] = name.split(".");
    setTerms((prevTerms) => ({
      ...prevTerms,
      [field]: {
        ...prevTerms[field],
        [lang]: value,
      },
    }));
  };

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
          _id: `section${prevTerms.sections.length + 1}_${Date.now()}`,
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

  const handleDeleteSection = (sectionId, index) => {
    setTerms((prevTerm) => ({
      ...prevTerm,
      sections: prevTerm.sections.filter((sec, i) =>
        sectionId ? sec._id !== sectionId : i !== index
      ),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (error) {
      alert("Please fill in all fields.");
      return;
    }
    alert("Terms updated (dummy)!");
  };

  const toggleLanguage = (index) => {
    setActiveLang((prev) => {
      const currentLang = prev[index] || "en";
      const newLang = currentLang === "en" ? "ar" : "en";
      return { ...prev, [index]: newLang };
    });
  };

  return (
    <div className="Cms">
      <h2 className="text-xl font-bold mb-3 text-center">Edit Terms</h2>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="flex items-center justify-center h-32">
            Loading...
          </div>
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
                    {(activeLang[index] || "en") === "en" ? "Title" : "العنوان"}
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