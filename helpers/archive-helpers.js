var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function() {
  var data = fs.readFileSync(exports.paths.list).toString(); 
  var sites = data.split('\n');
  return sites;
};

exports.isUrlInList = function(url) {
  var inUrl = true;
  var sites = exports.readListOfUrls();
  if(sites.indexOf(url) === -1){
    inUrl = false; 
  }
  console.log(inUrl);
  return inUrl;
};

exports.addUrlToList = function(url) {
  var saved = true;
  fs.appendFile(exports.paths.list, url + '\n', function(err){
    if(err){saved = false;}
  });
  return saved; 
};

exports.rewriteList = function(list){
  fs.writeFile(exports.paths.list, list); 
};

exports.isUrlArchived = function(url) {
  var exists = true;

  try {
    fs.accessSync(url, fs.R_OK);
  } catch (e) {
    exists = false;
  }

  return exists;
};

exports.writeHtmlFile = function(siteToProcess, siteDoc, cb) {

  fs.writeFile(exports.paths.archivedSites +"/"+ siteToProcess, siteDoc, function (err) {
    if (err) {
      console.log(err);
    } else {
      cb(); 
    }
  });

};
