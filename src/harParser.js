// harParser.js

export const parseHarFile = async (file) => {
    const text = await file.text();
    return JSON.parse(text);
  };
  

  