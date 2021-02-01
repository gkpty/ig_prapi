import 'dotenv/config.js';
import GetFollowing from './getFollowing'
import { addToQueue } from './shared'
import * as fs from 'fs';

//unfollow all users that are being followed (in actions.json) based on certain parameters 
const unfollowAll = async (priority=2, params: {days_more_than?: number, days_less_than?: number, not_following_back?: boolean}) =>{
  if(!params.days_more_than) params.days_more_than = 3
  const actions = fs.existsSync('actions.json')? JSON.parse(fs.readFileSync('actions.json', 'utf8')): []
  let queue = fs.existsSync('queue.json')? JSON.parse(fs.readFileSync('queue.json', 'utf8')): []
  let followers = fs.existsSync('followers.json')? JSON.parse(fs.readFileSync('followers.json', 'utf8')): []
  let followActions = actions.filter((action: { action: string }) => action.action === 'follow')
  let date = new Date()
  let currentTime = date.getTime()
  let queued = 0
  followActions.map((action: { date: number; pk: number; }) => {
    //86400000 ms per day
    let dateDiff = (currentTime-action.date)/86400000
    if(dateDiff > params.days_more_than) {
      if(params.not_following_back){
        if(followers.filter((follower: { pk: number; }) => follower.pk === action.pk).length < 1){
          queue = addToQueue(action.pk, priority, 'unfollow', queue)
          queued+=1
        }
      }
      else{
        queue = addToQueue(action.pk, priority, 'unfollow', queue)
        queued+=1
      }
    }
  })
  console.log(`A total of ${queued} users were added to the queue to be unfolowed`)
  fs.writeFileSync('queue.json', JSON.stringify(queue))
  return queue
}

export default unfollowAll