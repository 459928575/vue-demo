<template>
  <div id="app">
    <!-- 1、登陆后 -->
    <div class="has-login" v-if="CreateID">
      <el-container>
        <!-- 1、头部区域 -->
        <el-header>
          <div class="left">
            <img class="logo" src="../src/assets/images/3.png" alt="logo">
            <div class="title">市南电信后台管理系统</div>
          </div>
          <div class="right">
            <img class="user" src="../src/assets/images/2.png" alt="logo">
            <span class="role-name">{{RoleName}}</span>
            <el-menu class="el-menu-demo" mode="horizontal">
              <el-submenu index="2">
                <template slot="title">{{userName}}</template>
                <el-menu-item index="2-1" @click="modifyPassword">修改密码</el-menu-item>
                <el-menu-item index="2-2" @click="logOut">退出登录</el-menu-item>
              </el-submenu>
            </el-menu>
          </div>
        </el-header>

        <el-container style="height: 100%;">
          <!-- 2、菜单区域 -->
          <el-aside width="210px">
            <el-menu router :default-active="$route.path" class="el-menu-vertical-demo" background-color="#242326" text-color="#8b849a" active-text-color="#ffffff" style="height: 100%;">
              <el-submenu index="1" v-if="Roles.indexOf('产品管理') > -1">
                <template slot="title">
                  <i class="el-icon-notebook-1"></i>
                  <span>产品管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/productList">产品信息管理</el-menu-item>
                  <el-menu-item index="/productPrice">产品价格</el-menu-item>
                </el-menu-item-group>
              </el-submenu>

              <el-submenu index="2" v-if="Roles.indexOf('楼宇管理') > -1">
                <template slot="title">
                  <i class="el-icon-office-building"></i>
                  <span>楼宇管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/buildingInformation">楼宇信息管理</el-menu-item>
                  <el-menu-item index="/buildingPrice">楼宇价格</el-menu-item>
                  <el-menu-item index="/serviceChargeList">服务费列表</el-menu-item>
                </el-menu-item-group>
              </el-submenu>

              <el-submenu index="3" v-if="Roles.indexOf('促销管理') > -1">
                <template slot="title">
                  <i class="el-icon-collection"></i>
                  <span>促销管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/salesOrActivity">促销/活动信息管理</el-menu-item>
                  <el-menu-item index="/discountManagement">折扣管理</el-menu-item>
                </el-menu-item-group>
              </el-submenu>

              <el-submenu index="4" v-if="Roles.indexOf('订单管理') > -1">
                <template slot="title">
                  <i class="el-icon-s-order"></i>
                  <span>订单管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/addOrder">新增订单</el-menu-item>
                  <el-menu-item index="/orderList">订单状态管理</el-menu-item>
                  <!-- <el-menu-item index="/orderReport">订单报表</el-menu-item> -->
                  <el-menu-item index="/otherOrder">其他订单</el-menu-item>
                </el-menu-item-group>
              </el-submenu>

              <el-menu-item index="/couponsList" v-if="Roles.indexOf('优惠券管理') > -1">
                <i class="el-icon-document"></i>
                <span slot="title">优惠券管理</span>
              </el-menu-item>

              <el-submenu index="6" v-if="Roles.indexOf('评论管理') > -1">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>评论管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/commentList">评分列表</el-menu-item>
                </el-menu-item-group>
              </el-submenu>

              <el-submenu index="9" v-if="Roles.indexOf('客户管理') > -1">
                <template slot="title">
                  <i class="el-icon-user"></i>
                  <span>客户管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/customerList">客户列表</el-menu-item>
                  <el-menu-item index="/distributorClassification">客户分类</el-menu-item>
                </el-menu-item-group>
              </el-submenu>

              <el-submenu index="8" v-if="Roles.indexOf('积分管理') > -1">
                <template slot="title">
                  <i class="el-icon-medal"></i>
                  <span>积分管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/integralList">积分列表</el-menu-item>
                  <el-menu-item index="/IntegralExchangeList">兑换商城</el-menu-item>
                  <el-menu-item index="/exchangeRecordList">兑换记录</el-menu-item>
                  <el-menu-item index="/ruleList">规则列表</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="10" v-if="Roles.indexOf('系统设置') > -1">
                <template slot="title">
                  <i class="el-icon-setting"></i>
                  <span>系统设置</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/customOrder">自定义字段</el-menu-item>
                  <el-menu-item index="/userList">用户管理</el-menu-item>
                  <el-menu-item index="/rightsManagement">权限管理</el-menu-item>
                  <el-menu-item index="/protocolList">协议管理</el-menu-item>
                  <el-menu-item index="/contractList">合同管理</el-menu-item>
                </el-menu-item-group>
              </el-submenu>

            </el-menu>
          </el-aside>

          <!-- 3、内容区域 -->
          <el-main style="padding:0;">
            <div class="header-nav">
              <div class="left"></div>
              <div class="right">{{currentRouteName}}</div>
            </div>
            <router-view></router-view>
          </el-main>

        </el-container>
      </el-container>
      <el-backtop target=".el-main" :visibility-height='150' :right="50" :bottom="50"></el-backtop>

      <!-- 修改密码 -->
      <el-dialog :close-on-click-modal="false" class="modify-password-modal" :destroy-on-close="true" title="修改密码" :visible.sync="isShowPasswordModal" width="500px">
        <div class="details-container">
          <div class="details-item">
            <div class="left">用户名 :</div>
            <el-input :disabled="true" class="right w-75" v-model="changePasswordParameter.UserName" placeholder="请输入用户名">
            </el-input>
          </div>
          <div class="details-item">
            <div class="left">旧密码 :</div>
            <el-input class="right w-75" show-password v-model="changePasswordParameter.strPass" placeholder="请输入旧密码">
            </el-input>
          </div>
          <div class="details-item">
            <div class="left">新密码 :</div>
            <el-input class="right w-75" show-password v-model="changePasswordParameter.strNewPass" placeholder="请输入新密码">
            </el-input>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isShowPasswordModal = false">取 消</el-button>
          <el-button type="primary" @click="handleModify">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 2、登陆前 -->
    <div class="login" v-if="!CreateID">
      <home-login></home-login>
    </div>
  </div>
