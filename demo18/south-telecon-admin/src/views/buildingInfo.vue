<template >
  <div class="building-price">
    <div class="info-container">
      <div class="info-list">
        <div class="left">楼宇名称</div>
        <div class="right">
          <el-input clearable class="right-input" size="small" v-model="buildingInfo.ProjectName" placeholder="请输入楼宇名称">
          </el-input>
        </div>
      </div>

      <div class="info-list">
        <div class="left">业务分类</div>
        <div class="right">
          <el-select size="small" class="right-input" v-model="buildingInfo.OrderType" placeholder="请选择业务分类" @change="typeChange">
            <el-option v-for="item in typeOptions" :key="item.OrderCode" :label="item.OrderNotes" :value="item.OrderCode">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="info-list">
        <div class="left">负责人</div>
        <div class="right">
          <el-input clearable class="right-input" size="small" v-model="buildingInfo.Director " placeholder="请输入负责人姓名">
          </el-input>
        </div>
      </div>
      <div class="info-list">
        <div class="left">联系电话</div>
        <div class="right">
          <el-input clearable class="right-input" size="small" type="number" :maxlength="settingMaxlength" v-model="buildingInfo.CellPhone" placeholder="请输入联系电话">
          </el-input>
        </div>
      </div>
      <div class="info-list">
        <div class="left">地址</div>
        <div class="right">
          <el-input clearable class="right-input address" size="small" v-model="buildingInfo.Address" placeholder="请输入楼宇地址">
          </el-input>
        </div>
      </div>
      <div class="info-list p-0">
        <div class="left">备注</div>
        <div class="right border">
          <el-input clearable class="right-input textarea" size="small" type="textarea" :rows="4" v-model="buildingInfo.Remark" placeholder="请输入相关备注"></el-input>
        </div>
      </div>

      <!-- 服务费部分 -->
      <!-- <div class="info-list">
        <div class="left">服务费</div>
        <div class="right">
          <el-table empty-text="请选择业务分类" border :row-class-name="row-style" :data="oldServices" style="width: 100%"
            height="300">
            <el-table-column prop="ServiceName" label="费用名称" align="center"></el-table-column>
            <el-table-column prop="ServiceFee" label="费用金额(元)" align="center">
              <template slot-scope="scope">
                <el-input-number size="mini" v-model="scope.row.ServiceFee" controls-position="right" :min="0">
                </el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-button style="margin-left: 15px;" class="add-btn" size="mini" type="primary" plain icon="el-icon-plus"
          @click="dealClickServiceBtn">
          添加服务费</el-button>

      </div> -->

      <!-- 产品部分 -->
      <div class="info-list">
        <div class="left">产品选择</div>
        <div class="right">
          <el-table border :row-class-name="row-style" :data="oldProducts" style="width: 100%" height="300">
			<el-table-column type="index" width="50" align="center"></el-table-column>
            <el-table-column prop="ProductName" label="产品名称" align="center"></el-table-column>
          </el-table>
        </div>
        <el-button style="margin-left: 15px;" class="add-btn" size="mini" type="primary" plain icon="el-icon-plus" @click="dealClickProductBtn">
          添加产品</el-button>
      </div>

      <!-- 按钮部分 -->
      <div class="info-list">
        <div class="left"></div>
        <div class="right">
          <el-button size="small" type="primary" class="save-btn" @click="save">保存</el-button>
          <el-button size="small" type="primary" plain class="back-btn" @click="back">返回</el-button>
        </div>
      </div>
    </div>

    <!-- 服务费弹窗 -->
    <el-dialog :close-on-click-modal="false" class="discount-modal" title="添加服务费" :visible.sync="isAddServiceFee">
      <div class="add-product-container">
        <el-table border ref="multipleTable" class="product-table" height="300" :data="serviceFeeList" style="width: 100%" @selection-change="selectionChangeServiceFee">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="ServiceName" label="服务费名称" align="center"></el-table-column>
          <el-table-column prop="ServiceFeeValue" label="服务费金额(元)" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 产品弹窗 -->
    <el-dialog :close-on-click-modal="false" class="discount-modal" :destroy-on-close="true" title="添加产品" :visible.sync="isAddProductList">
      <div class="add-product-container">
        <el-table border ref="multipleTable2" class="product-table" height="300" :data="productList" style="width: 100%" @selection-change="selectionChangeProduct">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="ProductName" label="产品名称" align="center"></el-table-column>
          <el-table-column prop="ProductDeadline" label="付费周期（月）" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>

  </div>
