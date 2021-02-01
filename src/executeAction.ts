import * as fs from 'fs';

const executeAction = async (id: number) => {
  let actions = fs.existsSync('actions.json')? JSON.parse(fs.readFileSync('actions.json', 'utf8')): []
  //filter actions by pk
  let pkActions = actions.filter((action: { pk: number; }) => action.pk === id)
  if(pkActions.length > 0){
    let action = pkActions[0]
    switch(action.type){
      case 'follow':
        //do something
        break;
      case 'unfollow':
        //do something
        break;
    }
  }
  else throw new Error(`An action for a user with id ${id} doesnt exist in the actions log`)
}

export default executeAction