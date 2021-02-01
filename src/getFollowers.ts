import 'dotenv/config.js';
import { IgApiClient } from 'instagram-private-api';
import * as fs from 'fs';

const followers = async (id?: number) => {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);
  ig.state.proxyUrl = process.env.IG_PROXY;
  const auth = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  if(!id) id = auth.pk
  const followersFeed = ig.feed.accountFollowers(id);
  const items = await followersFeed.items();
  console.log('NUMBER OF FOLLOWERS ', items.length)
  if(id === auth.pk) fs.writeFileSync('followers.json', JSON.stringify(items))
  return items
}

export default followers;