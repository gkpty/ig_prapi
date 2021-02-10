import {followFollowers} from '../index';

followFollowers('ergonomicadesk', 2)
.then(data => console.log(data))
.catch(err => console.error(err))