/*
 * password.js
 *
 * Generates secure passwords. This includes getting all relevant parameters
 * such as the extension password and canonical URL.
 *
 * @authors Kyle DeFrancia, Erik Paulson, Joe Devlin
 * @version 11/20/13
 * @version 12/1/13 - added the logic to generate a password
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
greystash.getCanonicalURL = function(url) {
    var re = /^.*[\.\/](.*\.(com|edu|net|org)).*$/

    //compress website like www.pilots.up.edu/stuff/more_stuff to up.edu
    url = url.replace(re,function(match, p1){return p1});
    url =  url.toLowerCase();

    return url;
}


/*
 * getExtPassword()
 *
 * Sends a message to the background page asking for the extension password.
 * 
 * @param callback Callback function that uses the extension password
 */
greystash.getExtPass = function(callback) {
    chrome.runtime.sendMessage({getExtPass: "somethingToMakeItTrue"},callback);
}


/*
 * getStalePass()
 * 
 * Sends a message to the background page asking for the stale extension
 * password for a given website.
 * 
 * @param url The canonical url of the website
 * @param callback the function to call when the extension password is returned
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
 * @param typed The simple password the user enters into the website password field
 * @param extensionPassword The user's Greystash extension password
 *
 * @return A string containing the generated password
 */
greystash.generatePassword = function(url,typed,extensionPassword){
	console.log("made it in generatePassword");
    //big long string made from the web page URL, extension Password, and
	//typed password
	var toHash = url.concat(extensionPassword, typed);


    var pretendSalt = "a";//hardcoded for now
	var bitArray = sjcl.misc.pbkdf2(toHash, pretendSalt, 2000, 110);//200 = loop count 110 = num bits for key
    //convert bit array to a hex number
    var hash = sjcl.codec.hex.fromBits(bitArray);
    console.log("hashReturned: " + hash);

    //convert hash to ASCII password
    var password = greystash.convertBase(hash,BASE16,BASE92);
	
	console.log("Generated Password: " + password);

    //TODO: add a check to make sure it works with the website rules and
    //loop again if it does not match

    
    return password;
}


/*
 * convertBase()
 * 
 * Converts a string whose characters are in one base to another base
 * (this doesn't make sense, I don't know exactly what it should say)
 *
 * @param src The string to change the base of
 * @param srctable The set of characters that make up the current base
 * @param desttable  The set of characters that make up the new base
 *
 * @return A string 
 */
greystash.convertBase = function(src, srctable, desttable){
	var srclen = srctable.length;
	var destlen = desttable.length;
	// first convert to base 10
	var val = 0;
	var numlen = src.length;
	for (var i = 0; i < numlen; i ++)
	{
		val = val * srclen + srctable.indexOf(src.charAt(i));
	}
	if (val < 0)
	{
		return 0;
	}
	// then covert to any base
	var r = val % destlen;
	var res = desttable.charAt(r);
	var q = Math.floor(val / destlen);
	while (q)
	{
		r = q % destlen;
		q = Math.floor(q / destlen);
		res = desttable.charAt(r) + res;
	}
	return res;
}

var BASE2  = "01";
var BASE8  = "01234567";
var BASE10 = "0123456789";
var BASE16 = "0123456789abcdef";
var BASE32 = "0123456789abcdefghijklmnopqrstuvwxyz";
var BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var BASE75 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_.,!=-*(){}[]";
//Joe Devlin added following line to enable all special characters allowed in passwords
var BASE92 = "!\"#$%&'()*+'-./0123456789:;<=>?@abcdefghijklmnopqrstuvwxyz[\]^_`ABCDEFGHIJKLMNOPQRSTUVWZYZ";

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


