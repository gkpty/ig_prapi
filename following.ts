import 'dotenv/config.js';
import { IgApiClient } from 'instagram-private-api';
import * as fs from 'fs';

(async () => {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);
  ig.state.proxyUrl = process.env.IG_PROXY;
  const auth = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  const followingFeed = ig.feed.accountFollowing(auth.pk);
  const wholeResponse = await followingFeed.request();
  console.log('WHOLE RESPONSE \n',wholeResponse, '\n\n'); // You can reach any properties in instagram response
  const items = await followingFeed.items();
  console.log('NUMBER OF FOLLOWING ', items.length)
  console.log('ITEMIOS \n', items, '\n\n'); // Here you can reach items. It's array.
  fs.writeFileSync('followers.json', JSON.stringify(items))
  const thirdPageItems = await followingFeed.items();
  // Feed is stateful and auto-paginated. Every subsequent request returns results from next page
  console.log('THIRDPAGE ITEMS \n', thirdPageItems, '\n\n'); // Here you can reach items. It's array.
  const feedState = followingFeed.serialize(); // You can serialize feed state to have an ability to continue get next pages.
  console.log('FEED STATE \n',feedState, '\n\n');
  followingFeed.deserialize(feedState);
  const fourthPageItems = await followingFeed.items();
  console.log(fourthPageItems);
  // You can use RxJS stream to subscribe to all results in this feed.
  // All the RxJS powerful is beyond this example - you should learn it by yourself.
  followingFeed.items$.subscribe(
    following => console.log(following),
    error => console.error(error),
    () => console.log('Complete!'),
  );
})();