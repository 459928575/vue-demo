<template>
  <div class="box">
    <!-- 1、筛选部分 -->
    <div class="search-part">
      <el-input clearable size="small" @keyup.enter.native="getBuildingList" class="search-input" placeholder="请输入楼宇名称" v-model="queryCondition.projectsel">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-radio-group class="type-btns" v-model="selecttype" size="small" @change="chooseType">
        <el-radio-button :label="item.OrderNotes" v-for="(item, index) in typeOptions" :key="index"></el-radio-button>
      </el-radio-group>
      <el-button class="search-btn" size="small" @click="getBuildingList">搜索</el-button>
      <el-button class="add-btn" type="success" size="small" icon="el-icon-circle-plus-outline" @click="addBuilding">
        新增楼宇
      </el-button>
    </div>
    <!-- 2、表格数据 -->
    <el-table v-loading="loading" :data="buildingList" style="width: 100%;" :header-cell-style="$config.headerCellStyle" border>
      <el-table-column prop="ProjectName" label="楼宇名称" align="center"></el-table-column>
      <el-table-column prop="Address" label="地址" align="center"></el-table-column>
      <el-table-column prop="OrderType" label="类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.OrderType =='GR'">住宅</span>
          <span v-else-if="scope.row.OrderType =='QY'">企业</span>
          <span v-else>其他</span>
        </template>
      </el-table-column>
      <el-table-column prop="UpdateName" label="更新人" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" width="400" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleView(scope.$index, scope.row)">查看详情</el-button>
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="queryCondition.pageNum" background layout="total, prev, pager, next, jumper" :total="ResultTotal">
      </el-pagination>
    </div>

    <!-- 3、详情 -->
    <el-drawer class="order-details" :direction="direction" :title="currentBuildingInfo.ProjectName" :visible.sync="dialogVisible">
      <div class="order-info" :style="{height:scrollerHeight}" v-loading="loadingDetails">
        <div class="list">
          <div class="list-title">楼宇名称</div>
          <div class="list-content">{{currentBuildingInfo.ProjectName}}</div>
        </div>
        <div class="list">
          <div class="list-title">类型</div>
          <div class="list-content" v-if="currentBuildingInfo.OrderType =='GR'">住宅</div>
          <div class="list-content" v-else-if="currentBuildingInfo.OrderType =='QY'">企业</div>
          <div class="list-content" v-else>其他</div>
        </div>
        <div class="list">
          <div class="list-title">负责人</div>
          <div class="list-content">{{currentBuildingInfo.Director}}</div>
        </div>
        <div class="list">
          <div class="list-title">联系电话</div>
          <div class="list-content">{{currentBuildingInfo.CellPhone}}</div>
        </div>
        <div class="desc">
          <div class="title">地址</div>
          <div class="content">{{currentBuildingInfo.Address}}</div>
        </div>
        <!-- 产品 -->
        <div class="list">
          <div class="list-title">产品列表</div>
          <div class="list-content" v-if="!currentBuildingProducts || currentBuildingProducts.length == 0">--</div>
        </div>
        <div class="list" :class="(index + 1) == currentBuildingProducts.length?'border-bottom':''" v-for="(item, index) in currentBuildingProducts" :key="index">
          <div class="list-title">产品{{index + 1}}</div>
          <div class="list-content">{{item.ProductName}}</div>
        </div>
        <!-- 服务费 -->
        <template v-if="currentBuildingServices && currentBuildingServices.length > 0">
          <div class="list">
            <div class="list-title">服务费明细</div>
            <div class="list-content bg-green">¥{{totalServiceFee}}</div>
          </div>
        </template>
        <template v-if="currentBuildingServices && currentBuildingServices.length > 0">
          <div class="list" :class="(index + 1) == currentBuildingServices.length?'border-bottom':''" v-for="(item, index) in currentBuildingServices" :key="index">
            <div class="list-content">{{item.ServiceName}}</div>
            <div class="list-title">¥{{item.ServiceFee}}</div>
          </div>
        </template>
        <div class="desc">
          <div class="title">备注</div>
          <div class="content">{{currentBuildingInfo.Remark || '--'}}</div>
        </div>
        <div class="list">
          <div class="list-title">更新人</div>
          <div class="list-content">{{currentBuildingInfo.UpdateName}}</div>
        </div>
        <div class="list border-none">
          <div class="list-title">更新时间</div>
          <div class="list-content">{{currentBuildingInfo.UpdateTime}}</div>
        </div>
      </div>
    </el-drawer>

    <!-- 绑定产品弹窗 -->
    <el-dialog :close-on-click-modal="false" title="绑定产品" :visible.sync="isShowProductModal" width="50%">
      <el-table :header-cell-style="$config.headerCellStyle" border ref="multipleTable" :data="productList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column property="ProductName" label="产品名称" align="center"></el-table-column>
        <el-table-column property="OrderType" label="业务分类" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.OrderType == 'GR'">住宅</span>
            <span v-else-if="scope.row.OrderType == 'QY'">企业</span>
            <span v-else>其他</span>
          </template>
        </el-table-column>
        <el-table-column property="ProductDeadline" label="付费周期（月）" align="center"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowProductModal = false">取 消</el-button>
        <el-button type="primary" @click="toBindProduct">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