</template>
<script>
export default {
  name: "buildingInfo",
  created() {
    this.getTypeOptions(); //加载分类配置列表
    this.ID = Number(this.$route.query.ID);
    this.buildingDetailsParameter.projectid = Number(this.$route.query.ID);
    this.buildingInfo.ID = Number(this.$route.query.ID);
    if (this.ID) {
      this.getBuildingDetails(); //楼宇详情
    }
  },
  data() {
    return {
      settingMaxlength: 11,
      /**
       * 产品列表部分
       */

      multipleSelectionProduct: [],
      productList: [], //表格数据
      ResultTotal: 0, //数据总量
      productListParameter: {
        productflag: "All",
        productsel: "", //搜索条件
        ordertype: "",
        payment: 0,
        pageNum: 1,
        pageSize: 10000
      },
      /**
       * 楼宇详情部分
       */
      buildingDetailsParameter: {
        projectflag: "Detail",
        projectid: null
      },
      /**
       * 根据分类获取服务费列表
       */
      multipleSelectionServiceFee: [],
      serviceFeeByTypeParameter: {
        feeflag: "All",
        ordertype: "",
        pageNum: 1,
        pageSize: 10000
      },

      /**
       * 楼宇详情部分
       */
      ID: 0,
      oldProducts: [],
      oldServices: [],
      buildingInfo: {
        ID: 0,
        GPS: "",
        ProjectName: "",
        Address: "",
        OrderType: "",
        Director: "",
        CellPhone: "",
        Remark: "",
        CreateID: localStorage.getItem("CreateID")
      },
      typeOptions: [], //分类配置列表

      /**
       * 弹窗部分
       */
      isAddServiceFee: false,
      isAddProductList: false
    };
  },
  methods: {
    // 产品列表
    async getProductList() {
      this.productListParameter.ordertype = this.buildingInfo.OrderType;
      let res = await this.$Http.getProductList(
        this.productListParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.productList = res.ResultSet;
        let arr = [];
        if (this.oldProducts && this.oldProducts.length > 0) {
          this.oldProducts.forEach(item => {
            this.productList.forEach(unit => {
              if (item.ProductId == unit.ID) {
                arr.push(unit);
              }
            });
          });
          this.$nextTick(() => {
            this.toggleSelection2(arr);
          });
        }
      }
    },

    // 点击添加服务费按钮
    dealClickServiceBtn() {
      this.isAddServiceFee = true;
      this.getServiceFeeByType();
    },

    // 点击添加产品按钮
    dealClickProductBtn() {
      if (!this.buildingInfo.OrderType) {
        this.$message.warning("请选择业务分类");
      } else {
        this.isAddProductList = true;
        this.getProductList();
      }
    },

    // 楼宇详情
    async getBuildingDetails() {
      let res = await this.$Http.buildingDetails(
        this.buildingDetailsParameter,
        true
      );

      if (res.ResultFlag == "0") {
        this.buildingInfo = res.ResultSet;
        this.serviceFeeByTypeParameter.ordertype = this.buildingInfo.OrderType;
        // 已添加服务费梳理
        let tempServices = this.buildingInfo.Services;
        tempServices.forEach(item => {
          this.oldServices.push({
            ServiceId: item.ServiceId,
            OrderType: item.OrderType,
            ServiceFee: item.ServiceFee,
            ServiceName: item.ServiceName
          });
        });
        // 已添加产品梳理
        let tempProducts = this.buildingInfo.Products;
        tempProducts.forEach(item => {
          this.oldProducts.push({
            ProductId: item.ProductId,
            ProductName: item.ProductName
          });
        });
      }
    },

    toggleSelection2(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable2.toggleRowSelection(row);
        });
      }
    },

    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      }
    },

    // 服务费列表
    async getServiceFeeByType() {
      let res = await this.$Http.serviceFeeByType(
        this.serviceFeeByTypeParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.serviceFeeList = res.ResultSet;
        let arr = [];
        if (this.oldServices && this.oldServices.length > 0) {
          this.oldServices.forEach(item => {
            this.serviceFeeList.forEach(unit => {
              if (item.ServiceId == unit.ID) {
                arr.push(unit);
              }
            });
          });
          this.$nextTick(() => {
            this.toggleSelection(arr);
          });
        }
      }
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
        this.typeOptions = res.ResultSet;
      }
    },

    // 服务费选中数据变化
    selectionChangeServiceFee(val) {
      this.multipleSelectionServiceFee = val;
      this.oldServices = [];
      this.multipleSelectionServiceFee.forEach(item => {
        this.oldServices.push({
          ServiceId: item.ID,
          OrderType: item.OrderType,
          ServiceFee: item.ServiceFeeValue,
          ServiceName: item.ServiceName
        });
      });
    },

    // 产品选中数据变化
    selectionChangeProduct(val) {
      this.multipleSelectionProduct = val;
      this.oldProducts = [];
      this.multipleSelectionProduct.forEach(item => {
        this.oldProducts.push({
          ProductId: item.ID,
          ProductName: item.ProductName
        });
      });
    },

    // 分类选择
    typeChange(type) {
      this.buildingInfo.OrderType = type;
      this.serviceFeeByTypeParameter.ordertype = type;
      // 注意：在切换业务分类后，需要删除之前分类的产品选择；
      this.oldProducts = [];
      this.getServiceFeeByType();
    },

    // 保存楼宇信息
    save() {
      if (!this.buildingInfo.ProjectName) {
        this.$message.warning("请填写楼宇名称");
      } else if (!this.buildingInfo.Address) {
        this.$message.warning("请填写地址");
      } else if (!this.buildingInfo.OrderType) {
        this.$message.warning("请选择业务分类");
      } else if (!this.buildingInfo.Director) {
        this.$message.warning("请填写负责人");
      } else if (!this.buildingInfo.CellPhone) {
        this.$message.warning("请填写电话");
        // 备注：不进行电话检测（用户填写的电话，可能手机号码、固话、甚至外国电话）
        // else if (!this.$check.checkOutTel(this.buildingInfo.CellPhone)) {
        //         this.$message.warning("电话号码填写错误");
        //       }
      } else if (this.oldProducts.length == 0) {
        this.$message.warning("请选择产品");
      } else {
        let Products = [];
        let Services = [];
        // 楼宇可以没有服务费


        if (this.oldProducts.length > 0) {
          this.oldProducts.forEach(item => {
            Products.push({
              ProductId: item.ProductId
            });
          });

          this.buildingInfo["Products"] = Products;
        }

        if (this.oldServices.length > 0) {
          this.oldServices.forEach(item => {
            Services.push({
              ServiceId: item.ServiceId,
              OrderType: item.OrderType,
              ServiceFee: item.ServiceFee
            });
          });
          // this.buildingInfo["Services"] = Services;
        }
        this.buildingInfo["Services"] = Services;
        this.saveBuilding();
      }
    },

    // 保存楼宇信息
    async saveBuilding() {
      let res = await this.$Http.saveBuildingInfo(
        {
          projectflag: "Man",
          reqdata: JSON.stringify(this.buildingInfo)
        },
        true
      );
      if (res.ResultFlag == "0") {
        this.$message.success("保存成功");
        this.$router.push({
          path: "/buildingInformation"
        });
      }
    },

    // 返回
    back() {
      if (
        this.buildingInfo.ProjectName ||
        this.buildingInfo.Address ||
        this.buildingInfo.OrderType ||
        this.buildingInfo.Director ||
        this.buildingInfo.CellPhone ||
        this.buildingInfo.Remark
      ) {
        this.$confirm("当前含有未保存的内容, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$router.push({
              path: "/buildingInformation"
            });
          })
          .catch(() => {});
      } else {
        this.$router.push({
          path: "/buildingInformation"
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/buildingInfo";
</style>
<style lang="scss">
// 处理input type = number的上下箭头
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
