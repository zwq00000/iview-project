import Cookies from 'js-cookie';
import api from '@/api/login';

const user = {
    state: {
        userName: '',
        depcode: ''
    },
    mutations: {
        LOGOUT(state, vm) {
            Cookies.remove('user');
            localStorage.clear();
        },
        SET_UserName: (state, userName) => {
            Cookies.set('user', userName);
            state.userName = userName;
        }
    },
    getters:{
        /**
         * 用户名
         * @param {state} state 
         */
        userName(state){
            return state.userName;
        },
        /**
         * 是否登录
         * @param {*} state 
         */
        isLogin(state){
            return state.userName !='';
        }
    },
    actions: {
        login({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                api.login(userInfo.userName, userInfo.password)
                    .then(() => {
                        commit('SET_UserName', userInfo.userName);
                        resolve();
                    }).catch(err => {
                        reject(err);
                    });
            });
        },

        logout({commit}){
            api.logout();
            commit('LOGOUT');
        }
    }
};

export default user;
