import {executeActions} from '../index';

executeActions()
.then(data => console.log(data))
.catch(err => console.error(err))