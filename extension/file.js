/*
 * file.js
 *
 * Handles reading and writing to a sandboxed area of the local filesystem
 * using the Chrome Filesystem API.
 *
 * @authors Kyle DeFrancia, Joe Devlin
 * @version 11/21/13
 * @version 12/1/13 updated get and store password to use the chrome local storage
 *
 */

var greystash = greystash || {};

// storage keys
greystash.CHROME_SYNC = 'sync';
greystash.EXT_PASS = 'extPass';


/*
 * getPassword()
 *
 * Reads either the extension password from file or a stale password
 * for a given URL.
 *
 * @param url The url of the site to read the stale password of. If no URL
 *            is specified, read the extension password.
 @ @param callback A function that looks like: function(string){...}
 *                 This is string representing the extension or stale password
 */
greystash.getPassword = function(callback, url) {
    // what password are we getting
    url = url || greystash.EXT_PASS;

    // where are we getting it from
    greystash.getChromeSyncState(function(useChromeSync) {
        var storage = useChromeSync ? chrome.storage.sync : chrome.storage.local;

        storage.get(url, function(data) {
            callback(data[url]);
        });
    });
}


/*
 * storePassword()
 *
 * Writes extension password or a stale password for a given URL to file.
 *
 * @param text The password to write to file
 * @param callback Function that looks like: function(object){...}
                   The object contains the key:value pair that was stored
 * @param url The url of the site to write the stale password to. If no URL
 *            is specified, write the extension password.
 */
greystash.storePassword = function(text, callback, url) {
    // what password are we storing
    url = url || greystash.EXT_PASS;

    // where are we storing it
    greystash.getChromeSyncState(function(useChromeSync) {
        var storage = useChromeSync ? chrome.storage.sync : chrome.storage.local;

        var toStore = {};
        toStore[url] = text;

        storage.set(toStore, function() {
            callback(toStore);
        });
    });
}


/*
 * getChromeSyncState()
 * 
 * Determine if passwords should be synced with Chrome sync or not.
 *
 * Chrome sync allows local storage to be synced to the user's Google account
 * if they are signed into Chrome and have the option enabled.
 *
 * @param callback function that looks like: function(boolean){...}
 */ 
greystash.getChromeSyncState = function(callback) {
    chrome.storage.local.get(greystash.CHROME_SYNC, function(data) {
        if ((data != null) && (data.length > 0)) {
            callback(data[greystash.CHROME_SYNC]);
        } else {
            // disable sync by default
            callback(false);
        }
    });
}


/*
 * changeChromeSyncState()
 *
 * Turn Chrome sync on or off.
 *
 * @param value true to use Chrome sync or false to disable it
 */
greystash.changeChromeSyncState = function(value) {
    var toStore = {};
    toStore[greystash.CHROME_SYNC] = value;
    chrome.storage.local.set(toStore);
}
