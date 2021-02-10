import {actionDaemon} from '../index';

try{
  actionDaemon()
}catch(err){
  console.error(err)
  throw new Error(err)
}