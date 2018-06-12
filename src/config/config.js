import Env from './env';

const ajaxUrl = Env === 'development'
    ? 'http://localhost:51185/'
    : 'http://localhost:80/';

let config = {
    env: Env,
    baseUrl:ajaxUrl
};
export default config;