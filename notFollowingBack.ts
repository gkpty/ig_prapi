import 'dotenv/config.js';
import { IgApiClient } from 'instagram-private-api';
import * as fs from 'fs';

(async () => {
  const ig = new IgApiClient();
  const results = new Array();
  ig.state.generateDevice(process.env.IG_USERNAME);
  ig.state.proxyUrl = process.env.IG_PROXY;
  const auth = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  const followingFeed = ig.feed.accountFollowing(auth.pk);
  const followersFeed = ig.feed.accountFollowers(auth.pk);
  const followingItems = await followingFeed.items();
  const followersItems = await followersFeed.items();
  followingItems.map(user => {
    console.log('USER ', user, user.pk)
    if(followersItems.filter(item => item.pk === user.pk).length<1) results.push(user)
  })
  console.log(results, results.length)
  fs.writeFileSync('notFollowingBack.json', JSON.stringify(results))
})();

