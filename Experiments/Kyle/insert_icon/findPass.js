var passwordField = null;

function saveIt() {
    if (passwordField) {
        var typedPass = passwordField.value;
        alert('User typed: ' + typedPass);
        //save it
        chrome.storage.local.set({'key': typedPass});
        //get the saved value back
        chrome.storage.local.get('key', function(result) {
            alert('Found: ' + result.key);
        });        
    }
}

function turnPassRed() {
    var allPassFields = document.getElementsByTagName('input');
    var len = allPassFields.length;
    var input = null;
    
    if (len > 0) {
        //turn them all red
        for (var i = 0; i < len; i++) {
            input = allPassFields[i];
            if (input.getAttribute('type') == 'password') { 
                input.style.backgroundColor = 'red';
                passwordField = input;
            }

            if (input.getAttribute('type') == 'submit') {
                input.addEventListener('click', saveIt, false);
            }
        }//for
    }


}

//call when page is loaded and right now
//that way one of them will probably work
window.onload = turnPassRed;
turnPassRed();