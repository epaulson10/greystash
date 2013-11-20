/*
 * contentScript.js
 *
 *
 * @author Kyle DeFrancia, Joey Devlin, Erik Paulson, Tanya Crenshaw
 * @version 11/19/2013
 */

// Create a namespace for this extension.
var greystash = greystash || {};

/*
 * initInjection()
 * 
 * Find the password input field on the page and add a listener
 * to it.  Based on Joe Devlin's experiment source, findPass.js.
 * 
 */
greystash.initInjection = function() { 

    console.log('Page Instrumented.');
    
    // Grab all of the forms on the page.
    var allForms = document.getElementsByTagName('form');
    
    // Search through all the forms on the page, looking for the 
    // password input and the submit button.      
    for(var j = 0; j < allForms.length; j++){
        var form = allForms[j];
    
        for (var i = 0; i < form.elements.length; i++) {
            var input = form.elements[i];
        
        // Alter the display rules for the password input
        // and alter the submit listener
            if (input.getAttribute('type') == 'password') { 
                console.log("Found password field");
                console.log(input);
                input.style.backgroundColor = 'red';
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
 * Eventually this function should take on the same functionality as
 * in Joe Devlin's processForm in findPass.js.  For now, just log
 * the form.
 */
greystash.processForm = function(form) {
    console.log(form);    
}


// Begin logging by logging the ID of this extension.
greystash.ExtensionId = chrome.runtime.id;
console.log('My extension id is: ' + greystash.ExtensionId);
