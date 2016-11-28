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
}

function setTickRate(value){
  if(typeof value == 'number'){
    config.engine.mainLoopMinDuration = value || 1000
    env.set('tickRate',value)
    console.log(`Tick Rate set to ${value}ms`)
  }else{
    console.log(`Tick Rate failed to set ${value} ${typeof value}`)
  }
}