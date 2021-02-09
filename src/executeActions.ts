
import 'dotenv/config.js';
import { IgApiClient } from 'instagram-private-api';
import * as fs from 'fs';

//executes a number of actions less than 50
const executeActions = async (limit=50) => {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);
  //ig.state.proxyUrl = process.env.IG_PROXY;
  await ig.simulate.preLoginFlow();
  await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  //sort actions by priority
  const queue = fs.existsSync('queue.json')? JSON.parse(fs.readFileSync('queue.json', 'utf8')): []
  let newQueue = queue.sort((a: { priority: number}, b: { priority: number})=>{
    return a.priority - b.priority
  })
  //read actions array
  let actions = fs.existsSync('actions.json')? JSON.parse(fs.readFileSync('actions.json', 'utf8')): []
  const date = new Date()
  const currentTime = date.getTime()
  let executedActions = []
  if(newQueue.length < 1) throw new Error('No actions in newQueue')
  else if(currentTime - newQueue[newQueue.length-1].date > 60000){
    //execute total limit
    for(let i=0; i<=limit; i++){
      executedActions = await executeAction(ig, newQueue[i], executedActions, executedActions)
      newQueue.splice(i, 1)
    }
  }
  else {
    let lastHourExecutions = []
    for(let i=actions.length-1; i>=0; i--){
      if(currentTime - actions[i].date < 60000) lastHourExecutions.push(actions[i])
      else break
    }
    //execute limit - lastHourExecutions
    for(let i=0; i<lastHourExecutions.length; i++){
      executedActions = await executeAction(ig, newQueue[i], actions, executedActions)
      newQueue.splice(i, 1)
    }
  }
  //save actions and queue
  let newActions = actions.concat(executedActions)
  fs.writeFileSync('actions.json', JSON.stringify(newActions))
  fs.writeFileSync('queue.json', JSON.stringify(newQueue))
  return executedActions
}

const executeAction = async (ig: IgApiClient, action: {pk:number, action:'follow'|'unfollow', date:number}, actions: Array<{pk:number, date:number, action:'follow'|'unfollow'}>, executedActions: Array<{pk:number, date:number, action:'follow'|'unfollow', is_private:boolean}>) => {
  const date = new Date()
  const currentTime = date.getTime()
  console.log('ACTION ', action)
  switch(action.action){
    case 'follow':
      const friendship = await ig.friendship.create(action.pk).catch(err => {throw new Error(err)})
      executedActions.push({pk: action.pk, date:currentTime, action:'follow', is_private:friendship.is_private})
      return executedActions;
    case 'unfollow':
      const unfriendship = await ig.friendship.destroy(action.pk)
      executedActions.push({pk: action.pk, date:currentTime, action:'follow', is_private:unfriendship.is_private})
      return executedActions
  }
}

export default executeActions