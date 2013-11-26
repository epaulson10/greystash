/*
 * password.js
 *
 * Generates secure passwords. This includes getting all relevant parameters
 * such as the extension password and canonical URL.
 *
 * @authors Kyle DeFrancia, Erik Paulson
 * @version 11/20/13
 *
 */

var greystash = greystash || {};


/*
 * getCanonicalURL()
 * 
 * Returns the canonical url of the current website. An example
 * of a canonical url is www.facebook.com (with no more characters after "com").
 * 
 * @return A string containing the canonical url of the website
 */
greystash.getCanonicalURL = function() {
    return 'meow';
}


/*
 * getExtPassword()
 *
 * Sends a message to the background page asking for the extension password.
 * 
 * @param callback Callback function that uses the extension password
 */
greystash.getExtPass = function(callback) {
    chrome.runtime.sendMessage({getExtPass: 'please'}, callback);
}


/*
 * getStalePass()
 * 
 * Sends a message to the background page asking for the stale extension
 * password for a given website.
 * 
 * @param url The canonical url of the website
 */
greystash.getStalePass = function(url, callback){
    chrome.runtime.sendMessage({getStalePass: url}, callback);
}


/*
 * generatePassword()
 * 
 * Contains the logic for generating Greystash secure passwords using a site's url
 * plus a user's simple password for that site and their extension password.
 *
 * @param url The url of the website being logged into
 * @param simplePass The simple password the user enters into the website password field
 * @param extPass The user's Greystash extension password
 *
 * @return A string containing the generated password
 */
greystash.generatePassword = function(url, simplePass, extPass){
    //Concat big string
    //P2BKFS
    //Convert to base
    //Check rules
}


/*
 * convertBase()
 * 
 * Converts a string whose characters are in one base to another base
 * (this doesn't make sense, I don't know exactly what it should say)
 *
 * @param input The string to change the base of
 * @param origBase The set of characters that make up the current base
 * @param newBase  The set of characters that make up the new base
 *
 * @return A string 
 */
greystash.convertBase = function(input, origBase, newBase){
}


/*
 * checkRule()
 * 
 * Determines whether the generated password conforms to a certain website's
 * password requirements.
 *
 * @param url The canonical url of the website being examined
 *
 * @return true if the generated password fits the site's rules, false otherwise
 */
greystash.checkRule = function(url){
    return true
}


