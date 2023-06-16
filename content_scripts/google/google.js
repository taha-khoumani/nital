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
  function selectElement(query){
    return document.querySelector(query)
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

  // Helpers
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
  function makeElementId(element,id){
    const el = document.createElement(element)
    if(id) el.id = id
    return el
  }
  function elementClassInner(element,classList,inner){
    const el = document.createElement(element)
    if(classList) el.classList.add(classList)
    if(inner) el.innerText = inner
    return el
  }
  function wrapInputWithNitalDropdownParentDiv (toWrap) {
    const wrapper = elementClassInner('div','nitalDropdownParent')
    wrapper.style.position = 'relative'

    toWrap.parentNode.insertBefore(wrapper, toWrap);
    return wrapper.appendChild(toWrap);
  };


  // On type
  function translaterate(e){

    chrome.storage.local.get(['selectedLanguage','state'],async(result)=>{

      // Vars.
      const {selectedLanguage,state} = result
      const localInput = e.target
      let messageBody;

      // If it's the user first visit or extension is OFF or the user haven't finished typing the word: return.
      if(!state || state === 'off')return;
      
      // DROPDOWN: If the cursor is under a word: show dropdown menu of possible transliterations.
      if(getCurrentWord(localInput)){ 
        const text = getCurrentWord(localInput)
        messageBody = { 
          translateration:true, 
          language:selectedLanguage,
          text,
        }

        console.log(`Dropdown ${text}`);
    
        chrome.runtime.sendMessage(messageBody,(response)=>{
          // Extract choices from response
          const choices = response.split(' / ')

          // Update dropdown content
          selectElement('.dropdown').innerHTML = ''
          choices.forEach(choice=>selectElement('.dropdown').appendChild(elementClassInner('p','dropdownChoice',choice)))
          selectElement('.dropdown').style.display = 'block'
          
        });

      }else{
        // if cursor under no word "remove" dropdown
        selectElement('.dropdown').style.display = 'none'
      }
      
      // TRANSLITERATE: If user pressed space: Transliterate word behind.
      if(e.key === ' '){
        const text = getSpacedWord(localInput)
        messageBody = { 
          translateration:true, 
          language:selectedLanguage,
          text,
        }
  
        console.log(`Transliterate ${text}`);
  
        chrome.runtime.sendMessage(messageBody,(response)=>{
          //optimize by only asking for the first one or storing the already droped-down value
          const newValue = localInput.value.replace(getSpacedWord(localInput),response.split(' / ')[0]) 
          localInput.value = newValue
        });
      }

    })

  }

  // On focus
  function translaterateSetup(e){

    chrome.storage.local.get(['selectedLanguage','state'],async(result)=>{

      // Vars.
      const {selectedLanguage,state} = result
      const localInput = e.target

      // If it's the user first visit or extension is OFF or the user haven't finished typing the word: return.
      if(!state || state === 'off')return;
      
      // Change typing direction based on language.
      if(selectedLanguage === ('arabic' || 'pashto' || 'persian' || 'urdu')){
        localInput.dir = 'rtl'
        if(selectElement('.dropdown'))selectElement('.dropdown').style.textAlign = 'right'
      }else{
        localInput.dir = 'ltr'
        if(selectElement('.dropdown'))selectElement('.dropdown').style.textAlign = 'left'
      } 
  
      // If not already: wrap input with div with position relative, create dropdown element, append it to relative parent
      if(!localInput.parentNode.classList.contains('nitalDropdownParent')){
        wrapInputWithNitalDropdownParentDiv(localInput)
        const dropdown = elementClassInner('div','dropdown')
        dropdown.style.position = 'absolute'
        dropdown.style.display = 'none'
        selectElement('.nitalDropdownParent').appendChild(dropdown)
      }

      // Switch focus from relative parent to input
      localInput.focus()

    })

  }


  // Event listiners
  const inputElements = Array.from(document.querySelectorAll("input,textarea"))
  inputElements.forEach(input=>{
    input.addEventListener('keyup',translaterate)
    input.addEventListener('focus',translaterateSetup)
  })

// 