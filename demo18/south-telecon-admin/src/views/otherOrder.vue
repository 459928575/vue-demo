  <template>
  <div class="box">
    <!-- 1、搜索部分 -->
    <div class="search-part">
      <el-input clearable size="small" @keyup.enter.native="getOtherOrderList" class="search-input" placeholder="请输入路线编号" v-model="otherOrderParameter.linenum">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-radio-group v-model="category" size="small" @change="val=>changeSelect(val,'类型')">
        <el-radio-button :label="item.label" v-for="(item, index) in orderTypeOptions" :key="index"></el-radio-button>
      </el-radio-group>
      <el-button size="small" class="search-btn" @click="getOtherOrderList">搜索</el-button>
    </div>
    <!-- 2、表格数据 -->
    <el-table v-loading="loading" :data="otherOrderList" style="width: 100%" :header-cell-style="$config.headerCellStyle" border>
      <el-table-column v-for="(item, i) in dynamicTableHead" :prop="item.prop" :label="item.label" :key="i" align="center"></el-table-column>
      <el-table-column prop="OrderState" label="订单状态" align="center" v-if="otherOrderParameter.ordertype == 'XF'">
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
      <el-table-column label="操作" fixed="right" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleView(scope.$index, scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination :current-page.sync="otherOrderParameter.pageNum" @current-change="handleCurrentChange" background layout="total, prev, pager, next, jumper" :total="ResultTotal">
      </el-pagination>
    </div>

    <!-- 3、详情 -->
    <el-drawer class="order-details" :direction="direction" :title="'线路编号：' + orderInfo.LineNumber" :visible.sync="dialogFormVisible">
      <div class="order-info" :style="{height:scrollerHeight}" v-loading="loadingDetails">
        <div class="list" v-for="(item, index) in dynamicTableHead" :key="index">
          <div class="list-title">{{item.label}}</div>
          <div class="list-content">{{orderInfo[item.prop]}}</div>
        </div>
      </div>
    </el-drawer>

    <!-- 7、修改状态为使用中：填写生效日期-->
    <el-dialog :close-on-click-modal="false" class="add-modal" title="生效日期" :visible.sync="isShowDateModal" width="450px">
      <div class="details-container">
        <div class="details-item">
          <div class="left">选择生效日期 :</div>
          <el-date-picker class="right w-75" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="XFwriteCommencementDateParameter.startdate" type="date" placeholder="选择日期">
          </el-date-picker>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowDateModal = false">取 消</el-button>
        <el-button type="primary" @click="confirmChangeStartDate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "otherOrder",
  created() {
    this.getOtherOrderList(); //获取订单列表
  },
  data() {
    return {
      loading: true,
      // 配置动态表头
      dynamicTableHead: [
        { label: "线路编号", prop: "LineNumber" },
        { label: "订单编号", prop: "OrderNumber" },
        { label: "用户名", prop: "OldUserName" },
        { label: "联系电话", prop: "Tel" },
        { label: "业务名称", prop: "BusinessName" },
        { label: "费用（元）", prop: "Payments" },
        { label: "安装地址", prop: "SetupAddress" },
        { label: "备注", prop: "Remark" },
        { label: "申请时间", prop: "UpdateTime" }
      ],
      viewportH: 0,
      /**
       * 订单部分
       */
      ResultTotal: 0,
      otherOrderList: [],
      otherOrderParameter: {
        order2flag: "All",
        linenum: "",
        ordertype: "XF",
        pageNum: 1,
        pageSize: 10
      },
      orderTypeOptions: [
        // { label: "全部", value: "" },
        { label: "续费", value: "XF" },
        { label: "维修", value: "WX" },
        { label: "拆除", value: "CC" },
        { label: "移机", value: "YJ" },
        { label: "过户", value: "GH" }
      ],
      category: "续费",

      /**
       * 订单详情部分
       */
      otherOrderDetailsPatameter: {
        order2flag: "Detail",
        order2id: null
      },
      loadingDetails: false,
      dialogFormVisible: false,
      direction: "rtl",
      orderInfo: {},

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
      XFwriteCommencementDateParameter: {
        flag: "upddate",
        orderid: null,
        userid: null,
        startdate: "",
        orderstate: ""
      },
      isShowDateModal: false,
      XFChangeOrderStatusParamater: {
        flag: "updstate",
        userid: null,
        orderid: null,
        orderstate: ""
      }
    };
  },
  methods: {
    //下拉菜单的状态修改操作
    chooseAction(index, row, item) {
      if (item == "使用中") {
        // // 使用中，需要选择开始时间
        this.XFwriteCommencementDateParameter.orderid = row.ID;
        this.XFwriteCommencementDateParameter.userid = row.UserID;
        this.XFwriteCommencementDateParameter.orderstate = item;
        this.XFwriteCommencementDateParameter.startdate = "";
        this.isShowDateModal = true;
      } else {
        // 非使用中,不需要设置开始时间
        this.XFChangeOrderStatusParamater.orderid = row.ID;
        this.XFChangeOrderStatusParamater.orderstate = item;
        this.XFChangeOrderStatusParamater.userid = row.UserID;
        this.XFToChangeOrderStatus();
      }
    },

    // 修改订单状态
    async XFToChangeOrderStatus() {
      let res = await this.$Http.XFChangeOrderStatus(
        this.XFChangeOrderStatusParamater,
        true
      );
      if (res.ResultFlag == "0") {
        this.$message.success("状态修改成功");
        this.getOtherOrderList();
      } else {
        this.$message.error(res.ResultSet);
      }
    },

    // 填写/修改生效日期
    async confirmChangeStartDate() {
      if (!this.XFwriteCommencementDateParameter.startdate) {
        this.$message.warning("请选择生效日期");
        return;
      }
      let res = await this.$Http.XFwriteCommencementDate(
        this.XFwriteCommencementDateParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.$message.success("状态修改成功");
        this.isShowDateModal = false;
        this.getOtherOrderList();
      } else {
        this.$message.error("状态修改失败");
      }
    },

    // 订单列表
    async getOtherOrderList() {
      this.loading = true;
      let res = await this.$Http.otherOrder(this.otherOrderParameter, true);
      if (res.ResultFlag == "0") {
        this.otherOrderList = res.ResultSet;
        this.ResultTotal = res.ResultTotal;
        this.loading = false;
      } else {
        this.$message.error(res.ResultSet);
      }
    },

    // 分页
    handleCurrentChange(currentPage) {
      this.otherOrderParameter.pageNum = currentPage;
      this.getOtherOrderList();
    },

    //订单详情
    async getOtherOrderDetails() {
      this.loadingDetails = true;
      let res = await this.$Http.otherOrderDetails(
        this.otherOrderDetailsPatameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.orderInfo = res.ResultSet;
        this.dialogFormVisible = true;
        this.loadingDetails = false;
      } else {
        this.$message.error(res.ResultSet);
      }
    },

    // 切换类型
    changeSelect(val, str) {
      if (str == "类型") {
        this.orderTypeOptions.forEach(item => {
          if (item.label == val) {
            this.otherOrderParameter.ordertype = item.value;
          }
        });
        /**
         * 思路分析：
         * 根据不同的类型，配置不同的表头，已达到动态表头的目的。
         */
        switch (this.otherOrderParameter.ordertype) {
          case "XF":
            this.dynamicTableHead = [
              { label: "线路编号", prop: "LineNumber" },
              { label: "订单编号", prop: "OrderNumber" },
              { label: "用户名", prop: "OldUserName" },
              { label: "联系电话", prop: "Tel" },
              { label: "业务名称", prop: "BusinessName" },
              { label: "费用（元）", prop: "Payments" },
              { label: "安装地址", prop: "SetupAddress" },
              { label: "备注", prop: "Remark" },
              { label: "申请时间", prop: "UpdateTime" }
            ];
            break;
          case "WX":
            this.dynamicTableHead = [
              { label: "线路编号", prop: "LineNumber" },
              { label: "订单编号", prop: "OrderNumber" },
              { label: "用户名", prop: "OldUserName" },
              { label: "联系电话", prop: "Tel" },
              { label: "业务名称", prop: "BusinessName" },
              { label: "安装地址", prop: "SetupAddress" },
              { label: "故障描述", prop: "Remark" },
              { label: "申请时间", prop: "UpdateTime" }
            ];
            break;
          case "CC":
            this.dynamicTableHead = [
              { label: "线路编号", prop: "LineNumber" },
              { label: "订单编号", prop: "OrderNumber" },
              { label: "用户名", prop: "OldUserName" },
              { label: "联系电话", prop: "Tel" },
              { label: "业务名称", prop: "BusinessName" },
              { label: "安装地址", prop: "SetupAddress" },
              { label: "备注", prop: "Remark" },
              { label: "申请时间", prop: "UpdateTime" }
            ];
            break;
          case "YJ":
            this.dynamicTableHead = [
              { label: "线路编号", prop: "LineNumber" },
              { label: "订单编号", prop: "OrderNumber" },
              { label: "用户名", prop: "OldUserName" },
              { label: "联系电话", prop: "Tel" },
              { label: "业务名称", prop: "BusinessName" },
              { label: "旧地址", prop: "SetupAddress" },
              { label: "新地址", prop: "NewAddress" },
              { label: "备注", prop: "Remark" },
              { label: "申请时间", prop: "UpdateTime" }
            ];
            break;
          case "GH":
            this.dynamicTableHead = [
              { label: "线路编号", prop: "LineNumber" },
              { label: "订单编号", prop: "OrderNumber" },
              { label: "旧用户名", prop: "OldUserName" },
              { label: "新用户名", prop: "NewUserName" },
              { label: "联系电话", prop: "Tel" },
              { label: "新联系电话", prop: "NewTel" },
              { label: "业务名称", prop: "BusinessName" },
              { label: "安装地址", prop: "SetupAddress" },
              { label: "备注", prop: "Remark" },
              { label: "申请时间", prop: "UpdateTime" }
            ];
            break;
          case "BG":
            this.dynamicTableHead = [
              { label: "线路编号", prop: "LineNumber" },
              { label: "订单编号", prop: "OrderNumber" },
              { label: "用户名", prop: "OldUserName" },
              { label: "联系电话", prop: "Tel" },
              { label: "旧业务名称", prop: "OldBusinessName" },
              { label: "新业务名称", prop: "NewBusinessName" },
              { label: "安装地址", prop: "SetupAddress" },
              { label: "备注", prop: "Remark" },
              { label: "申请时间", prop: "UpdateTime" }
            ];
            break;

          default:
            break;
        }
      }
      this.otherOrderParameter.pageNum = 1;
      this.getOtherOrderList();
    },

    // 点击详情按钮
    handleView(index, row) {
      this.otherOrderDetailsPatameter.order2id = row.ID;
      this.getOtherOrderDetails();
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
@import "../style/otherOrder";
</style>