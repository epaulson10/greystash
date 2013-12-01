/*
 * file.js
 *
 * Handles reading and writing to a sandboxed area of the local filesystem
 * using the Chrome Filesystem API.
 *
 * @authors Kyle DeFrancia
 * @version 11/21/13
 * @version 12/1/13 updated get and store password to use the chrome local storage
 *
 */

var greystash = greystash || {};

greystash.EXTPASSWORD = "keyForExtensionPasswrd";

/*
 * getPassword()
 *
 * Reads either the extension password from file or a stale password
 * for a given URL.
 *
 * @param url The url of the site to read the stale password of. Pass in
 *              null to read the extension password.
 *
 * @return A string representing the extension or stale password
 */
greystash.getPassword = function(url) {
    if(url == null){
        chrome.storage.local.get(greystash.EXTPASSWORD, function(data){
            sendResponse({farewell: data});//have to send response from here b/c asyn request
        };
    }
}
/*
 * storeWrite()
 *
 * Writes extension password or a stale password for a given URL to file.
 *
 * @param url The url of the site to write the stale password to. Pass in
 *              null to write the extension password.
 * @param text The password to write to file
 *
 * @return True if the write was successfull or false if it wasn't 
 */
greystash.storePassword = function(url, text) {
    if(url == null){
        chrome.storage.local.set({"foo": text},function(){});
    }
};
