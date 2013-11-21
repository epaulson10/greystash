
//Is this the correct namespace? -ep
password = password || {};

/*
 * getCanonicalURL()
 * 
 * Returns the canonical url of the current website. An example
 * of a canonical url is www.facebook.com (with no more characters after "com").
 * 
 * @return A string containing the canonical url of the website
 */
 password.getCanonicalURL = function(){
 }
 
/*
 * getExtPassword()
 *
 * 
 */
  
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
password.generatePassword = function(url, simplePass, extPass){
    //Concat big string
    //P2BKFS
    //Convert to base
    //Check rules
}

/*
 * convertBase()
 * 
 * I don't understand this enought to document it. Joe can you do this? -ep
 *
 * @param 
 * @param 
 * @param 
 *
 * @return A string 
 */
password.convertBase = function(passString, origBase, newBase){
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
password.checkRule = function(url){
}

/*
 * getStalePass()
 * 
 * Determines whether the generated password conforms to a certain website's
 * password requirements.
 *
 * @param url The canonical url of the website being examined
 *
 * @return true if the generated password fits the site's rules, false otherwise
 */
password.checkRule = function(url){
}


