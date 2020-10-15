  <template>
  <div class="login-container">
    <div class="login-part">
      <div class="login-info">
        <div class="login-name">市南电信后台管理系统</div>
        <div class="user-login-container">
          <div class="line"></div>
          <div class="user-ligin">用户登录</div>
          <div class="line"></div>
        </div>
        <div class="login-main-container">
          <div class="login-main">
            <div class="login-title">账号</div>
            <el-input class="login-content" clearable v-model="loginInfoParameter.ArchUser" placeholder="请输入账号" @keyup.enter.native="handleLogin"></el-input>
          </div>
          <div class="login-main">
            <div class="login-title">密码</div>
            <el-input class="login-content" clearable placeholder="请输入密码" v-model="loginInfoParameter.ArchPass" show-password @keyup.enter.native="handleLogin"></el-input>
          </div>
          <div class="password-container">
            <el-checkbox class="remember-password" v-model="isRemPass" @change="handleRememberPassword">记住密码</el-checkbox>
            <div class="forget-password" @click="forgetPassword">忘记密码？</div>
          </div>
          <div class="login-main btn-center">
            <el-button class="login-btn" type="primary" :disabled="(!loginInfoParameter.ArchPass) || (!loginInfoParameter.ArchUser)" @click="handleLogin">登录</el-button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "homeLogin",
  created() {
    /**
     * 思路梳理：
     * 1、进入登录页面，首先判断是不是记住密码
     * 2、如果之前选择记住密码，那么要获取缓存信息，对账号信息进行赋值处理；
     * 3、如果之前没有记住密码，那么不需要获取缓存；
     * 注意：所有的缓存之值都是字符串（number、boolean）
     */

    this.isRemPass =
      this.$aes.decrypt(localStorage.getItem("isRemPass")) == "true"
        ? true
        : false;
    if (this.isRemPass) {
      this.loginInfoParameter = JSON.parse(
        this.$aes.decrypt(localStorage.getItem("loginInfoParameter"))
      );
    }
  },
  data() {
    return {
      isRemPass: false,
      loginInfoParameter: {
        ArchUser: "",
        ArchPass: ""
      },
      Roles: []
    };
  },
  methods: {
    // 忘记密码
    forgetPassword() {
      this.$message.success("请联系管理员重置密码");
    },

    // 处理记住密码
    handleRememberPassword(flag) {
      if (this.isRemPass) {
        let aesLoginInfo = this.$aes.encrypt(
          JSON.stringify(this.loginInfoParameter)
        );
        localStorage.setItem("loginInfoParameter", aesLoginInfo);
      } else {
        localStorage.setItem("loginInfoParameter", "");
      }
      let aesIsRemPass = this.$aes.encrypt(String(this.isRemPass));
      localStorage.setItem("isRemPass", aesIsRemPass);
    },

    // 处理登录
    handleLogin() {
      if (!this.loginInfoParameter.ArchUser) {
        this.$message.warning("请输入账号");
      } else if (!this.loginInfoParameter.ArchPass) {
        this.$message.warning("请输入登录密码");
      } else {
        if (this.isRemPass) {
          let aesLoginInfo = this.$aes.encrypt(
            JSON.stringify(this.loginInfoParameter)
          );
          localStorage.setItem("loginInfoParameter", aesLoginInfo);
        }

        this.getLoginAccount();
      }
    },

    // 确定登录
    async getLoginAccount() {
      let res = await this.$Http.loginAccount(this.loginInfoParameter, true);
      if (res.ResultFlag == "0") {
        this.$parent.CreateID = res.ResultSet1; //登录的账号id
        this.$parent.userName = res.ResultSet; //登录的账号名
        let accountInfo = res.ResultTotal;
        this.$parent.RoleName = accountInfo.RoleName; // 权限名称（示例：超级管理员）
        this.$parent.Roles = accountInfo.Roles; //可见菜单列表string（全局变量）
        this.Roles = accountInfo.Roles; //可见菜单列表string（login页面变量）

        let aesUserName = this.$aes.encrypt(res.ResultSet);
        let aesRoleName = this.$aes.encrypt(accountInfo.RoleName); //权限名称（示例：超级管理员）
        let aesRoles = this.$aes.encrypt(accountInfo.Roles);//权限菜单（示例：【产品列表】）
        localStorage.setItem("userName", aesUserName);//用户名称（示例：张三）
        localStorage.setItem("CreateID", res.ResultSet1); //用户登录id
        localStorage.setItem("RoleName", aesRoleName);
        localStorage.setItem("Roles", aesRoles);
        this.$message.success("登录成功");
        this.$router.push({
          path: "/productList"
        });
      } else {
        this.$message.error(res.ResultMessage);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/login";
</style>
<style lang="scss">
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>

