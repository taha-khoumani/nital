// Functions
function applyOrangeOutline() {
    const searchBox = document.querySelector('form>#container');
    searchBox.classList.add("orange-outline-bar");

    const icon = document.querySelector('#search-icon-legacy');
    icon.classList.add("orange-outline-icon");
  }

  function removeOrangeOutline() {
    const searchBox = document.querySelector('form>#container');
    searchBox.classList.remove("orange-outline-bar");

    const icon = document.querySelector('#search-icon-legacy');
    icon.classList.remove("orange-outline-icon");
  }

  function on(){
    applyOrangeOutline()
  }

  function off(){
    removeOrangeOutline()
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
        // window.location.reload()
      }else if(request.message === "off"){
        off()
        // window.location.reload()
      }
      chrome.storage.local.get(['state'],async(result)=>{
        const {state} = result
        updateDualInput(state,selectElement('input'))
      })
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
      // console.log(word)
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
    function getStringBeforeWord(inputString, word) {
      const wordsArray = inputString.split(word);
      if (wordsArray.length > 1) {
        return wordsArray[0];
      } else {
        return "";
      }
    }
    function getCssStyle(element, prop) {
      return window.getComputedStyle(element, null).getPropertyValue(prop);
    }
    function getFont(input){
      const weight = getCssStyle(input,'font-weight') 
      const size = getCssStyle(input,'font-size')
      const familly = getCssStyle(input,'font-family')
      return `${weight} ${size} ${familly}`
    }
    function getTextWidth(text, font) {
      // re-use canvas object for better performance
      const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
      const context = canvas.getContext("2d");
      context.font = font;
      const metrics = context.measureText(text);
      return metrics.width;
    }
    function positionDropdown(input,dropdown){
      const stringOffset = getStringBeforeWord(input.value,getCurrentWord(input))
      const textFont = getFont(input)
      const offset = `${getTextWidth(stringOffset,textFont)}px`
      if(input.dir === 'ltr'){
        dropdown.style.left = offset
        dropdown.style.right = 'auto'
      }else{
        dropdown.style.right = offset
        dropdown.style.left = 'auto'
      }
    }
    function updateDropDown(input,choices){

      // vars
      const dropdown = selectElement('.dropdown')

      // reset
      dropdown.innerHTML = ''
      
      // add content and event listiners
      choices.forEach((choice,index)=>{
        const pElement = elementClassInner('p','dropdownChoice',choice)
        pElement.tabIndex = index + 1
        pElement.cursor = 'default' //So that there is no cursor flickering when the p is focused on.

        // Event listiners
          pElement.addEventListener('click',()=>{
            input.value = input.value.replace(getCurrentWord(input),choice) + " "
            dropdown.style.display = 'none'
            input.focus()
          })
          pElement.addEventListener('keyup',(e)=>{
            if(e.key ==='Enter' || e.key === ' ')e.target.click()
            // else if (e.key === 'ArrowDown') e.target.nextSibling.focus()
            // else if (e.key === 'ArrowUp') e.target.previousSibling ? e.target.previousSibling.focus() : input.focus()
          })
        // 
        dropdown.appendChild(pElement)
      })

      // position dropdown
      positionDropdown(input,dropdown)

      // display
      dropdown.style.display = 'block'
    }
    function updateDropdownPosition(language,input){
      if(language === ('ar' || 'ps' || 'fa' || 'ur')){
        input.dir = 'rtl'
        if(selectElement('.dropdown')){
          selectElement('.dropdown').style.textAlign = 'right'
          selectElement('.dropdown').style.left = 'auto'
          selectElement('.dropdown').style.right = '0'
          positionDropdown(input,selectElement('.dropdown'))
        }

      }else{
        input.dir = 'ltr'
        if(selectElement('.dropdown')){
          selectElement('.dropdown').style.textAlign = 'left'
          positionDropdown(input,selectElement('.dropdown'))
        }

      } 
    }
    function wrapUpInputInitilazer(input){
      if(!input.parentNode.classList.contains('nitalDropdownParent')){
        wrapInputWithNitalDropdownParentDiv(input)
        const dropdown = elementClassInner('div','dropdown')
        dropdown.style.position = 'absolute'
        dropdown.style.display = 'none'
        selectElement('.nitalDropdownParent').appendChild(dropdown)
      }
    }



  // Vars
    let lastTransliterationChoice = {
      original:'',
      translateration:'',
    }



  // On type
  function translaterate(e){

    chrome.storage.local.get(['selectedLanguage','state'],async(result)=>{

      // Vars.
      const {selectedLanguage,state} = result
      const localInput = e.target
      let messageBody;

      // If it's the user first visit or extension is OFF or the user haven't finished typing the word: return.
      if(!state || state === 'off')return;

      // If there is no text hide dropdown and return
      if(localInput.value.replace(/\s/g,'') === ''){selectElement('.dropdown').style.display = 'none';return;}
      
      // UPDATE-DROPDOWN: If the cursor is under a word: show dropdown menu of possible transliterations.
        const currentWord = getCurrentWord(localInput)
        if(currentWord){ 

          // NAVIGATE-DROPDOWN
            if(e.key === 'ArrowDown'){
              const firstChoice = selectElement('.dropdown').firstChild
              firstChoice.focus()
              return;
            }
          // 

          const text = currentWord
          messageBody = { 
            translateration:true, 
            to:selectedLanguage,
            text,
            n:'8'
          }
      
          chrome.runtime.sendMessage(messageBody,(response)=>{
            // check if you have reached rates limits
            if(response?.message){
              alert(response.message)
              return;
            }

            // Extract choices from response
            lastTransliterationChoice = {
              original:currentWord,
              translateration:response[0]
            }

            // Update dropdown content
            updateDropDown(localInput,response)
            
          });

        }
      // 
        
      // TRANSLITERATE: If user pressed space: Transliterate word behind.
        if(e.key === ' '){

          // Hide the dropdown
          selectElement('.dropdown').style.display = 'none'
          
          const text = getSpacedWord(localInput)
          messageBody = { 
            translateration:true, 
            to:selectedLanguage,
            text,
            n:'1'
          }

          // Optimize the api calls and time if the last dropdown is for the same word => copy past
          if(lastTransliterationChoice.translateration && text === lastTransliterationChoice.original){
            const newValue = localInput.value.replace(getSpacedWord(localInput),lastTransliterationChoice.translateration) 
            localInput.value = newValue
            console.log('optimazation on TIME and API_CALLS')
            return;
          }

          chrome.runtime.sendMessage(messageBody,(response)=>{
            // check if you have reached rates limits
            if(response?.message){
              alert(response.message)
              return;
            }

            //optimize by only asking for the first one or storing the already droped-down value
            const newValue = localInput.value.replace(getSpacedWord(localInput),response) 
            localInput.value = newValue
          });

        }
      // 

    })

  }

  // On focus
  function translaterateSetup(e){

    chrome.storage.local.get(['selectedLanguage','state'],async(result)=>{

      // Vars.
      const {selectedLanguage,state} = result
      let localInput = e.target

      // Remove youtube dropdowns from document
      if(state === 'on') localInput = updateDualInput(state,localInput)
      // let old_element = e.target;
      // const localInput = old_element.cloneNode(true);
      // old_element.parentNode.replaceChild(localInput, old_element);

      // If not already: wrap input with div with position relative, create dropdown element, append it to relative parent
      wrapUpInputInitilazer(localInput)
      console.log(localInput)

      // Switch focus from relative parent to input
      localInput.select()

      // Add tabindex 0
      localInput.tabIndex = 0

      // If it's the user first visit or extension is OFF or the user haven't finished typing the word: return.
      if(!state || state === 'off')return;

      // Remove dropdown on (X) button
      selectElement('#search-clear-button').addEventListener('click',()=>selectElement('.dropdown').style.display = 'none')
      
      // Change typing direction based on language.
      updateDropdownPosition(selectedLanguage,localInput);

      // Add keypup event listener after input changed
      localInput.addEventListener('keyup',translaterate)

    })

  }


  // Event listiners
  const inputElements = Array.from(document.querySelectorAll("input,textarea"))
  let originalInput,newInput;
  function updateDualInput(state,currentInput){
    if(state === 'on'){
      currentInput.parentNode.replaceChild(newInput,currentInput)
      return newInput
    } else if(state === 'off'){
      currentInput.parentNode.replaceChild(originalInput,currentInput)
      return originalInput
    }
  }
  inputElements.forEach(input=>{
    // Set dual-input inital values
    originalInput = input
    newInput = input.cloneNode(true)
    newInput.addEventListener('keyup',(e)=>{if(e.key === 'Enter')selectElement('#search-form').submit()}) 

    input.addEventListener('focus',translaterateSetup)

    chrome.storage.local.get(['selectedLanguage'],async(result)=>{
      const {selectedLanguage} = result
      // Update typing direaction
      selectedLanguage === ('ar' || 'ps' || 'fa' || 'ur') ? input.dir = 'rtl' : input.dir = 'ltr'
    })
  })
  
// 