<template>
  <div class="box">
    <!-- 1、筛选部分 -->
    <div class="search-part">
      <el-input clearable size="small" @keyup.enter.native="getProductList" class="search-input" placeholder="请输入产品名称" v-model="productListParameter.productsel">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-radio-group v-model="currentClass" size="small" @change="changeType">
        <el-radio-button :label="item.OrderNotes" v-for="(item, index) in typeOptions" :key="index"></el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="category" size="small" @change="changeSelect">
        <el-radio-button :label="item.label" v-for="(item, index) in priceOptions" :key="index"></el-radio-button>
      </el-radio-group>
      <el-button class="search-btn" size="small" @click="getProductList">搜索</el-button>
      <el-button class="add-btn" type="success" size="small" icon="el-icon-circle-plus-outline" @click="addProduct">新增产品
      </el-button>
    </div>
    <!-- 2、表格数据 -->
    <el-table v-loading="loading" :data="productList" style="width: 100%" :header-cell-style="$config.headerCellStyle" border>
      <el-table-column prop="ProductName" label="产品名称" align="center"></el-table-column>
      <el-table-column prop="OrderType" label="业务分类" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.OrderType == 'GR'">住宅</span>
          <span v-else-if="scope.row.OrderType == 'QY'">企业</span>
          <span v-else>其他</span>
        </template>
      </el-table-column>
      <el-table-column prop="MenuType" label="运营商" align="center"></el-table-column>
      <el-table-column prop="ProductDeadline" label="付费周期（月）" align="center"></el-table-column>
      <el-table-column prop="UpdateName" label="更新人" align="center"></el-table-column>
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
      <el-pagination :current-page.sync="productListParameter.pageNum" @current-change="handleCurrentChange" background layout="total, prev, pager, next, jumper" :total="ResultTotal">
      </el-pagination>
    </div>

    <!-- 用户详情弹窗 -->
    <el-drawer class="order-details" :direction="direction" :title="currentProductInfo.ProductName" :visible.sync="dialogVisible">
      <div class="order-info" :style="{height:scrollerHeight}">
        <!-- 1、套餐信息 -->
        <div class="product-desc">
          <img class="product-img" :src="currentProductInfo.ProductBase" :alt="currentProductInfo.ProductName">
          <span class="product-name">{{currentProductInfo.ProductName}}</span>
        </div>
        <div class="product-content" v-html="currentProductInfo.ProductContent"></div>
        <div class="list">
          <div class="list-title">产品类型</div>
          <div class="list-content" v-if="currentProductInfo.OrderType == 'GR'">住宅</div>
          <div class="list-content" v-else-if="currentProductInfo.OrderType == 'QY'">企业</div>
          <div class="list-content" v-else>其他</div>
        </div>
        <div class="list">
          <div class="list-title">运营商</div>
          <div class="list-content">{{currentProductInfo.MenuType}}</div>
        </div>
        <div class="list">
          <div class="list-title">付费周期（月）</div>
          <div class="list-content">{{currentProductInfo.ProductDeadline}}</div>
        </div>
        <div class="list" v-if="currentProductInfo.OffPrice">
          <div class="list-title">优惠</div>
          <div class="list-content green">-¥ {{currentProductInfo.OffPrice}}</div>
        </div>
        <!-- 4、服务费部分 -->
        <template v-if="ServiceList && ServiceList.length>0">
          <div class="list" v-for="(item, index) in ServiceList" :key="index">
            <div class="list-title">{{item.ServiceName}}</div>
            <div class="list-content">¥ {{item.ServiceFee}}</div>
          </div>
        </template>
        <!-- <div class="list" v-if="ServiceList && ServiceList.length>0">
          <div class="list-title">服务费总计</div>
          <div class="list-content">¥ {{TServiceChange}}</div>
        </div> -->
        <!-- 5、合计费用 -->
        <div class="list">
          <div class="list-title">价格</div>
          <div class="list-content">¥ {{currentProductInfo.Price}}</div>
        </div>
        <div class="service-list">
          <div class="list-title bold">合计</div>
          <div class="price">¥ {{totalPrice}}</div>
        </div>
        <div class="list">
          <div class="list-title">更新人</div>
          <div class="list-content">{{currentProductInfo.UpdateName}}</div>
        </div>
        <div class="list">
          <div class="list-title">更新日期</div>
          <div class="list-content">{{currentProductInfo.UpdateTime}}</div>
        </div>
        <div class="remark">
          <div class="list-title">备注</div>
          <div class="list-content" v-if="!currentProductInfo.Remark">--</div>
          <div class="list-content" v-else v-html="currentProductInfo.Remark"></div>
        </div>
      </div>
    </el-drawer>

  </div>
