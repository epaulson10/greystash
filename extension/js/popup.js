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

    var extPassInput = document.getElementById('password');
    var confirmDiv = document.getElementById('confirmDiv');
    var confirmInput = document.getElementById('confirm');
    var errOutput = document.getElementById('error');
    var changePassBtn = document.getElementById('changePass');
    var syncData = document.getElementById('sync');

    // show confirmation box when password entered
    var toggleConfirm = function() {
        if (extPassInput.value == "") {
            confirmDiv.style.display = 'none';
            confirmInput.value = "";
        } else {
            confirmDiv.style.display = 'block';
        }
    };
    extPassInput.onkeypress = toggleConfirm;
    extPassInput.onchange = toggleConfirm;
    extPassInput.oninput = toggleConfirm;

    // Alter the submit form's onclick behaviour to
    // send a  message to the background page.  
    changePassBtn.onclick = function() { 
        errOutput.textContent = "";

        console.log('new ext password: ' + extPassInput.value);

        if (extPassInput.value == "") {
            errOutput.textContent = 'Please enter a secret phrase'; 
            return;
        }

        if (extPassInput.value == confirmInput.value) {
            // send a request to background page to change the extension pass
            chrome.runtime.sendMessage({changeExtPass: extPassInput.value}, 
              function(response) {
                  console.log('saved new ext pass in storage: ' + response.data);
                  greystash.updateExtPassStatus();
            });
            extPassInput.value = "";
            toggleConfirm();
            
            // update the staleness of the user's current website
            errOutput.textContent = 'Refresh the page for change to take effect';
        } else {
            errOutput.textContent = 'Secret phrases do not match.';
        }
    };

    // Use either storage.sync if syncData is checked
    // or use storage.local if not
    syncData.onclick = function() {
        console.log('toggle chrome sync to: ' + syncData.checked);
        // send a request to the background page to sync the extension pass
        chrome.runtime.sendMessage({useChromeSync: syncData.checked});
    };
}


/*
 * getExtPassStatus()
 *
 * @return true if the extension password is set, false if not
 */
greystash.updateExtPassStatus = function() {
    // send a request to background page to change the extension pass
    chrome.runtime.sendMessage({getExtPass: true}, 
      function(response) {
          if (response.extPass) {
            console.log('saved ext pass found: ' + response.extPass);
            document.getElementById('hasPassImg').src = 'imgs/green_check.png';
            document.getElementById('hasPass').textContent = 'Secret phrase set';
          } else {
            console.log('no saved ext pass found');
            document.getElementById('hasPassImg').src = 'imgs/red_x.png';
            document.getElementById('hasPass').textContent = 'No secret phrase found';
          }
    });
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

    greystash.updateExtPassStatus();
} 


// After the extension popup is done loading, I want to add a 
// listener to it so that I can grab the master password.
document.addEventListener('DOMContentLoaded', greystash.initPopup, false);
