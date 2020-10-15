<template>
  <div class="box">
    <div class="search-part">
      <el-input clearable size="small" class="search-input" placeholder="请输入名称" v-model="queryCondition.productsel">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button class="search-btn" size="small" @click="getProductList">搜索</el-button>
      <el-button class="add-btn" type="success" size="small" icon="el-icon-circle-plus-outline" @click="addProduct">新增产品
      </el-button>
    </div>
    <!-- 表格数据 -->
    <el-table v-loading="loading" :data="productList" style="width: 100%" :header-cell-style="$config.headerCellStyle"
      border>
      <el-table-column prop="ProductName" label="产品名称" align="center"></el-table-column>
      <el-table-column prop="OrderType" label="业务分类" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.OrderType == 'GR'">住宅</span>
          <span v-else-if="scope.row.OrderType == 'QY'">企业</span>
          <span v-else>其他</span>
        </template>
      </el-table-column>
      <el-table-column prop="ProductDeadline" label="付费周期（月）" align="center"></el-table-column>
      <el-table-column prop="CreateID" label="更新人" align="center"></el-table-column>
      <el-table-column prop="UpdateTime" label="最后更新时间" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" width="300" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleView(scope.$index, scope.row)">查看详情</el-button>
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination :current-page.sync="queryCondition.pageNum" @current-change="handleCurrentChange" background
        layout="total, prev, pager, next, jumper" :total="ResultTotal">
      </el-pagination>
    </div>

    <!-- 查看详情弹窗 -->
    <el-dialog :close-on-click-modal="false" class="details-modal" title="产品详情" :visible.sync="dialogVisible" width="50%">
      <div class="details-container">
        <div class="details-item">
          <div class="left">产品名称 :</div>
          <div class="right">{{currentProductInfo.ProductName}}</div>
        </div>
        <div class="details-item">
          <div class="left">产品描述 :</div>
          <div class="right">{{currentProductInfo.ProductContent}}</div>
        </div>
        <div class="details-item">
          <div class="left">产品类型 :</div>
          <div class="right" v-if="currentProductInfo.OrderType == 'GR'">住宅</div>
          <div class="right" v-else-if="currentProductInfo.OrderType == 'QY'">企业</div>
          <div class="right" v-else>其他</div>
        </div>
        <div class="details-item">
          <div class="left">更新人 :</div>
          <div class="right">{{currentProductInfo.CreateID}}</div>
        </div>
        <div class="details-item">
          <div class="left">付费周期（月） :</div>
          <div class="right">{{currentProductInfo.ProductDeadline}}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增产品 -->
  </div>
</template>

<script>
export default {
  name: "productList",
  created() {
    this.open();
    this.CreateID = localStorage.getItem("CreateID");
    this.getProductList();
  },
  data() {
    return {
      ResultTotal: 0, //数据总量
      CreateID: 0,
      queryCondition: {
        productflag: "All",
        productsel: "", //搜索条件
        pageNum: 1,
        pageSize: 10
      },
      dialogVisible: false, //弹窗显隐控制
      currentProductInfo: {}, //弹窗展示的行数据
      loading: true, //数据加载标识
      productList: [], //表格数据
      delProductInfo: {
        productflag: "Del",
        productid: null
      }
    };
  },
  methods: {
    open() {
      this.$alert("静态页面，功能开发中，敬请期待……", "温馨提示", {
        confirmButtonText: "确定",
        callback: action => {
          this.$message({
            type: "success",
            message: `谢谢浏览`
          });
        }
      });
    },
    // 加载数据
    async getProductList() {
      let res = await this.$Http.getProductList(this.queryCondition, true);
      if (res.ResultFlag == "0") {
        this.productList = res.ResultSet;
        this.ResultTotal = res.ResultTotal;
        this.loading = false;
      }
    },

    // 查看详情
    handleView(index, row) {
      this.dialogVisible = true;
      this.currentProductInfo = row;
    },

    // 编辑信息
    handleEdit(index, row) {
      this.$router.push({
        path: "/modifyProductInfo",
        query: {
          ID: row.ID
        }
      });
    },

    // 删除产品弹窗
    handleDelete(index, row) {
      let _this = this;
      _this.delProductInfo.productid = row.ID;
      _this
        .$confirm("此操作将永久删除该产品, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.deleteProduct();
        })
        .catch(() => {
          _this.delProductInfo.productid = null;
        });
    },

    // 删除产品
    async deleteProduct() {
      let res = await this.$Http.delProduct(this.delProductInfo, true);
      if (res.ResultFlag == "0") {
        this.$message.success("删除成功");
        this.getProductList();
      }else{
        this.$message.error('删除失败')
      }
    },

    handleCurrentChange(currentPage) {
      this.queryCondition.pageNum = currentPage;
      this.getProductList();
    },
    // 新增产品
    addProduct() {
      this.$router.push({
        path: "/modifyProductInfo",
        query: {
          ID: 0
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/productList";
</style>
