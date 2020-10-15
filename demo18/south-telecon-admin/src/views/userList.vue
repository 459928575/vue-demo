<template>
  <div class="box">
    <!-- 1、筛选 -->
    <div class="search-part">
      <el-input clearable @keyup.enter.native="getUserList" size="small" class="search-input" placeholder="请输入账号" v-model="userListParameter.UserName">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button class="search-btn" size="small" @click="getUserList">搜索</el-button>
      <el-button class="add-btn" type="success" size="small" icon="el-icon-circle-plus-outline" @click="handleAddBtn">
        新增用户
      </el-button>
    </div>
    <!-- 2、表格数据 -->
    <el-table v-loading="loading" :data="userList" style="width: 100%" :header-cell-style="$config.headerCellStyle" border>
      <el-table-column prop="UserName" label="账号" align="center"></el-table-column>
      <el-table-column prop="Alias" label="用户名" align="center"></el-table-column>
      <el-table-column prop="UserRole" label="权限" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="right">
            <p v-for=" (item, ind) in scope.row.Role" :key="ind">{{ item.RoleName }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag type="success" size="medium" style="cursor: pointer;">查看权限</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="MobilePIN" label="手机号" align="center"></el-table-column>
      <el-table-column prop="Email" label="邮箱" width="240" align="center"></el-table-column>
      <el-table-column prop="IsApproved" label="当前状态" align="center">
        <template slot-scope="scope">
          <el-dropdown class="action-dropdown" size="mini" type="primary" @command="StrState=>chooseAction(scope.$index, scope.row,StrState)">
            <el-button size="mini" :type="scope.row.IsApproved == '激活'?'primary':'danger'">{{scope.row.IsApproved}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="scope.row.IsApproved == item.status" v-for="(item,ind) in actionOptions" :key="ind" :command="item.StrState">{{item.status}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column prop="UserNotes" label="备注" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.UserNotes || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="360" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleView(scope.$index, scope.row)">查看详情</el-button>
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="warning" size="mini" @click="handleChange(scope.$index, scope.row)">重置密码</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination :current-page.sync="userListParameter.pageNum" @current-change="handleCurrentChange" background layout="total, prev, pager, next, jumper" :total="ResultTotal">
      </el-pagination>
    </div>

    <!-- 3、详情 -->
    <el-drawer class="order-details" :direction="direction" :title="currentUserInfo.Alias" :visible.sync="drawer">
      <div class="order-info" :style="{height:scrollerHeight}">
        <div class="list">
          <div class="list-title">账号</div>
          <div class="list-content">{{currentUserInfo.UserName}}</div>
        </div>
        <div class="list">
          <div class="list-title">用户名</div>
          <div class="list-content">{{currentUserInfo.Alias}}</div>
        </div>
        <div class="role-part">
          <div class="role-title">权限</div>
          <div class="role-content">
            <span class="role-groups" v-for="(item,index) in currentUserInfo.Role" :key="index">
              <span>{{item.RoleName}}</span>
              <span v-if="index != currentUserInfo.Role.length -1">、</span>
            </span>
          </div>
        </div>
        <div class="list">
          <div class="list-title">手机号</div>
          <div class="list-content">{{currentUserInfo.MobilePIN}}</div>
        </div>
        <div class="list">
          <div class="list-title">邮箱</div>
          <div class="list-content">{{currentUserInfo.Email}}</div>
        </div>
        <div class="list">
          <div class="list-title">当前状态</div>
          <div class="list-content">{{currentUserInfo.IsApproved}}</div>
        </div>
        <div class="list">
          <div class="list-title">创建时间</div>
          <div class="list-content">{{currentUserInfo.CreateDate}}</div>
        </div>
        <div class="remark-part border-none">
          <div class="remark-title">备注</div>
          <div class="remark-content">{{currentUserInfo.UserNotes || '无'}}</div>
        </div>

      </div>

    </el-drawer>

    <!-- 4、新增/编辑 -->
    <el-dialog :close-on-click-modal="false" class="add-modal" :destroy-on-close="true" :title="isNewAdd?'新增用户':'编辑用户'" :visible.sync="isShowModal" width="650px">
      <div class="details-container">
        <div class="details-item">
          <div class="left">账号 :</div>
          <el-input class="right w-75" :disabled="!isNewAdd" v-model="reqdata.UserName" placeholder="注意：账号不可再次修改">
          </el-input>
        </div>
        <div class="details-item" v-if="isNewAdd">
          <div class="left">密码 :</div>
          <el-input class="right w-75" :disabled="!isNewAdd" show-password v-model="reqdata.Password" placeholder="密码须为７位，且含１个特殊符号">
          </el-input>
        </div>
        <div class="details-item">
          <div class="left">邮箱 :</div>
          <el-input class="right w-75" v-model="reqdata.Email" placeholder="请输入邮箱"></el-input>
        </div>

        <div class="details-item">
          <div class="left">用户名 :</div>
          <el-input class="right w-75" v-model="reqdata.Alias" placeholder="请输入用户名"></el-input>
        </div>

        <div class="details-item">
          <div class="left">手机号 :</div>
          <el-input class="right w-75" v-model="reqdata.MobilePIN" placeholder="请输入手机号"></el-input>
        </div>
        <div class="details-item">
          <div class="left">权限 :</div>
          <el-table class="right w-75" height="200" :header-cell-style="$config.headerCellStyle" border ref="multipleTable" :data="roleList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="RoleName" label="权限" align="center"></el-table-column>
            <el-table-column prop="RoleNotes" label="备注" align="center"></el-table-column>
          </el-table>
        </div>
        <div class="details-item">
          <div class="left">备注 :</div>
          <el-input class="right w-75" v-model="reqdata.UserNotes" placeholder="请输入备注"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowModal = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddUser">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" class="add-modal" :destroy-on-close="true" title="重置密码" :visible.sync="isShowPasswordModal" width="400px">
      <div class="details-container">
        <div class="details-item">
          <div class="left">用户名 :</div>
          <el-input class="right w-75" :disabled="true" v-model="changePasswordParameter.UserName" placeholder="请输入用户名">
          </el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowPasswordModal = false">取 消</el-button>
        <el-button type="primary" @click="confirmModifyPassword">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "userList",
  created() {
    this.getRoleList(); //获取权限列表
    this.getUserList(); //获取用户列表
  },
  data() {
    return {
      /**
       * 权限部分
       */

      roleListParameter: {
        Roleflag: "All",
        pageNum: 1,
        pageSize: 10000,
        Rolesel: ""
      },
      roleList: [],
      multipleSelection: [],

      /**
       * 用户列表部分
       */

      ResultTotal: 0, //数据总量
      userListParameter: {
        StrFlag: "All",
        UserName: "", //搜索条件
        pageNum: 1,
        pageSize: 10
      },
      loading: true, //数据加载标识
      userList: [], //表格数据

      /**
       * 用户状态改变
       */
      actionOptions: [
        { status: "激活", StrState: 0 },
        { status: "禁用", StrState: 1 }
      ],
      changeUserStatusParameter: {
        StrFlag: "disable",
        UserName: "",
        StrState: null
      },

      /**
       * 弹窗部分
       */
      isNewAdd: true,
      isShowModal: false,
      newUserParameter: {
        StrFlag: "Add",
        reqdata: ""
      },
      reqdata: {
        UserName: "", //账号
        Password: "", // 密码
        Email: "", // 邮箱
        Alias: "", // 用户名
        MobilePIN: "", // 手机号
        UserNotes: "", // 备注
        UserRole: [] //权限列表
      },
      Role: [], //当前用户的权限列表

      /**
       * 用户详情
       */

      userDetailsParameter: {
        StrFlag: "Detail",
        userid: null
      },
      currentUserInfo: {},
      direction: "rtl",
      drawer: false,
      isLoadingModal: true,

      /**
       * 删除用户
       */
      delUserParameter: {
        StrFlag: "Del",
        userid: null
      },

      /**
       * 重置密码
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
  methods: {
    // 点击重置密码
    handleChange(index, row) {
      this.isShowPasswordModal = true;
      this.changePasswordParameter.UserName = row.UserName;
    },

    // 确定修改密码
    async confirmModifyPassword() {
      let res = await this.$Http.changePassword(
        this.changePasswordParameter,
        true
      );

      if (res.ResultFlag == "0") {
        this.$message.success("重置成功");
        this.isShowPasswordModal = false;
        let newPaaword = res.ResultSet
        this.passwordTips(this.changePasswordParameter.UserName, newPaaword);
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 密码提示
    passwordTips(UserName,newPaaword) {
      this.$notify({
        title: "密码重置结果",
        message: UserName + "的新密码为" + newPaaword,
        duration: 0
      });
    },

    // 权限列表
    async getRoleList() {
      let res = await this.$Http.roleList(this.roleListParameter, true);
      if (res.ResultFlag == "0") {
        this.roleList = res.ResultSet;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 获取用户列表
    async getUserList() {
      let res = await this.$Http.userList(this.userListParameter, true);
      if (res.ResultFlag == "0") {
        this.userList = res.ResultSet;
        this.ResultTotal = res.ResultTotal;
        this.loading = false;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 选择状态
    chooseAction(index, row, StrState) {
      this.changeUserStatusParameter.StrState = StrState;
      this.changeUserStatusParameter.UserName = row.UserName;
      this.changeStatus();
    },

    // 修改状态
    async changeStatus() {
      let res = await this.$Http.changeUserStatus(
        this.changeUserStatusParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.$message.success("状态修改成功");
        this.getUserList();
      } else {
        this.$message.error("状态修改失败");
      }
    },

    // 选择权限
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 新增用户
    handleAddBtn() {
      this.newUserParameter.StrFlag = "Add";
      this.isNewAdd = true;
      this.isShowModal = true;
      this.reqdata.UserName = "";
      this.reqdata.Password = "";
      this.reqdata.Email = "";
      this.reqdata.Alias = "";
      this.reqdata.MobilePIN = "";
      this.reqdata.UserNotes = "";
      this.reqdata.UserRole = [];
    },

    // 确定添加用户
    confirmAddUser() {
      if (!this.reqdata.UserName) {
        this.$message.warning("请输入账号");
      } else if (this.isNewAdd && !this.reqdata.Password) {
        this.$message.warning("请输入密码");
      } else if (!this.reqdata.Email) {
        this.$message.warning("请输入邮箱");
      } else if (
        this.reqdata.Email &&
        !this.$check.checkOutEmail(this.reqdata.Email)
      ) {
        this.$message.warning("邮箱格式不正确");
      } else if (!this.reqdata.Alias) {
        this.$message.warning("请输入用户名");
      } else if (!this.reqdata.MobilePIN) {
        this.$message.warning("请输入手机号");
      } else if (
        this.reqdata.MobilePIN &&
        !this.$check.checkOutTel(this.reqdata.MobilePIN)
      ) {
        this.$message.warning("手机号码不正确");
      } else if (this.multipleSelection.length == 0) {
        this.$message.warning("请选择权限");
      } else {
        let UserRole = [];
        this.multipleSelection.forEach(item => {
          UserRole.push({
            ID: 0,
            UserId: this.isNewAdd ? 0 : this.userDetailsParameter.userid,
            RoleId: item.ID
          });
        });
        this.reqdata.UserRole = UserRole;
        this.newUserParameter.reqdata = JSON.stringify(this.reqdata);
        this.addUser();
      }
    },

    // 新增编辑用户
    async addUser() {
      let res = await this.$Http.newUser(this.newUserParameter, true);
      if (res.ResultFlag == "0") {
        this.isShowModal = false;
        this.$message.success("保存成功");
        this.getUserList();
      } else {
        this.$message.error(res.ResultMessage);
      }
    },

    // 删除产品弹窗
    handleDelete(index, row) {
      let _this = this;
      _this.delUserParameter.userid = row.ID;
      _this
        .$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.deleteUser();
        })
        .catch(() => {
          _this.delUserParameter.userid = null;
        });
    },

    // 删除用户
    async deleteUser() {
      let res = await this.$Http.delUser(this.delUserParameter, true);
      if (res.ResultFlag == "0") {
        this.$message.success("删除成功");
        this.getUserList();
      } else {
        this.$message.error("删除失败");
      }
    },

    // 查看详情
    handleView(index, row) {
      this.drawer = true;

      this.userDetailsParameter.userid = row.ID;
      this.getUserDetails();
    },

    // 编辑信息
    handleEdit(index, row) {
      this.isNewAdd = false;
      this.isShowModal = true;
      this.isLoadingModal = true;
      this.userDetailsParameter.userid = row.ID;
      this.newUserParameter.StrFlag = "Update";
      this.getUserDetails();
    },

    // 用户详情
    async getUserDetails() {
      let res = await this.$Http.userDetails(this.userDetailsParameter, true);
      if (res.ResultFlag == "0") {
        this.currentUserInfo = res.ResultSet;
        this.reqdata.UserName = this.currentUserInfo.UserName;
        this.reqdata.Password = this.currentUserInfo.Password;
        this.reqdata.Email = this.currentUserInfo.Email;
        this.reqdata.Alias = this.currentUserInfo.Alias;
        this.reqdata.MobilePIN = this.currentUserInfo.MobilePIN;
        this.reqdata.UserNotes = this.currentUserInfo.UserNotes;
        this.isLoadingModal = false;
        // 这里需要标记用户已经有的权限
        this.Role = this.currentUserInfo.Role;
        // isLoadingModal 为了标记是不是加载弹窗接口，避免Cannot read property 'toggleRowSelection' of undefined报错
        // 当编辑情况下，且含有权限的时候，执行以下代码
        if (!this.isNewAdd && this.Role.length > 0) {
          let arr = [];
          this.Role.forEach(item => {
            this.roleList.forEach(unit => {
              if (item.ID == unit.ID) {
                arr.push(unit);
              }
            });
          });
          /**
           * 在使用这个方法的时候，需要给dialog设置destroy-on-close为true， 关闭时销毁 Dialog 中的元素;
           * this.$nextTick
           * 否则，有的时候执行，有的时候不执行标记方法。
           */
          this.$nextTick(() => {
            this.toggleSelection(arr);
          });
        }
      } else {
        this.$message.error("数据加载失败");
      }
    },

    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      }
    },

    handleCurrentChange(currentPage) {
      this.userListParameter.pageNum = currentPage;
      this.getUserList();
    }
  },
  computed: {
    scrollerHeight() {
      this.viewportH =
        window.innerHeight || document.documentElement.clientHeight;
      return this.viewportH - 77 + "px";
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/productList";
@import "../style/userList";
</style>
