import {unfollowAll} from '../index';

unfollowAll(2, {days_more_than: 3, not_following_back: true})
.then(data => console.log(data))
.catch(err => console.error(err))
