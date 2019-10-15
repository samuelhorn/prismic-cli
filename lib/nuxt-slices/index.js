import { init } from './init';
import { sync } from './commands';

export default (config, firstArg, args) => {
  if (firstArg === 'sync') {
    return sync(config, args);
  }
  return init(config, args);
};
