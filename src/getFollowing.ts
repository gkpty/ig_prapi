import 'dotenv/config.js';
import { IgApiClient } from 'instagram-private-api';
import * as fs from 'fs';

const following = async (id?: number) => {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);
  ig.state.proxyUrl = process.env.IG_PROXY;
  const auth = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  if(!id) id = auth.pk
  const followingFeed = ig.feed.accountFollowing(id);
  const items = await followingFeed.items();
  console.log('NUMBER OF FOLLOWING ', items.length)
  if(id === auth.pk) fs.writeFileSync('following.json', JSON.stringify(items))
  return items
}

export default following