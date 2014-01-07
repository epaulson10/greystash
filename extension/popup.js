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

    greystash.restoreSettings();

    console.log('Popup Instrumented.');

    var changePassBtn = document.getElementById('changePass');
    // Alter the submit form's onclick behaviour to
    // send a  message to the background page.  
    changePassBtn.onclick = function() { 
        var extPassInput = document.getElementById('password');

        console.log('new ext password: ' + extPassInput.value);

        if (extPassInput.value) {
            // send a request to background page to change the extension pass
            chrome.runtime.sendMessage({changeExtPass: extPassInput.value}, 
              function(response) {
                  console.log('saved new ext pass in storage: ' + response.data);
            });
        } else {
            var err = document.getElementById('error');
            err.textContent = 'Please enter a password'; 
        }
    };

    var syncData = document.getElementById('sync');
    // Use either storage.sync if syncData is checked
    // or use storage.local if not
    syncData.onclick = function() {
        console.log('toggle chrome sync to: ' + syncData.checked);
        // send a request to the background page to sync the extension pass
        chrome.runtime.sendMessage({useChromeSync: syncData.checked});
    };
}


/*
 * restoreSettings()
 *
 * Restores user input fields to their saved state.
 */
greystash.restoreSettings = function() {
    chrome.runtime.sendMessage({getChromeSyncState: true}, function(response) {
        var savedSetting = (typeof response.syncState === 'boolean') ?
                           response.syncState :
                           false;   // do not sync by default

        console.log('sync setting restored to: ' + savedSetting);
        document.getElementById('sync').checked = savedSetting;
    });
} 


// After the extension popup is done loading, I want to add a 
// listener to it so that I can grab the master password.
document.addEventListener('DOMContentLoaded', greystash.initPopup, false);
