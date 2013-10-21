/*
 * background.js
 *
 * Background page for experimental extension.  
 * 
 * 1. Instrument the browsers tabs with a listener.
 * 
 * 2. Log or respond to messages sent by the content script.  
 *
 * @author Tanya L. Crenshaw
 * @since 10/14/2013
 */


// Add a listener such that whenever a tab is updated in Chrome,
// the page is instrumented according to our instrumentPage()
// content script function.

// TODO: Need to correct this listener so that it doesn't 
// try to alter the chrome://extensions and other such tabs.
// Doing so throws an error to the console.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    if (changeInfo.status === 'complete') {
        chrome.tabs.executeScript(tabId, {
            code: ' Greystash.instrumentPage(); ' 
        });
    }
});


// Add a listener to the background page, such that whenever
// it receives a message from the content script, it 
// logs the message and, in the case of "hello", sends
// a response.
chrome.runtime.onMessage.addListener(
  function(callingScriptMessage, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
               
    console.log(callingScriptMessage);

    if (callingScriptMessage.greeting == "Popup Loaded"){
        sendResponse({farewell: "acknowledged"});
    }    
    if (callingScriptMessage.greeting == "WTF!?"){
        sendResponse({farewell: "?TFW"});
    }
  });
