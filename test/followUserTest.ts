import {followUser} from '../index';

followUser(null, 'pochito50')
.then(data => console.log(data))
.catch(err => console.error(err))
