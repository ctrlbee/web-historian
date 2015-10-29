var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers.js')
// require more modules/folders here!

// var routes = {
//   '/': function (res) {
//     httpHelpers.serveAssets(res, archive.paths.siteAssets + '/index.html', function (data) {
//       res.end(data);
//     })
//   }
// }


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
