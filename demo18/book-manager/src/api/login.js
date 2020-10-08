import myaxios from '../utils/myaxios.js'
const VUE_APP_SERVICE_URL='https://easy-mock.bookset.io/mock/5f7e731627a63c62ffa72850/user'
export function login(username, password) {
    return myaxios({
        
        url: VUE_APP_SERVICE_URL+'/user/login',
        method: "post",
        data: { username, password }
    })
}

export function getUserInfo(token) {
    console.log('token:'+token);
    
    return myaxios({
        url: VUE_APP_SERVICE_URL+`/user/info/token=${token}`,
        method: "get"  
    })
}