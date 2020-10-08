//import myaxios from '../utils/myaxios.js'
 import myaxios from '@/utils/myaxios.js'
// myaxios.get('data.json')
// .then(resp=>{console.log(resp.data)})
// .catch(err=>{console.log(err);
// })

//myaxios({method:'get',url:'data.json'}).then(resp=>{console.log(resp.data)}).catch(err=>{console.log(err)})

// const BASE_URL='/dev-apis'
const BASE_URL=[process.env.VUE_APP_BASE_API]
// export default
// { 
//    getList()
//    {
//     const promisel= myaxios({
//         method:'get',
//         url:'data.json'//data.json  'dev-apis/data.json'
//     })
//     return promisel;
//    }
// }

export default {
    getList(){
        const promise1=myaxios({
            method:'get',
            url:'/data.json',   //http://localhost:8082/data.json
        })
        return promise1
    }
}

