import 'dotenv/config.js';
import GetFollowing from './getFollowing'
import { addToQueue } from './shared'
import * as fs from 'fs';

//For all of the people a given user is following, each person that is not already beign followed by you will be queued to get followed. 
const followFollowing = async (username: string, priority: number) => {
  const myFollowing = fs.existsSync('following.json')? JSON.parse(fs.readFileSync('following.json', 'utf8')): []
  const users = myFollowing.filter((user: { username: string }) => user.username === username)
  if(users.length>0){
    const user = users[0]
    const userFollowing = await GetFollowing(user.pk)
    let queue = fs.existsSync('queue.json')? JSON.parse(fs.readFileSync('queue.json', 'utf8')): null
    let queued = 0
    userFollowing.map(async newUser => {
      if(myFollowing.filter((mf: { pk: number }) => mf.pk === newUser.pk).length < 1){
        queue = await addToQueue(newUser.pk, priority, "follow", queue)
        queued+=1
      }
      else console.log(`User ${newUser.username} is already being followed`)
    })
    console.log(`A total of ${queued} users were added to the queue to be folowed`)
    fs.writeFileSync('queue.json', JSON.stringify(queue))
    return queue
  }
  else throw new Error(`Username ${username} doesnt exist or is not being followed. To follow a givne user's following/folowers please make sure to folow them first.`)
}

export default followFollowing