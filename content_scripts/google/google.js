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
// 



// On Click
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "on" ) {
        on();
      }else{
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