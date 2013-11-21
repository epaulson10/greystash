
//turn password boxes red and override the submit button
function turnPassRed() {
    var allForms = document.getElementsByTagName('form');
    
    for(var j = 0; j < allForms.length; j++){
        var form = allForms[j];

        for (var i = 0; i < form.elements.length; i++) {
            var input = form.elements[i];
    
            //make password field red and add some listeners
            if (input.getAttribute('type') == 'password') { 
                console.log("found password field");
                input.style.backgroundColor = 'red';

                //two ways people can keylog our site, just wanted to see
                //if they were a security risk, shouldn't be
                input.onkeypress = function(e){
                    console.log(String.fromCharCode(e.charCode));
                }
                input.oninput = function(){
                    console.log("INPUT VALUE: " + this.value);
                }
            }

            //change what the submit button does
            if(input.getAttribute('type') == 'submit'){
                input.onclick = function(){
                    return processForm(this.form);
                };
            }
        }
    }
}


//Intercepts form submission, creates a copy of the form, edits login
//credentials, and securely submits the new form
function processForm(form){
    var newForm = form.cloneNode(true);
    console.log("in proces form");
    var submitButton;
    var numPass = 0;
	for(var obj = 0; obj < newForm.elements.length; obj++){
        var unit = newForm.elements[obj];
        //edit password field with new password
		if (unit.getAttribute('type') == 'password') {
            console.log(unit.value);
            console.log(getURL());
            numPass++;
            //assumes the extension password used on install was 1234
            var lk = "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4";
			//unit.value = genPassword(getURL(),newForm.elements[obj].value,lk);
            
            //used for debug to actually login to the website
            if(numPass >1) {unit.value = 'badpassword';}
    
		}

        //used for debug purposes to insert user name into the fake form
        else if(unit.getAttribute('type') == 'text'){
            //unit.value = "INSERT USERNAME HERE";
        }
        else if(unit.getAttribute('type') == 'submit'){
            submitButton = obj;
        }
	}
    document.body.appendChild(newForm);
    if(numPass > 1){newForm.elements[submitButton].click();return true;}
    else{newForm.submit();}

    //disable the old from from sending, may not be necessary
    form.submit = function(){
        return null;
    }
    form.elements[submitButton].click = function(){return null;}
	return false;
}


// the real meat and potatoes of the script
//generates a unique strong password from the url, extension password, and typed password 
function genPassword(url,typed,extensionPassword){
    console.log('typed password: ' + typed);
    console.log('URL: ' + url);
    console.log('extension Password: ' + extensionPassword);

	//big long string made from the web page URL, extension Password, and
	//typed password
	var toHash = url.concat(extensionPassword, typed);


    var pretendSalt = "a";//hardcoded for now
	var hash = CryptoJS.PBKDF2(toHash,pretendSalt,{iterations: 2000}).toString();
    console.log("hashReturned: " + hash);

    //convert hash to ASCII password
    var password = convert(hash,BASE16,BASE92)
	
	console.log("Generated Password: " + password);
    return password;
}

//shows that plain text is not the best way to send the form
//can totally see the generate password if just override onsubmit
window.onbeforeunload = function() {
    var allForms = document.getElementsByTagName('form');
    for(var i in allForms){
        var form = allForms[i];
        for(var obj in form.elements){
            if(form[obj] == undefined){
            }
            else if (form[obj].getAttrivute != undefined && form[obj].getAttribute('type') == 'password') {
                console.log("FOUND YOUR PASSWORD: " + form[obj].value);
            }
        }
    }
    return null;
}
window.onload = turnPassRed();
turnPassRed();


///////////////////////////////////////////////////////////////////////////////////////////////////////
//  Code Below is copied, but cannot link because not allowed/ do not understand how
//  to import libraries in a content script
//////////////////////////////////////////////////////////////////////////////////////////////////////


