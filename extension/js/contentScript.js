/*
 * contentScript.js
 *
 * The content script initially injects an icon into the password field and
 * attaches an event listener to the page’s form submit button.  Once a 
 * secure password has been generated, the content script can submit the login
 * form with the secure password to the website.
 *
 * @author Kyle DeFrancia, Joe Devlin, Erik Paulson, Tanya Crenshaw
 * @version 11/21/2013
 * @version 12/1/2013
 */

// Create a namespace for this extension.
var greystash = greystash || {};

//added constants to represent weather or not to hash passwords
//should be changed when we use icons
greystash.HASH = 'green';
greystash.NO_HASH = 'red';
greystash.USE_STALE = 'yellow';

/*
 * initInjection()
 * 
 * Find password fields and attach a Greystash icon to them.  Find the form
 * submit button and attach a listener to it. 
 *
 * Green is default icon to insert, but check if there are multiple password
 * fields and if there is a stale password for this site to try and guess when
 * we should insert a yellow icon instead.
 * 
 * This code runs when the background page detects a page has been loaded in
 * the browser.
 */
greystash.initInjection = function() { 

    console.log(
"        GREYSTASH          \n" +
"                           \n" +
"        . `.*.' .          \n" +
"  . +  * .o   o.* `.`. +.  \n" +
" *  . ' ' |\\^/|  `. * .  * \n" +
"           \\V/             \n" +
"You Shall  /_\\  Not Pass!  \n" +
"          _/ \\_            \n");
    
    // Grab all of the forms on the page.
    var allForms = document.forms;
    
    // Search through all the forms on the page, looking for the 
    // password input and the submit button.      
    var elements, input;
    for(var i = 0; i < allForms.length; i++) {

        elements = allForms[i].elements;
        for (var j = 0; j < elements.length; j++) {
            input = elements[j];
        
            // Alter the display rules for the password input
            // and alter the submit listener
            if (input.getAttribute('type') === 'password') { 
                input.style.backgroundColor = greystash.NO_HASH;
                
                //for now change modes when the user clicks on the
                //text field
                input.onclick = function() {
                    greystash.changeIcon(this);
                }
            }
        
            //change what the submit button does
            if (input.getAttribute('type') === 'submit') {
                input.onclick = function() {
                    return greystash.processForm(this.form, this);
                };
            }
        }//for
    }//for
}

/*
 * processForm()
 * 
 * Handles submitting a form to a web site.  First the form is cloned
 * and all the required parameters to generate a secure password are gathered:
 * the canonical URL, the typed password, and the extension password.
 *
 * A secure password is then generated, input into the dummy form and
 * submitted to the web site.
 *
 * @param form The login form being submitted
 * @param button the submit button for the form
 */
greystash.processForm = function(form, button) {
    console.log('Form submitted:', form);
    
    var elements = form.elements;
    var pass, passParams;
    for (var i = 0; i < elements.length; i++) {
        
        if (elements[i].getAttribute('type') === 'password') {
            pass = elements[i];
            passParams = {url: document.URL, typed: pass.value};

            //check if we need to hash
            if (pass && pass.style.backgroundColor != greystash.NO_HASH) {
                // generate the pass in the background script
                chrome.runtime.sendMessage({generatePass: passParams}, function(response) {
                    var genPass = response.generatedPass;
                    console.log('Pass received: ' + genPass);
        
                    // put new password into the form and change to do not hash,
                    // since we just did
                    pass.value = genPass;
                    pass.style.backgroundColor = greystash.NO_HASH;

                    // attempt to resubmit the form
                    button.click();
                });

                return false; // wait for the password to be hashed
            }
        }
    }//for

    return true;
}


/*
 * changeIcon()
 *
 * Iterates the Greystash icon attached to a password field to the next icon
 * according to the order: Green, Yellow, Red.
 *
 * The three icons are:
 *  Green: this is the 'on' icon.  Password fields with this icon will
 *         transform the user input into a generated password using the
 *         extension password.
 *
 *  Yellow: this is the 'old password' icon.  Password fields with this icon
 *          will transform the user input into a generated password but using
 *          the stale password associated with the site.
 *
 *          NOTE: this icon is only available if there is currently a stale
 *                password associated with the site.
 *
 *  Red: this is the 'off' icon.  Password fields with this icon will not have
 *       the user input changed into a generated password and will be submitted
 *       to the website as typed by the user.
 * 
 * Note: for now just changes the color of the filed to indicate weather to 
 * hash a password or not
 *
 * @param inputField The password field whose icon is to be changed
 */
greystash.changeIcon = function(inputField) {
    if (inputField.style.backgroundColor === greystash.HASH){
        inputField.style.backgroundColor = greystash.NO_HASH;
    } else {
        inputField.style.backgroundColor = greystash.HASH;
    }
}


/*
 * checkStale()
 *
 * Checks if the given URL has a stale password associated with it.
 *
 * @param url The url of the web site to check
 *
 * @return True is a stale password exists, false if not.
 */
greystash.checkStale = function(url) {
    return true;
}


/*
 * confirmStalePassChange()
 *
 * Has the user confirm if they just changed their password on the web site
 * by prompting them with an alert box.
 * 
 * If the user confirms they changed a password, a message is sent to the
 * background page to update the stale state of the web site.
 * 
 * 
 */
greystash.confirmStalePassChange = function(inputField) {
}
