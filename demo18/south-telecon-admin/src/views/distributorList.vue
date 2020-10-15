<template>
  <div class="box">
    <div class="search-part">
      <el-input clearable size="small" class="search-input" placeholder="请输入客户名称"
        v-model="distributorsTableParameter.salessearch" @input="emptySearch">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-radio-group class="type-btns" v-model="type" size="small" @change="chooseType">
        <el-radio-button label="全部"></el-radio-button>
        <el-radio-button label="一级"></el-radio-button>
        <el-radio-button label="二级"></el-radio-button>
        <el-radio-button label="三级"></el-radio-button>
      </el-radio-group>
      <el-button class="search-btn" size="small" @click="getDistributorsList">搜索</el-button>
      <el-button class="add-btn" type="success" size="small" icon="el-icon-circle-plus-outline" @click="addDistributor">
        新增分销商
      </el-button>
    </div>
    <el-table :data="distributorList" style="width: 100%;" :header-cell-style="$config.headerCellStyle" border>
      <el-table-column prop="SalesName" label="分销商名称" align="center"></el-table-column>
      <el-table-column prop="SalesType.SalesTypeName" label="类型" align="center"></el-table-column>
      <el-table-column prop="UpdateID" label="更新人" align="center"></el-table-column>
      <el-table-column prop="UpdateTime" label="更新时间" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="240">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="primary" size="mini" @click="handleAdd(scope.$index, scope.row)">添加用户</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination @current-change="currentPage=>handleCurrentChange('1',currentPage)"
        :current-page.sync="distributorsTableParameter.pageNum" background layout="total, prev, pager, next, jumper"
        :total="distributorResultTotal">
      </el-pagination>
    </div>

    <!-- 添加用户弹窗 -->
    <el-dialog :close-on-click-modal="false" class="use-modal" title="添加用户" width="80%" :visible.sync="isShowModal">
      <div class="search-part">
        <el-input clearable size="small" class="search-input" placeholder="关键词+Enter搜索"
          v-model="addUserInDistributorParameter.usersel">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button class="search-btn" size="small" @click="loadingUserList">搜索</el-button>
      </div>
      <el-table :data="userList" style="width: 100%" height="400" :header-cell-style="$config.headerCellStyle" border>
        <el-table-column prop="OpenId" label="用户openID" align="center"></el-table-column>
        <el-table-column prop="NickName" label="用户姓名" align="center"></el-table-column>
        <el-table-column prop="UserType" label="用户类型" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.UserType || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="CellPhone" label="联系方式" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.CellPhone || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="DetailAddress" label="地址" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.DetailAddress || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" v-if="scope.row.SalesId == 0"
              @click="addMemberAction(scope.$index, scope.row)">添加
            </el-button>
            <el-button type="danger" size="mini" v-else @click="delMemberAction(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination @current-change="currentPage=>handleCurrentChange('2',currentPage)"
          :current-page.sync="addUserInDistributorParameter.pageNum" background
          layout="total, prev, pager, next, jumper" :total="userResultTotal">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isShowModal = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 新增/编辑分销商分类 -->
    <el-dialog :close-on-click-modal="false" class="distributor-modal" :title="isNewAdd?'新增分销商':'编辑分销商'" :visible.sync="isShowDistributorModal">
      <el-form :model="form" label-position="left">
        <el-form-item label="分销商名称" :label-width="formLabelWidth">
          <el-input clearable class="content-input" v-model="reqdata.SalesName" placeholder="请输入分销商名称"></el-input>
        </el-form-item>

        <el-form-item label="分销商分类" :label-width="formLabelWidth">
          <el-select filterable class="content-input" v-model="currenType" placeholder="请选择分销商分类"
            @change="chooseDistributorType">
            <el-option v-for="item in distributorsTypeList" :key="item.ID" :label="item.SalesTypeName" :value="item.ID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" :label-width="formLabelWidth">
          <el-input clearable class="content-input" v-model="reqdata.Contacts " placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth">
          <el-input clearable class="content-input" v-model="reqdata.CellPhone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="固定电话" :label-width="formLabelWidth">
          <el-input clearable class="content-input" v-model="reqdata.TelPhone" placeholder="请输入固定电话"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input clearable class="content-input w-70" v-model="reqdata.Address" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input clearable class="content-input big" type="textarea" :autosize="{ minRows: 3, maxRows: 6}"
            v-model="reqdata.Remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDistributorModal = false">取 消</el-button>
        <el-button type="primary" @click="saveDistributorInfo">保 存</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
