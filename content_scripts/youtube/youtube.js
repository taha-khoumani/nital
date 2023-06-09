// Functions
function applyOrangeOutline() {
    const searchBox = document.querySelector('form>#container');
    searchBox.classList.add("orange-outline-bar");

    const icon = document.querySelector('#search-icon-legacy');
    icon.classList.add("orange-outline-icon");
  }

  function removeOrangeOutline() {
    const searchBox = document.querySelector('form>#container');
    searchBox.classList.remove("orange-outline-bar");

    const icon = document.querySelector('#search-icon-legacy');
    icon.classList.remove("orange-outline-icon");
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
      const input = e.target
      const value = input.value
      const regex = new RegExp('.*')
      const translateratedValue = value.replace(regex,'X'.repeat(value.length))

      input.value = translateratedValue
  }
// 