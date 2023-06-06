chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message === "on" ) {
            on();
        }else{
            off()
        }
    }
);

function on(){
    console.log("on");
    applyOrangeOutline()
}
function off(){
    console.log("off");
    removeOrangeOutline()
}


  
  function applyOrangeOutline() {
    const inputElements = document.querySelectorAll('input,textarea');
    inputElements.forEach(element => {
      element.classList.add('orange-outline');
    });
  }
  function removeOrangeOutline() {
    const inputElements = document.querySelectorAll('input,textarea');
    inputElements.forEach(element => {
      element.classList.remove("orange-outline");
    });
  }
  

chrome.storage.local.get(
    'state',
    (result) => {
        console.log(result.state)
        if(result.state === "on")on();
    }
);