// Helpers
    function checkGoogle(){
        chrome.storage.local.get(
            'state',
            (result) => {

                
                // Vars
                const state = result.state

                if(!state)return;

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
            chrome.tabs.update({ url: "https://www.google.com" });
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
          // Something went wrong
          console.warn("Whoops.. " + chrome.runtime.lastError.message);
          // Maybe explain that to the user too?
        } else {
          // No errors, you can use entry
        }
    }
// 



// ON-NEW-TAB
    chrome.tabs.onCreated.addListener(function(tab) {
        if (!tab.url || tab.url === "chrome://newtab/") {
            checkGoogle()
        }
    });

// 
  
// ON-CHANGE-TAB
    function runExtensionOnTabChange(){
        // Update url if on home
        checkGoogle()

        // Check state value
        chrome.storage.local.get(
            'state',
            (result) => {
                // if it's the user first visit 
                if(!result.state)return;
    
    
                // Variables
                state = result.state
    
                // Update UI orange outline based on state
                chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
                    var activeTab = tabs[0];
                    chrome.tabs.sendMessage(activeTab.id, {message: state},handleError)
                });
                
            }
        );
    }


    chrome.tabs.onActivated.addListener(function(activeInfo) {
        runExtensionOnTabChange()
    });
          

// 




// TRANSLATERATION-WORK
    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
        if(message.translateration !== true) return;

        const {text,language} = message
        const url = `https://us-central1-nital-389303.cloudfunctions.net/translateText?text=${text}&to=${language}&`

        const response = await fetch(url)
        const data = await response.json()

        const result = data.translatedText

        chrome.tabs.query({active : true, lastFocusedWindow : true}, function (tabs) {
            var CurrTab = tabs[0];
            chrome.tabs.sendMessage(CurrTab.id,{
                translateration:true, 
                result
            });
        })


        // return true
    });
  
// 