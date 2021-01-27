import 'dotenv/config.js';
import { IgApiClient } from 'instagram-private-api';
import { addAction } from './shared'

const unfollowUser = async (id: number) => {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);
  ig.state.proxyUrl = process.env.IG_PROXY;
  await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  const friendship = await ig.friendship.destroy(id)
  console.log(friendship)
  await addAction(id, 'unfollow')  
}

export default unfollowUser;