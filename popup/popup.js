// GLOBAL-VARIABLES
    const state = 'on'
    const currentLanguageShown = selectElement('#currentLanguageShown')
    const languagesInputs = Array.from(document.querySelectorAll(".language-box"))
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
    const currentLanguageShownContainer = selectElement("#currentLanguageShownContainer")
    const languagesSection = selectElement("#language-selection")
    const saveButton = selectElement("#save-languages")

    // Event listener funtions
    function goToLanguagesSection(){
        removeAddClass(languagesSection,"hidden","flex")
        removeAddClass(home,"flex","hidden")
        saveButton.innerText = "Go back"
    }
    function goToHome(){
        removeAddClass(home,"hidden","flex")
        removeAddClass(languagesSection,"flex","hidden")
    }
    function onSaveHandler(){
        goToHome()
    }

    // Dom
    currentLanguageShownContainer.addEventListener('click',goToLanguagesSection)
    saveButton.addEventListener('click',onSaveHandler)
//



// LANGUAGES-SELECTION
    // Variables
    let selectedLanguage = ""

    // On load
    chrome.storage.local.get(
        'selectedLanguage',
        (result) => {
            // Variables
            const selectedLanguage = result.selectedLanguage

            // if it's the user first visit
            if(!selectedLanguage){
                saveButton.innerText = "Continue"
                return
            } 

            // Conditional variables 
            const radioButtonMatchingCurrentLanguage = languagesInputs.find(language=> language.value === selectedLanguage )
            
            // Check the stored language on the form
            radioButtonMatchingCurrentLanguage.checked = true

            // update the currentLanguageShown in home
            currentLanguageShown.innerText = radioButtonMatchingCurrentLanguage.labels[0].textContent

            // navigate to home
            goToHome()
            
        }
    );

    // On change
    function onLanguageChangeHandler(e){
        // Variables
        const clickedRadio = e.target
        const clickedLanguage = e.target.value

        // Update local variable and localStorage variable
        selectedLanguage = clickedLanguage
        chrome.storage.local.set({selectedLanguage:clickedLanguage})
        
        // update the currentLanguageShown in home
        currentLanguageShown.innerText = clickedRadio.labels[0].textContent
        
    }

    // Dom
    languagesInputs.forEach(language=>language.addEventListener('change',onLanguageChangeHandler))
// 



// TESTING
    const logo = selectElement("#logo")
    logo.addEventListener("click",()=>{
        chrome.storage.local.clear();
    })
    logo.addEventListener("contextmenu",()=>{
        chrome.storage.local.get(
            'selectedLanguage', 
            (result) => {
                console.log(result)
            }
        );
    })
// 

























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