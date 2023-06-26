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
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if(message.translateration !== true) return;

        const {text,to,n} = message
        const url = `https://inputtools.google.com/request?itc=${to}-t-i0&num=${n}&text=${text}`

        fetch(url)
        .then(res=>res.json())
        .then(data=>{
            if(data?.message){
                sendResponse(data)
                return;
            }
            const result = data[1][0][1]
            sendResponse(result)
        })


        return true;
    });
  
// 