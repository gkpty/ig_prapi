import 'dotenv/config.js';
import * as fs from 'fs';
import getFollowers from './getFollowers'
import getFollowing from './getFollowing'

const notFollowingBack = async () => {
  const followingItems = await getFollowing()
  const followersItems = await getFollowers()
  let results = []
  followingItems.map(user => {
    if(followersItems.filter(item => item.pk === user.pk).length<1) results.push(user)
  })
  console.log(`A total of ${results.length} users are NOT following you back`)
  fs.writeFileSync('not_following_back.json', JSON.stringify(results))
  return results
}

export default notFollowingBack

