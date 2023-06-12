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

  // send message to background.js
  async function translaterate(e){
    chrome.storage.local.get(
        'state',
        async (result) => {
          // if it's the user first visit 
          if(!result.state || result.state === 'off')return;
          
          const input = e.target

          const text = input.value
          const language = 'ar'

          // send message to background.js
          chrome.runtime.sendMessage({ 
            translateration:true, 
            text,
            language,
          },handleError);

        }
    );
  }


  // listen to translateration from background.js
  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if(message.translateration !== true) return;
    const {result} = message
    const input = document.querySelector("*:focus")
    input.value = result
    // console.log(input)
  });


  // Event listiners
  const inputElements = Array.from(document.querySelectorAll("input,textarea"))
  inputElements.forEach(input=>{
    input.addEventListener('input',translaterate)
  })

// 