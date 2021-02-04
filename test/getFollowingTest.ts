import getFollowing from '../src/getFollowing';

try{
  getFollowing(null, 'ergonomicadesk').then(data=>console.log(data))
}catch(err){
  console.log(err)
}
