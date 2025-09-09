import React, { useState, useEffect } from "react";
import { getCurrentLanguage, setLanguage, getAvailableLanguages } from "../utils/messageUtils";

// Map of language codes to their flags and names
const languageInfo = {
  "en": { flag: "gb", name: "English" },
  "es": { flag: "es", name: "Español" }
};

const LanguageSelector = ({ onChange }) => {
  const [selectedLang, setSelectedLang] = useState(getCurrentLanguage());
  const availableLanguages = getAvailableLanguages();

  useEffect(() => {
    // Update the selected language when it changes externally
    setSelectedLang(getCurrentLanguage());
  }, []);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLang(newLang);
    setLanguage(newLang);
    onChange && onChange(newLang);
  };

  return (
    <div className="relative inline-block">
      <select
        value={selectedLang}
        onChange={handleLanguageChange}
        className="appearance-none bg-white/10 border border-white/20 text-white rounded-lg pl-8 pr-8 py-2 cursor-pointer hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {availableLanguages.map(lang => (
          <option key={lang} value={lang} className="bg-gray-800 text-white">
            {languageInfo[lang]?.name || lang.toUpperCase()}
          </option>
        ))}
      </select>
      <span className={`fi fi-${languageInfo[selectedLang]?.flag} absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-4`}></span>
      <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-white">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSelector;
