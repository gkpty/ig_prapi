import 'dotenv/config.js';
import { IgApiClient } from 'instagram-private-api';
import { getUserPk, addToActions } from './shared'

//Immediately follow a given user
const followUser = async (id?: number, username?: string) => {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);
  //ig.state.proxyUrl = process.env.IG_PROXY;
  await ig.simulate.preLoginFlow();
  const auth = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  if(username && !id) id = await getUserPk(username).catch(err => {throw new Error(err)})
  else if(!id) id = auth.pk
  const friendship = await ig.friendship.create(id).catch(err => {throw new Error(err)})
  console.log(friendship)
  addToActions(id, 'follow')
  return friendship
}

export default followUser;