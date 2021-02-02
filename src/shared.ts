import * as fs from 'fs';

const addToActions = async (id: number, action: "follow" | "unfollow") => {
  let actions = fs.existsSync('actions.json')? JSON.parse(fs.readFileSync('actions.json', 'utf8')): []
  let date = new Date()
  actions.push({date:date.getTime(), action:action, pk:id})
  fs.writeFileSync('actions.json', JSON.stringify(actions))
}

const addToQueue = async (id: number, priority=2, action: "follow" | "unfollow", queue?: Array<{pk:number, date:number, action:string, priority:number}>) => {
  if(!queue) queue = fs.existsSync('queue.json')? JSON.parse(fs.readFileSync('queue.json', 'utf8')): []
  let date = new Date()
  if(queue.length < 1) queue.push({date:date.getTime(), action:action, priority:priority, pk:id})
  else if(queue.filter(action => action.pk === id).length < 1) queue.push({date:date.getTime(), action:action, priority:priority, pk:id})
  //fs.writeFileSync('queue.json', JSON.stringify(queue))
  return queue
}




export {
  addToActions,
  addToQueue
}