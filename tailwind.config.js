/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./popup/popup.html"],
  theme: {
    extend: {
      width:{
        "100px":"100px",
        "359px":"359px",
      },
      height:{
        "2px":"2px",
        "37px":"37px",
      },
      colors:{
        "black":"#25282E",
        "gray":"#393E46",
        "orange":"#FE552D"
      },
      padding:{
        "3px":"3px",
        "10px":"10px",
      },
      gap:{
        "10px":"10px"
      }
    },
  },
  plugins: [],
}

