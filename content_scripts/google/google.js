// Vars
let lastTransliterationChoice = {original:'',translateration:'',}
const searchInput = selectElement('#APjFqb')
const reportInappropriatePredictions = selectElement('.M8H8pb')
const googleDefaultDropdown =   selectElement('.UUbT9')
const googleForm = selectElement('[role="search"]')

// On load: if on run the script
chrome.storage.local.get('state',(result) => { if(result.state === "on")on() })

// On switch state
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    chrome.storage.local.get(['state','selectedLanguage'],({selectedLanguage,state})=>updateDir(searchInput,selectedLanguage,state))
    if( request.message === "on" ) {
      on();
    }else if(request.message === "off"){
      off()
    }
  }
);

// Assign event listener to search input
searchInput.addEventListener('focus',translaterateSetup)
searchInput.addEventListener('keyup',translaterate)

// When user change language or state
chrome.storage.onChanged.addListener(()=>{searchInput.value = ''})




// General
function selectElement(query){
  return document.querySelector(query)
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

// Parents
function on(){
  applyOrangeOutline()

  googleDefaultDropdown.remove()
}
function off(){
  removeOrangeOutline()
  reportInappropriatePredictions.parentNode.insertBefore(googleDefaultDropdown, reportInappropriatePredictions);
  // googleDefaultDropdownParent.appendChild(googleDefaultDropdown)
}
function translaterate(e){

  chrome.storage.local.get(['selectedLanguage','state'],async(result)=>{

    // Vars.
    const {selectedLanguage,state} = result;
    const localInput = e.target
    let messageBody;

    // Since the enter key doesn't work
    if(e.key === 'Enter')googleForm.submit()

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
function translaterateSetup(e){

  chrome.storage.local.get(['selectedLanguage','state'],async(result)=>{

    // Vars.
    const {selectedLanguage,state} = result
    const localInput = e.target

    // Remove google dropdowns from document
    // if(state === 'on' && googleDefaultDropdown)googleDefaultDropdown.remove()

    // Add tabindex 0
    localInput.tabIndex = 0

    // If it's the user first visit or extension is OFF or the user haven't finished typing the word: return.
    if(!state || state === 'off')return;
    
    // Change typing direction based on language.
    if(selectedLanguage==='fa-t-i0'||selectedLanguage==='ar-t-i0'||selectedLanguage==='ur-t-i0'){
      localInput.dir = 'rtl'
      if(selectElement('.dropdown')){
        selectElement('.dropdown').style.textAlign = 'right'
        selectElement('.dropdown').style.left = 'auto'
        selectElement('.dropdown').style.right = '0'
        positionDropdown(localInput,selectElement('.dropdown'))
      }

    }else{
      localInput.dir = 'ltr'
      if(selectElement('.dropdown')){
        selectElement('.dropdown').style.textAlign = 'left'
        positionDropdown(localInput,selectElement('.dropdown'))
      }

    } 

    // Remove dropdown on (X) click
    selectElement('.BKRPef').addEventListener('click',()=>{searchInput.value ='';selectElement('.dropdown').style.display = 'none'})

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

// Childs
function wrapInputWithNitalDropdownParentDiv (toWrap) {
  const wrapper = elementClassInner('div','nitalDropdownParent')
  wrapper.style.position = 'relative'

  toWrap.parentNode.insertBefore(wrapper, toWrap);
  return wrapper.appendChild(toWrap);
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
  const dropdown = selectElement('.dropdown')

  dropdown.innerHTML = ''
  
  choices.forEach((choice,index)=>{
    const pElement = elementClassInner('p','dropdownChoice',choice)
    pElement.tabIndex = index + 1
    pElement.cursor = 'default'
      pElement.addEventListener('click',()=>{
        input.value = input.value.replace(getCurrentWord(input),choice) + " "
        dropdown.style.display = 'none'
        input.focus()
      })
      pElement.addEventListener('keyup',(e)=>{ if(e.key === 'Enter')e.target.click() })

    dropdown.appendChild(pElement)
  })
 
  positionDropdown(input,dropdown)

  dropdown.style.display = 'block'
}

// Mini functions
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
function handleError() {
  if(chrome.runtime.lastError) {
  
  } else {
  
  }
}
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
function applyOrangeOutline() {
const searchBox = document.querySelector('.RNNXgb');
searchBox.classList.add("orange-outline");
}
function removeOrangeOutline() {
  const searchBox = document.querySelector('.RNNXgb');
  searchBox.classList.remove("orange-outline");
}
function updateDir(input,language,state){
  if(state === 'off')input.dir = ''
  else{(language==='fa-t-i0'||language==='ar-t-i0'||language==='ur-t-i0') ? input.dir = 'rtl' : input.dir = 'ltr'}
}