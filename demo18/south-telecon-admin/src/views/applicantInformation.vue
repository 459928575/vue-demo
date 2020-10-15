<template>
  <div class="applicant-information">
    <!-- A、个人 -->
    <div class="content" v-if="serviceType != '3'">
      <!-- 1、申请人姓名 -->
      <div class="list">
        <div class="left">
          <span>申请人</span>
          <span class="require">*</span>
        </div>
        <div class="right">
          <el-input clearable class="right-input" size="small" v-model="formInfo.ApplicantUser" placeholder="请输入申请人姓名">
          </el-input>
        </div>
      </div>

      <!-- 2、联系电话 -->
      <div class="list">
        <div class="left">
          <span>联系电话</span>
          <span class="require">*</span>
        </div>
        <div class="right">
          <el-input type="number" clearable class="right-input" size="small" :maxlength="telMaxLength"
            v-model="formInfo.Cellphone" placeholder="请输入联系电话">
          </el-input>
        </div>
      </div>

      <!-- 3、邮箱 -->
      <div class="list">
        <div class="left">
          <span>E-MAIL</span>
        </div>
        <div class="right">
          <el-input clearable class="right-input" size="small" v-model="formInfo.Email" placeholder="请输入邮箱">
          </el-input>
        </div>
      </div>

      <!-- 4、备注 -->
      <div class="list">
        <div class="left">
          <span>备注</span>
        </div>
        <div class="right">
          <el-input clearable class="right-input" size="small" v-model="formInfo.Remark" placeholder="请输入备注信息">
          </el-input>
        </div>
      </div>

      <!-- 5、楼宇名称 -->
      <div class="list">
        <div class="left">
          <span>楼宇名称</span>
        </div>
        <div class="right">
          {{buildingAddress}}
        </div>
      </div>

      <!-- 6、楼宇地址 -->
      <div class="list">
        <div class="left">
          <span>楼宇地址</span>
        </div>
        <div class="right">
          {{detailsBuildAddress}}
        </div>
      </div>

      <!-- 7、安装地址 -->
      <div class="list">
        <div class="left">
          <span>安装地址</span>
          <span class="require">*</span>
        </div>
        <div class="right">
          <el-input clearable class="right-input w-600" size="small" v-model="formInfo.detailAddress"
            placeholder="请输入安装地址">
          </el-input>
        </div>
      </div>

      <!-- 7、账单地址 -->
      <div class="list">
        <div class="left">
          <span>账单地址</span>
        </div>
        <div class="right">
          <el-input clearable class="right-input w-600" size="small" v-model="formInfo.BillingAddress"
            placeholder="请输入账单地址">
          </el-input>
        </div>
      </div>

      <!-- 自定义文本部分 -->
      <div v-if="customTextList.length >0">
        <div class="list" v-for="(item, index) in customTextList" :key="index">
          <div class="left">
            <span>{{item.PropName}}</span>
            <span class="require" v-if="item.PropEmpty == '1'">*</span>
          </div>
          <div class="right">
            <el-input clearable class="right-input" size="small" v-model="item.PropNotes"
              :placeholder="'请输入'+ item.PropName">
            </el-input>
          </div>
        </div>
      </div>

      <!-- 服务费部分 -->
      <div class="list" v-if="serviceFeeList.length>0">
        <div class="left">
          <span>服务费明细</span>
        </div>
        <div class="right setting-height">
          <div class="service-table">
            <el-table class="table-data" height="240" :header-cell-style="$config.headerCellStyle" border
              :data="serviceFeeList" style="width: 100%;">
              <el-table-column prop="ServiceName" label="费用名称" align="center"></el-table-column>
              <el-table-column prop="ServiceFee" label="费用金额(元)" align="center"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>

      <div class="list">
        <div class="left">
          <span>{{productInfo.ProductName}}</span>
        </div>
        <div class="right">
          {{productInfo.Price}}元
        </div>
      </div>
      <div class="list">
        <div class="left">
          <span>共计</span>
        </div>
        <div class="right">
          {{totalPrice}}元
        </div>
      </div>

      <div class="action-btns">
        <div class="left"></div>
        <div class="right">
          <el-button size="small" type="primary" class="save-btn" @click="toFillInOrderPic">下一步</el-button>
          <el-button size="small" type="primary" plain class="back-btn" @click="goBack">返回上一步</el-button>
        </div>
      </div>
    </div>

    <!-- B、企业 -->
    <div class="content" v-if="serviceType == '3'">
      <!-- 1、申请单位名称 -->
      <div class="list">
        <div class="left">
          <span>企业名称</span>
          <span class="require">*</span>
        </div>
        <div class="right">
          <el-input clearable class="right-input" size="small" v-model="formInfo.ApplicantUser" placeholder="请输入企业名称">
          </el-input>
        </div>
      </div>

      <!-- 2、法人姓名 -->
      <div class="list">
        <div class="left">
          <span>法人姓名</span>
          <span class="require">*</span>
        </div>
        <div class="right">
          <el-input clearable class="right-input" size="small" v-model="formInfo.LegalName" placeholder="请输入姓名">
          </el-input>
        </div>
      </div>

      <!-- 3、法人联系电话-->
      <div class="list">
        <div class="left">
          <span>法人电话</span>
          <span class="require">*</span>
        </div>
        <div class="right">
          <el-input type="number" clearable class="right-input" size="small" :maxlength="telMaxLength"
            v-model="formInfo.Cellphone" placeholder="请输入法人联系电话">
          </el-input>
        </div>
      </div>

      <!-- 4、邮箱 -->
      <div class="list">
        <div class="left">
          <span>E-MAIL</span>
        </div>
        <div class="right">
          <el-input clearable class="right-input" size="small" v-model="formInfo.Email" placeholder="请输入邮箱">
          </el-input>
        </div>
      </div>

      <!-- 5、经办人姓名 -->
      <div class="list">
        <div class="left">
          <span>经办人姓名</span>
          <span class="require">*</span>
        </div>
        <div class="right">
          <el-input clearable class="right-input" size="small" v-model="formInfo.Trustees" placeholder="请输入经办人姓名">
          </el-input>
        </div>
      </div>

      <!-- 6、经办人联系电话 -->
      <div class="list">
        <div class="left">
          <span>经办人电话</span>
          <span class="require">*</span>
        </div>
        <div class="right">
          <el-input clearable class="right-input" size="small" v-model="formInfo.Telphone" placeholder="请输入经办人联系电话">
          </el-input>
        </div>
      </div>

      <!-- 7、经办人邮箱 -->
      <div class="list">
        <div class="left">
          <span>经办人邮箱</span>
        </div>
        <div class="right">
          <el-input clearable class="right-input" size="small" v-model="formInfo.TrusteesEmail" placeholder="请输入经办人邮箱">
          </el-input>
        </div>
      </div>

      <!-- 8、备注 -->
      <div class="list">
        <div class="left">
          <span>备注</span>
        </div>
        <div class="right">
          <el-input clearable class="right-input" size="small" v-model="formInfo.Remark" placeholder="请输入备注信息">
          </el-input>
        </div>
      </div>

      <!-- 9、楼宇名称 -->
      <div class="list">
        <div class="left">
          <span>楼宇名称</span>
        </div>
        <div class="right">
          {{buildingAddress}}
        </div>
      </div>

      <!-- 10、楼宇地址 -->
      <div class="list">
        <div class="left">
          <span>楼宇地址</span>
        </div>
        <div class="right">
          {{detailsBuildAddress}}
        </div>
      </div>

      <!-- 11、安装地址 -->
      <div class="list">
        <div class="left">
          <span>安装地址</span>
          <span class="require">*</span>
        </div>
        <div class="right">
          <el-input clearable class="right-input w-600" size="small" v-model="formInfo.detailAddress"
            placeholder="请输入安装地址">
          </el-input>
        </div>
      </div>

      <!-- 11、账单地址 -->
      <div class="list">
        <div class="left">
          <span>账单地址</span>
        </div>
        <div class="right">
          <el-input clearable class="right-input w-600" size="small" v-model="formInfo.BillingAddress"
            placeholder="请输入账单地址">
          </el-input>
        </div>
      </div>

      <!-- 票据类型 -->
      <div class="list">
        <div class="left">
          <span>票据类型</span>
          <span class="require">*</span>
        </div>
        <div class="right">
          <el-select size="small" class="right-input" v-model="selectBillType" placeholder="请选择票据类型"
            @change="chooseValue">
            <el-option v-for="item in billTypeList" :key="item.OrderCode" :label="item.OrderNotes"
              :value="item.OrderCode">
            </el-option>
          </el-select>
        </div>
      </div>

      <!-- 12、自定义文本部分 -->
      <div v-if="customTextList.length >0">
        <div class="list" v-for="(item, index) in customTextList" :key="index">
          <div class="left">
            <span>{{item.PropName}}</span>
            <span class="require" v-if="item.PropEmpty == '1'">*</span>
          </div>
          <div class="right">
            <el-input clearable class="right-input" size="small" v-model="item.PropNotes"
              :placeholder="'请输入'+ item.PropName">
            </el-input>
          </div>
        </div>
      </div>

      <!-- 13、服务费部分 -->
      <div class="list" v-if="serviceFeeList.length>0">
        <div class="left">
          <span>服务费明细</span>
        </div>
        <div class="right setting-height">
          <div class="service-table">
            <el-table class="table-data" height="240" :header-cell-style="$config.headerCellStyle" border
              :data="serviceFeeList" style="width: 100%;">
              <el-table-column prop="ServiceName" label="费用名称" align="center"></el-table-column>
              <el-table-column prop="ServiceFee" label="费用金额(元)" align="center"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>

      <div class="list">
        <div class="left">
          <span>{{productInfo.ProductName}}</span>
        </div>
        <div class="right">
          {{productInfo.Price}}元
        </div>
      </div>

      <div class="list">
        <div class="left">
          <span>共计</span>
        </div>
        <div class="right">
          {{totalPrice}}元
        </div>
      </div>

      <div class="action-btns">
        <div class="left"></div>
        <div class="right">
          <el-button size="small" type="primary" class="save-btn" @click="toFillInOrderPic">下一步</el-button>
          <el-button size="small" type="primary" plain class="back-btn" @click="goBack">返回上一步</el-button>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  name: "applicantInformation",
  created() {
    this.UserID = localStorage.getItem("CreateID"); //PC段的管理用的userid为CreateID变量
    this.ordertype = this.$route.query.orderType; //业务类型，注意变量的大小写不同
    switch (this.ordertype) {
      case "GR":
        this.serviceType = "2";
        break;
      case "QY":
        this.serviceType = "3";
        break;
      default:
        this.serviceType = "4";
        break;
    }
    this.buildingAddress = this.$route.query.ProjectName; //楼宇地址
    this.detailsBuildAddress = this.$route.query.detailsBuildAddress; //楼宇详细的地址
    this.ProjetID = Number(this.$route.query.ProjectId); //楼宇id，注意前后变量的命名不同
    this.ProductID = Number(this.$route.query.productId); //产品id
    this.getBillType(); //获取票据类型列表
    this.getProductInfo(this.ProductID, this.ProjetID); //套餐详情
    this.getCustomText(); //获取自定义文本字段(企业或者个人)
  },
  data() {
    return {
      totalPrice: 0,
      /**
       * 一、地址栏参数部分
       */
      serviceType: "", //身份标识
      ordertype: "", //业务类型
      buildingAddress: "", //楼宇地址
      ProjetID: null, //楼宇id
      /**
       * 二、表单数据部分
       */
      telMaxLength: 11,
      productInfo: {}, //套餐信息
      serviceFeeList: [], //服务费列表
      ProductID: null,
      OrderState: "未提交",
      orderid: 0, //接受订单生成后的订单id
      OrderId: 0, //(新增为空)
      OrderNumber: "", //当前订单的订单编号
      UserID: 0, //用户id, 当前用户的UserID
      photoList: [], //点击添加照片对应的数组
      formInfo: {
        ApplicantUser: "", //申请人姓名/公司名称
        LegalName: "", //法人姓名
        Trustees: "", //经办人
        Cellphone: "", //电话
        Telphone: "", //固定电话
        Email: "", //邮箱
        Remark: "", //备注
        detailAddress: "", //详细地址
        BillingAddress: "",
        BillType: "",
        idCard: "", //法人身份证（企业服务）
        businessLicense: "", //营业执照（企业服务）
        payWay: "", //支付周期
        PaymentMethod: "", //缴纳方式
        TrusteesEmail: "" //经办人邮箱
      },
      /**
       * 三、自定义文本部分
       */
      customTextList: [],
      customTextParameter: {
        ordertype: "",
        pageNum: 1,
        pageSize: 10
      },

      /**
       * 四、票据类型
       */
      billTypeList: [],
      billTypeOptions: [],
      selectBillType: "",
      billTypeParameter: {
        flag: "Bill"
      }
    };
  },
  computed: {
    TServiceChange() {
      let total = 0;
      this.serviceFeeList.forEach(item => {
        total += item.ServiceFee;
      });
      return total;
    }
  },
  methods: {
    /**
     * fixed(str) 数据格式转化
     * getCustomText 获取自定义文本字段(企业或者个人)
     * toFillInOrderPic 前往照片上传部分
     * getProductInfo(proid, projectid) 获取套餐信息
     */

    // 票据类型
    async getBillType() {
      let res = await this.$Http.billType(this.billTypeParameter, true);
      if (res.ResultFlag == "0") {
        this.billTypeList = res.ResultSet;
      }
    },

    // 选择票据类型
    chooseValue(value) {
      this.billTypeList.forEach(item => {
        if (value == item.OrderCode) {
          this.selectBillType = item.OrderNotes;
          this.formInfo.BillType = item.OrderNotes;
        }
      });
    },

    // 数据格式转化
    fixed(str) {
      if (!str) str = "0.00";
      let ret = Math.round(parseFloat(str) * 100) / 100;
      let decimal = ret.toString().split(".");
      if (decimal.length === 1) {
        return ret.toString() + ".00";
      }
      if (decimal.length > 1) {
        if (decimal[1].length < 2) {
          return ret.toString() + "0";
        }
        return ret;
      }
      return ret;
    },

    // 获取自定义文本字段(企业或者个人)
    async getCustomText() {
      this.customTextParameter.ordertype = this.ordertype;
      let res = await this.$Http.customText(this.customTextParameter, true);
      if (res.ResultFlag == "0") {
        this.customTextList = res.ResultSet;
      }
    },

    // 获取套餐信息
    async getProductInfo(proid, projectid) {
      let res = await this.$Http.productInfo(
        {
          proflag: "Detail",
          proid: proid,
          projectid: projectid
        },
        true
      );
      if (res.ResultFlag == "0") {
        this.productInfo = res.ResultSet;
        this.serviceFeeList = this.productInfo.ServiceList;
        let total = 0;
        this.serviceFeeList.forEach(item => {
          total += item.ServiceFee;
        });
        this.totalPrice = total + this.productInfo.Price;
      }
    },

    // 下一步
    toFillInOrderPic() {
      switch (this.serviceType) {
        case "2":
          /**
           * 个人业务申请
           * 需要校验的字段有：申请人姓名、手机号码、邮箱、证件号码，地址等
           */

          if (!this.formInfo.ApplicantUser) {
            this.$message.warning("请填写申请人姓名");
          } else if (!this.formInfo.Cellphone) {
            this.$message.warning("请填写联系电话");
          } else if (
            this.formInfo.Email &&
            !this.$check.isEmail(this.formInfo.Email)
          ) {
            this.$message.error("邮箱格式不正确");
          } else if (!this.formInfo.detailAddress) {
            this.$message.warning("请填写安装地址");
          } else if (!this.formInfo.detailAddress) {
            this.$message.warning("请填写安装地址");
          } else {
            /**
             * 两种情况：
             * A、自定义文本字段存在
             *   1、必填字段填写完整，允许提交；
             *   2、必填字段填写不完整，不允许提交；
             * B、自定义文本字段不存在，直接提交
             */

            if (this.customTextList.length > 0) {
              let flag = true;
              for (let index = 0; index < this.customTextList.length; index++) {
                if (
                  this.customTextList[index].PropEmpty == "1" &&
                  !this.customTextList[index].PropNotes
                ) {
                  flag = false;
                  this.$message.warning(
                    "请填写" + this.customTextList[index].PropName
                  );
                  break;
                }
              }
              if (flag) {
                this.submitOrder();
              }
            } else {
              this.submitOrder();
            }
          }
          break;
        case "3":
          /**
           * 企业业务申请
           * 需要校验的字段有：公司名称、法人姓名、经办人姓名、手机号码、固定电话、邮箱、证件号码、地址等
           */

          if (!this.formInfo.ApplicantUser) {
            this.$message.warning("请填写企业名称");
          } else if (!this.formInfo.LegalName) {
            this.$message.warning("请填写法人姓名");
          } else if (!this.formInfo.Cellphone) {
            this.$message.warning("请填写法人手机号码");
          } else if (
            this.formInfo.Cellphone &&
            !this.$check.checkOutTel(this.formInfo.Cellphone)
          ) {
            this.$message.error("法人手机号码错误");
          } else if (
            this.formInfo.Email &&
            !this.$check.isEmail(this.formInfo.Email)
          ) {
            this.$message.error("法人邮箱格式不正确");
          } else if (!this.formInfo.Trustees) {
            this.$message.warning("请填写经办人姓名");
          } else if (!this.formInfo.TrusteesEmail) {
            this.$message.warning("请填写经办人邮箱");
          } else if (
            this.formInfo.TrusteesEmail &&
            !this.$check.isEmail(this.formInfo.TrusteesEmail)
          ) {
            this.$message.error("经办人邮箱格式不正确");
          } else if (!this.formInfo.BillType) {
            this.$message.warning("请选择票据类型");
          } else if (!this.formInfo.detailAddress) {
            this.$message.warning("请填写安装地址");
          } else {
            /**
             * 两种情况：
             * A、自定义文本字段存在
             *   1、必填字段填写完整，允许提交；
             *   2、必填字段填写不完整，不允许提交；
             * B、自定义文本字段不存在，直接提交
             */

            // A、自定义文本字段存在
            if (this.customTextList.length > 0) {
              let flag = true;
              for (let index = 0; index < this.customTextList.length; index++) {
                if (
                  this.customTextList[index].PropEmpty == "1" &&
                  !this.customTextList[index].PropNotes
                ) {
                  flag = false;
                  this.$message.warning(
                    "请填写" + this.customTextList[index].PropName
                  );
                  break;
                }
              }
              if (flag) {
                this.submitOrder();
              }
            } else {
              // B、自定义文本字段不存在，直接提交
              this.submitOrder();
            }
          }
          break;
      }
    },

    // 提交订单
    async submitOrder() {
      let OrderProps = [],
        OrderImages = [],
        OrderServiceFee = [];
      this.customTextList.forEach(item => {
        OrderProps.push({
          PropId: item.ID,
          PropName: item.PropName,
          OrderType: this.ordertype,
          PropValue: item.PropNotes || ""
        });
      });
      this.serviceFeeList.forEach(item => {
        OrderServiceFee.push({
          // ID: 0, //新增不需要
          OrderId: this.OrderId,
          OrderType: this.ordertype,
          ServiceId: item.ID,
          ServiceName: item.ServiceName,
          ServiceValue: item.ServiceFee
        });
      });

      let reqdata = {
        reqdata: JSON.stringify({
          // ID: 0,  //新增不需要
          OrderNumber: this.OrderNumber, //订单号（新增为空）
          OrderType: this.ordertype, //服务类型
          ProductID: this.ProductID, // 产品id
          ProjetID: this.ProjetID, // 楼宇地址id
          ApplicantUser: this.formInfo.ApplicantUser, // 申请人/单位名称
          Trustees: this.formInfo.Trustees, // 经办人
          Cellphone: this.formInfo.Cellphone, // 手机
          Email: this.formInfo.Email, // 邮箱
          Address: this.detailsBuildAddress + this.formInfo.detailAddress, //地址
          TrusteesEmail: this.formInfo.TrusteesEmail, // 经办人邮箱
          BillingAddress: this.formInfo.BillingAddress, // 账单地址
          BillType: this.formInfo.BillType, //票据类型
          UserID: this.UserID, //用户id
          OrderState: this.OrderState, //订单状态（草稿、未付款、已完成）
          Price: this.fixed(this.productInfo.Price), // 价格
          LegalName: this.formInfo.LegalName, //法人姓名
          Telphone: this.formInfo.Telphone, //固定电话
          TServiceChange: this.fixed(this.TServiceChange), // 服务费合计
          PaymentMethod: this.formInfo.PaymentMethod, //缴纳方式
          Remark: this.formInfo.Remark, //备注
          OrderProps: OrderProps, //自定义数组类型
          OrderImages: OrderImages,
          OrderServiceFee: OrderServiceFee //订单服务费
        })
      };
      let res = await this.$Http.submitOrder(reqdata, true);
      if (res.ResultFlag == "0") {
        this.orderid = res.ResultSet;
        this.$router.push({
          path: `/pictureUpload`,
          query: {
            orderid: this.orderid,
            ordertype: this.ordertype
          }
        });
      }
    },

    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/applicantInformation";
</style>