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
greystash.STALE = 1;
greystash.CURRENT = 0;

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
        console.log(extPass);
        //loop through all the sites
        for (var site in greystash.rules) {
            var url = greystash.rules[site].urls;
            //made helper to create closure
            greystash.checkStale(url,extPass);
        }
    });
}

//baby helper function to create a closure for initStateTable
greystash.checkStale = function(url,extPass) {
    greystash.getPassword(function(webPass){
        //if not initialized, set web password to ext password
        if(webPass == null){
            greystash.storePassword(extPass,function(){}, url);
            greystash.staleTable[url] = greystash.CURRENT;
        }
        else if(webPass == extPass){
            greystash.staleTable[url] = greystash.CURRENT;
        }
        else{
            greystash.staleTable[url] = greystash.STALE;
        }
        console.log("Stale Table:");
        console.log(greystash.staleTable);
    },url);
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
