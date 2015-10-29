// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var httpGet = require('http-request');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');

var sites = archive.readListOfUrls(); 
var siteToProcess = sites.shift(); 

var updateFile = function(){
  archive.rewriteList(sites.join('\n')); 
}

httpGet.get(siteToProcess, function (err, res) {
  if (err) {
    console.log(err);
  }
  
  var siteDoc = res.buffer.toString(); 

  console.log(archive.writeHtmlFile)

  archive.writeHtmlFile(siteToProcess, siteDoc, updateFile); 

});

