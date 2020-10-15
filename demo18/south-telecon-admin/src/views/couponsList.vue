  <template>
  <div class="box">
    <div class="search-part">
      <el-input clearable size="small" @keyup.enter.native="getCouponsList" class="search-input" placeholder="请输入活动名称" v-model="couponListParameter.couponname">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-radio-group v-model="category" size="small" @change="changeSelect">
        <el-radio-button :label="item.label" v-for="(item, index) in priceOptions" :key="index"></el-radio-button>
      </el-radio-group>
      <el-button class="search-btn" size="small" @click="getCouponsList">搜索</el-button>
      <el-button class="add-btn" type="success" size="small" icon="el-icon-circle-plus-outline" @click="addCoupon">新增优惠券
      </el-button>
    </div>
    <el-table :data="couponsList" style="width: 100%" :header-cell-style="$config.headerCellStyle" border>
      <!-- <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="适用项目">
              <span v-for="(item, ind) in props.row.ProjectList" :key="ind">
                <span>{{ item.ProjectName }}</span>
                <span v-if="(ind + 1) != props.row.ProjectList.length">、</span>
              </span>
            </el-form-item>
            <el-form-item label="发行数量">
              <span>{{ props.row.CouponQuantity }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column> -->
      <el-table-column prop="CouponName" label="活动名称" align="center"></el-table-column>
      <el-table-column prop="CouponSDate" label="生效时间" align="center"></el-table-column>
      <el-table-column prop="CouponEDate" label="失效时间" align="center"></el-table-column>
      <el-table-column prop="CouponMoney" label="抵用金额（元）" align="center"></el-table-column>
      <el-table-column prop="CouponQuantity" label="总量" align="center"></el-table-column>
      <el-table-column prop="UserCount" label="已领用" align="center"></el-table-column>
      <el-table-column prop="UsedCount" label="已使用" align="center"></el-table-column>
      <el-table-column prop="LeftCount" label="未生成" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="240">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="primary" size="mini" @click="handleCode(scope.$index, scope.row)">二维码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination :current-page.sync="couponListParameter.pageNum" @current-change="handleCurrentChange" background layout="total, prev, pager, next, jumper" :total="ResultTotal">
      </el-pagination>
    </div>

    <!-- 二维码对话框 -->
    <el-dialog @close="refreshData" :close-on-click-modal="false" class="code-modal" title="二维码" :visible.sync="dialogVisible" width="400px">
      <div class="code-content">
        <h3>{{codeForm.CouponName}}</h3>
        <div id="qrCode" ref="qrCodeDiv"></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="refreshData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

  <script>
import QRCode from "qrcodejs2";
export default {
  name: "couponsList",
  created() {
    this.getCouponsList();
  },
  data() {
    return {
      category: "未失效",
      priceOptions: [
        { label: "未失效", value: "False" },
        { label: "已失效", value: "True" }
      ],
      ResultTotal: 0,
      // 获取优惠券列表的参数
      couponListParameter: {
        couponflag: "All",
        isexpired: "False",
        couponname: "",
        pageNum: 1,
        pageSize: 10
      },
      dialogVisible: false,
      formLabelWidth: "80px",
      isShowModal: false,
      couponsList: [],
      codeForm: {
        CouponName: "",
        ScanUrl: ""
      },
      couponCodeParameter: {
        couponflag: "UserScan",
        userid: Number(localStorage.getItem("CreateID")),
        couponid: null
      }
    };
  },
  methods: {
    refreshData() {
      this.dialogVisible = false;
      this.getCouponsList();
    },
    // 切换类型
    changeSelect(type) {
      this.category = type;
      this.priceOptions.forEach(item => {
        if (item.label == type) {
          this.couponListParameter.isexpired = item.value;
        }
      });
      this.couponListParameter.pageNum = 1;
      this.getCouponsList();
    },
    // 获取优惠券列表
    async getCouponsList() {
      let res = await this.$Http.couponList(this.couponListParameter, true);
      if (res.ResultFlag == "0") {
        this.couponsList = res.ResultSet;
        this.ResultTotal = res.ResultTotal;
      }else{
        this.$message.error('数据加载失败')
      }
    },

    // 分页
    handleCurrentChange(currentPage) {
      this.couponListParameter.pageNum = currentPage;
      this.getCouponsList();
    },

    // 编辑按钮
    handleEdit(index, row) {
      this.$router.push({
        path: "/addCoupon",
        query: {
          couponid: row.ID
        }
      });
    },

    // 查看二维码
    handleCode(index, row) {
      this.couponCodeParameter.couponid = row.ID;
      this.codeForm.CouponName = row.CouponName;
      this.getCouponCode();
    },

    async getCouponCode() {
      let res = await this.$Http.couponCode(this.couponCodeParameter, true);
      if (res.ResultFlag == "0") {
        this.dialogVisible = true;
        this.codeForm.ScanUrl = res.ResultSet;
        let codeText = this.codeForm.ScanUrl;
        this.$nextTick(function() {
          document.getElementById("qrCode").innerHTML = "";
          this.bindQRCode(codeText);
        });
      } else {
        this.$message.error(res.ResultSet);
      }
    },

    // 生成二维码
    bindQRCode(codeText) {
      new QRCode(this.$refs.qrCodeDiv, {
        text: codeText,
        width: 200,
        height: 200,
        colorDark: "#333333", //二维码颜色
        colorLight: "#ffffff", //二维码背景色
        correctLevel: QRCode.CorrectLevel.L //容错率，L/M/H
      });
    },

    // 新增优惠券
    addCoupon() {
      this.$router.push({
        path: "/addCoupon",
        query: {
          couponid: 0
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/productList";
.coupons-modal {
  .w-50 {
    width: 50%;
  }
  .w-75 {
    width: 75%;
  }
}

.code-modal {
  .el-dialog {
    .el-dialog__body {
      .code-content {
        margin: -20px auto -20px;
        text-align: center;
        h3 {
          font-size: 18px;
        }
        #qrCode {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand {
  font-size: 0;
  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
    .el-form-item__label {
      color: #99a9bf;
    }
  }
}
</style>