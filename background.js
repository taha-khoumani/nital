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
// 



// GOOGLE-URL-TOGGLING-ON-NEW-TAB
    chrome.tabs.onCreated.addListener(function(tab) {
        if (!tab.url || tab.url === "chrome://newtab/") {
            checkGoogle()
        }
    });

// 
  