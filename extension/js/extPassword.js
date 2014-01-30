/*
 * extPassword.js
 *
 * Keeps track of stale passwords when the extension password is changed.
 *
 * @authors Kyle DeFrancia, Joe Devlin, Erik Paulson
 * @version 11/21/13
 *
 */

var greystash = greystash || {};


// array to keep track of which sites currently have stale passwords
greystash.staleTable = [];


/*
 * initStaleTable()
 *
 * This function initializes the staleTable variable as a table with sites
 * as the index and either a 1 or 0 as the value.  1 means the site has a 
 * stale password.  0 means the site is using the current extension password.
 */
greystash.initStaleTable = function() {
}


/*
 * isStale()
 *
 * Determines whether a given url has a stale password or is using the
 * current extension password.
 *
 * @param url The url of the site to check
 *
 * @return True if the site has a stale password, false otherwise
 */
greystash.isStale = function(url) {
    return (greystash.staleTable.url == 1);
}


/*
 * getStalePass()
 *
 * Function to get the stale password for a given URL from the filesystem.
 *
 * @param url The url of the site to read
 * 
 * @return A string representing the stale password for the site
 */
greystash.getStalePass = function(){
}


/*
 * updateStalePass()
 *
 * Updates the saved stale password for a given site.
 *
 * @param url The url of the site to update
 * 
 * @return True if the update was successful, false if something went wrong.
 */
greystash.updateStalePass = function(url) {
    return true;
}
