import {getFollowing} from '../index';

getFollowing(null, 'ergonomicadesk')
.then(data=>console.log(data))
.catch(err=> console.error(err))
