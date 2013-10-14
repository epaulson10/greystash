var passwordField = null;
var key = "7547AC94 5855588B 5A18D06C 144FE94E"

// Display what was saved in local storage then decrypt it
function showMe() {
    chrome.storage.local.get('secretPass', function(result) {
        var stored = result.secretPass;
        console.log('Found: ' + stored);
        alert('You saved: ' + sjcl.decrypt(key, stored));
    });
}

// Encrypt the text entered into the password field and save it to local storage
function saveIt() {
    if (passwordField) {
        console.log('Saved: ' + passwordField.value)
        var encrypted = sjcl.encrypt(key, passwordField.value);
        chrome.storage.local.set({'secretPass': encrypted}, showMe());
    }
}

// Find all password fields, color them red, and add event listener to the submit button
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
