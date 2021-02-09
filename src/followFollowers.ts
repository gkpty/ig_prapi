import 'dotenv/config.js';
import GetFollowers from './getFollowers'
import { addToQueue } from './shared'
import * as fs from 'fs';

//For all of a given user's Followers, each person that is not already beign followed will get queued to be followed according to priority. 
const followFollowers = async (username: string, priority: number) => {
  const myFollowing = fs.existsSync('following.json')? JSON.parse(fs.readFileSync('following.json', 'utf8')): []
  const users = myFollowing.filter((user: { username: string }) => user.username === username)
  if(users.length>0){
    const user = users[0]
    const userFollowers = await GetFollowers(user.pk)
    let queue = fs.existsSync('queue.json')? JSON.parse(fs.readFileSync('queue.json', 'utf8')): []
    let queued_count = 0
    let skipped_count = 0
    userFollowers.map(async newUser => {
      if(myFollowing.filter((mf: { pk: number }) => mf.pk === newUser.pk).length < 1){
        let q = addToQueue(newUser.pk, newUser.username, priority, "follow", queue)
        if(q){
          queue = q
          queued_count+=1
        } else skipped_count+=1
      } else skipped_count+=1
    })
    console.log(`A total of ${queued_count} users were added to the queue and will be followed. A total of ${skipped_count} users were already being followed.`)
    fs.writeFileSync('queue.json', JSON.stringify(queue))
    return queue
  }
  else throw new Error(`Username ${username} doesnt exist or is not being followed. To follow a given user's followers please make sure to follow them first.`)
}

export default followFollowers