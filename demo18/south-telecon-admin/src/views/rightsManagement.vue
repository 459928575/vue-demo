<template>
  <div class="box">
    <div class="search-part">
      <el-input clearable @keyup.enter.native="getRoleList" size="small" class="search-input" placeholder="请输入权限名称" v-model="roleListParameter.Rolesel">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button class="search-btn" size="small" @click="getRoleList">搜索</el-button>
      <el-button class="add-btn" type="success" size="small" icon="el-icon-circle-plus-outline" @click="handleAddBtn">
        新增权限
      </el-button>
    </div>
    <el-table v-loading="loading" :data="roleList" :header-cell-style="$config.headerCellStyle" style="width: 100%" border>
      <el-table-column prop="RoleName" label="权限名称" align="center"></el-table-column>
      <el-table-column prop="Roles" label="菜单权限" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="right">
            <p v-for=" (item, ind) in JSON.parse(scope.row.Roles)" :key="ind">{{ item }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag type="success" size="medium" style="cursor: pointer;">查看</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="RoleNotes" label="备注" align="center"></el-table-column>
      <el-table-column prop="UpdateTime" label="最近修改时间" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" width="300" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleView(scope.$index, scope.row)">查看详情</el-button>
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination :current-page.sync="roleListParameter.pageNum" @current-change="handleCurrentChange" background layout="total, prev, pager, next, jumper" :total="ResultTotal">
      </el-pagination>
    </div>

    <!-- 新增权限列表 -->

    <el-dialog :close-on-click-modal="false" class="add-modal" :destroy-on-close="true" :title="currentRoleInfo.ID?'编辑权限':'新增权限'" :visible.sync="isShowModal" width="650px">
      <div class="details-container">
        <div class="details-item">
          <div class="left">权限名称 :</div>
          <el-input clearable class="right w-75" v-model="currentRoleInfo.RoleName" placeholder="请输入权限名称"></el-input>
        </div>
        <div class="details-item">
          <div class="left">操作权限 :</div>
          <div class="right w-75">
            <el-table ref="multipleTable" :data="leftMenuList" :header-cell-style="$config.headerCellStyle" height="240" border style="width: 100%" @selection-change="handleSelectionChangeMenu">
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column prop="OrderNotes" label="菜单管理" align="center">
              </el-table-column>
            </el-table>
          </div>
        </div>

        <div class="details-item">
          <div class="left">备注 :</div>
          <el-input clearable class="right w-75" type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model="currentRoleInfo.RoleNotes" placeholder="请输入备注信息"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowModal = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 详情 -->
    <el-drawer class="order-details" :direction="direction" :title="currentRoleInfo.RoleName" :visible.sync="drawer">
      <div class="order-info">
        <div class="list">
          <div class="list-title">权限名称</div>
          <div class="list-content">{{currentRoleInfo.RoleName}}</div>
        </div>
        <div class="agreement-part">
          <div class="agreement-title">菜单权限</div>
          <div class="agreement-content">{{oldRoles || '未填写'}}</div>
        </div>
        <div class="agreement-part">
          <div class="agreement-title">备注</div>
          <div class="agreement-content">{{currentRoleInfo.RoleNotes || '未填写'}}</div>
        </div>
        <div class="list">
          <div class="list-title">更新人</div>
          <div class="list-content">{{otherDetails.UpdateID}}</div>
        </div>
        <div class="list border-none">
          <div class="list-title">更新时间</div>
          <div class="list-content">{{otherDetails.UpdateTime}}</div>
        </div>
      </div>

    </el-drawer>
  </div>
</template>
<script>
export default {
  name: "rightsManagement",
  data() {
    return {
      loading: true,
      roleListParameter: {
        Roleflag: "All",
        Rolesel: "",
        pageNum: 1,
        pageSize: 10
      },
      roleList: [],

      /**
       * 新增/编辑权限部分
       */
      isNewAdd: true,
      addRoleParameter: {
        Roleflag: "Man",
        reqdata: ""
      },
      direction: "rtl",
      isShowModal: false,
      drawer: false,
      formLabelWidth: "100px",
      currentRoleInfo: {
        ID: 0,
        RoleName: "",
        RoleNotes: "",
        CreateID: Number(localStorage.getItem("CreateID")),
        Roles: ""
      },
      oldRoles: "", //当前用户权限
      otherDetails: {
        UpdateID: null,
        UpdateTime: null
      },
      roleDetailsParameter: {
        Roleflag: "Detail",
        Roleid: null
      },

      /**
       * 删除权限部分
       */
      delRoleParameter: {
        Roleflag: "Del",
        Roleid: null
      },

      /**
       * 左侧菜单部分
       */
      leftMenuParameter: {
        Roleflag: "All"
      },
      leftMenuList: [], //菜单列表
      allowedMenu: [] //可操作菜单
    };
  },
  created() {
    this.getLeftMenu();
    this.getRoleList();
  },
  methods: {
    // 菜单选择变换
    handleSelectionChangeMenu(val) {
      this.allowedMenu = val;
    },

    // 左侧菜单列表
    async getLeftMenu() {
      let res = (res = await this.$Http.leftMenu(this.leftMenuParameter, true));
      if (res.ResultFlag == "0") {
        this.leftMenuList = res.ResultSet;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 获取权限列表
    async getRoleList() {
      this.loading = true;
      let res = await this.$Http.roleList(this.roleListParameter, true);
      if (res.ResultFlag == "0") {
        this.ResultTotal = res.ResultTotal;
        this.roleList = res.ResultSet;
        this.loading = false;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 分页
    handleCurrentChange(currentPage) {
      this.roleListParameter.pageNum = currentPage;
      this.getRoleList();
    },

    // 点击添加按钮
    handleAddBtn() {
      this.isNewAdd = true;
      this.currentRoleInfo.ID = 0;
      this.currentRoleInfo.RoleName = "";
      this.currentRoleInfo.RoleNotes = "";
      this.isShowModal = true;
    },

    // 保存权限
    confirmAdd() {
      let arr = [];
      if (this.allowedMenu.length > 0) {
        this.allowedMenu.forEach(item => {
          arr.push(item.OrderNotes);
        });
      }
      this.currentRoleInfo.Roles = JSON.stringify(arr);
      if (!this.currentRoleInfo.RoleName) {
        this.$message.warning("请输入权限名称");
      } else if (this.allowedMenu.length == 0) {
        this.$message.warning("请选择操作菜单");
      } else {
        this.addRoleParameter.reqdata = JSON.stringify(this.currentRoleInfo);
        this.addRole();
      }
    },

    // 添加权限
    async addRole() {
      let res = await this.$Http.addRole(this.addRoleParameter, true);
      if (res.ResultFlag == "0") {
        this.$message.success("保存成功");
        this.isShowModal = false;
        this.getRoleList();
      } else {
        this.$message.error("保存失败");
      }
    },

    // 权限详情
    async getRoleDetails() {
      let res = await this.$Http.roleDetails(this.roleDetailsParameter, true);
      if (res.ResultFlag == "0") {
        let roleInfo = res.ResultSet;
        this.currentRoleInfo.RoleName = roleInfo.RoleName;
        this.currentRoleInfo.RoleNotes = roleInfo.RoleNotes;
        this.currentRoleInfo.ID = roleInfo.ID;
        this.otherDetails.UpdateID = roleInfo.UpdateID;
        this.otherDetails.UpdateTime = roleInfo.UpdateTime;
        let oldRoles = JSON.parse(roleInfo.Roles);
        this.oldRoles = oldRoles.toString();
        // 注意：只有在编辑的情况下，才进行已有权限的标记。
        if (this.currentRoleInfo.ID && oldRoles.length > 0 && !this.isNewAdd) {
          let arr = [];
          oldRoles.forEach(item => {
            this.leftMenuList.forEach(unit => {
              if (item == unit.OrderNotes) {
                arr.push(unit);
              }
            });
          });
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

    // 查看详情
    handleView(index, row) {
      this.isNewAdd = true;
      this.roleDetailsParameter.Roleid = row.ID;
      this.oldRoles = ""; //权限首先置空
      this.getRoleDetails();
      this.drawer = true;
    },

    // 编辑权限信息
    handleEdit(index, row) {
      this.isNewAdd = false;
      this.currentRoleInfo.ID = row.ID;
      this.roleDetailsParameter.Roleid = row.ID;
      this.oldRoles = ""; //权限首先置空
      this.getRoleDetails();
      this.isShowModal = true;
    },

    handleDelete(index, row) {
      let _this = this;
      _this.delRoleParameter.Roleid = row.ID;
      _this
        .$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.deleteRole();
        })
        .catch(() => {});
    },

    // 删除
    async deleteRole() {
      let res = await this.$Http.delRole(this.delRoleParameter, true);
      if (res.ResultFlag == "0") {
        this.$message.success("删除成功");
        this.getRoleList();
      } else {
        this.$message.error("删除失败");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/rightsManagement";
@import "../style/productList";
</style>