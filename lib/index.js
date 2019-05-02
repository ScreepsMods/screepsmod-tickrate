module.exports = function(config){
  console.log("screepsmod-tickrate is now obsolete, functionality has been moved to screepsmod-admin-utils")
  if(config.backend) require('./backend')(config) 
  if(config.engine) require('./engine')(config) 
}