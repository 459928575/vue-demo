<template>
  <div class="header">
    <a href="/" style="padding-left:30px">
      <img class="logo" src="@/assets/mylogo.png" />
      <span class="title">小豆子图书信息管理系统</span>
    </a>
    <el-dropdown >
      <span class="el-dropdown-link">
        您好：
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a">修改密码</el-dropdown-item>
        <el-dropdown-item command="b">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 修改密码对话框 -->
    <el-dialog title="修改密码"  width="400px">
      <el-form
        status-icon
        label-width="100px"
        style="width:300px;margin-top:-30px;margin-bottom:-20px;"
        size="mini"
      >
        <el-form-item label="旧密码" prop="oldpass">
          <el-input type="password"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newpass">
          <el-input type="password"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkpass">
          <el-input type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" >提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
</script>
<style scoped>
.logo {
  width: 25px;
  vertical-align: middle;
  border-radius: 5px;
}
.title {
  position: absolute;
  color: #fff;
  padding-left: 5px;
  font-size: 20px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #fff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.el-dropdown {
  float: right;
  margin-right: 30px;
}
</style>