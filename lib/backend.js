module.exports = function(config){
  let { env, pubsub } = config.common.storage
  if(config.cli) {
    config.cli.on('cliSandbox', function(sandbox) {
      sandbox.setTickRate = function(value) {
        if(!value) return 'Value required'
        pubsub.publish('setTickRate',value)
        return 'Tick rate set to '+value+'ms';
      };
      sandbox.getTickRate = function() {
        return env.get('tickRate').then(value=>`Tick rate is ${value}ms`);
      };
    });
  }
}
