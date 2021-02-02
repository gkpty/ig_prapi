import * as fs from 'fs';
import Follow from './follow'
import Unfollow from './unfollow'
import {addToActions} from './shared'

const executeAction = async (id: number) => {
  let queue = fs.existsSync('queue.json')? JSON.parse(fs.readFileSync('queue.json', 'utf8')): []
  let pkActions = queue.filter((action: { pk: number; type: "follow" | "unfollow"}) => action.pk === id)
  if(pkActions.length > 0){
    let action = pkActions[0]
    switch(action.type){
      case 'follow':
        await Follow(id)
        break;
      case 'unfollow':
        await Unfollow(id)
        break;
    }
    //add to actions
    addToActions(action.pk, action.type)
    //remove from queue
    let newQueue = queue.filter((action: { pk: number; }) => action.pk !== id)
    fs.writeFileSync('queue.json', JSON.stringify(newQueue))
  }
  else throw new Error(`An action for a user with id ${id} doesnt exist in the actions log`)
}

export default executeAction