import 'dotenv/config.js';
import { IgApiClient } from 'instagram-private-api';
import * as fs from 'fs';
import {getUserPk} from './shared'

//gets the list of people a given user is following
const getFollowing = async (id?: number, username?: string) => {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);
  //ig.state.proxyUrl = process.env.IG_PROXY;
  await ig.simulate.preLoginFlow();
  const auth = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  if(username && !id) id = await getUserPk(username).catch(err => {throw new Error(err)})
  else if(!id) id = auth.pk
  let following_arr = []
  const followingFeed = ig.feed.accountFollowing(id);
  return new Promise<Array<{pk: number, username: string}>>((resolve, reject) => {
    followingFeed.items$.subscribe(
      following => following_arr = following_arr.concat(following),
      error => reject(error),
      () => {
        console.log('Account Following: ', following_arr.length)
        //update following.json
        if(id === auth.pk) fs.writeFileSync('following.json', JSON.stringify(following_arr))
        resolve(following_arr)
      }
    );
  })
}

export default getFollowing