export default {
  name: "buildingInformation",
  created() {
    let tempTypeOptions = JSON.parse(localStorage.getItem("typeOptions"));
    this.typeOptions = this.typeOptions.concat(tempTypeOptions);

    /**
     * 利用缓存的typeOptions，来避免接口的反复调用;
     * this.getTypeOptions(); 加载分类配置列表
     */

    // this.getTypeOptions();
    this.getProductList(); //加载产品列表
    this.getBuildingList(); //加载楼宇列表
  },
  data() {
    return {
      viewportH: 0,
      /**
       * 绑定产品部分
       */
      isShowProductModal: false,
      productList: [],
      loading: true,
      productListParameter: {
        productflag: "All",
        productsel: "", //搜索条件
        ordertype: "",
        payment: 0,
        pageNum: 1,
        pageSize: 10000
      },
      multipleSelection: [],

      /**
       * 楼宇部分
       */
      ResultTotal: 0, //数据总量
      dialogVisible: false,
      selecttype: "全部",
      queryCondition: {
        projectflag: "All",
        projectsel: "", //搜索条件
        ordertype: "",
        pageNum: 1,
        pageSize: 10
      },
      buildingList: [],
      currentBuildingInfo: {}, //弹窗展示的行数据
      currentBuildingProducts: [],
      currentBuildingServices: [],
      delBuildingInfo: {
        projectid: null,
        projectflag: "Del"
      },
      typeOptions: [{ OrderCode: "", OrderNotes: "全部" }], //分类配置列表
      bindProductParameter: {
        flag: "Man",
        projectid: null,
        reqdata: ""
      },
      /**
       * 楼宇详情
       */
      loadingDetails:false,
      buildingDetailsParameter: {
        projectflag: "Detail",
        projectid: null
      },
      direction: "rtl"
    };
  },

  methods: {
    // 楼宇详情
    async getBuildingDetails() {
      this.loadingDetails = true;
      let res = await this.$Http.buildingDetails(
        this.buildingDetailsParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.currentBuildingInfo = res.ResultSet;
        this.currentBuildingProducts = this.currentBuildingInfo.Products; //产品
        this.currentBuildingServices = this.currentBuildingInfo.Services; //服务费
        this.dialogVisible = true;
        this.loadingDetails = false;
      } else {
        this.$message.error("数据加载失败");
      }
    },
    // 产品列表
    async getProductList() {
      let res = await this.$Http.getProductList(
        this.productListParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.productList = res.ResultSet;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    handleCurrentChange(currentPage) {
      this.queryCondition.pageNum = currentPage;
      this.getBuildingList();
    },
    // 业务分类列表
    async getTypeOptions() {
      let res = await this.$Http.newOrderType(
        {
          flag: "New"
        },
        true
      );
      if (res.ResultFlag == "0") {
        this.typeOptions = this.typeOptions.concat(res.ResultSet);
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 加载楼宇列表
    async getBuildingList() {
      this.loading = true;
      let res = await this.$Http.buildingList(this.queryCondition, true);
      if (res.ResultFlag == "0") {
        this.buildingList = res.ResultSet;
        this.ResultTotal = res.ResultTotal;
        this.loading = false;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 选择分类
    chooseType(type) {
      if (type == "全部") {
        this.queryCondition.ordertype = "";
      } else {
        this.queryCondition.ordertype = type;
        this.typeOptions.forEach((item, ind) => {
          if (type == item.OrderNotes) {
            this.queryCondition.ordertype = this.typeOptions[ind].OrderCode;
            this.selecttype = this.typeOptions[ind].OrderNotes;
          }
        });
      }
      this.queryCondition.pageNum = 1;
      this.getBuildingList();
    },

    // 编辑
    handleEdit(index, row) {
      this.$router.push({
        path: "/buildingInfo",
        query: {
          ID: row.ID
        }
      });
    },

    // 查看详情
    handleView(index, row) {
      this.buildingDetailsParameter.projectid = row.ID;
      this.getBuildingDetails();
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    handleBind(index, row) {
      this.isShowProductModal = true;
      this.bindProductParameter.projectid = row.ID;
    },

    // 绑定产品
    async toBindProduct() {
      let reqdata = [];
      if (this.multipleSelection.length > 0) {
        this.multipleSelection.forEach(item => {
          reqdata.push({
            ID: 0,
            ProductId: item.ID,
            ProjectId: this.bindProductParameter.projectid
          });
        });
        this.bindProductParameter.reqdata = JSON.stringify(reqdata);
        let res = await this.$Http.bindProduct(this.bindProductParameter, true);
        if (res.ResultFlag == "0") {
          this.$message.success("绑定成功");
          this.isShowProductModal = false;
        } else {
          this.$message.error("绑定失败");
        }
      } else {
        this.$message.warning("请选择产品");
      }
    },

    // 新增
    addBuilding() {
      this.$router.push({
        path: "/buildingInfo",
        query: {
          ID: 0
        }
      });
    },

    // 删除楼宇信息
    async deleteBuilding() {
      let res = await this.$Http.delBuilding(this.delBuildingInfo, true);
      if (res.ResultFlag == "0") {
        this.$message.success("删除成功");
        this.getBuildingList();
      } else {
        this.$message.error("删除失败");
      }
    },

    // 处理删除按钮事件
    handleDelete(index, row) {
      let _this = this;
      _this.delBuildingInfo.projectid = row.ID;
      _this
        .$confirm("此操作将永久删除该楼宇, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.deleteBuilding();
        })
        .catch(() => {
          _this.delBuildingInfo.projectid = null;
        });
    }
  },
  computed: {
    scrollerHeight() {
      this.viewportH =
        window.innerHeight || document.documentElement.clientHeight;
      return this.viewportH - 77 + "px";
    },
    totalServiceFee() {
      let total = 0;
      if (
        this.currentBuildingServices &&
        this.currentBuildingServices.length > 0
      ) {
        this.currentBuildingServices.forEach(item => {
          total += item.ServiceFee;
        });
      }
      return total;
    }
  }
};
</script>
<style lang="scss">
@import "../style/productList";
@import "../style/buildingInformation";
</style>