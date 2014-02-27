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


// Add a listener to handle the first install of the Greystash extension
// This prompts the user to set an Extension password
greystash.onInstall = function(details) {
    chrome.tabs.create({url: 'popup.html'});
    alert("Greystash loaded. \n\nEnter a new password and press " +
          "'Change Password' to set your extension password.");
};
chrome.runtime.onInstalled.addListener(greystash.onInstall);


// Add a listener such that whenever a tab is updated in Chrome,
// the page is instrumented according to our initInjection()
// content script function if the website is supported.
greystash.initPage = function(tabId, changeInfo, tab) {
    // if there is a rule for this url than this website is supported
    var url = greystash.getCanonicalURL(tab.url);
    if (greystash.getRule(url) && (changeInfo.status === 'complete')) {
        chrome.pageAction.show(tabId);

        var staleness = greystash.isStale(url);

        chrome.tabs.executeScript(tabId, {
            code: ' greystash.initInjection(' + staleness + '); ' 
        });
    }
};
chrome.tabs.onUpdated.addListener(greystash.initPage);


// Add a listener to the background page, such that whenever
// it receives a message from the content script, and make the
// appropriate action
greystash.messageHandler = function(csm, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    console.log(csm);

    if (csm.generatePass) {
        var params = csm.generatePass;
        var url = greystash.getCanonicalURL(params.url);

        var callback = function(extPass) {
            console.log('Generating password:');
            console.log('  url: ' + url);
            console.log('  typed: ' + params.typed);
            console.log('  extPass: ' + extPass);
            var pass = greystash.generatePassword(url, params.typed, extPass);
            sendResponse({generatedPass : pass});
        };

        if (params.stale) {
            greystash.getStalePass(callback, url);
        } else {
            greystash.getPassword(callback);
        }
    }
    else if (csm.changeExtPass) {
        greystash.storePassword(csm.changeExtPass,
          function(result) {
            greystash.initStaleTable();
            sendResponse({data: result});
        });
    }     
    else if (csm.getExtPass) {
        greystash.getPassword(function(password) {
            sendResponse({extPass: password});
        });
    }
    // since useChromeSync could be false, check if it is a boolean instead
    else if (typeof csm.useChromeSync === 'boolean') {
        console.log('sync set to: ' + csm.useChromeSync.toString());
        greystash.changeChromeSyncState(csm.useChromeSync);
    }
    else if (csm.getChromeSyncState) {
        greystash.getChromeSyncState(function(useChromeSync) {
            sendResponse({syncState: useChromeSync});
        });
    }
    else if(csm.changeStalePass){
        console.log("Updating ext pass for webpage");
        greystash.updateStalePass(url);
        sendResponse();
    }
    else {
        sendResponse({farewell: "looks like we forgot a case"});
    }
    return true; //allow for async response
};
chrome.runtime.onMessage.addListener(greystash.messageHandler);
