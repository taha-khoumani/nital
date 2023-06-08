// GLOBAL-VARIABLES
    const currentLanguageShown = selectElement('#currentLanguageShown')
    const languagesInputs = Array.from(document.querySelectorAll(".language-box"))
// 



// HELPER-FUNCTIONS
    function selectElement(query){
        return document.querySelector(query)
    }

    function removeAddClass(element,removedClass,addedClass){
        if(removeAddClass) element.classList.remove(removedClass);
        if(addedClass) element.classList.add(addedClass);
    }

    function checkGoogle(){
        chrome.storage.local.get(
            'state',
            (result) => {
                // Vars
                const state = result.state
    
                if(state === "on"){
                    goToGoolgeIfOnHome()
                }else{
                    goToHomeIfOnGoogle()
                }
            }
        );
    }
    
    function goToGoolgeIfOnHome(){
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            const tab = tabs[0];
            if (!tab.url || tab.url === "chrome://newtab/") {
              chrome.tabs.update({ url: "https://www.google.com" },()=>console.log("google finished"));
            }
        }); 
    }
    
    function goToHomeIfOnGoogle(){
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            const tab = tabs[0];
            if (tab.url === "https://www.google.com/") {
              chrome.tabs.update({ url: "chrome://newtab/" });
            }
        }); 
    }
// 



// HOME-TO-LANGUAGES_SELECT-TOGGLING
    // Variables
    const home = selectElement("#home")
    const currentLanguageShownContainer = selectElement("#currentLanguageShownContainer")
    const languagesSection = selectElement("#language-selection")
    const saveButton = selectElement("#save-languages")
    const form = selectElement("#languagesForm")
 
    // 1TimesRuns
    form.addEventListener("submit",(e)=>e.preventDefault())

    // Event listener funtions
    function goToLanguagesSection(){
        // check if the toggler is off
        if(state === "off") return;

        removeAddClass(languagesSection,"hidden","flex")
        removeAddClass(home,"flex","hidden")
        saveButton.innerText = "Go back"
    }
    function goToHome(){
        removeAddClass(home,"hidden","flex")
        removeAddClass(languagesSection,"flex","hidden")
    }
    function onSavePopup(){
        if(!form.checkValidity()) return;

        state = "on"
        chrome.storage.local.set({state:"on"})
        onOnUI()
        goToHome()
    }

    // Dom
    currentLanguageShownContainer.addEventListener('click',goToLanguagesSection)
    saveButton.addEventListener('click',onSavePopup)
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
    function onLanguageChangePopup(e){
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
    languagesInputs.forEach(language=>language.addEventListener('change',onLanguageChangePopup))
// 



// ON-OFF-TOGGLING

    // Variables
    let state;
    const on = selectElement("#on")
    const off = selectElement("#off")

    // On load
    chrome.storage.local.get(
        'state',
        (result) => {
            // if it's the user first visit 
            if(!result.state)return;


            // Variables
            state = result.state

            if(state === 'on') return;
            onOffPopup()
            
            
        }
    );

    //Event listener funtions  
    function ON(){

    }    
    function OFF (){

    }
    function onOnUI() {
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {message: "on"});
        });
    }
    function onOnPopup(){
        // Update global variable
        state = "on"

        // Store to localStorage
        chrome.storage.local.set({state:"on"})

        // Update popup UI
        removeAddClass(on,false,'state')
        removeAddClass(off,'state',false)
        removeAddClass(currentLanguageShownContainer,'disabled',false)

        // Navigate to Google.com if needed
        checkGoogle()
    } 
    function onOffUI() {
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {message: "off"});
        });
    }
    function onOffPopup(){
        // Update global variable
        state = "off"

        // Store to localStorage
        chrome.storage.local.set({state:"off"})

        // Update UI
        removeAddClass(on,'state',false)
        removeAddClass(off,false,'state')
        removeAddClass(currentLanguageShownContainer,false,'disabled')

        // Navigate to Home if needed
        checkGoogle()
    } 

    // Dom
    document.addEventListener("load", ()=>on.addEventListener("click", onOnUI));
    on.addEventListener('click',onOnPopup)
    document.addEventListener("load", ()=>off.addEventListener("click", onOffUI));
    off.addEventListener('click',onOffPopup)

// 