</template>

<script>
import homeLogin from "./views/login";
export default {
  name: "app",
  components: {
    homeLogin
  },
  data() {
    return {
      CreateID: 0,
      currentRouteName: "",
      userName: "",
      Roles: "",
      RoleName: "",
      /**
       * 修改密码部分
       */
      isShowPasswordModal: false,
      changePasswordParameter: {
        StrFlag: "pass",
        UserName: "",
        strPass: "",
        strNewPass: ""
      }
    };
  },
  created() {
    this.CreateID = Number(localStorage.getItem("CreateID")); //用户登录id
    this.userName = this.$aes.decrypt(localStorage.getItem("userName")); //用户名称（示例：张三）
    this.Roles = this.$aes.decrypt(localStorage.getItem("Roles")); //权限菜单（示例：【产品列表】）
    this.RoleName = this.$aes.decrypt(localStorage.getItem("RoleName")); //权限名称（示例：超级管理员）
    if (!this.CreateID) {
      this.$router.push({
        path: "/login"
      });
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },

    // 修改密码
    modifyPassword() {
      this.changePasswordParameter.UserName = this.$aes.decrypt(
        localStorage.getItem("userName")
      );
      this.isShowPasswordModal = true;
    },

    // 点击修改按钮
    handleModify() {
      if (!this.changePasswordParameter.UserName) {
        this.$message.warning("请输入用户名");
      } else if (!this.changePasswordParameter.strPass) {
        this.$message.warning("请输入原密码");
      } else if (!this.changePasswordParameter.strNewPass) {
        this.$message.warning("请输入新密码");
      } else {
        this.confirmModifyPassword();
      }
    },

    // 确定修改密码
    async confirmModifyPassword() {
      let res = await this.$Http.changePassword(
        this.changePasswordParameter,
        true
      );

      if (res.ResultFlag == "0") {
        this.$message.success("修改成功");
        localStorage.setItem("loginInfoParameter", "");
        this.isShowPasswordModal = false;
        this.$router.push({
          path: "/login"
        });
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 退出登录
    logOut() {
      this.$confirm("此操作将推退出账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          /**
           * 备注：回到登录页面的逻辑梳理
           * 1、点击退出登录按钮;
           * 逻辑处理1：（1）app vue中CreateID设置为0；（2）清除CreateID字段的缓存，但是不清除其他字段的缓存（比如：记住密码）；
           * 2、用户手动输入login或者"/"进入登陆页面；
           * 逻辑处理2：（1）app vue中CreateID设置为0；（2）清除CreateID字段的缓存，但是不清除其他字段的缓存（比如：记住密码）；
           */
          this.CreateID = 0;
          localStorage.setItem("CreateID", "");
          localStorage.setItem("userName", "");
          this.$router.push({
            path: "/login"
          });
        })
        .catch(() => {});
    }
  },
  watch: {
    $route(to, from) {
      this.currentRouteName = to.meta.title;
      if (to.name == "login") {
        this.CreateID = 0;
        this.userName = "";
        localStorage.setItem("CreateID", "");
        localStorage.setItem("userName", "");
      } else {
        if (!localStorage.getItem("CreateID")) {
          this.$router.push({
            path: "/login"
          });
        }
      }
    }
  }
};
</script>

<style lang="scss">
html,
body,
#app,
.el-container {
  /*设置内部填充为0，几个布局元素之间没有间距*/
  padding: 0px;
  /*外部间距也是如此设置*/
  margin: 0px;
  /*统一设置高度为100%*/
  height: 100%;
}

@import "../src/style/common";

.el-header {
  background-color: #fff;
  color: #333;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  line-height: 60px;
  box-shadow: 0 -1px 14px #e1dee7;
  border-bottom: 1px solid #e1dee7;
  .left {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .logo {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .title {
      font-size: 20px;
      font-weight: bold;
    }
  }
  .right {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    .el-menu-demo.el-menu--horizontal.el-menu {
      border: none;
      height: 57px;
      .el-submenu {
        .el-submenu__title {
          height: 45px;
          line-height: 45px;
          font-size: 17px;
          color: #000;
          font-weight: bold;
          padding: 0 10px;
        }
      }
    }

    .user {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      margin-bottom: 12px;
    }
    .role-name{
        font-size: 17px;
  font-weight: 700;
  margin-bottom: 13px;
  margin-left: 10px;
    }
  }
}

.el-aside {
  color: #ffffff;
  position: absolute;
  left: 0;
  top: 60px;
  bottom: 0;
  overflow-y: scroll;
  .el-menu-vertical-demo.el-menu {
    .el-submenu {
      .el-submenu__title {
        color: #fff !important;
        height: 50px !important;
        line-height: 50px !important;
        i {
          color: #fff !important;
        }
        span {
          font-size: 16px;
        }
      }

      .el-menu {
        .el-menu-item-group {
          /* 修改菜单的缩进样式 */
          .el-menu-item-group__title {
            padding: 0;
          }
          .el-menu-item {
            padding-left: 60px !important;
            color: #fff !important;
            height: 45px !important;
            line-height: 45px !important;
            &.is-active {
              // background-color: #058ce8 !important;
              color: #ffd04b !important;
              i {
                color: #ffd04b !important;
              }
            }
          }
        }
      }
    }
    .el-menu-item {
      color: #fff !important;
      font-size: 16px !important;
      i {
        color: #fff !important;
      }
      &.is-active {
        color: #ffd04b !important;
        i {
          color: #ffd04b !important;
        }
      }
    }
  }
}

.el-main {
  // background-color: #e9eef3;
  background-color: #fff;
  color: #333;
  position: absolute;
  left: 210px;
  right: 0;
  top: 60px;
  bottom: 0;
  overflow-y: scroll;
  // background-color: #fff;
}

// 顶部导航-面包屑
.header-nav {
  height: 40px;
  line-height: 40px;
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid #e1dee7;

  .left {
    height: 20px;
    width: 4px;
    background-color: #058ce8;
    margin-left: 10px;
    margin-right: 10px;
  }
  .right {
    font-size: 20px;
    font-weight: bold;
  }
}


// 登陆部分
.login {
  width: 100%;
  height: 100vh;
  background: url("../src/assets/images/bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
// 修改密码部分
.modify-password-modal {
  .details-container {
    margin: -20px auto -30px;
    padding-top: 20px;
    .details-item {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      font-size: 16px;
      min-height: 40px;
      margin-bottom: 20px;
      .left {
        margin-right: 10px;
        width: 80px;
      }
      .right {
        width: 50%;
        color: #999;
        &.w-75 {
          width: 75%;
        }
      }
    }
  }
}
</style>

