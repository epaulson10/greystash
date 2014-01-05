/*
 * background.js
 *
 * Background page for Greystash extension.  Handles retrieving the extension
 * password, responding to messages from the content scripts, and initializing
 * the injection routine whenever a tab updates in the browser.  
 * 
 * @authors Kyle DeFrancia, Tanya L. Crenshaw, Joe Devlin, Erik Paulson
 * @version 11/21/2013
 *
 */

var greystash = greystash || {};
//var greystash.EXTPASSWORD = "keyForExtensionPasswrd";

/*
 * getExtPass()
 *
 * Retrieves the saved extension password from the filesystem.
 * 
 * @return A string containing the extension password
 */
greystash.getExtPass = function() {
    return 'gato';
}


// Add a listener such that whenever a tab is updated in Chrome,
// the page is instrumented according to our initInjection()
// content script function.

// TODO: Need to correct this listener so that it doesn't 
// try to alter the chrome://extensions and other such tabs.
// Doing so throws an error to the console.
greystash.initPage = function(tabId, changeInfo) {
    if (changeInfo.status === 'complete') {
        chrome.tabs.executeScript(tabId, {
            code: ' greystash.initInjection(); ' 
        });
    }
}
chrome.tabs.onUpdated.addListener(greystash.initPage);


// Add a listener to the background page, such that whenever
// it receives a message from the content script, and make the
// appropriate action
greystash.messageHandler = function(callingScriptMessage, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    console.log(callingScriptMessage);

    if (callingScriptMessage.generatePass) {
        var params = callingScriptMessage.generatePass;
        var url = greystash.getCanonicalURL(params.url);

        greystash.getPassword(null, function(passFound) {
            var extPass = passFound.farewell;
            console.log('Generating password:');
            console.log('url: ' + url);
            console.log('typed: ' + params.typed);
            console.log('extPass: ' + extPass);
            var pass = greystash.generatePassword(url, params.typed, extPass);
            sendResponse({generatedPass : pass});
        });
    }
    else if (callingScriptMessage.changeExtPass) {
        //null means want to store extension password
        greystash.storePassword(null, callingScriptMessage.changeExtPass, sendResponse);
    }     
    else if (callingScriptMessage.getExtPass) {
        //null means want to store extension password
        greystash.getPassword(null, sendResponse);
    }    
    else if (callingScriptMessage.greeting == "WTF!?") {
        sendResponse({farewell: "?TFW"});
    }
    else {
        sendResponse({farewell: "looks like we forgot a case"});
    }
    return true; //allow for async response
}
chrome.runtime.onMessage.addListener(greystash.messageHandler);
