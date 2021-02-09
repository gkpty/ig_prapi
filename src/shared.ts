import * as fs from 'fs';

const addToActions = (id: number, action: "follow" | "unfollow", actions?: Array<{pk:number, date:number, action:string}>) => {
  let date = new Date()
  if(!actions) actions = fs.existsSync('actions.json')? JSON.parse(fs.readFileSync('actions.json', 'utf8')): []
  actions.push({date:date.getTime(), action:action, pk:id})
  return actions
}

const addToQueue = (id: number, username: string, priority=2, action: "follow" | "unfollow", queue?: Array<{pk:number, username:string, date:number, action:string, priority:number}>) => {
  //if(!queue) queue = fs.existsSync('queue.json')? JSON.parse(fs.readFileSync('queue.json', 'utf8')): []
  let date = new Date()
  if(queue.length < 1) queue.push({date:date.getTime(), action:action, priority:priority, username:username, pk:id})
  else if(queue.filter(action => action.pk === id).length < 1) queue.push({date:date.getTime(), action:action, priority:priority, username:username, pk:id})
  else return false
  //fs.writeFileSync('queue.json', JSON.stringify(queue))
  return queue
}

const getUserPk = (username: string) => {
  return new Promise<number>((resolve, reject)=> {
    const myFollowing = fs.existsSync('following.json')? JSON.parse(fs.readFileSync('following.json', 'utf8')): []
    const following = myFollowing.filter((user: { username: string }) => user.username === username)
    if(following.length>0) resolve(following[0].pk)
    else {
      const myFollowers = fs.existsSync('followers.json')? JSON.parse(fs.readFileSync('followers.json', 'utf8')): []
      const followers = myFollowers.filter((user: { username: string }) => user.username === username)
      if(followers.length>0) resolve(followers[0].pk)
      else reject(`Username ${username} doesnt exist, is not being followed, or is not folowing you.`)
    }
  })
}

export {
  addToActions,
  addToQueue,
  getUserPk
}