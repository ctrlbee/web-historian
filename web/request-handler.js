var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers.js');
var fs = require('fs'); 
var Promise = require('bluebird');

///////////////////////////
/////PROMISE SOLUTION//////
///////////////////////////

var readFile = Promise.promisify(fs.readFile); 

exports.handleRequestPromise = function (req, res){
  if(req.url==="/" && req.method ==='POST'){
    //collect data from post and substring it
    var sub = ""; 
    collectData(req)
      .then(function(data){
        sub = data.substring(4); 
        return archive.paths.archivedSites + "/" + sub; 
      })
      .then(function(file){
         if(archive.isUrlArchived(file)){
            return readFile(file); 
         } else {
            if(!archive.isUrlInList(sub)){
              archive.addUrlToList(sub);   
            }
            return readFile(archive.paths.siteAssets + '/loading.html')  
          }
      })
      .then(function(htmlFile){
        httpHelpers.sendResponse(res, htmlFile); 
      })
      .catch(function(err){
        console.log("error in the chain"); 
      })
  }


   // SERVES UP INITIAL STATIC ASSETS
  if (req.url === '/' && req.method === 'GET') {
    httpHelpers.serveAssets(archive.paths.siteAssets + '/index.html', function (data) {
      httpHelpers.sendResponse(res, data);
    })
  } else if (req.url === '/styles.css' && req.method === 'GET') {
    httpHelpers.serveAssets(archive.paths.siteAssets + '/styles.css', function (data) {
      httpHelpers.sendResponse(res, data);
    })
  }
}

//refeactored to return a promise (pulled from the http-helpers)
var collectData = function(request) {
  return new Promise(function(resolve, reject){
    var data = "";
    request.on('data', function(chunk) {
      data += chunk;
    });
    request.on('end', function() {
      resolve(data);
    });
  })
};


////////////////////////////
////NON-PROMISE SOLUTION////
////////////////////////////

exports.handleRequest = function (req, res) {
  // SERVES HTML REQUESTED FROM FORM
  if(req.url === '/' && req.method === 'POST'){
    httpHelpers.collectData(req, function(data){
      data = data.substring(4); 
      if(archive.isUrlArchived(archive.paths.archivedSites + "/" + data)){ 
        httpHelpers.serveAssets(archive.paths.archivedSites + "/" + data, function(htmlfile){
          httpHelpers.sendResponse(res, htmlfile); 
        })
      } else {
        if(!archive.isUrlInList(data)){
          archive.addUrlToList(data);   
        }
        //return that "in list" page
        httpHelpers.serveAssets(archive.paths.siteAssets + '/loading.html', function (data) {
          httpHelpers.sendResponse(res, data);
        });
      }
    })
  }

  // SERVES UP INITIAL STATIC ASSETS
  if (req.url === '/' && req.method === 'GET') {
    httpHelpers.serveAssets(archive.paths.siteAssets + '/index.html', function (data) {
      httpHelpers.sendResponse(res, data);
    })
  } else if (req.url === '/styles.css' && req.method === 'GET') {
    httpHelpers.serveAssets(archive.paths.siteAssets + '/styles.css', function (data) {
      httpHelpers.sendResponse(res, data);
    })
  }
};
