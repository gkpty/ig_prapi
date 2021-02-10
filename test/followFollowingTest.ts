import {followFollowing} from '../index';

followFollowing('ergonomicadesk', 2)
.then(data => console.log(data))
.catch(err => console.error(err))
