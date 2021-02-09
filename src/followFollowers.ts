import 'dotenv/config.js';
import GetFollowers from './getFollowers'
import { getUserPk, addToQueue } from './shared'
import * as fs from 'fs';

//For all of a given user's Followers, each person that is not already beign followed will get queued to be followed according to priority. 
const followFollowers = async (username: string, priority: number) => {
  const myFollowing = fs.existsSync('following.json')? JSON.parse(fs.readFileSync('following.json', 'utf8')): []
  const user = await getUserPk(username).catch(err => {throw new Error(err)})
  const userFollowers = await GetFollowers(user)
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

export default followFollowers