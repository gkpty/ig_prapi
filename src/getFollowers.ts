import 'dotenv/config.js';
import { IgApiClient } from 'instagram-private-api';
import * as fs from 'fs';
import {getUserPk} from './shared'

//gets the list of a given users followers
const getFollowers = async (id?: number, username?: string) => {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);
  //ig.state.proxyUrl = process.env.IG_PROXY;
  await ig.simulate.preLoginFlow();
  const auth = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  if(username && !id) id = await getUserPk(username).catch(err => {throw new Error(err)})
  else if(!id) id = auth.pk
  let followers_arr = []
  const followersFeed = ig.feed.accountFollowers(id);
  return new Promise<Array<{pk: number, username: string}>>((resolve, reject) => {
    followersFeed.items$.subscribe(
      followers => followers_arr = followers_arr.concat(followers),
      error => reject(error),
      () => {
        console.log('Account Followers: ', followers_arr.length)
        //update followers.json
        if(id === auth.pk) fs.writeFileSync('followers.json', JSON.stringify(followers_arr))
        resolve(followers_arr)
      }
    );
  })
}

export default getFollowers