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
    var re = /^.*[\.\/](.*?\.(com|edu|net|org))[^\%].*/

    //compress website like www.pilots.up.edu/stuff/more_stuff to up.edu
    url = url.replace(re, function(match, p1){return p1});
    url = url.toLowerCase();

    return url;
}


/*
 * generatePassword()
 * 
 * Contains the logic for generating Greystash secure passwords using a site's url
 * plus a user's simple password for that site and their extension password.
 *
 * @param url The url of the website being logged into
 * @param typed The simple password the user enters into the website password field
 * @param extPass The user's Greystash extension password
 *
 * @return A string containing the generated password
 */
greystash.generatePassword = function(url, typed, extPass){
    var toHash = url + extPass;
    var pass;
    var attempt = 0;
    var loopCount = 30000;
    do {
        // 600 = number of bits to output. 600 bits == 100 base64 chars
        var bits = sjcl.misc.pbkdf2(toHash, typed + attempt, loopCount, 600);

        //convert bit array to a string using base64 encoding
        var b64 = sjcl.codec.base64.fromBits(bits);
        
        // 1245679go@wayNSA!+/.$#CDFGHJKLMPQUVWXYBO08IEZbcefhijklmnpqrstvxz
        // The following replacements are made to the SJCL base64 char set:
        // @ for 3
        // $ for T
        // # for u
        // ! for R
        // . for d
        var subs = {'3':'@', 'T':'$', 'u':'#', 'R':'!', 'd':'.'};
        pass = b64.replace(/3|T|u|R|d/g,function(match) {return subs[match];});

        // truncate if needed
        var max = greystash.getRule(url).max_len;
        if (max && pass.length > max) pass = pass.substring(0, max);
        
        attempt++;
        loopCount = 1; // try passwords faster after first attempt
    } while (!greystash.checkRule(url, pass) && (attempt < 100));

    console.log(pass ?
        'genPass: Generated password: ' + pass :
        'genPass: ERROR: cannot generate a password for ' + url);

    return pass;
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
greystash.checkRule = function(url, pass) {
    var re = greystash.getRule(url).rule;

    if (re == null) {
        console.log('ERROR: rule for ' + url + ' not found');
        return false;
    }

    return re.test(pass);
}
