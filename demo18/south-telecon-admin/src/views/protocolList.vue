<template>
  <div class="box">
    <!-- 1、筛选条件 -->
    <div class="search-part">
      <el-input clearable @keyup.enter.native="getAgreementList" size="small" class="search-input" placeholder="请输入协议名称" v-model="agreementListParameter.search">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button class="search-btn" size="small" @click="getAgreementList">搜索</el-button>
      <el-button class="add-btn" type="success" size="small" icon="el-icon-circle-plus-outline" @click="handleAddBtn">
        新增协议
      </el-button>
    </div>
    <!-- 2、表格数据 -->
    <el-table v-loading="loading" :data="agreementList" style="width: 100%" :header-cell-style="$config.headerCellStyle" border>
      <el-table-column prop="AgreementName" label="协议名称" align="center"></el-table-column>
      <el-table-column prop="OrderType" label="业务分类" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.OrderType == 'GR'">住宅</span>
          <span v-else-if="scope.row.OrderType == 'QY'">企业</span>
          <span v-else>其他</span>
        </template>
      </el-table-column>
      <el-table-column prop="AgreementContent" label="协议内容" align="center">
        <template slot-scope="scope">
          <el-tag type="success" style="cursor: pointer;" @click="handleView(scope.$index, scope.row)">点我查看</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="Remark" label="备注" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.Remark || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="300" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleView(scope.$index, scope.row)">查看详情</el-button>
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination :current-page.sync="agreementListParameter.pageNum" @current-change="handleCurrentChange" background layout="total, prev, pager, next, jumper" :total="ResultTotal">
      </el-pagination>
    </div>

    <!-- 3、详情 -->
    <el-drawer class="order-details" :direction="direction" :title="currentAgreementInfo.AgreementName" :visible.sync="drawer">
      <div class="order-info" :style="{height:scrollerHeight}">
        <div class="list">
          <div class="list-title">协议名称</div>
          <div class="list-content">{{currentAgreementInfo.AgreementName}}</div>
        </div>
        <div class="list">
          <div class="list-title">业务分类</div>
          <div class="list-content">{{selectType}}</div>
        </div>
        <div class="agreement-part">
          <div class="agreement-title">协议内容</div>
          <div class="agreement-content">{{currentAgreementInfo.AgreementContent}}</div>
        </div>
        <div class="agreement-part border-none">
          <div class="agreement-title">备注</div>
          <div class="agreement-content">{{currentAgreementInfo.Remark || '--'}}</div>
        </div>
      </div>
    </el-drawer>

    <!-- 4、新增/编辑 -->
    <el-dialog :close-on-click-modal="false" class="add-modal" :destroy-on-close="true" :title="isNewAdd?'新增协议':'编辑协议'" :visible.sync="isShowModal" width="650px">
      <div class="details-container">
        <div class="details-item">
          <div class="left">协议名称 :</div>
          <el-input class="right w-75" v-model="reqdata.AgreementName" placeholder="请输入协议名称"></el-input>
        </div>
        <div class="details-item">
          <div class="left">业务分类 :</div>
          <el-select size="small" class="right w-75" v-model="selectType" placeholder="请选择业务" @change="val=>chooseValue(val, '业务')">
            <el-option v-for="item in typeOptions" :key="item.OrderCode" :label="item.OrderNotes" :value="item.OrderCode">
            </el-option>
          </el-select>
        </div>
        <div class="details-item">
          <div class="left">协议内容 :</div>
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" resize="vertical" class="right w-75" v-model="reqdata.AgreementContent" placeholder="请输入协议内容"></el-input>
        </div>
        <div class="details-item">
          <div class="left">协议备注 :</div>
          <el-input class="right w-75" v-model="reqdata.Remark" placeholder="请输入协议备注"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowModal = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddAgreement">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "protocolList",
  created() {
    this.getTypeOptions();
    this.getAgreementList();
  },
  data() {
    return {
      viewportH: 0,
      ResultTotal: 0, //数据总量
      agreementListParameter: {
        Agreementflag: "All",
        search: "", //搜索条件
        pageNum: 1,
        pageSize: 10
      },
      isShowModal: false, //弹窗显隐控制
      currentProductInfo: {}, //弹窗展示的行数据
      loading: true, //数据加载标识
      agreementList: [], //表格数据
      delAgreementParameter: {
        flag: "Del",
        Agreementid: null
      },

      /**
       * 新增协议部分
       */
      typeOptions: [], //分类配置列表
      selectType: "",
      newAgreementParameter: {
        flag: "Man",
        reqdata: ""
      },
      reqdata: {
        ID: 0, //新增为0
        AgreementName: "", // 名称
        AgreementContent: "", // 内容
        OrderType: "", //业务分类
        Remark: ""
      },
      isShowModal: false,
      isNewAdd: true,
      /**
       * 协议详情
       */
      currentAgreementInfo: {},
      direction: "rtl",
      drawer: false,
      agreementDetailsParameter: {
        Agreementflag: "Detail",
        Agreementid: null
      },


    };
  },
  methods: {

    // 业务分类列表
    async getTypeOptions() {
      let res = await this.$Http.newOrderType(
        {
          flag: "New"
        },
        true
      );
      if (res.ResultFlag == "0") {
        this.typeOptions = res.ResultSet;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 下拉框选择
    chooseValue(value, str) {
      switch (str) {
        case "业务":
          this.reqdata.OrderType = value;
          this.typeOptions.forEach(item => {
            if (value == item.OrderCode) {
              this.selectType = item.OrderNotes;
            }
          });
          break;
      }
    },
    // 获取协议列表
    async getAgreementList() {
      let res = await this.$Http.agreementList(
        this.agreementListParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.agreementList = res.ResultSet;
        this.ResultTotal = res.ResultTotal;
        this.loading = false;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 用户详情
    async getAgreementDetails() {
      let res = await this.$Http.agreementDetails(
        this.agreementDetailsParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.currentAgreementInfo = res.ResultSet;
        this.reqdata.AgreementName = this.currentAgreementInfo.AgreementName;
        this.reqdata.AgreementContent = this.currentAgreementInfo.AgreementContent;
        this.reqdata.OrderType = this.currentAgreementInfo.OrderType;
        this.reqdata.Remark = this.currentAgreementInfo.Remark;
        this.reqdata.ID = this.currentAgreementInfo.ID;
        this.typeOptions.forEach(item => {
          if (this.currentAgreementInfo.OrderType == item.OrderCode) {
            this.selectType = item.OrderNotes;
          }
        });
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 确定添加协议
    confirmAddAgreement() {
      if (!this.reqdata.AgreementName) {
        this.$message.warning("请输入账号");
      } else if (!this.reqdata.AgreementContent) {
        this.$message.warning("请输入内容");
      } else if (!this.reqdata.OrderType) {
        this.$message.warning("请选择分类");
      } else {
        this.newAgreementParameter.reqdata = JSON.stringify(this.reqdata);
        this.addAgreement();
      }
    },

    // 新增编辑协议
    async addAgreement() {
      let res = await this.$Http.newAgreement(this.newAgreementParameter, true);
      if (res.ResultFlag == "0") {
        this.isShowModal = false;
        this.$message.success("保存成功");
        this.getAgreementList();
      } else {
        this.$message.error("保存失败");
      }
    },

    // 查看详情
    handleView(index, row) {
      this.reqdata.ID = row.ID;
      this.agreementDetailsParameter.Agreementid = row.ID;
      this.getAgreementDetails();
      this.drawer = true;
    },

    // 编辑信息
    handleEdit(index, row) {
      this.isNewAdd = false;
      this.isShowModal = true;
      this.reqdata.ID = row.ID;
      this.agreementDetailsParameter.Agreementid = row.ID;
      this.getAgreementDetails();
    },

    // 删除产品弹窗
    handleDelete(index, row) {
      let _this = this;
      _this.delAgreementParameter.Agreementid = row.ID;
      _this
        .$confirm("此操作将永久删除该协议, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.deleteAgreement();
        })
        .catch(() => {
          _this.delAgreementParameter.Agreementid = null;
        });
    },

    // 删除协议
    async deleteAgreement() {
      let res = await this.$Http.delAgreement(this.delAgreementParameter, true);
      if (res.ResultFlag == "0") {
        this.$message.success("删除成功");
        this.getAgreementList();
      } else {
        this.$message.error("删除失败");
      }
    },

    // 分页
    handleCurrentChange(currentPage) {
      this.agreementListParameter.pageNum = currentPage;
      this.getAgreementList();
    },

    // 新增产品
    handleAddBtn() {
      this.isNewAdd = true;
      this.isShowModal = true;
      this.reqdata.AgreementName = "";
      this.reqdata.AgreementContent = "";
      this.reqdata.OrderType = "";
      this.reqdata.Remark = "";
      this.reqdata.ID = 0;
      this.selectType = "";
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
@import "../style/protocolList";
</style>
