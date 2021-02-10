import * as fs from 'fs';
import followUser from './followUser'
import unfollowUser from './unfollowUser'
import {addToActions} from './shared'

//execute an action from the queue with a given id 
const executeAction = async (id: number) => {
  let queue = fs.existsSync('queue.json')? JSON.parse(fs.readFileSync('queue.json', 'utf8')): []
  let pkActions = queue.filter((action: { pk: number; action: "follow" | "unfollow"}) => action.pk === id)
  if(pkActions.length > 0){
    let action = pkActions[0]
    const newQueue = queue.filter((action: { pk: number }) => action.pk !== id)
    switch(action.action){
      case 'follow':
        const follow = await followUser(id).catch(err=> {throw new Error(err)})
        fs.writeFileSync('queue.json', JSON.stringify(newQueue))
        return follow
      case 'unfollow':
        const unfollow = await unfollowUser(id).catch(err=> {throw new Error(err)})
        fs.writeFileSync('queue.json', JSON.stringify(newQueue))
        return unfollow
      default:
        throw new Error('Unsuported action type')
    }
  }
  else throw new Error(`An action for a user with id ${id} doesnt exist in the actions log`)
}

export default executeAction