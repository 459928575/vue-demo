<template>
  <div class="add-order">
    <div class="content">
      <!-- 1、业务选择 -->
      <div class="list">
        <div class="left">
          <span class="title">业务选择</span>
          <span class="require">*</span>
        </div>
        <div class="right">
          <el-select size="small" class="right-select" v-model="orderInfo.OrderCode" placeholder="请选择业务" @change="val=>chooseValue(val, '业务')">
            <el-option v-for="item in typeOptions" :key="item.OrderCode" :label="item.OrderNotes" :value="item.OrderCode">
            </el-option>
          </el-select>
        </div>
      </div>
      <!-- 2、楼宇查询 -->
      <div class="list">
        <div class="left">
          <span class="title">楼宇搜索</span>
          <span class="require">*</span>
        </div>
        <div class="right">
          <el-input size="small" v-model="addressListParameter.projectname" placeholder="请输入楼宇地址" class="right-select">
          </el-input>
          <el-button @click="viewAddressList" class="preview-btn" size="small" type="primary" plain>搜索</el-button>
        </div>
      </div>
      <!-- 1、业务选择 -->
      <div class="list">
        <div class="left">
          <span class="title">运营商</span>
          <span class="require">*</span>
        </div>
        <div class="right">
          <el-select :disabled="!productListByIdParameter.projectid" size="small" class="right-select" v-model="selectOperator" placeholder="请选择运营商" @change="val=>chooseValue(val, '运营商')">
            <el-option v-for="item in operatorOptions" :key="item.OrderCode" :label="item.OrderNotes" :value="item.OrderCode">
            </el-option>
          </el-select>
        </div>
      </div>
      <!-- 楼宇名称 -->
      <!-- 			<div class="list">
				<div class="left">
					<span class="title">楼宇名称</span>
					<span class="require">*</span>
				</div>
				<div class="right">
					<el-select size="small" class="right-select" v-model="orderInfo.ProjectName" placeholder="请选择产品" @change="val=>chooseValue(val, '楼宇')">
						<el-option v-for="item in addressList" :key="item.ID" :label="item.ProjectName" :value="item.ID">
						</el-option>
					</el-select>
				</div>
			</div> -->
      <!-- 产品选择 -->
      <div class="list">
        <div class="left">
          <span class="title">产品选择</span>
          <span class="require">*</span>
        </div>
        <div class="right">
          <el-select :disabled="!productListByIdParameter.projectid" size="small" class="right-select" v-model="orderInfo.ProductName" placeholder="请选择产品" @change="val=>chooseValue(val, '产品')">
            <el-option v-for="item in productList" :key="item.ID" :label="item.ProductName" :value="item.ID">
            </el-option>
          </el-select>
          <el-button @click="handleDetails" class="preview-btn" size="small" icon="el-icon-full-screen" type="primary" plain>预览产品详情</el-button>
        </div>
      </div>

      <div class="action-btns">
        <div class="left"></div>
        <div class="right">
          <el-button size="small" type="primary" class="save-btn" @click="goNext">下一步</el-button>
          <el-button size="small" type="primary" plain class="back-btn" @click="cancel">取消</el-button>
        </div>
      </div>

    </div>

    <!-- 查看详情弹窗 -->
    <!-- <el-dialog :close-on-click-modal="false" class="details-modal" title="产品详情" :visible.sync="dialogVisible" width="50%">
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
    </el-dialog> -->

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
          <div class="list-content">{{currentProductInfo.CreateID}}</div>
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

    <!-- 楼宇弹窗 -->
    <el-dialog :close-on-click-modal="false" class="details-modal" title="选择楼宇" :visible.sync="isShowBuildModal" width="650px">
      <el-table ref="singleTable" :header-cell-style="$config.headerCellStyle" :data="addressList" highlight-current-row @current-change="handleCurrentChange" style="width: 100%" height="400" border>
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column property="ProjectName" label="楼宇名称" align="center"></el-table-column>
        <el-table-column property="Address" label="楼宇地址" align="center"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "addOrder",
  created() {
    this.getTypeOptions(); //加载分类配置列表
    this.getOperatorOptions();
    // this.getBuildingList(); //加载楼宇列表
  },
  data() {
    return {
      /**
       * 运营商列表
       */
      operatorOptions: [],
      operatorOptionsParameter: {
        flag: "Menu"
      },
      selectOperator: "",
      detailsBuildAddress: "",
      /**
       * 地址列表查询参数
       */
      isShowBuildModal: false,
      currentRow: {},
      addressListParameter: {
        projectflag: "Sel",
        projectname: "", //楼宇地址
        ordertype: ""
      },

      orderInfo: {
        OrderCode: "",
        OrderNotes: "",
        ProjectId: null,
        ProjectName: "",
        ProductName: "",
        productId: null
      },

      /**
       * 分类部分
       */
      typeOptions: [], //分类配置列表

      /**
       * 产品部分
       */

      productList: [],
      productListByIdParameter: {
        proflag: "All",
        projectid: null, //楼宇id
        menutype: "", //运营商名称
        ordertype: "",
        pageNum: 1,
        pageSize: 10000
      },
      /**
       * 产品详情
       */
      productDetailsParameter: {
        proflag: "Detail",
        proid: null,
        projectid: null
      },
      dialogVisible: false,
      currentProductInfo: {},
      direction: "rtl",
      viewportH: 0,

      /**
       * 楼宇部分
       */

      buildingListParameter: {
        projectflag: "All",
        projectsel: "",
        ordertype: "",
        pageNum: 1,
        pageSize: 10
      },
      buildingList: [],
      addressList: []
    };
  },
  methods: {
    // 运营商列表
    async getOperatorOptions() {
      let res = await this.$Http.operator(this.operatorOptionsParameter, true);
      if (res.ResultFlag == "0") {
        // res.ResultSet.forEach(item => {
        //   this.operatorOptions.push(item.OrderNotes);
        // });
        this.operatorOptions = res.ResultSet;
      } else {
        this.$message.error("运营商加载出错");
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
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 查询地址
    async viewAddressList() {
      // 1、业务分类必选
      if (!this.productListByIdParameter.ordertype) {
        this.$message.warning("请选择业务分类");
        return;
      }
      // 2、搜索地址必填
      if (!this.addressListParameter.projectname) {
        this.$message.warning("请输入地址");
        return;
      }

      // 3、加载楼宇里列表
      let res = await this.$Http.getAddressList(
        this.addressListParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.addressList = res.ResultSet;
        this.selectProjectId = null;
        if (this.addressList.length == 0) {
          this.$message.warning("未查询到相关数据");
        } else {
          this.isShowBuildModal = true;
        }
      } else {
        this.$message.warning("查询失败");
      }
    },

    // 单选表格(选中楼宇，加载当前楼宇的产品列表)
    handleCurrentChange(val) {
      this.currentRow = val;
      /**
       * 楼宇列表参数赋值
       */
      this.productListByIdParameter.projectid = this.currentRow.ID;
      this.addressListParameter.projectname = this.currentRow.ProjectName;

      /**
       * orderInfo赋值
       */
      this.orderInfo.ProjectName = this.currentRow.ProjectName;
      this.orderInfo.ProjectId = this.currentRow.ID;

      this.detailsBuildAddress = this.currentRow.Address; //楼宇具体的地址
      this.getProductListById();
      this.productDetailsParameter.projectid = this.currentRow.ID;
      this.isShowBuildModal = false;
    },

    // 产品列表
    async getProductListById() {
      let res = await this.$Http.getProductListById(
        this.productListByIdParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.productList = res.ResultSet;
        if (res.ResultSet.length == 0) {
          this.$message.info("未查询到相关产品");
        }
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 下拉框选择
    chooseValue(value, str) {
      switch (str) {
        case "业务":
          /**
           * orderInfo部分
           */

          this.orderInfo.OrderCode = value;
          this.typeOptions.forEach(item => {
            if (value == item.OrderCode) {
              this.orderInfo.OrderNotes = item.OrderNotes;
            }
          });
          this.orderInfo.ProjectId = null;
          this.orderInfo.ProjectName = "";
          this.orderInfo.ProductName = "";
          this.orderInfo.productId = null;

          /**
           * 切换分类后，对楼宇与产品的影响
           * 1、楼宇信息搜索重置；
           * 2、产品列表信息重置；
           * 3、产品详情参数重置；
           * 4、运营商名称重置；
           */

          // 1、楼宇信息重置；(置空完成)
          // addressListParameter:{projectflag: "Sel",projectname: "",ordertype: ""}
          this.addressListParameter.projectname = "";
          this.addressListParameter.ordertype = value;

          // 2、产品列表信息重置；(置空完成)
          // productListByIdParameter: {proflag: "All",projectid: null, ordertype: "",pageNum: 1,pageSize: 10000}
          this.productList = [];
          this.productListByIdParameter.projectid = null;
          this.productListByIdParameter.ordertype = value;
          this.productListByIdParameter.menutype = "";

          // 3、产品详情参数重置；
          // productDetailsParameter: {proflag: "Detail",proid: null,projectid:null}
          this.productDetailsParameter.proid = null;
          this.productDetailsParameter.projectid = null;

          // 4、运营商名称重置；
          this.selectOperator = "";

          break;

        // case "楼宇":
        // 	this.buildingList.forEach(item => {
        // 		if (value == item.ID) {
        // 			this.orderInfo.ProjectName = item.ProjectName;
        // 		}
        // 	});
        // 	this.orderInfo.ProjectId = value;
        // 	this.orderInfo.ProductName = '';
        // 	this.orderInfo.productId = null;
        // 	this.productDetailsParameter.proid = null;
        // 	this.productListByIdParameter.projectid = value;
        // 	this.getProductListById();
        // 	break;

        case "产品":
          /**
           * orderInfo部分 --productId、ProductName
           */
          this.orderInfo.productId = value;
          this.productList.forEach(item => {
            if (value == item.ID) {
              this.orderInfo.ProductName = item.ProductName;
            }
          });

          /**
           * 产品详情参数productDetailsParameter -- proid
           */
          this.productDetailsParameter.proid = value;
          break;
        case "运营商":
          this.operatorOptions.forEach(item => {
            if (value == item.OrderCode) {
              this.selectOperator = item.OrderNotes;
              this.productListByIdParameter.menutype = item.OrderNotes;
            }
          });
          this.getProductListById();
          break;
      }
    },

    // 点击预览产品详情按钮
    handleDetails() {
      if (!this.productDetailsParameter.proid) {
        this.$message.warning("请先选择产品");
      } else {
        this.viewProductDetails();
        this.dialogVisible = true;
      }
    },

    // 产品详情
    async viewProductDetails() {
      let res = await this.$Http.productDetails(
        this.productDetailsParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.currentProductInfo = res.ResultSet;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 下一步
    goNext() {
      if (!this.orderInfo.OrderCode) {
        this.$message.warning("请选择业务");
      } else if (!this.orderInfo.ProjectId) {
        this.$message.warning("请选择楼宇");
      } else if (!this.orderInfo.productId) {
        this.$message.warning("请选择产品");
      } else {
        this.$router.push({
          path: "/applicantInformation",
          query: {
            orderType: this.orderInfo.OrderCode, //业务申请类型
            ProjectId: this.orderInfo.ProjectId, //楼宇id
            productId: this.orderInfo.productId, //产品id
            ProjectName: this.orderInfo.ProjectName, //楼宇名称
            detailsBuildAddress: this.detailsBuildAddress
          }
        });
      }
    },

    // 取消按钮
    cancel() {
      this.$router.push({
        path: "/orderList"
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
@import "../style/addOrder";
@import "../style/productListDrawer";
</style>
