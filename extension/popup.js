/*
 * popup.js
 *
 * Handles submitting an extension password to the extension from the page
 * action popup.
 *
 * @authors Kyle DeFrancia, Tanya Crenshaw, Joe Devlin, Erik Paulson
 * @version 11/19/13
 *
 */

var greystash = greystash || {};

/*
 * initPopup()
 * 
 * Add a listener to the popup page so that user's may sign in with
 * their extension password.
 * 
 */
greystash.initPopup = function() {

    console.log('Popup Instrumented.');

    var extPassInput = document.getElementById('password');
    var submitForm = document.getElementById('signIn');

    if ((extPassInput !== null) && (submitForm !== null)) {     
        // Alter the submit form's onclick behaviour to
        // send a  message to the background page.  
        submitForm.onclick = function(){ 
            console.log('submit form: ' + extPassInput.value);

            if (extPassInput.value) {
                // send a request to the background page to change the extension pass
                chrome.runtime.sendMessage({changeExtPass: extPassInput.value}, function(response) {
                      console.log(response.farewell);
                });
            } else {
                var err = document.getElementById('error');
                err.textContent = 'Please enter a password'; 
            }
        };

    }//if
}

// After the extension popup is done loading, I want to add a 
// listener to it so that I can grab the master password.
document.addEventListener('DOMContentLoaded', greystash.initPopup, false);
