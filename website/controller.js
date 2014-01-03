var greystash = greystash || {};

greystash.webGenerate = function() {
    var out = document.getElementById('output');

    var site = greystash.getCanonicalURL(document.getElementById('site').value)
    var sitePass = document.getElementById('site_pass').value;
    var extPass = document.getElementById('ext_pass').value;

    console.log("Site: " + site);
    console.log("Site Pass: " + sitePass);
    console.log("Ext Pass: " + extPass);

    out.innerHTML = greystash.generatePassword(site, sitePass, extPass);
}

// attach the generatePass function to the generate button
onload = function() {
    var btn = document.getElementById('generate');
    btn.addEventListener('click', greystash.webGenerate);
}
