const getters={
    isEvenOrOdd(state){
        return state.home.count%2==0?"偶数":"奇数"
    }
}
export default getters