// 导入一些依赖 模块  调用
//入口文件
var test= require('./test.js')
test()  //test函数就是 test.js的function 函数\

const p={ name:'zs' ,age:30} 
// const name=p.name;const age=p.age;
const {name,age}=p;

console.log(`${name}--${age}`)
console.log('------------------------');
const color=['red','blue']
const [first,second]=color
console.log(first);
console.log('------------------------');
const color1=['red','black']
const colorfull=[...color1,'yellow','green']
console.log('colorfull:'+colorfull);




 

