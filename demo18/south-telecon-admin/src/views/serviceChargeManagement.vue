<template>
  <div class="service-charge-management">
    <div class="middle">
      <div class="title">分类</div>
      <div class="right-content">
        <el-select v-model="selecttype" placeholder="请选择业务分类" @change="chooseType">
          <el-option v-for="item in typeOptions" :key="item.OrderCode" :label="item.OrderNotes" :value="item.OrderCode">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="middle">
      <div class="title">名称</div>
      <div class="right-content">
        <el-input clearable size="small" v-model="currentServiceFeeInfo.ServiceName" placeholder="请输入服务费名称">
        </el-input>
      </div>
    </div>
    <div class="middle">
      <div class="title">金额</div>
      <div class="right-content">
        <el-input-number size="small" v-model="currentServiceFeeInfo.ServiceFeeValue" controls-position="right" :min="0"
          placeholder="">
        </el-input-number>
      </div>
    </div>
    <div class="middle">
      <div class="title">备注</div>
      <div class="right-content">
        <el-input clearable size="small" v-model="currentServiceFeeInfo.ServiceNotes" placeholder="请输入备注">
        </el-input>
      </div>
    </div>
    <div class="middle">
      <div class="title"></div>
      <div class="right-content">
        <el-button size="mini" type="primary" class="save-btn" @click="saveServiceFee">保存</el-button>
        <el-button size="mini" type="primary" plain class="back-btn" @click="goBack">返回</el-button>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  name: "serviceChargeManagement",
  created() {
    this.CreateID = localStorage.getItem("CreateID");
    this.serviceFeeDetailsParameter.serviceid = Number(
      this.$route.query.serviceid
    );
    this.getTypeOptions(); //加载分类配置列表
  },
  data() {
    return {
      /**
       * 分类配置部分
       */
      typeOptions: [], //业务分类配置
      newOrderTypeParameter: {
        flag: "New"
      },
      /**
       * 服务费详情
       */
      serviceFeeDetailsParameter: {
        feeflag: "Detail",
        serviceid: null
      },

      ID: 0,
      CreateID: null,

      ServiceNotes: "", //服务名称
      selecttype: "", //选择的业务类型代号
      selectCode: "", //选择的业务类型
      chargeList: [], //添加的服务费明细

      /**
       * 新增/编辑服务费部分
       */
      newServiceFeeParameter: {
        feeflag: "Man",
        reqdata: ""
      },
      currentServiceFeeInfo: {
        ID: 0, //  新增为0，修改传ID
        OrderType: "", //  个人：GR 企业：QY 其他：QT
        ServiceName: "", //费用名称
        ServiceFeeValue: 0, // 费用金额
        ServiceNotes: "", // 服务费备注
        CreateID: Number(localStorage.getItem("CreateID"))
      }
    };
  },
  methods: {
    // 产品详情
    async getServiceFeeDetails() {
      let res = await this.$Http.serviceFeeDetails(
        this.serviceFeeDetailsParameter,
        true
      );
      if (res.ResultFlag == "0") {
        // this.FeeList = this.currentServiceFeeInfo.FeeList;
      }else{
        this.$message.error('数据加载失败')
      }
    },
    goBack() {
      this.$router.push({
        path: "/serviceChargeList"
      });
    },
    // 业务分类列表
    async getTypeOptions() {
      let res = await this.$Http.newOrderType(this.newOrderTypeParameter, true);
      if (res.ResultFlag == "0") {
        this.typeOptions = res.ResultSet;
        this.getServiceFeeDetails();
      }
    },

    // 是否允许提交
    isAllowASubmit() {
      /**
       * 判断：如果一处不符合要求，则终止执行。
       */

      let isAllowASubmitFlag = true; //允许提交

      // 判断情况一
      if (!this.ServiceNotes) {
        isAllowASubmitFlag = false;
        this.$message.warning("请填写服务名称");
        return isAllowASubmitFlag; //不再执行
      }

      // 判断情况二
      if (this.chargeList.length != 0) {
        this.chargeList.forEach(item => {
          if (!(item.ServiceName && item.ServiceFeeValue)) {
            isAllowASubmitFlag = false;
          }
        });
        if (!isAllowASubmitFlag) {
          this.$message.warning("请填写费用名称或费用金额");
          return isAllowASubmitFlag; //不再执行
        }
      } else {
        this.$message.warning("请添加项目");
        isAllowASubmitFlag = false;
        return isAllowASubmitFlag; //不再执行
      }

      if (!this.selecttype) {
        this.$message.warning("请选择业务分类");
        isAllowASubmitFlag = false;
        return isAllowASubmitFlag; //不再执行
      }

      return isAllowASubmitFlag; //不再执行
    },

    // 新增/编辑服务费
    async saveServiceFee() {
      let flag = this.isAllowASubmit();
      if (!flag) {
        return;
      }

      let tempArr = [];
      this.chargeList.forEach(item => {
        tempArr.push({
          ID: item.ID, //新增为0
          CreateID: item.CreateID, //账号id
          OrderType: this.selectCode, //个人：GR 企业：QY 其他：QT
          ServiceNotes: this.ServiceNotes, //服务名称
          ServiceName: item.ServiceName, //费用名称
          ServiceFeeValue: item.ServiceFeeValue //费用金额
        });
      });
      let formData = {
        feeflag: "Man",
        reqdata: JSON.stringify(tempArr)
      };

      let res = await this.$Http.serviceFee(formData, true);
      if (res.ResultFlag == "0") {
        this.$message.success("保存成功");
        this.$router.push({
          path: "/serviceChargeList"
        });
      } else {
        this.$message.error("保存失败");
      }
    },

    // 添加费用名称
    addProject() {
      this.chargeList.push({
        ID: this.ID,
        OrderType: this.selectCode, //个人：GR 企业：QY 其他：QT
        ServiceNotes: this.ServiceNotes, //服务名称
        ServiceName: "", //费用名称
        ServiceFeeValue: 0, //费用金额
        CreateID: this.CreateID, //账号id
        ListProduct: [] //使用的产品
      });
    },

    // 删除费用名称
    delProject(index) {
      this.chargeList.splice(index, 1);
    },

    // 选择分类
    chooseType(type) {
      this.typeOptions.forEach((item, ind) => {
        if (type == item.OrderCode) {
          this.selectCode = this.typeOptions[ind].OrderCode;
          this.selecttype = this.typeOptions[ind].OrderNotes;
        }
      });
      /**
       * 疑问：如果用户点击重新选择了新的分类，但是他没有点击确定，这个时候他没有点击确定，应该如果处理？
       * 问题：1、此时selectCode已经改变了。2、选择的数组multipleSelection应该怎么处理？3、已经适用的产品列表productList应该如何处理？
       *
       */
    }
  },
  computed: {}
};
</script>
<style lang="scss" scoped>
@import "../style/serviceChargeManagement";
</style>