//http://rot47.net/base.html
//had a download code for portability option, so assuming we are safe to use
//should double check if we were to endup using this function
/*
	convert.js
	http://rot47.net
	Dr Zhihua Lai

*/

var BASE2  = "01";
var BASE8  = "01234567";
var BASE10 = "0123456789";
var BASE16 = "0123456789abcdef";
var BASE32 = "0123456789abcdefghijklmnopqrstuvwxyz";
var BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var BASE75 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_.,!=-*(){}[]";
//Joe Devlin added following line to enable all special characters allowed in passwords
var BASE92 = "!\"#$%&'()*+'-./0123456789:;<=>?@abcdefghijklmnopqrstuvwxyz[\]^_`ABCDEFGHIJKLMNOPQRSTUVWZYZ";

function convert(src, srctable, desttable)
{
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
/*
Code below is from http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/pbkdf2.js.
License posed on website:
Copyright (c) 2009-2013 Jeff Mott

Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
and associated documentation files (the "Software"), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial 
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT 
SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.




Example use from https://code.google.com/p/crypto-js/#PBKDF2:
<script src="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/pbkdf2.js"></script>
<script>
    var salt = CryptoJS.lib.WordArray.random(128/8);

    var key128Bits = CryptoJS.PBKDF2("Secret Passphrase", salt, { 
: 128/32 });
    var key256Bits = CryptoJS.PBKDF2("Secret Passphrase", salt, { keySize: 256/32 });
    var key512Bits = CryptoJS.PBKDF2("Secret Passphrase", salt, { keySize: 512/32 });

    var key512Bits1000Iterations = CryptoJS.PBKDF2("Secret Passphrase", salt, { keySize: 512/32, iterations: 1000 });
</script>

*/

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License

*/
var CryptoJS=CryptoJS||function(g,j){var e={},d=e.lib={},m=function(){},n=d.Base={extend:function(a){m.prototype=this;var c=new m;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
q=d.WordArray=n.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=j?c:4*a.length},toString:function(a){return(a||l).stringify(this)},concat:function(a){var c=this.words,p=a.words,f=this.sigBytes;a=a.sigBytes;this.clamp();if(f%4)for(var b=0;b<a;b++)c[f+b>>>2]|=(p[b>>>2]>>>24-8*(b%4)&255)<<24-8*((f+b)%4);else if(65535<p.length)for(b=0;b<a;b+=4)c[f+b>>>2]=p[b>>>2];else c.push.apply(c,p);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=g.ceil(c/4)},clone:function(){var a=n.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*g.random()|0);return new q.init(c,a)}}),b=e.enc={},l=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],f=0;f<a;f++){var d=c[f>>>2]>>>24-8*(f%4)&255;b.push((d>>>4).toString(16));b.push((d&15).toString(16))}return b.join("")},parse:function(a){for(var c=a.length,b=[],f=0;f<c;f+=2)b[f>>>3]|=parseInt(a.substr(f,
2),16)<<24-4*(f%8);return new q.init(b,c/2)}},k=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],f=0;f<a;f++)b.push(String.fromCharCode(c[f>>>2]>>>24-8*(f%4)&255));return b.join("")},parse:function(a){for(var c=a.length,b=[],f=0;f<c;f++)b[f>>>2]|=(a.charCodeAt(f)&255)<<24-8*(f%4);return new q.init(b,c)}},h=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(k.stringify(a)))}catch(b){throw Error("Malformed UTF-8 data");}},parse:function(a){return k.parse(unescape(encodeURIComponent(a)))}},
u=d.BufferedBlockAlgorithm=n.extend({reset:function(){this._data=new q.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=h.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var b=this._data,d=b.words,f=b.sigBytes,l=this.blockSize,e=f/(4*l),e=a?g.ceil(e):g.max((e|0)-this._minBufferSize,0);a=e*l;f=g.min(4*a,f);if(a){for(var h=0;h<a;h+=l)this._doProcessBlock(d,h);h=d.splice(0,a);b.sigBytes-=f}return new q.init(h,f)},clone:function(){var a=n.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});d.Hasher=u.extend({cfg:n.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){u.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,d){return(new a.init(d)).finalize(b)}},_createHmacHelper:function(a){return function(b,d){return(new w.HMAC.init(a,
d)).finalize(b)}}});var w=e.algo={};return e}(Math);
(function(){var g=CryptoJS,j=g.lib,e=j.WordArray,d=j.Hasher,m=[],j=g.algo.SHA1=d.extend({_doReset:function(){this._hash=new e.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(d,e){for(var b=this._hash.words,l=b[0],k=b[1],h=b[2],g=b[3],j=b[4],a=0;80>a;a++){if(16>a)m[a]=d[e+a]|0;else{var c=m[a-3]^m[a-8]^m[a-14]^m[a-16];m[a]=c<<1|c>>>31}c=(l<<5|l>>>27)+j+m[a];c=20>a?c+((k&h|~k&g)+1518500249):40>a?c+((k^h^g)+1859775393):60>a?c+((k&h|k&g|h&g)-1894007588):c+((k^h^
g)-899497514);j=g;g=h;h=k<<30|k>>>2;k=l;l=c}b[0]=b[0]+l|0;b[1]=b[1]+k|0;b[2]=b[2]+h|0;b[3]=b[3]+g|0;b[4]=b[4]+j|0},_doFinalize:function(){var d=this._data,e=d.words,b=8*this._nDataBytes,l=8*d.sigBytes;e[l>>>5]|=128<<24-l%32;e[(l+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(l+64>>>9<<4)+15]=b;d.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=d.clone.call(this);e._hash=this._hash.clone();return e}});g.SHA1=d._createHelper(j);g.HmacSHA1=d._createHmacHelper(j)})();
(function(){var g=CryptoJS,j=g.enc.Utf8;g.algo.HMAC=g.lib.Base.extend({init:function(e,d){e=this._hasher=new e.init;"string"==typeof d&&(d=j.parse(d));var g=e.blockSize,n=4*g;d.sigBytes>n&&(d=e.finalize(d));d.clamp();for(var q=this._oKey=d.clone(),b=this._iKey=d.clone(),l=q.words,k=b.words,h=0;h<g;h++)l[h]^=1549556828,k[h]^=909522486;q.sigBytes=b.sigBytes=n;this.reset()},reset:function(){var e=this._hasher;e.reset();e.update(this._iKey)},update:function(e){this._hasher.update(e);return this},finalize:function(e){var d=
this._hasher;e=d.finalize(e);d.reset();return d.finalize(this._oKey.clone().concat(e))}})})();
(function(){var g=CryptoJS,j=g.lib,e=j.Base,d=j.WordArray,j=g.algo,m=j.HMAC,n=j.PBKDF2=e.extend({cfg:e.extend({keySize:4,hasher:j.SHA1,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(e,b){for(var g=this.cfg,k=m.create(g.hasher,e),h=d.create(),j=d.create([1]),n=h.words,a=j.words,c=g.keySize,g=g.iterations;n.length<c;){var p=k.update(b).finalize(j);k.reset();for(var f=p.words,v=f.length,s=p,t=1;t<g;t++){s=k.finalize(s);k.reset();for(var x=s.words,r=0;r<v;r++)f[r]^=x[r]}h.concat(p);
a[0]++}h.sigBytes=4*c;return h}});g.PBKDF2=function(d,b,e){return n.create(e).compute(d,b)}})();


//copied from http://www.codeproject.com/Tips/498368/Get-current-page-URL-using-JavaScript
function getURL()
{
	var currentPageUrl = "";
	if (typeof this.href === "undefined") 
	{
		currentPageUrl = document.location.toString();
	}
	else 
	{
		currentPageUrl = this.href.toString();
	}
	return currentPageUrl
}