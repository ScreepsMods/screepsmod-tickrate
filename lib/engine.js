let env, config
module.exports = function engine(conf,auth){
  config = conf
  let storage = config.common.storage
  env = storage.env
  let bootInter = setInterval(()=>{
    if(!env.get) return
    clearInterval(bootInter)
    env.get('tickRate').then(setTickRate)
  },100)
  config.engine.on('init', function(processType) {
    if(processType == 'main'){
      config.common.storage.pubsub.subscribe('setTickRate',setTickRate)
    }
  })
  config.engine.on('playerSandbox', function(sandbox,userID) {
    sandbox.setTickRate = function(value) {
      if(!value) return sandbox.console.log('Value required')
      if(!config.auth)
        return sandbox.console.log(`screepsmod-auth is required to set tick rate from player console.`);
      if(!config.auth.getUser)
        return sandbox.console.log(`screepsmod-auth is outdated, please update screepsmod-auth`);
      config.auth.getUser({ _id: userID }).then(user=>{
        if(user.hasGroup('admin')){
          pubsub.publish('setTickRate',value)
          sandbox.console.log(`Tick rate set to ${value}ms`);
        }else{
          sandbox.console.log(`Unauthorized. Only Admins can set tick rate.`);
        }
      })
    };
    sandbox.getTickRate = function() {
      env.get('tickRate').then(value=>{
        sandbox.console.log(`Tick rate is ${value}ms`);
      })
    };
  });
}

function setTickRate(value){
  value = parseInt(value)
  if(typeof value == 'number' && !Number.isNaN(value)){
    config.engine.mainLoopMinDuration = value || 1000
    env.set('tickRate',value)
    console.log(`Tick Rate set to ${value}ms`)
  }else{
    console.log(`Tick Rate failed to set ${value} ${typeof value}`)
  }
}
