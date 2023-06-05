// GLOBAL-VARIABLES
    const state = 'on'
// 



// HELPER-FUNCTIONS
    function selectElement(query){
        return document.querySelector(query)
    }

    function removeAddClass(element,removedClass,addedClass){
        element.classList.remove(removedClass)
        element.classList.add(addedClass)
    }
// 



// HOME-TO-LANGUAGES_SELECT-TOGGLING
    // Variables
    const home = selectElement("#home")
    const plusButton = selectElement("#plus-div")
    const languagesSection = selectElement("#language-selection")
    const saveButton = selectElement("#save-languages")

    // Event listener funtions
    function goToLanguagesSection(){
        removeAddClass(languagesSection,"hidden","flex")
        removeAddClass(home,"flex","hidden")
    }
    function goToHome(){
        removeAddClass(home,"hidden","flex")
        removeAddClass(languagesSection,"flex","hidden")
    }
    function onSaveHandler(){
        // store in local storage
        chrome.storage.local.set({selectedLanguages:selectedLanguages})

        //go to home
        goToHome()
    }

    // Dom
    plusButton.addEventListener('click',goToLanguagesSection)
    saveButton.addEventListener('click',onSaveHandler)
//



// LANGUAGES-SELECTION
    // Variables
    let selectedLanguages = []
    chrome.storage.local.get(
        'selectedLanguages', 
        (result) => {
            selectedLanguages = result.selectedLanguages
        }
    );
    const languagesInputs = Array.from(document.querySelectorAll(".language-box"))
    const languagesCounter = selectElement("#languages-counter")

    // Event listener funtions
    function onLanguageChangeHandler(e){
        const clickedLanguage = e.target.value
        const isSelecting = e.target.checked

        // modify the selectedLanguage var
        if(isSelecting){
            selectedLanguages.push(clickedLanguage)
        } else{
            selectedLanguages = selectedLanguages.filter(language=>language !== clickedLanguage)
        }
        
        // modify the counter
        languagesCounter.innerText = selectedLanguages.length
    }

    // Dom
    languagesInputs.forEach(language=>language.addEventListener('change',onLanguageChangeHandler))
// 

// const x = selectElement('#currentLanguage')
// x.addEventListener('click',function(){

//     chrome.storage.local.get(
//         'selectedLanguages', 
//         (result) => {
//             console.log(result.selectedLanguages)
//         }
//     );
// })



/*
// ON-OFF-TOGGLING

    // Variables
    const on = selectElement("#on")
    const off = selectElement("#off")

    //Event listener funtions
    function onOffHandler(){}    
    function onOnHandler(){}    

    // Dom
    off.addEventListener('click',onOffHandler)
    off.addEventListener('click',onOnHandler)

// 
*/