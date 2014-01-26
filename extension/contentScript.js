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
greystash.initInjection = function() { 

    console.log('Page Instrumented.');

    //jQuery code to allow us to click on the icon in the 
    //password field to change greystash options.
    $(document).on('mousemove', '.icon-greystash', function( e ){
                  $(this)[(this.offsetWidth-18 < e.clientX-this.getBoundingClientRect().left)?'addClass':'removeClass']('onX');   
               }).on('click', '.onX', function(){
                  $(this).removeClass('x onX');
                  greystash.changeIcon(this);
                  console.log("Field button clicked!");
               });

    // Grab all of the forms on the page.
    var allForms = document.getElementsByTagName('form');
    
    // Search through all the forms on the page, looking for the 
    // password input and the submit button.      
    for(var j = 0; j < allForms.length; j++) {
        var form = allForms[j];
    
        for (var i = 0; i < form.elements.length; i++) {
            var input = form.elements[i];
        
            // Alter the display rules for the password input
            // and alter the submit listener
            if (input.getAttribute('type') == 'password') { 
               console.log("Found password field");
               console.log(input);

               //Add the clickable icon to the password field
               input.className = input.className + " icon-greystash icon-check";
            }

            //change what the submit button does
            if(input.getAttribute('type') == 'submit'){
               input.onclick = function(){
                  return greystash.processForm(this.form);
                };
            }
        }
    }
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
 */
greystash.processForm = function(form) {
    console.log('Form submitted:');
    console.log(form);

    //grab typed password
    var pass;
    var typedPass;
    for(var obj = 0; obj < form.elements.length; obj++){
        var unit = form.elements[obj];
        //edit password field with new password
        if (unit.getAttribute('type') == 'password') {
            pass = unit;
            typedPass = unit.value;
        }
    }

    if (pass && typedPass) {
        var passParams = {url: document.URL, typed: typedPass};

        // generate the pass in the background script
        chrome.runtime.sendMessage({generatePass: passParams}, function(response) {
            var genPass = response.generatedPass;
            console.log('Pass received: ' + genPass);
            // put new password into the form
            pass.value = genPass;
            form.submit();
        });

        return false;//makes it so we don't submit before we are ready
    }
    // if we can't find the password field don't do anything
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
 * @param password The password field whose icon is to be changed
 */
greystash.changeIcon = function(password) {
   if ($(password).hasClass('icon-check')) {
      $(password).removeClass('icon-check').addClass('icon-triangle');
   }
   else if ($(password).hasClass('icon-triangle')) {
      $(password).removeClass('icon-triangle').addClass('icon-x');
   }
   else if ($(password).hasClass('icon-x')) {
      $(password).removeClass('icon-x').addClass('icon-check');
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
 */
greystash.confirmStalePassChange = function() {
   alert('Did you change your password yet??');
}
