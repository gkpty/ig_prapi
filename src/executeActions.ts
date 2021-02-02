
import 'dotenv/config.js';
import { IgApiClient } from 'instagram-private-api';
import * as fs from 'fs';

const executeActions = async (limit=50) => {
  //login
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);
  ig.state.proxyUrl = process.env.IG_PROXY;
  await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  //sort actions by priority
  let queue = fs.existsSync('queue.json')? JSON.parse(fs.readFileSync('queue.json', 'utf8')): []
  queue.sort((a: { priority: number}, b: { priority: number})=>{
    a.priority - b.priority
  })
  //read actions array
  let actions = fs.existsSync('actions.json')? JSON.parse(fs.readFileSync('actions.json', 'utf8')): []
  const date = new Date()
  const currentTime = date.getTime()
  let size = queue.length-1
  if(queue.length < 1) throw new Error('No actions in queue')
  else if(currentTime - queue[size].date > 60000){
    //execute limit queue
    for(let i=0; i<=limit; i++){
      //execute action and update queue
      actions = await executeAction(ig, queue[i], actions)
      queue = queue.splice(i, 1)
    }
  }
  else {
    let lastHourExecutions = []
    for(let i=size; i>=0; i--){
      if(currentTime - queue[i].date < 60000) lastHourExecutions.push(queue[i])
      else break
    }
    //execute lastHourExecutions.length queue
    for(let i=0; i<lastHourExecutions.length; i++){
      //execute action and update queue
      actions = await executeAction(ig, queue[i], actions)
      queue = queue.splice(i, 1)
    }
  }
  //save actions and queue
  fs.writeFileSync('actions.json', actions)
  fs.writeFileSync('queue.json', queue)
  return 'All Done'
}

const executeAction = async (ig: IgApiClient, action: {pk:number, type:'follow'|'unfollow', date:number}, actions: Array<{pk:number, date:number, type:string}>) => {
  switch(action.type){
    case 'follow':
      await ig.friendship.create(action.pk)
      break;
    case 'unfollow':
      await ig.friendship.destroy(action.pk)
      break;
  }
  //add to the actions array
  const date = new Date()
  action.date = date.getTime()
  actions.push(action)
  return actions
}

export default executeActions