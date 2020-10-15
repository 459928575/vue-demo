  <template>
  <div class="box">
    <div class="search-part">
      <el-input clearable size="small" class="search-input" @keyup.enter.native="getOrderList" placeholder="请输入订单编号" v-model="orderListParameter.ordernum">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-input clearable size="small" class="search-input" @keyup.enter.native="getOrderList" placeholder="请输入申请人姓名" v-model="orderListParameter.users">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-input clearable size="small" class="search-input" @keyup.enter.native="getOrderList" placeholder="请输入地址" v-model="orderListParameter.address">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-input clearable size="small" class="search-input" @keyup.enter.native="getOrderList" placeholder="请输入客户手机号" v-model="orderListParameter.phone" maxlength="11" show-word-limit type="number">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button size="small" class="search-btn" @click="getOrderList">搜索</el-button>
    </div>

    <div class="search-part">
      <el-radio-group v-model="category" size="small" @change="val=>changeSelect(val,'类型')">
        <el-radio-button :label="item.label" v-for="(item, index) in orderTypeOptions" :key="index"></el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="statusSelect" size="small" @change="val=>changeSelect(val,'状态')">
        <el-radio-button v-for="(item, index) in statusOptions" :label="item.label" :key="index"></el-radio-button>
      </el-radio-group>
    </div>
    <el-table v-loading="loading" :data="orderList" style="width: 100%" :header-cell-style="$config.headerCellStyle" border>
      <el-table-column prop="OrderNumber" label="订单编号" align="center"></el-table-column>
      <el-table-column prop="ApplicantUser" label="申请人（单位）" align="center"></el-table-column>
      <el-table-column prop="OrderProduct.ProductName" label="套餐名称" align="center"></el-table-column>
      <el-table-column prop="OrderType" label="业务分类" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.OrderType=='GR'">住宅</span>
          <span v-else-if="scope.row.OrderType=='QY'">商户</span>
          <span v-else>其他</span>
        </template>
      </el-table-column>

      <el-table-column prop="OrderState" label="订单状态" align="center">
        <template slot-scope="scope">
          <el-dropdown size="mini" @command="item=>chooseAction(scope.$index, scope.row, item)">
            <!-- 未提交 -->
            <el-button class="current-status" v-if="scope.row.OrderState== '未提交'" type="danger" size="mini">
              {{scope.row.OrderState}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <!-- 待付款 -->
            <el-button class="current-status" v-else-if="scope.row.OrderState== '待付款'" type="warning" size="mini">
              {{scope.row.OrderState}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <!-- 订单已确认 -->
            <el-button class="current-status" v-else-if="scope.row.OrderState== '订单已确认'" type="success" size="mini">
              {{scope.row.OrderState}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <!-- 已付款 -->
            <el-button class="current-status" v-else-if="scope.row.OrderState== '已付款'" type="info" size="mini">
              {{scope.row.OrderState}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <!-- 已确认付款 -->
            <el-button class="current-status" v-else-if="scope.row.OrderState== '已确认付款'" type="success" size="mini">
              {{scope.row.OrderState}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <!-- 使用中 -->
            <el-button class="current-status" v-else-if="scope.row.OrderState== '使用中'" type="success" size="mini">
              {{scope.row.OrderState}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <!-- 已过期 -->
            <el-button class="current-status" plain v-else-if="scope.row.OrderState== '已过期'" type="info" size="mini">
              {{scope.row.OrderState}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <!-- 已完成 -->
            <el-button class="current-status" plain v-else type="warning" size="mini">
              {{scope.row.OrderState}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="scope.row.OrderState == item.status" v-for="(item,ind) in actionOptions" :key="ind" :command="item.flag">{{item.status}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <el-table-column prop="Address" label="地址" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleView(scope.$index, scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination :current-page.sync="orderListParameter.pageNum" @current-change="handleCurrentChange" background layout="total, prev, pager, next, jumper" :total="ResultTotal">
      </el-pagination>
    </div>

    <!-- 订单详情弹窗 -->
    <el-drawer class="order-details" :direction="direction" :title="OrderProduct.ProductName" :visible.sync="dialogFormVisible">
      <div class="order-info" :style="{height:scrollerHeight}" v-loading="loadingDetails">
        <!-- 1、套餐信息 -->
        <div class="product-desc">
          <img class="product-img" :src="OrderProduct.ProductBase" :alt="OrderProduct.ProductName">
          <span class="product-name">{{OrderProduct.ProductName}}</span>
        </div>
        <div class="product-content" v-html="OrderProduct.ProductContent"></div>
        <div class="list">
          <div class="list-title">付费周期（月）</div>
          <div class="list-content">{{OrderProduct.ProductDeadline}}</div>
        </div>
        <!-- 暂时隐藏 -->
        <div class="list">
          <div class="list-title">业务类型</div>
          <div class="list-content" v-if="orderInfo.OrderType == 'GR'">住宅</div>
          <div class="list-content" v-else-if="orderInfo.OrderType == 'QY'">企业</div>
          <div class="list-content" v-else>其他</div>
        </div>
        <!-- 2、订单信息 -->
        <!-- 个人订单信息 -->
        <template v-if="orderInfo.OrderType == 'GR'">
          <div class="list">
            <div class="list-title">申请人</div>
            <div class="list-content">{{orderInfo.ApplicantUser}}</div>
          </div>
          <div class="list">
            <div class="list-title">联系电话</div>
            <div class="list-content">{{orderInfo.Cellphone}}</div>
          </div>
          <div class="list">
            <div class="list-title">邮箱</div>
            <div class="list-content">{{orderInfo.Email || "--"}}</div>
          </div>
          <div class="list">
            <div class="list-title">订单状态</div>
            <div class="list-content status no-submit">{{orderInfo.OrderState}}</div>
          </div>
          <div class="list" v-if="orderInfo.PaymentMethod">
            <div class="list-title">支付方式</div>
            <div class="list-content status no-submit">{{orderInfo.PaymentMethod}}</div>
          </div>
          <div class="list">
            <div class="list-title">安装地址</div>
            <div class="list-content">{{orderInfo.Address}}</div>
          </div>
          <div class="list">
            <div class="list-title">账单地址</div>
            <div class="list-content">{{orderInfo.BillingAddress || "--"}}</div>
          </div>
          <div class="list">
            <div class="list-title">下单日期</div>
            <div class="list-content">{{orderInfo.CreateTime}}</div>
          </div>
          <div class="list">
            <div class="list-title">更新日期</div>
            <div class="list-content">{{orderInfo.UpdateTime}}</div>
          </div>
          <div class="list border">
            <div class="list-title">备注</div>
            <div class="list-content">{{orderInfo.Remark || "--"}}</div>
          </div>
        </template>

        <!-- 企业订单信息 -->
        <template v-if="orderInfo.OrderType == 'QY'">
          <div class="list">
            <div class="list-title">企业名称</div>
            <div class="list-content">{{orderInfo.ApplicantUser}}</div>
          </div>
          <div class="list">
            <div class="list-title">法人姓名</div>
            <div class="list-content">{{orderInfo.LegalName}}</div>
          </div>
          <div class="list">
            <div class="list-title">法人电话</div>
            <div class="list-content">{{orderInfo.Cellphone}}</div>
          </div>
          <div class="list">
            <div class="list-title">法人邮箱</div>
            <div class="list-content">{{orderInfo.Email || "--"}}</div>
          </div>
          <div class="list">
            <div class="list-title">经办人姓名</div>
            <div class="list-content">{{orderInfo.Trustees}}</div>
          </div>
          <div class="list">
            <div class="list-title">经办人电话</div>
            <div class="list-content">{{orderInfo.Telphone}}</div>
          </div>
          <div class="list">
            <div class="list-title">经办人邮箱</div>
            <div class="list-content">{{orderInfo.TrusteesEmail || "--"}}</div>
          </div>
          <div class="list">
            <div class="list-title">票据类型</div>
            <div class="list-content">{{orderInfo.BillType}}</div>
          </div>
          <div class="list">
            <div class="list-title">订单状态</div>
            <div class="list-content status no-submit">{{orderInfo.OrderState}}</div>
          </div>
          <div class="list" v-if="orderInfo.PaymentMethod">
            <div class="list-title">支付方式</div>
            <div class="list-content status no-submit">{{orderInfo.PaymentMethod}}</div>
          </div>
          <div class="list">
            <div class="list-title">地址</div>
            <div class="list-content">{{orderInfo.Address}}</div>
          </div>
          <div class="list">
            <div class="list-title">下单日期</div>
            <div class="list-content">{{orderInfo.CreateTime}}</div>
          </div>
          <div class="list">
            <div class="list-title">更新日期</div>
            <div class="list-content">{{orderInfo.UpdateTime}}</div>
          </div>
          <div class="list border">
            <div class="list-title">备注</div>
            <div class="list-content">{{orderInfo.Remark || "--"}}</div>
          </div>
        </template>

        <!-- 3、自定义文本部分 -->
        <div class="list" :class="index == (orderInfo.OrderProps.length-1)?'border':''" v-for="(item, index) in orderInfo.OrderProps" :key="index">
          <div class="list-title">{{item.PropName}}</div>
          <div class="list-content">{{item.PropValue}}</div>
        </div>
        
        <!-- 4、服务费部分 -->
        <template v-if="orderInfo.OrderServiceFee && orderInfo.OrderServiceFee.length > 0">
          <div class="list" v-for="(item, index) in orderInfo.OrderServiceFee" :key="index">
            <div class="list-title">{{item.ServiceName}}</div>
            <div class="list-content">¥ {{item.ServiceValue}}</div>
          </div>
        </template>
        <div class="list">
          <div class="list-title">产品价格</div>
          <div class="list-content">¥ {{orderInfo.Price}}</div>
        </div>
        <div class="list">
          <div class="list-title">合计</div>
          <div class="list-content">¥ {{orderInfo.TServiceChange + orderInfo.Price}}</div>
        </div>
        <div class="list" v-if="orderInfo.CouponOff && (Number(orderInfo.CouponOff)>0)">
          <div class="list-title">优惠抵扣</div>
          <div class="list-content green">-¥ {{Number(orderInfo.CouponOff)}}</div>
        </div>
        <div class="list" v-if="orderInfo.PointOff && (Number(orderInfo.PointOff)>0)">
          <div class="list-title">积分抵扣</div>
          <div class="list-content green">-¥ {{Number(orderInfo.PointOff) }}</div>
        </div>
        <div class="service-list" v-if="orderInfo.Payments && Number(orderInfo.Payments)>0">
          <div class="list-title" v-if="orderInfo.OrderState != '待付款' && orderInfo.OrderState != '未提交'">实际支付</div>
          <div class="list-title" v-if="orderInfo.OrderState == '待付款' || orderInfo.OrderState == '未提交'">应付金额</div>
          <div class="price">¥ {{orderInfo.Payments}}</div>
        </div>
        <!-- 5、合同下载部分 -->
        <div class="action-list" v-if="orderInfo.OrderType == 'QY'">
          <el-button class="contract-btn" type="primary" @click="downloadFile" v-loading.fullscreen.lock="fullscreenLoading" element-loading-background="rgba(0, 0, 0, 0.8)" element-loading-text="合同生成中">下载合同</el-button>
          <el-button class="contract-btn" type="warning" @click="isShowEmailModal = true;">发送邮件</el-button>
        </div>

        <!-- 6、图片部分 -->
        <div class="img-container">
          <div class="img-list" v-for="(item, index) in currentOrderImgs" :key="index">
            <div class="info">
              <div class="info-title">{{item.PropName}}</div>
              <div class="info-content">{{item.PropValue}}</div>
            </div>
            <div class="imgs" v-for="(element, ind) in item.PropImgList" :key="ind">
              <img class="photo" :src="element.PicBase" :alt="item.PropName + (ind + 1)">
              <div class="view-mask">
                <el-button class="view-btn" type="primary" @click="viewPicture(index, ind)">查看</el-button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </el-drawer>

    <!-- 7、修改状态为使用中：填写生效日期-->
    <el-dialog :close-on-click-modal="false" class="add-modal" title="生效日期" :visible.sync="isShowDateModal" width="450px">
      <div class="details-container">
        <div class="details-item">
          <div class="left">选择生效日期 :</div>
          <el-date-picker class="right w-75" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="writeCommencementDateParameter.startdate" type="date" placeholder="选择日期">
          </el-date-picker>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowDateModal = false">取 消</el-button>
        <el-button type="primary" @click="confirmChangeStartDate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 8、邮箱接收合同-->
    <el-dialog :close-on-click-modal="false" class="add-modal" title="邮箱" :visible.sync="isShowEmailModal" width="450px">
      <div class="details-container">
        <div class="details-item">
          <div class="left">接收邮箱 :</div>
          <el-input size="small" class="right w-75" v-model="downloadContractParameter.email" placeholder="请输入邮箱">
          </el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowEmailModal = false">取 消</el-button>
        <el-button type="primary" @click="handleSendBtn">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 9、预览图片 -->
    <el-dialog :close-on-click-modal="false" :visible.sync="previewPicture.isViewPicture">
      <img width="100%" :src="previewPicture.dialogImageUrl" alt="">
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "orderList",
  created() {
    this.getOrderList(); //获取订单列表
  },
  data() {
    return {
      loading: true,
      /**
       * 修改订单状态
       *
       */
      changeOrderStatusParamater: {
        orderflag: "updstate",
        orderid: null,
        userid: null,
        orderstate: ""
      },
      viewportH: 0,
      /**
       * 订单部分
       */
      ResultTotal: 0,
      orderList: [],
      orderListParameter: {
        orderflag: "All",
        phone: "", //客户手机号码
        ordernum: "", //订单号码
        states: "", //状态
        ordertype: "", //类型
        users: "", //申请人
        address: "", //地址
        pageNum: 1,
        pageSize: 10
      },
      // 注意：这些状态值与后端要一字不差
      statusOptions: [
        { label: "全部", value: "" },
        { label: "未提交", value: "未提交" },
        { label: "待付款", value: "待付款" },
        { label: "订单已确认", value: "订单已确认" },
        { label: "已付款", value: "已付款" },
        { label: "已确认付款", value: "已确认付款" },
        { label: "使用中", value: "使用中" },
        { label: "已退单", value: "已退单" },
        { label: "已退款", value: "已退款" },
        { label: "已过期", value: "已过期" },
        { label: "已完成", value: "已完成" }
      ],
      statusSelect: "全部",
      orderTypeOptions: [
        { label: "全部", value: "" },
        { label: "住宅", value: "GR" },
        { label: "商户", value: "QY" }
      ],
      category: "全部",

      /**
       * 订单详情部分
       */
      orderid: null,
      orderInfo: {},
      dialogFormVisible: false,
      OrderProduct: {},
      direction: "rtl",
      OrderProject: {},
      loadingDetails: true,

      /**
       * 编辑状态部分
       */
      actionOptions: [
        { status: "未提交", flag: "未提交" },
        { status: "待付款", flag: "待付款" },
        { status: "订单已确认", flag: "订单已确认" },
        { status: "已付款", flag: "已付款" },
        { status: "已确认付款", flag: "已确认付款" },
        { status: "使用中", flag: "使用中" },
        { status: "已退单", flag: "已退单" },
        { status: "已退款", flag: "已退款" },
        { status: "已过期", flag: "已过期" },
        { status: "已完成", flag: "已完成" }
      ],

      /**
       * 修改状态部分
       */
      writeCommencementDateParameter: {
        orderflag: "upddate",
        orderid: null,
        userid: null,
        startdate: "",
        orderstate: ""
      },
      isShowDateModal: false,
      /**
       * 发送邮件部分
       */
      isShowEmailModal: false,
      downloadContractParameter: {
        orderid: null,
        projectid: null,
        email: ""
      },

      /**
       * 合同下载部分
       */

      downloadPdfParameter: {
        orderid: null,
        projectid: null
      },
      fullscreenLoading: false,

      /**
       * 图片预览
       */
      previewPicture: {
        isViewPicture: false,
        dialogImageUrl: ""
      },
      currentOrderImgs: []
    };
  },
  methods: {
    // 预览图片
    viewPicture(index, ind) {
      this.previewPicture.dialogImageUrl = this.currentOrderImgs[
        index
      ].PropImgList[ind].PicBase;
      this.previewPicture.isViewPicture = true;
    },

    // 生成合同文件
    async downloadFile() {
      this.fullscreenLoading = true;
      let res = await this.$Http.downloadPdf(this.downloadPdfParameter, true);
      if (res.ResultFlag == "0") {
        let pdfUrl = res.ResultSet;
        this.fullscreenLoading = false;
        this.$message.info("合同生成成功");
        window.open(pdfUrl);
      } else {
        this.$message.error("合同生成失败");
      }
    },

    // 发送邮件按钮
    handleSendBtn() {
      if (!this.downloadContractParameter.email) {
        this.$message.warning("请输入邮箱");
      } else if (!this.$check.isEmail(this.downloadContractParameter.email)) {
        this.$message.warning("邮箱格式不正确");
      } else {
        this.confirmSendEmail();
      }
    },

    // 确认发送邮件
    async confirmSendEmail() {
      let res = await this.$Http.downloadContract(
        this.downloadContractParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.isShowEmailModal = false;
        this.$message.success("发送成功");
      } else {
        this.$message.error("发送失败");
      }
    },

    // 订单列表
    async getOrderList() {
      this.loading = true;
      let res = await this.$Http.orderList(this.orderListParameter, true);
      if (res.ResultFlag == "0") {
        // let tempList = res.ResultSet;
        // tempList.forEach(item => {
        //   if(item.OrderProject){
        //     item["lastAddress"] = item.OrderProject.Address + item.Address;
        //     if(item.Address.indexOf(item.OrderProject.Address)>-1){

        //     }
        //   }else{
        //     item["lastAddress"] = item.Address;
        //   }
        // });
        this.orderList = res.ResultSet;
        this.ResultTotal = res.ResultTotal;
        this.loading = false;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    handleCurrentChange(currentPage) {
      this.orderListParameter.pageNum = currentPage;
      this.getOrderList();
    },

    //订单信息
    async getOrderDetails() {
      this.loadingDetails = true;
      this.dialogFormVisible = true;
      let res = await this.$Http.orderDetails(
        {
          orderflag: "Detail",
          orderid: this.orderid
        },
        true
      );
      if (res.ResultFlag == "0") {
        this.orderInfo = res.ResultSet;
        this.OrderProduct = this.orderInfo.OrderProduct;
        this.OrderProject = this.orderInfo.OrderProject;
        let str = this.OrderProduct.ProductContent.replace(/↵/g, "<br/>");
        this.OrderProduct.ProductContent = str;
        this.loadingDetails = false;
        this.downloadPdfParameter.orderid = this.orderInfo.ID;
        this.downloadPdfParameter.projectid = this.orderInfo.ProjetID;
        this.downloadContractParameter.orderid = this.orderInfo.ID;
        this.downloadContractParameter.projectid = this.orderInfo.ProjetID;
        this.downloadContractParameter.email = "";
        this.currentOrderImgs = this.orderInfo.OrderImages;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 切换类型
    changeSelect(val, str) {
      switch (str) {
        case "类型":
          this.orderTypeOptions.forEach(item => {
            if (item.label == val) {
              this.orderListParameter.ordertype = item.value;
            }
          });
          break;
        case "状态":
          this.statusOptions.forEach(item => {
            if (item.label == val) {
              this.orderListParameter.states = item.value;
            }
          });
          break;
      }
      this.orderListParameter.pageNum = 1;
      this.getOrderList();
    },

    // 点击详情按钮
    handleView(index, row) {
      this.orderid = row.ID;
      this.getOrderDetails();
    },

    //下拉菜单的状态修改操作
    chooseAction(index, row, item) {
      if (item == "使用中") {
        // 使用中，需要选择开始时间
        this.writeCommencementDateParameter.orderid = row.ID;
        this.writeCommencementDateParameter.userid = row.UserID;
        this.writeCommencementDateParameter.orderstate = item;
        this.writeCommencementDateParameter.startdate = "";
        this.isShowDateModal = true;
      } else {
        // 非使用中,不需要设置开始时间
        this.changeOrderStatusParamater.orderid = row.ID;
        this.changeOrderStatusParamater.orderstate = item;
        this.changeOrderStatusParamater.userid = row.UserID;
        this.toChangeOrderStatus();
      }
    },

    async toChangeOrderStatus() {
      let res = await this.$Http.changeOrderStatus(
        this.changeOrderStatusParamater,
        true
      );
      if (res.ResultFlag == "0") {
        this.$message.success("状态修改成功");
        this.getOrderList();
      } else {
        this.$message.error(res.ResultSet);
      }
    },

    // 填写/修改生效日期
    async confirmChangeStartDate() {
      if (!this.writeCommencementDateParameter.startdate) {
        this.$message.warning("请选择生效日期");
        return;
      }
      let res = await this.$Http.writeCommencementDate(
        this.writeCommencementDateParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.$message.success("状态修改成功");
        this.isShowDateModal = false;
        this.getOrderList();
      } else {
        this.$message.error("状态修改失败");
      }
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
@import "../style/orderList";
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

