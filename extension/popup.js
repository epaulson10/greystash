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

    var inputForm = document.getElementById("password");
    var submitForm = document.getElementById("signIn");

    if(!(inputForm === null)) {     

        // Alter the submit form's onclick behaviour to
        // send a  message to the background page.  
        submitForm.onclick = function(){ 

            // This shall be logged to the popup's console.
            console.log(inputForm.value);

            // This shall be sent to the background page.  A
            // response will be issued by the background page.
            chrome.runtime.sendMessage({changeExtPass: inputForm.value}, function(response) {
                  console.log(response.farewell);
            });
        };
    }//if
}

// After the extension popup is done loading, I want to add a 
// listener to it so that I can grab the master password.
document.addEventListener('DOMContentLoaded', greystash.initPopup, false);
