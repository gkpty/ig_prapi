import {unfollowUser} from '../index';

unfollowUser(null, 'gkardonsk')
.then(data => console.log(data))
.catch(err => console.error(err))