</template>

<script>
export default {
  name: "productList",
  created() {
    this.getTypeOptions();
    this.CreateID = Number(localStorage.getItem("CreateID"));
    this.getProductList();
  },
  data() {
    return {
      viewportH: 0,
      /**
       * 类型列表配置
       */
      currentClass: "全部",
      typeOptions: [{ OrderCode: "", OrderNotes: "全部" }],
      typeOptionsParameter: {
        flag: "New"
      },
      CreateID: 0,
      /**
       * 产品列表部分
       */

      category: "全部",
      priceOptions: [
        { label: "全部", value: 0 },
        { label: "<=12月", value: 12 },
        { label: "24月", value: 24 },
        { label: ">=36月", value: 36 }
      ],
      /**
       * 产品列表部分
       */

      productList: [], //表格数据
      ResultTotal: 0, //数据总量
      productListParameter: {
        productflag: "All",
        productsel: "",
        ordertype: "",
        payment: 0,
        pageNum: 1,
        pageSize: 10
      },
      dialogVisible: false, //弹窗显隐控制
      direction: "rtl",
      currentProductInfo: {}, //弹窗展示的行数据
      ServiceList: [],
      loading: true, //数据加载标识
      /**
       * 删除部分
       */
      delProductInfo: {
        productflag: "Del",
        productid: null
      },
      /**
       * 详情部分
       */
      productDetailsParameter: {
        productflag: "Detail",
        productid: null
      }
    };
  },
  methods: {
    // 业务分类列表
    async getTypeOptions() {
      let res = await this.$Http.newOrderType(this.typeOptionsParameter, true);
      if (res.ResultFlag == "0") {
        // 对分类配置列表设置缓存，可以提升至app.vue组件中进行
        localStorage.setItem("typeOptions", JSON.stringify(res.ResultSet));
        this.typeOptions.push(...res.ResultSet); //用户筛选列表
        this.getProductList();
      }
    },

    // 业务分类切换选择
    changeType(type) {
      this.currentClass = type;
      this.typeOptions.forEach(item => {
        if (item.OrderNotes == type) {
          this.productListParameter.ordertype = item.OrderCode;
        }
      });
      this.productListParameter.pageNum = 1;
      this.getProductList();
    },

    // 切换价格筛选条件
    changeSelect(price) {
      this.category = price;
      this.priceOptions.forEach(item => {
        if (item.label == price) {
          this.productListParameter.payment = item.value;
        }
      });
      this.productListParameter.pageNum = 1;
      this.getProductList();
    },

    // 产品列表
    async getProductList() {
      this.loading = true;
      let res = await this.$Http.getProductList(
        this.productListParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.productList = res.ResultSet;
        this.ResultTotal = res.ResultTotal;
        this.loading = false;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 产品详情
    async getProductDetails() {
      let res = await this.$Http.viewProductDetails(
        this.productDetailsParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.currentProductInfo = res.ResultSet;
        this.ServiceList = this.currentProductInfo.ServiceList;
        let contentStr = this.currentProductInfo.ProductContent.replace(
          /↵/g,
          "<br/>"
        );
        let remarkStr = this.currentProductInfo.Remark.replace(/↵/g, "<br/>");
        this.currentProductInfo.ProductContent = contentStr;
        this.currentProductInfo.Remark = remarkStr;
        this.dialogVisible = true;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 查看详情
    handleView(index, row) {
      this.productDetailsParameter.productid = row.ID;
      this.getProductDetails();
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
      } else {
        this.$message.error("删除失败");
      }
    },

    // 分页
    handleCurrentChange(currentPage) {
      this.productListParameter.pageNum = currentPage;
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
  },
  computed: {
    totalPrice() {
      let totalPrice =
        this.currentProductInfo.Price - this.currentProductInfo.OffPrice;
      if (this.ServiceList && this.ServiceList.length > 0) {
        this.ServiceList.forEach(element => {
          totalPrice += element.ServiceFee;
        });
      }
      return totalPrice;
    },
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
@import "../style/productListDrawer";
</style>
