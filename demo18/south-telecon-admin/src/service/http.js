import axios from 'axios'
import service from './api'

let instance = axios.create({
    // baseURL: 'http://192.168.100.32:8080/snapi',
    // baseURL: 'http://test.chenzhou-iot.com/southtelpc', //阿里云服务器
     baseURL: 'http://czone.net.cn/southtelpc', //客户服务器
    baseURL: '/southtelpc', //阿里云服务器
    timeout: 60000
})
const Http = {};
for (let key in service) {
    let api = service[key];
    Http[key] = async function(
        params,
        isFormData = false,
        config = {}
    ) {
        let newParams = {}
        if (params && isFormData) {
            newParams = new FormData()
            for (let i in params) {
                newParams.append(i, params[i])
            }
        } else {
            newParams = params
        }
        let response = {};
        if (api.method === 'put' || api.method === 'post' || api.method === 'patch') {
            try {
                response = await instance[api.method](api.url, newParams, config)
            } catch (err) {
                response = err
            }
        } else if (api.method === 'delete' || api.method === 'get') {
            config.params = newParams
            try {
                response = await instance[api.method](api.url, config)
            } catch (err) {
                response = err
            }
        }
        return response;
    }
}

// 拦截器的添加
// 请求拦截器
instance.interceptors.request.use(config => {
        // 发起请求前做些什么
        if (window.location.href.indexOf("login") == -1) {
            // 非登录页面，且无CreateID状态
            if (!Number(localStorage.getItem('CreateID'))) {
                window.location.href = "/southtelpc/index.html#/login";
                alert("请先登录");
            }
        }
        return config
    }, () => {
        // 请求错误

    })
    // 响应拦截器
instance.interceptors.response.use(res => {
    // 请求成功
    // 1、登录失效问题
    let resultInfo = res.data;
    if (resultInfo.ResultFlag == "9") {
        window.location.href = "/southtelpc/index.html#/login";
        alert(resultInfo.ResultSet);
    }
    return res.data
}, (err) => {
    // console.log(err, '请求失败');
    // console.log(err.name, '请求失败');
    // console.log(err.message, '请求失败');
    // if (err.message.indexOf("timeout") > -1) {
    //     alert("网络超时，请刷新重试！")
    // }
})

export default Http