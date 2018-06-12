import axios from 'axios';
import { Notice } from 'iview';
import config from '../config/config.js';

// 创建axios实例
const service = axios.create({
    baseURL: config.baseUrl,
    // 请求超时时间
    timeout: 15000
});

// request拦截器
service.interceptors.request.use(config => {
    return config;
}, error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use(
    response => {
        // code为非20000是抛错 可结合自己业务进行修改
        if (response.status >= 400) {
            Notice.info({
                title: `${response.status}`,
                desc: response.statusText,
                duration: 5 * 1000
            });
        }
        return response;
    },
    err => {
        console.log(err.toString());// for debug
        Notice.error({
            title: err.message,
            desc: err.config.baseURL,
            duration: 5 * 1000
        });
        return Promise.reject(err);
    }
);

export default service;
