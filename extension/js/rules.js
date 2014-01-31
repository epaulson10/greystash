/*
 * rules.js
 *
 * Responsible for reading in supported website url aliases and password
 * requirements.
 *
 * @author Kyle DeFrancia
 */
var greystash = greystash || {};


/*
 * initRules()
 *
 * This method runs when the script loads and makes the mathching urls,
 * password rules, and max password length of all supported websites available
 * in the greystash.rules object.
 *
 * A rule object must contain:
 *   key: urls
 * value: array of canonical URLs
 * 
 *   key: rule
 * value: regular expression
 *
 * Optionally a rule may also contain:
 *   key: max_len
 * value: integer value 
 *
 * @return the rules object containg all supported website rules
 */
greystash.initRules = function() {
    var rules = {};
    
    rules['reddit'] = {
        urls: ['reddit.com'],
        rule: /^.{3,}$/
    };

    rules['facebook'] = {
        urls: ['facebook.com'],
        rule: /^.{6,}$/,
        max_len: 1000
    };

    rules['ebay'] = {
        urls: ['ebay.com'],
        rule: /^(?=.*[0-9].*[0-9])(?=.*[A-Z])(?=.*[\^\-*#~!@$%&()_+=`]).*/
    };
    rules['twitter'] = {
        urls: ['twitter.com'],
        rule: /^.{6,}$/
    };
    rules['pilots'] = {
        urls: ['up.edu'],
        rule: /^(?=.*[0-9].*)(?=.*[a-z].*)(?=.*[A-Z])(?=.*[\^\-*#~!@$%&()_+=`]).*/
    };
    rules['amazon'] = {
        urls: ['amazon.com'],
        rule: /^.{6,128}$/,
        max_len: 128
    };
    rules['live'] = {
        urls: ['live.com'],
        rule: /^(?=.*[0-9].*)(?=.*[a-z].*)(?=.*[A-Z])(?=.*[\^\-*#~!@$%&()_+=`]).*/,
        max_len: 16
    };
    rules['google'] = {
        urls: ['google.com'],
        rule: /^.{8,}$/
    };
    // read a file for more rules in JSON?

    return rules;
};
greystash.rules = greystash.initRules();


/*
 * getRule()
 *
 * Get password rules for a supported website.
 *
 * @param url The url to get the rule for
 *
 * @return a rule object
 */
greystash.getRule = function(url) {
    greystash.rules = greystash.rules || greystash.initRules();

    var entry;
    // check each site listed in the rules
    for (var site in greystash.rules) {
        // if the url is associated with this site
        if (greystash.rules[site].urls.indexOf(url) > -1) {
            entry = greystash.rules[site];
            break;
        }
    }

    if (entry == null) {
        console.log('ERROR: rule entry for ' + url + ' not found');
        return null;
    }

    return entry;
};
