<template>
  <div id="login-container">
    <el-form :ref="form" :rules="rules" :model="form" label-width="60px" class="login-form">
      <h2 class="login-title">小豆子图书信息管理系统</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username" placeholder="请输入账号"></el-input>
      </el-form-item>
     <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(form)">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login, getUserInfo } from "../../api/login.js";
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      rules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 32,
            message: "长度在 6 到 32 个字符",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          login(this.form.username, this.form.password)
            .then((resp) => {
              console.log(resp.data);
            })
            .catch((err) => {
              console.log(err);
            });
          // alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
  
<style scoped>
#login-container{
    position: absolute;
    width:100%;
    height: 100%;
    background-image: url('../../assets/login-bg.png');
}
.login-form{
    width:350px;
    background-color: #fff;
    /* margin:160px auto; */
    padding:15px;
    border-radius: 20px;
    height: 250px;
    left:50%;
    top:50%;
    margin-left:-175px;
    margin-top:-125px;
    position: absolute;
}
.login-title{
    text-align: center;
    color: #606266;
}
</style>>