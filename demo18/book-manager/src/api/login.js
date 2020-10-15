import myaxios from '../utils/myaxios.js'
// const VUE_APP_SERVICE_URL='https://easy-mock.bookset.io/mock/5f7e731627a63c62ffa72850/user'
export function login(username, password) {
    return myaxios({
        
        url:'/user/login',
        method: "post",
        data: { username, password }
    })
}

export function getUserInfo(token) {
    console.log('token:'+token);
    
    return myaxios({
        url:`/user/info/token=${token}`,
        method: "get"  
    })
}

export function logout(token){
    return myaxios({
        url:`/user/logout/${token}`,
        method:'post',
    })
}