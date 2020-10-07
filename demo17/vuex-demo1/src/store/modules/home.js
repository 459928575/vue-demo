import type from '../type.js'
const state={
    count:1
}
const mutations={
    [type.INCREMENT](state,n)
    {
        state.count+=n
    },
    //载荷
    [type.DECREMENT](state){
        state.count--
    }
}
const actions={
        //通过方法提交突变
        add(context,n)
        {
            //模拟发送异步操作，比如到后台去验证用户身份
            var p=new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    var num=Math.ceil(Math.random()*10);
                    if(num<=5){
                        console.log(num)
                        resolve('异步操作成功')
                    }
                    else
                    {
                        console.log(num)
                        reject('数字太大了')
                    }
                },1000)
            })
            p.then(resp=>{
                console.log(resp)
                context.commit(type.INCREMENT,n) //事件类型
            })
           p.catch(err=>{
               console.log(err)
           })
        },
        // 按需传入
        decrement({commit,state})
        {
            if(state.count>50){
                console.log(state.count)
                commit(type.DECREMENT)
            }
            
        }
}
const getters={
    msg(state){
        if(state.count>80){
            return "看电视"
        }

        else if(state.count>20)
        {
            return "看电影"
        }
        else{
            return "打篮球"
        }
    }
    
}
export default{
     state,
     mutations,
     actions,    
     getters
}