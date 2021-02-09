import * as fs from 'fs';

const addToActions = async (id: number, action: "follow" | "unfollow") => {
  let actions = fs.existsSync('actions.json')? JSON.parse(fs.readFileSync('actions.json', 'utf8')): []
  let date = new Date()
  actions.push({date:date.getTime(), action:action, pk:id})
  fs.writeFileSync('actions.json', JSON.stringify(actions))
}

const addToQueue = (id: number, username: string, priority=2, action: "follow" | "unfollow", queue?: Array<{pk:number, date:number, action:string, priority:number}>) => {
  //if(!queue) queue = fs.existsSync('queue.json')? JSON.parse(fs.readFileSync('queue.json', 'utf8')): []
  let date = new Date()
  if(queue.length < 1) queue.push({date:date.getTime(), action:action, priority:priority, pk:id})
  else if(queue.filter(action => action.pk === id).length < 1) queue.push({date:date.getTime(), action:action, priority:priority, pk:id})
  else return false
  //fs.writeFileSync('queue.json', JSON.stringify(queue))
  return queue
}

const getUserPk = (username: string) => {
  return new Promise<number>((resolve, reject)=> {
    const myFollowing = fs.existsSync('following.json')? JSON.parse(fs.readFileSync('following.json', 'utf8')): []
    const users = myFollowing.filter((user: { username: string }) => user.username === username)
    if(users.length>0) resolve(users[0].pk)
    else reject(`Username ${username} doesnt exist or is not being followed. To follow a givne user's following/folowers please make sure to folow them first. If you followed the user recently, Try refreshing the list of users you are following by running the getFollowing command with no args.`)
  })
}

export {
  addToActions,
  addToQueue,
  getUserPk
}