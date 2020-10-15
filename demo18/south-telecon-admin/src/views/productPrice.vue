  <template>
  <div class="productPrice">
    <div class="search-part">
      <el-radio-group v-model="category" size="small" @change="changeSelect">
        <el-radio-button :label="item.label" v-for="(item, index) in priceOptions" :key="index"></el-radio-button>
      </el-radio-group>
      <el-input clearable size="small" @keyup.enter.native="getProductPriceList" class="search-input" placeholder="请输入产品名称" v-model="productPriceListParameter.productname">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
       <el-button class="search-btn" size="small" @click="getProductPriceList">搜索</el-button>
      <el-button class="add-btn" type="success" size="small" icon="el-icon-circle-plus-outline" @click="handleAddProduct">新增产品价格
      </el-button>
    </div>
    <!-- 表格数据 -->
    <el-table v-loading="loading" :data="productPriceList" style="width: 100%" :header-cell-style="$config.headerCellStyle" border>
      <el-table-column prop="ProductName" label="产品名称" align="center"></el-table-column>
      <el-table-column prop="Price" label="价格" align="center"></el-table-column>
      <el-table-column prop="UsingPointUpper" label="积分使用上限" align="center"></el-table-column>
      <el-table-column prop="StartDate" label="开始日期" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.StartDate || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="Remark" label="备注" align="center">
        <template slot-scope="scope">
          <span v-if="!scope.row.Remark">--</span>
          <span v-else>{{scope.row.Remark | brieflyShow}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination :current-page.sync="productPriceListParameter.pageNum" @current-change="handleCurrentChange" background layout="total, prev, pager, next, jumper" :total="ResultTotal">
      </el-pagination>
    </div>

    <!-- 新增/编辑产品价格 -->
    <el-dialog :close-on-click-modal="false" class="add-modal" :title="isNewAdd?'新增产品价格':'编辑产品价格'" :visible.sync="dialogVisible" width="650px">
      <div class="details-container">
        <div class="details-item">
          <div class="left">产品选择 :</div>
          <el-select class="right w-50" :disabled="!isNewAdd" v-model="selectProductName" filterable placeholder="请选择" @change="handleChange">
            <el-option v-for="item in productList" :key="item.value" :label="item.ProductName" :value="item.ID">
            </el-option>
          </el-select>
        </div>
        <div class="details-item">
          <div class="left">开始日期 :</div>
          <el-date-picker class="right w-50" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="currentProductPriceInfo.StartDate" type="date" placeholder="选择日期">
          </el-date-picker>
        </div>
        <div class="details-item">
          <div class="left">产品价格 :</div>
          <el-input-number class="right width-200" v-model="currentProductPriceInfo.Price" controls-position="right" :min="0">
          </el-input-number>
          <span class="unit">元</span>
        </div>

        <div class="details-item">
          <div class="left">使用积分上限 :</div>
          <el-input-number class="right width-200" v-model="currentProductPriceInfo.UsingPointUpper" controls-position="right" :min="0">
          </el-input-number>
          <span class="unit">积分</span>
        </div>
        <div class="details-item">
          <div class="left">备注 :</div>
          <el-input class="right w-75" v-model="currentProductPriceInfo.Remark" placeholder="请输入备注"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProductPrice">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "ProductPrice",
  created() {
    this.getProductPriceList(); //产品价格列表
    this.getProductList(); //产品列表
  },
  data() {
    return {
      isNewAdd: true,
      dialogVisible: false, //弹窗显隐控制
      productPriceList: [], //产品价格列表
      selectProductName: "", //选择的产品名称
      /**
       * 产品列表部分
       */
      loading: true,
      productList: [], //产品列表
      productListParameter: {
        productflag: "All",
        ordertype: "",
        productsel: "", //搜索条件
        pageNum: 1,
        pageSize: 100000,
        payment: 0
      },
      /**
       * 产品价格部分
       */
      category: "全部",
      priceOptions: [
        { label: "全部", value: "False" },
        { label: "现行价格", value: "True" }
      ],
      ResultTotal: 0,
      productPriceListParameter: {
        productsflag: "All",
        productname:"",
        pageNum: 1,
        pageSize: 10,
        goingprice: "False"
      },
      delProductPriceParameter: {
        productsflag: "Del",
        productsid: null
      },
      // 模拟参数（接口未提供）
      productPriceDetailsParameter: {
        productsflag: "Detail",
        productsid: null
      },
      currentProductPriceInfo: {
        ID: 0,
        ProductId: 0, //新增为0
        StartDate: "",
        Price: 0,
        Remark: "",
        UsingPointUpper: 0,
        CreateID: Number(localStorage.getItem("CreateID"))
      }
    };
  },
  methods: {
    // 切换价格筛选条件
    changeSelect(price) {
      this.category = price;
      this.priceOptions.forEach(item => {
        if (item.label == price) {
          this.productPriceListParameter.goingprice = item.value;
        }
      });
      this.productPriceListParameter.pageNum = 1;
      this.getProductPriceList();
    },

    // 获取产品价格列表
    async getProductPriceList() {
      this.loading = true;
      let res = await this.$Http.productPriceList(
        this.productPriceListParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.productPriceList = res.ResultSet;
        this.ResultTotal = res.ResultTotal;
        this.loading = false;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 加载产品列表
    async getProductList() {
      let res = await this.$Http.getProductList(
        this.productListParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.productList = res.ResultSet;
      }
    },

    handleCurrentChange(currentPage) {
      this.productPriceListParameter.pageNum = currentPage;
      this.getProductPriceList();
    },

    // 编辑产品价格
    handleEdit(index, row) {
      this.isNewAdd = false;
      this.productPriceDetailsParameter.productsid = row.ID;
      if (!this.productPriceDetailsParameter.productsid) {
        this.$message.warning("请通过新增设置产品价格");
        // 注意：当前的逻辑是，没有设置产品价格，不可以进行编辑与删除，需要设置产品价格后，方可编辑与删除；
      } else {
        this.dialogVisible = true;
        this.getProductPriceDetails();
      }
    },

    // 产品价格详情
    async getProductPriceDetails() {
      let res = await this.$Http.productPriceDetails(
        this.productPriceDetailsParameter,
        true
      );
      if (res.ResultFlag == "0") {
        let currentProductPriceInfo = res.ResultSet;
        this.currentProductPriceInfo.ID = currentProductPriceInfo.ID;
        this.currentProductPriceInfo.ProductId =
          currentProductPriceInfo.ProductId;
        this.currentProductPriceInfo.StartDate =
          currentProductPriceInfo.StartDate;
        this.currentProductPriceInfo.Price = currentProductPriceInfo.Price;
        this.currentProductPriceInfo.Remark = currentProductPriceInfo.Remark;
        this.currentProductPriceInfo.UsingPointUpper =
          currentProductPriceInfo.UsingPointUpper;
        this.currentProductPriceInfo.CreateID =
          currentProductPriceInfo.CreateID;
        this.selectProductName =
          currentProductPriceInfo.ProductModel.ProductName;
      }
    },
    // 删除楼宇弹窗
    handleDelete(index, row) {
      let _this = this;
      _this.delProductPriceParameter.productsid = row.ID;
      if (!_this.delProductPriceParameter.productsid) {
        this.$message.warning("请通过新增设置产品价格");
        return;
      }
      _this
        .$confirm("此操作将永久删除该产品价格, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.deleteProductPrice();
        })
        .catch(() => {});
    },

    // 删除产品价格
    async deleteProductPrice() {
      let res = await this.$Http.delProductPrice(
        this.delProductPriceParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.$message.success("删除成功");
        this.getProductPriceList();
      } else {
        this.$message.error("删除失败");
      }
    },

    // 选择地址
    handleChange(val) {
      this.currentProductPriceInfo.ProductId = val;
    },

    // 新增产品
    handleAddProduct() {
      this.isNewAdd = true;
      this.dialogVisible = true;
      this.currentProductPriceInfo.ID = 0;
      this.currentProductPriceInfo.StartDate = "";
      this.currentProductPriceInfo.Price = 0;
      this.currentProductPriceInfo.Remark = "";
      this.currentProductPriceInfo.ProductId = 0;
      this.currentProductPriceInfo.UsingPointUpper = 0;
      this.selectProductName = "";
    },

    // 新增产品价格
    async addProductPrice() {
      if (!this.currentProductPriceInfo.ProductId) {
        this.$message.warning("请选择产品");
      } else if (!this.currentProductPriceInfo.StartDate) {
        this.$message.warning("请选择开始日期");
      } else if (!this.currentProductPriceInfo.Price) {
        this.$message.warning("请填写价格");
      } else if (
        this.currentProductPriceInfo.Price <=
        this.currentProductPriceInfo.UsingPointUpper
      ) {
        this.$message.warning("使用积分上限不得超过产品价格");
      } else {
        let res = await this.$Http.newProductPrice(
          {
            productsflag: "Man",
            reqdata: JSON.stringify(this.currentProductPriceInfo)
          },
          true
        );
        if (res.ResultFlag == "0") {
          this.$message.success("添加成功");
          this.dialogVisible = false;
          this.getProductPriceList();
        } else {
          this.$message.error(res.ResultSet);
        }
      }
    }
  },
  filters: {
    brieflyShow(str) {
      if (str.length > 10) {
        return str.substr(0, 10) + "...";
      } else {
        return str;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/productPrice";
</style>