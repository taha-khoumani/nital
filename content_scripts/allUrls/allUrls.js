// Functions
  function applyOrangeOutline() {
    const inputElements = document.querySelectorAll('input,textarea');
    inputElements.forEach(element => {
      element.classList.add('orange-outline');
    });
  }

  function removeOrangeOutline() {
    const inputElements = document.querySelectorAll('input,textarea');
    inputElements.forEach(element => {
      element.classList.remove("orange-outline");
    });
  }

  function on(){
    applyOrangeOutline()
  }

  function off(){
    removeOrangeOutline()
  }

  function handleError() {
    if(chrome.runtime.lastError) {

    } else {

    }
  }
// 



// On Click
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "on" ) {
        on();
      }else if(request.message === "off"){
        off()
      }
    }
  );
// 


  
// On load
  chrome.storage.local.get(
    'state',
    (result) => {
        if(result.state === "on")on();
    }
  );
// 



// MAIN-TRANSLATERATION-LOGIC
  const languageMap = {
    arabic: 'ar',
    bengali: 'bn',
    burmese: 'my',
    chinese_simplified: 'zh-CN',
    chinese_traditional: 'zh-TW',
    gujarati: 'gu',
    hindi: 'hi',
    japanese: 'ja',
    kannada: 'kn',
    khmer: 'km',
    korean: 'ko',
    malayalam: 'ml',
    marathi: 'mr',
    nepali: 'ne',
    odia: 'or',
    pashto: 'ps',
    persian: 'fa',
    punjabi: 'pa',
    russian: 'ru',
    sanskrit: 'sa',
    sindhi: 'sd',
    sinhala: 'si',
    tamil: 'ta',
    telugu: 'te',
    thai: 'th',
    urdu: 'ur',
    uzbek: 'uz',
  };


  // send message to background.js
  async function translaterate(e){
    // change typing direction
    chrome.storage.local.get('selectedLanguage',(result)=>{
      const language = result.selectedLanguage
      if(language === ('arabic' || 'pashto' || 'persian' || 'urdu')){
        e.target.dir = 'rtl'
      }      

    })

    chrome.storage.local.get(
      'state',
      (result) => {
        // if it's the user first visit 
        if(!result.state || result.state === 'off')return;
        
        const input = e.target
        const text = input.value          
        const lastWordArray = text.match(/\b(\w+)\b(?= )/g)

        if(!lastWordArray?.length)return;

        chrome.storage.local.get('selectedLanguage',(result)=>{
          
          const lastWord = lastWordArray[0]
          const language = result.selectedLanguage
          const languageCode = languageMap[language]

          // send message to background.js
          chrome.runtime.sendMessage({ 
            translateration:true, 
            language:languageCode,
            text:lastWord,
          },handleError);


        })
        
      }
    )
  }


  // listen to translateration from background.js
  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if(message.translateration !== true) return;
    const {result} = message;console.log(result)

    const input = document.querySelector("*:focus")

    let value = input.value.replace(/\b(\w+)\b(?= )/g,result)

    input.value = value

  });


  // Event listiners
  const inputElements = Array.from(document.querySelectorAll("input,textarea"))
  inputElements.forEach(input=>{
    input.addEventListener('input',translaterate)
  })

// 