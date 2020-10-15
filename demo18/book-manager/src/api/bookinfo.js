import myaxios from '../utils/myaxios.js'
// const VUE_APP_SERVICE_URL='https://easy-mock.bookset.io/mock/5f7e731627a63c62ffa72850/user'
export default {
    getBookInfoList()
    {
        return myaxios({
            url:"/bookinfo/list",
            method:"get"
        })
    },
       //bookinfo/list/search/{page}/{size}
    search(page,size,seacheWhere)
    {
        return myaxios({
            url:`/bookinfo/list/search/${page}/${size}`,
            method:"post",
            data:seacheWhere
        
        })
    }

}