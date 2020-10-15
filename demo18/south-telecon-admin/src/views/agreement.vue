<template>
  <div class="agreement-bind">
    <div class="header">
      <div class="header-left">标题</div>
      <div class="header-content">订单协议</div>
    </div>
    <div class="main-part">
      <div class="main-part-left">协议</div>
      <div class="main-part-content" v-html="Agreement"></div>
    </div>
    <div class="bottom-part">
      <div class="bottom-part-left"></div>
      <el-button size="small" class="bottom-part-content" type="primary" @click="agreeAfter">同意</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "agreement",
  created() {
    this.orderAgreementParameter.ordertype = this.$route.query.ordertype;
    this.orderid = Number(this.$route.query.orderid);
    this.getOrderAgreement();
  },
  data() {
    return {
      /**
       * 订单协议
       */
      orderAgreementParameter: {
        ordertype: ""
      },
      Agreement: "",
      /**
       * 绑定订单协议
       */
      saveOrderAgreementParameter: {
        orderflag: "order",
        reqdata: ""
      },
      reqdata: {
        ID: null,
        UserID:Number(localStorage.getItem("CreateID")),
        Agreement: ""
      }
    };
  },
  methods: {
    //  获取订单协议
    async getOrderAgreement() {
      let res = await this.$Http.orderAgreement(
        this.orderAgreementParameter,
        true
      );
      if (res.ResultFlag == "0") {
        let str = res.ResultSet.AgreementContent;
        this.Agreement = str.replace(/↵/g, "<br/>");
      }else{
        this.$message.error('数据加载失败')
      }

    },

    // 同意协议
    agreeAfter() {
      this.reqdata.ID = Number(this.orderid);
      this.reqdata.Agreement = this.Agreement;
      this.saveOrderAgreementParameter.reqdata = JSON.stringify(this.reqdata);
      this.submitOrderAgreement();
    },

    // 协议与订单绑定
    async submitOrderAgreement() {
      let res = await this.$Http.saveOrderAgreement(
        this.saveOrderAgreementParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.$router.push({
          path: "/orderList"
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/agreement";
</style>
