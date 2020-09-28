<template>
    <div style="display: flex;justify-content: center;margin-top: 150px">
        <el-card class="box-card" v-show="showlogin">
            <div slot="header" class="clearfix">
                <span>登录</span>
            </div>
            <el-form :model="ruleForm" status-icon  ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="pass">
                    <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="checkPass">
                    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="regis()">注册</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="box-card" v-show="isdisplay">
            <div slot="header" class="clearfix">
                <span>注册</span>
            </div>
            <el-form :model="ruleForm" status-icon  ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="pass">
                    <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="checkPass">
                    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="regis()">注册</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      ruleForm: {

      },
      isdisplay:false,
      showlogin:true
    }
  },
  methods:{
      submitForm(){

      },
      regis(){
          this.isdisplay = true
          this.showlogin = false
      }
  }
}
</script>

<style>
  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 480px;
  }
</style>
