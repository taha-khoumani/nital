// Functions
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
      }else if(request.message === "off"){
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



// MAIN-TRANSLATERATION-LOGIC
  const inputElements = Array.from(document.querySelectorAll("input,textarea"))
  inputElements.forEach(input=>{
      input.addEventListener('input',translaterate)
  })

  function translaterate(e){

    chrome.storage.local.get(
      'state',
      (result) => {
        // if it's the user first visit 
        if(!result.state || result.state === 'off')return;

        const input = e.target
        const value = input.value
        const regex = new RegExp('.*')
        const translateratedValue = value.replace(regex,'X'.repeat(value.length))
      
        input.value = translateratedValue

      }
  );
  
  }
// 