import 'dotenv/config.js';
import { IgApiClient } from 'instagram-private-api';
import * as fs from 'fs';

const getFollowing = async (id?: number, username?: string) => {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);
  ig.state.proxyUrl = process.env.IG_PROXY;
  const auth = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  if(username && !id){
    const myFollowing = fs.existsSync('following.json')? JSON.parse(fs.readFileSync('following.json', 'utf8')): []
    const users = await myFollowing.filter((user: { username: string }) => user.username === username)
    if(users.length>0) id = users[0].pk
    else throw new Error(`Username ${username} doesnt exist or is not being followed. To follow a givne user's following/folowers please make sure to folow them first.`)
    console.log('USER 0 ',users[0], id)
  }
  else if(!id) id = auth.pk
  let following_arr = []
  const followingFeed = ig.feed.accountFollowing(id);
  return new Promise((resolve, reject) => {
    followingFeed.items$.subscribe(
      following => following_arr = following_arr.concat(following),
      error => reject(error),
      () => {
        console.log('COMPLETE!')
        //console.log(following_arr)
        console.log('NUMBER OF FOLLOWING ', following_arr.length)
        if(id === auth.pk) fs.writeFileSync('following.json', JSON.stringify(following_arr))
        resolve(following_arr)
      }
    );
  })
}

export default getFollowing