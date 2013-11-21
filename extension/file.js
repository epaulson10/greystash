/*
 * file.js
 *
 * Handles reading and writing to a sandboxed area of the local filesystem
 * using the Chrome Filesystem API.
 *
 * @authors Kyle DeFrancia
 * @version 11/21/13
 *
 */

var greystash = greystash || {};


/*
 * specialRead()
 *
 * Reads either the extension password from file or a stale password
 * for a given URL.
 *
 * @param url The url of the site to read the stale password of. Pass in
 *              null to read the extension password.
 *
 * @return A string representing the extension or stale password
 */
greystash.specialRead = function(url) {
    return 'cats';
}


/*
 * specialWrite()
 *
 * Writes extension password or a stale password for a given URL to file.
 *
 * @param url The url of the site to write the stale password to. Pass in
 *              null to write the extension password.
 * @param text The password to write to file
 *
 * @return True if the write was successfull or false if it wasn't 
 */
greystash.specialRead = function(url) {
    return true;
}
