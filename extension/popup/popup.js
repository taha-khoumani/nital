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

    function handleError() {
        if(chrome.runtime.lastError) {

        } else {

        }
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

        // scroll to selected language
        selectElement(`#${selectedLanguage}`).scrollIntoView()
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
        checkGoogle()
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
            selectedLanguage = result.selectedLanguage

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

        // Add the removed languages if search box used
        languagesDiv.forEach(language=>language.style.display = "")

        // Reseting the search input
        search.value = ""

        // Scroll to selected element
        selectElement(`#${clickedLanguage}`).scrollIntoView()
        
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
            chrome.tabs.sendMessage(activeTab.id, {message: "on"},handleError);

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
            chrome.tabs.sendMessage(activeTab.id, {message: "off"},handleError);
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
    document.addEventListener("DOMContentLoaded", ()=>on.addEventListener("click", onOnUI));
    on.addEventListener('click',onOnPopup)
    document.addEventListener("DOMContentLoaded", ()=>off.addEventListener("click", onOffUI));
    off.addEventListener('click',onOffPopup)

// 



// Search Filtering
    // Vars
    const search = selectElement("#search")
    const languagesDiv = Array.from(document.querySelectorAll(".language"))
    

    // Event listener functions
    function onInputSearchHandler(e){
        const searchInput = e.target.value
        const regex = new RegExp(`^${searchInput}.*`,'i');
        const languagesInputs = languagesDiv.map(l=>l.firstElementChild.id)
        const languagesInputsToRemove = languagesInputs.filter(l=>!regex.test(l))
        const languagesDivToRemove = languagesInputsToRemove.map(l=>selectElement(`#${l}`).parentNode)
        
        languagesDiv.forEach(languageDiv=>{
            if(languagesDivToRemove.includes(languageDiv)){
                languageDiv.style.display = 'none'
            }else{
                languageDiv.style.display = ''
            }
        })

    }

    // Dom
    search.addEventListener("input",onInputSearchHandler)

// 



// GET-ACCES-TOKEN
    // required header information.
    var pHeader = {"alg":"RS256","typ":"JWT"}
    var sHeader = JSON.stringify(pHeader);

    // claim
    var pClaim = {};
    pClaim.aud = "https://www.googleapis.com/oauth2/v3/token";
    pClaim.scope = "https://www.googleapis.com/auth/analytics.readonly";
    pClaim.iss = "<serviceAccountEmail@developer.gserviceaccount.com";
    pClaim.exp = KJUR.jws.IntDate.get("now + 1hour");
    pClaim.iat = KJUR.jws.IntDate.get("now");
    var sClaim = JSON.stringify(pClaim);


// 



// TEST
    const logo = selectElement("#logo")
    async function onLogoClick (){
        // const text = 'sama3a'
        // const inputLanguage = 'en'
        // const outputLanguage = 'ar'
        // const accessToken = generateAccessToken()
        
        // const response = await fetch('https://translate.googleapis.com/v3beta1/projects/nital-389303:translateText',{
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${accessToken}`,
        //     },
        //     body: JSON.stringify({                
        //         "contents": [text],
        //         "sourceLanguageCode":inputLanguage,
        //         "targetLanguageCode": outputLanguage,
        //         "mimType":"text/plain"
        //     })
        // })
        // const data = await response.json()

        // console.log('data :',data)
        // console.log('result :',result)

        // let latin = ''

        // alert(arabic)


        console.log(awaitgenerateAccessToken())
    }
    logo.addEventListener('click',onLogoClick)
// 