import * as fs from 'fs';

const addAction = async (id: number, action: string) => {
  let actions = fs.existsSync('actions.json')? JSON.parse(fs.readFileSync('actions.json', 'utf8')): []
  let date = new Date()
  actions.push({date:date.toString(), action:action, user_id:id})
  fs.writeFileSync('actions.json', JSON.stringify(actions))
}

export {
  addAction
}