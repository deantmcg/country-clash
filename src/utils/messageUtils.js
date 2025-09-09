import messages from '../data/messages.json';

let currentLanguage = 'en';

export const setLanguage = (language) => {
  if (messages[language]) {
    currentLanguage = language;
  } else {
    console.warn(`Language ${language} not found, falling back to English`);
    currentLanguage = 'en';
  }
};

export const getMessage = (messageKey, ...args) => {
  // Split the key by dots to access nested properties
  const keys = messageKey.split('.');
  let message = messages[currentLanguage];
  
  for (const key of keys) {
    if (message && message[key]) {
      message = message[key];
    } else {
      console.warn(`Message key ${messageKey} not found`);
      return messageKey;
    }
  }

  // Replace tokens with args
  return args.reduce((msg, arg, i) => msg.replace(`{${i}}`, arg), message);
};

// Get the current language
export const getCurrentLanguage = () => currentLanguage;

// Get available languages
export const getAvailableLanguages = () => Object.keys(messages);
