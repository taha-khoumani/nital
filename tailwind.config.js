/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./popup/popup.html","./content_scripts/google/google.js"],
  theme: {
    extend: {
      width:{
        "18px":"18px",
        "100px":"100px",
        "359px":"359px",
      },
      height:{
        "2px":"2px",
        "18px":"18px",
        "37px":"37px",
      },
      colors:{
        "black":"#25282E",
        "gray":"#393E46",
        "orange":"#FE552D",
        "link":"#016BF8",
      },
      padding:{
        "3px":"3px",
        "6px":"6px",
        "10px":"10px",
        "11px":"11px",
      },
      gap:{
        "10px":"10px"
      },
      borderWidth:{
        "3px":"3px",
      }
    },
  },
  plugins: [],
}

