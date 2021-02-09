import 'dotenv/config.js';
import { IgApiClient } from 'instagram-private-api';
import { getUserPk, addToActions } from './shared'

//Immediately follow a given user
const unfollowUser = async (id?: number, username?: string) => {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);
  //ig.state.proxyUrl = process.env.IG_PROXY;
  await ig.simulate.preLoginFlow();
  await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  if(!id && !username) throw new Error(`Please supply at least one arg`)
  else if(username && !id) id = await getUserPk(username).catch(err => {throw new Error(err)})
  const unfriendship = await ig.friendship.destroy(id).catch(err => {throw new Error(err)})
  addToActions(id, 'unfollow')
  return unfriendship
}

export default unfollowUser;