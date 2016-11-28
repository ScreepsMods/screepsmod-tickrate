module.exports = function(config){
  let pubsub = config.common.storage.pubsub
  if(config.cli) {
    config.cli.on('cliSandbox', function(sandbox) {
      sandbox.setTickRate = function(value) {
        pubsub.publish('setTickRate',value)
        return 'Tick rate set to '+value+'ms';
      };
    });
  }
}