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
greystash.STALE = true;
greystash.CURRENT = false;


/*
 * initStaleTable()
 *
 * This function initializes the staleTable variable as a table with sites
 * as the index and either a 1 or 0 as the value.  1 means the site has a 
 * stale password.  0 means the site is using the current extension password.
 */
greystash.initStaleTable = function() {
    //grab extpass
    greystash.getPassword(function(extPass){
        console.log('InitStaleTable: extPass is ', extPass);
        //loop through all the sites
        for (var site in greystash.rules) {
            greystash.checkStale(site, extPass);
        }
    });
}
greystash.initStaleTable();


//baby helper function to create a closure for initStateTable
greystash.checkStale = function(site, extPass) {
    greystash.getPassword(function(webPass) {
        //if not initialized, set web password to ext password
        if (webPass == null) {
            greystash.storePassword(extPass, null, site);
            greystash.staleTable[site] = greystash.CURRENT;
        }
        else if (webPass == extPass) {
            greystash.staleTable[site] = greystash.CURRENT;
        }
        else {
            greystash.staleTable[site] = greystash.STALE;
        }
        console.log('--- updated stale rule for: ', site);
        console.log(greystash.staleTable);
    }, site);
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
    var site = greystash.getSiteFromURL(url);
    return greystash.staleTable.site;
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
greystash.getStalePass = function(callback, url) {
    var site = greystash.getSiteFromURL(url);
    greystash.getPassword(callback, site);
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
    var site = greystash.getSiteFromURL(url);
    greystash.getPassword(function(extPass) {
        greystash.storePassword(extPass, null, site);
        greystash.staleTable[site] = greystash.CURRENT;
    });
}


/*
 * getSiteFromURL()
 *
 * Helper function to get the site entry from a given URL.
 *
 * @param url The URL of the website
 */
greystash.getSiteFromURL = function(url) {
    for (var site in greystash.rules) {
        // if the url is associated with this site
        if (greystash.rules[site].urls.indexOf(url) > -1) {
            return site;
        }
    }

    console.log('ERROR: no site found for ' + url);
    return null;
}
