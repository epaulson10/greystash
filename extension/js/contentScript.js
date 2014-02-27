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
greystash.initInjection = function(staleness) { 

    console.log(
        "        GREYSTASH          \n" +
        "                           \n" +
        "        . `.*.' .          \n" +
        "  . +  * .o   o.* `.`. +.  \n" +
        " *  . ' ' |\\^/|  `. * .  * \n" +
        "           \\V/             \n" +
        "You Shall  /_\\  Not Pass!  \n" +
        "          _/ \\_            \n"
    );

    // does this site have a stale password?
    greystash.isStale = staleness;
    
    // Grab all of the forms on the page.
    var allForms = document.forms;

    //This unfortunately ugly code adds rules to the CSS to make the clickable
    //icons work. Doing so here prevents having to hardcode the extension ID
    //in the CSS.
    var styleCheck = $('<style>.icon-check{ background-image: url(' +
               chrome.extension.getURL("imgs/check.png")+ '); }</style>');
    $('html > head').append(styleCheck);

    var styleX = $('<style>.icon-x{ background-image: url(' +
                chrome.extension.getURL("imgs/x.png")+ '); }</style>');
    $('html > head').append(styleX);

    if (greystash.isStale) {
        var styleTriangle = $('<style>.icon-triangle{ background-image: url(' +
                   chrome.extension.getURL("imgs/triangle.png")+ '); }</style>');
        $('html > head').append(styleTriangle);
    }

    //jQuery code to allow us to click on the icon in the 
    //password field to change greystash options.
    $(document).on('mousemove', '.icon-greystash', function( e ){
                  $(this)[(this.offsetWidth-28 < e.clientX-this.getBoundingClientRect().left)?'addClass':'removeClass']('onX');   
               }).on('click', '.onX', function(){
                  $(this).removeClass('x onX');
                  greystash.changeIcon(this);
                  console.log("Field button clicked!");
               });

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
                input.className = input.className + " icon-greystash icon-check"; 
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
    var sawGreen = false;
    var pass, passParams;
    for (var i = 0; i < elements.length; i++) {
        
        if (elements[i].getAttribute('type') === 'password') {
            pass = elements[i];
            passParams = {url: document.URL, typed: pass.value};

            //check if we need to hash
            if (pass && !$(pass).hasClass('icon-x')) {
                // are we using a stale password or the ext pass?
                if ($(pass).hasClass('icon-triangle')) {
                    passParams.stale = true;
                } else {
                    if ($(pass).hasClass('icon-check')) sawGreen = true;
                    passParams.stale = false;
                }

                // generate the pass in the background script
                chrome.runtime.sendMessage({generatePass: passParams}, function(response) {
                    var genPass = response.generatedPass;
                    console.log('Pass received: ' + genPass);
        
                    // put new password into the form and change to do not hash,
                    // since we just did
                    pass.value = genPass;
                    $(pass).removeClass("icon-check").removeClass("icon-triangle");
                    $(pass).addClass('icon-x');

                    //prompt user to confirm new website password
                    if(greystash.isStale && sawGreen){
                        var retVal = prompt("Did you change your password on this site?\n" +
                               "Enter Y[es] or N[o] to continue", "No");
                        var re = /^\s*[yY].*/

                        if(retVal ? retVal.match(re) : false){
                            chrome.runtime.sendMessage({changeStalePass: document.URL},
                                function(){
                                    console.log('-- update noticed in content script');
                                    greystash.isStale = false;
                                });
                        }
                    }

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
    if (greystash.isStale) {
        if ($(inputField).hasClass('icon-check')) {
           $(inputField).removeClass('icon-check').addClass('icon-triangle');
        }
        else if ($(inputField).hasClass('icon-triangle')) {
           $(inputField).removeClass('icon-triangle').addClass('icon-x');
        }
        else if ($(inputField).hasClass('icon-x')) {
           $(inputField).removeClass('icon-x').addClass('icon-check');
        }
    } else {
        if ($(inputField).hasClass('icon-check')) {
           $(inputField).removeClass('icon-check').addClass('icon-x');
        }
        else if ($(inputField).hasClass('icon-x')) {
           $(inputField).removeClass('icon-x').addClass('icon-check');
        }
    }//else
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
