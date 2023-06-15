// Functions
function applyOrangeOutline() {
    const searchBox = document.querySelector('.RNNXgb');
    searchBox.classList.add("orange-outline");
  }

  function removeOrangeOutline() {
    const searchBox = document.querySelector('.RNNXgb');
    searchBox.classList.remove("orange-outline");
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

let globalInput = null;

function getCurrentWord(input) {
  const value = input.value
  const cursorPosition = input.selectionStart

  // Find the start and end positions of the word
  let start = cursorPosition;
  let end = cursorPosition;
  
  // Move the start position backwards until a space or the beginning of the input field is encountered
  while (start > 0 && value.charAt(start - 1) !== ' ') {
    start--;
  }
  
  // Move the end position forwards until a space or the end of the input field is encountered
  while (end < value.length && value.charAt(end) !== ' ') {
    end++;
  }
  
  // Extract the word based on the start and end positions
  const word = value.substring(start, end);
  
  return word
}
function getSpacedWord(inputElement) {
  const cursorPosition = inputElement.selectionStart;
  const inputValue = inputElement.value
  
  let word = '';
  let i = cursorPosition - 1;
  
  // Move backwards until a non-space character is encountered or the beginning of the input
  do{
    word = inputValue[i] + word;
    i--;
  }
  while (i >= 0 && inputValue[i] !== ' ')



  // Check if the word has a space at the end
  if (word[word.length - 1] === ' ') {
    word = word.trim(); // Remove trailing space
  }

  return word;
}

// Send message to background.js
function translaterate(e){

  chrome.storage.local.get(['selectedLanguage','state'],async(result)=>{

    // Vars.
    const {selectedLanguage,state} = result
    const localInput = e.target
    globalInput = localInput  
    let messageBody;

    // If it's the user first visit or extension is OFF or the user haven't finished typing the word: return.
    if(!state || state === 'off')return;

    // Change typing direction based on language.
    selectedLanguage === ('arabic' || 'pashto' || 'persian' || 'urdu') ? localInput.dir = 'rtl' : localInput.dir = 'ltr'

    
    // If the cursor is under a word: show dropdown menu of possible transliterations.
    if(getCurrentWord(localInput)){
      const text = getCurrentWord(localInput)
      messageBody = { 
        translateration:true, 
        language:selectedLanguage,
        text,
      }

      console.log(`Dropdown ${text}`);return;
  
      chrome.runtime.sendMessage(messageBody,(response)=>{
        // dropdown code...
      });

    }
    
    
    
    // If user pressed space: Transliterate word behind.
    if(e.key === ' '){
      const text = getSpacedWord(localInput)
      messageBody = { 
        translateration:true, 
        language:selectedLanguage,
        text,
      }

      console.log(`Transliterate ${text}`);return;

      chrome.runtime.sendMessage(messageBody,(response)=>{
        // transliterate code...
      });

    }
    


  })

}

/*
// listen to translateration from background.js
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  // if(message.translateration !== true || ) return;

  const {result} = message;
  let value = globalInput.value.replace(getCurrentWord(globalInput),result)

  globalInput.value = value

});
*/

// Event listiners
const inputElements = Array.from(document.querySelectorAll("input,textarea"))
inputElements.forEach(input=>{
  input.addEventListener('keyup',translaterate)
})
// 