export default {
  name: "distributorList",
  data() {
    return {
      isNewAdd: true,
      isShowModal: false,
      type: "全部",

      /**
       * 添加用户相关
       */
      addUserInDistributorParameter: {
        userflag: "salesuser",
        usersel: "",
        salesid: null,
        pageNum: 1,
        pageSize: 10
      },
      userList: [],
      userResultTotal: 0,

      // 加载分销商清单列表参数
      distributorsTableParameter: {
        flag: "sales",
        pageNum: 1,
        pageSize: 10,
        salessearch: "",
        salestype: ""
      },
      distributorResultTotal: 0, //数据总量
      distributorList: [],

      /**
       * 新增分销商成员
       */
      addDistributorMemberParameter: {
        flag: "Man",
        reqdata: ""
      },
      currentSalesId: 0,

      delDistributorMemberParameter: {
        flag: "Del",
        userid: null
      },

      /**
       * 新增编辑分销商部分
       */

      formLabelWidth: "120px",
      currenType: "", //当前选择的分销商分类等级
      isShowDistributorModal: false, //新增分销商弹窗显隐控制
      addDistributorParameter: {
        flag: "Man",
        reqdata: ""
      },
      reqdata: {
        ID: 0,
        SaleTypeID: 0,
        SalesName: "",
        Address: "",
        CellPhone: "",
        TelPhone: "",
        Contacts: "",
        Remark: "",
        CreateID: Number(localStorage.getItem("CreateID"))
      },

      delDistributorInfoParameter: {
        flag: "Del",
        salesid: null
      },

      /**
       * 分销商分类部分
       */
      distributorsTypeList: [], //分销商分类列表
      distributorsTypeParameter: {
        flag: "saletype",
        pageNum: 1,
        pageSize: 10000
      } // 客户分类列表参数
    };
  },
  created() {
    this.getDistributorsTypeList(); //获取分销商分类列表
    this.getDistributorsList(); //获取分销商清单
  },
  methods: {
    /**
     * getDistributorsList  获取分销商清单
     * getDistributorsTypeList 获取分销商分类列表
     * emptySearch 当前清空查询条件后，自动查询数据
     * loadingUserList 获取分销商-添加用户列表信息
     * chooseType(type) 选择查询类型
     * chooseDistributorType(id) 选择分销商分类
     * saveDistributorInfo 保存新增或编辑信息
     * handleEdit(index, row) 编辑分销商信息
     * handleDelete 删除分销商按钮
     * confirmDelete 确认删除分销商
     * handleAdd(index, row)  添加
     */

    // 获取分销商清单
    async getDistributorsList() {
      let res = await this.$Http.distributorsTable(
        this.distributorsTableParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.distributorList = res.ResultSet;
        this.distributorResultTotal = res.ResultTotal;
      }
    },

    // 获取分销商分类列表
    async getDistributorsTypeList() {
      let res = await this.$Http.distributorsList(
        this.distributorsTypeParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.distributorsTypeList = res.ResultSet;
      }else{
        this.$message.error('数据加载失败')
      }
    },

    // 当前清空查询条件后，自己查询数据
    emptySearch() {
      if (this.distributorsTableParameter.salessearch == "")
        this.getDistributorsList();
    },

    // 加载弹窗表格数据
    async loadingUserList() {
      let res = await this.$Http.addUserInDistributor(
        this.addUserInDistributorParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.userList = res.ResultSet;
        this.userResultTotal = res.ResultTotal;
      }
    },

    // 选择查询类型
    chooseType(type) {
      if (type == "全部") {
        this.distributorsTableParameter.salestype = "";
      } else {
        this.distributorsTableParameter.salestype = type;
      }
    },

    // 新增分销商
    addDistributor() {
      this.isNewAdd = true;
      this.currenType = "";
      this.reqdata.SaleTypeID = null;
      this.reqdata.SalesName = "";
      this.reqdata.ID = 0;
      this.reqdata.Address = "";
      this.reqdata.CellPhone = "";
      this.reqdata.TelPhone = "";
      this.reqdata.Contacts = "";
      this.reqdata.Remark = "";
      this.isShowDistributorModal = true;
    },

    // 选择分销商分类
    chooseDistributorType(id) {
      this.reqdata.SaleTypeID = id;
    },

    // 保存新增或编辑信息
    saveDistributorInfo() {
      if (!this.reqdata.SalesName) {
        this.$message.warning("请填写分销商名称");
      } else if (!this.reqdata.SaleTypeID) {
        this.$message.warning("请选择分销商分类");
      } else if (!this.reqdata.Contacts) {
        this.$message.warning("请填写联系人");
      } else if (!this.reqdata.CellPhone) {
        this.$message.warning("请填写联系电话");
      } else if (
        this.reqdata.CellPhone &&
        !this.$check.checkOutTel(this.reqdata.CellPhone)
      ) {
        this.$message.error("联系电话填写错误");
      } else if (!this.reqdata.TelPhone) {
        this.$message.warning("请填写固定电话");
      } else if (
        this.reqdata.TelPhone &&
        !this.$check.checkOutFixedTelephone(this.reqdata.TelPhone)
      ) {
        this.$message.error("固定电话填写错误");
      } else if (!this.reqdata.Address) {
        this.$message.warning("请填写地址");
      } else {
        this.addOrEditDistributorInfo();
      }
    },

    // 新增或编辑分销商信息
    async addOrEditDistributorInfo() {
      this.addDistributorParameter.reqdata = JSON.stringify(this.reqdata);
      let res = await this.$Http.newDistributorInfo(
        this.addDistributorParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.isShowDistributorModal = false;
        this.getDistributorsList();
        this.$message.success("保存成功");
      } else {
        this.$message.error("保存失败");
      }
    },

    // 编辑分销商信息
    handleEdit(index, row) {
      this.isNewAdd = false;
      this.reqdata.SaleTypeID = row.SaleTypeID;
      this.currenType = row.SalesType.SalesTypeName; //展示当前选中的分销商分类名称
      this.reqdata.SalesName = row.SalesName;
      this.reqdata.ID = row.ID;
      this.reqdata.Address = row.Address;
      this.reqdata.CellPhone = row.CellPhone;
      this.reqdata.TelPhone = row.TelPhone;
      this.reqdata.Contacts = row.Contacts;
      this.reqdata.Remark = row.Remark;
      this.isShowDistributorModal = true;
    },

    // 删除分销商按钮
    handleDelete(index, row) {
      this.delDistributorInfoParameter.salesid = row.ID;
      this.$confirm("此操作将删除该分销商, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.confirmDelete();
        })
        .catch(() => {});
    },

    // 确认删除分销商
    async confirmDelete() {
      let res = await this.$Http.delDistributorInfo(
        this.delDistributorInfoParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.getDistributorsList();
        this.$message.success("删除成功");
      } else {
        this.$message.error("删除失败");
      }
    },

    /**
     * 弹窗操作
     * handleAdd(index, row) 添加用户
     * addMemberAction(index, row) 弹窗添加操作
     * delMemberAction(index, row) 弹窗取消操作
     */

    // 添加用户
    handleAdd(index, row) {
      this.currentSalesId = row.ID;
      this.addUserInDistributorParameter.salesid = row.ID;
      this.isShowModal = true;
      this.loadingUserList();
    },

    // 分销商成员添加
    async toAddDistributorMember() {
      let res = await this.$Http.addDistributorMember(
        this.addDistributorMemberParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.$message.success("添加成功");
        this.loadingUserList();
      } else {
        this.$message.error("添加失败");
      }
    },

    // 分销商成员删除
    async toDelDistributorMember() {
      let res = await this.$Http.delDistributorMember(
        this.delDistributorMemberParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.loadingUserList();
        this.$message.success("删除成功");
      } else {
        this.$message.error("删除失败");
      }
    },

    // 添加成员操作
    addMemberAction(index, row) {
      let obj = {};
      obj.ID = 0;
      obj.SalesId = this.currentSalesId;
      obj.UserID = row.ID;
      this.addDistributorMemberParameter.reqdata = JSON.stringify(obj);
      this.toAddDistributorMember();
    },

    // 删除成员操作
    delMemberAction(index, row) {
      this.delDistributorMemberParameter.userid = row.ID;
      this.$confirm("此操作将删除该成员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.toDelDistributorMember();
        })
        .catch(() => {});
    },

    // 分页操作
    handleCurrentChange(str, currentPage) {
      if (str == "1") {
        this.distributorsTableParameter.pageNum = currentPage;
        this.getDistributorsList();
      } else if (str == "2") {
        this.addUserInDistributorParameter.pageNum = currentPage;
        this.loadingUserList();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/productList";
@import "../style/distributorList";

.use-modal {
  .search-part {
    margin-top: -30px;
    padding-left: 0 !important;
  }
}
</style>