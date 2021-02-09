import {getFollowers} from '../index';

getFollowers(null, 'ergonomicadesk')
.then(data=>console.log(data))
.catch(err=> console.error(err))
