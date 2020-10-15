<template>
  <div class="building-price">
    <div class="info-container">
      <div class="info-list">
        <div class="left">客户选择</div>
        <div class="right">
          <el-select size="small" :disabled="reqdata.RuleName == '默认规则'" v-model="selectType" placeholder="请选择客户" @change="chooseDistributor">
            <el-option class="right-input" v-for="item in distributorsList" :key="item.ID" :label="item.SalesTypeName" :value="item.ID">
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="info-list">
        <div class="left">规则名称</div>
        <div class="right">
          <el-input size="small" class="right-input" :disabled="reqdata.RuleName == '默认规则'" v-model="reqdata.RuleName " placeholder="请输入规则名称"></el-input>
        </div>
      </div>

      <div class="info-list">
        <div class="left">付款赢积分</div>
        <div class="right">
          <el-input-number class="right-input" v-model="reqdata.PayPoint  " controls-position="right" size="small" :min="0" :step="1" :controls="false"></el-input-number>
          <span class="score">元</span>
          <span class="tips-txt">示例：每付款"X"元，可得1积分。</span>
        </div>
      </div>

      <div class="info-list">
        <div class="left">分享赢积分</div>
        <div class="right">
          <el-input-number class="right-input" v-model="reqdata.SharePoint" controls-position="right" size="small" :min="0" :step="1" :controls="false"></el-input-number>
          <span class="score">元</span>
          <span class="tips-txt">示例：每分享"Y"元，可得1积分。</span>
        </div>
      </div>

      <div class="info-list p-0">
        <div class="left">备注</div>
        <div class="right border border-none">
          <el-input clearable class="right-input textarea" size="small" type="textarea" :rows="4" v-model="reqdata.Remark" placeholder="请输入相关备注"></el-input>
        </div>
      </div>

      <!-- <div class="info-list">
        <div class="left">使用积分</div>
        <div class="right">
          <el-input-number class="right-input" v-model="reqdata.OrderPoint" controls-position="right" size="small"
            :min="0" :step="1" :controls="false"></el-input-number>
          <span class="score">积分</span>
        </div>
      </div> -->

      <div class="info-list">
        <div class="left">使用比例</div>
        <div class="right">
          <el-input-number class="right-input" v-model="reqdata.OrderPercent" controls-position="right" size="small" :min="0" :step="1" :controls="false"></el-input-number>
          <span class="score">%</span>
        </div>
      </div>

      <div class="info-list">
        <div class="left"></div>
        <div class="right tips">
          <i class="el-icon-warning-outline"></i>
          <span class="text">备注：使用积分数量按以上规则最小值确定</span>
        </div>
      </div>

      <div class="info-list">
        <div class="left"></div>
        <div class="right border-top">
          <el-button size="small" type="primary" class="save-btn" @click="save">保存</el-button>
          <el-button size="small" type="primary" plain class="back-btn" @click="back">返回</el-button>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
export default {
  name: "reqdata",
  created() {
    this.getDistributorsList();
    /**
     * 注意数据类型的转换，在进进入新增页面的时候，路由中的ruleid，其实为string类型，刷新之后，会执行加载规则详情的函数，这点事不符合要求的。
     */
    this.ruleDetailsParameter.ruleid = Number(this.$route.query.ruleid);
    if (this.ruleDetailsParameter.ruleid) {
      this.getRuleDetails();
    }
  },
  data() {
    return {
      /**
       * 规则详情部分
       */
      ruleDetailsParameter: {
        flag: "Detail",
        ruleid: null
      },
      currentRuleInfo: {},
      // 客户选择下拉
      distributorsListParameter: {
        flag: "saletype",
        pageNum: 1,
        pageSize: 10000
      },
      newRulesParameter: {
        flag: "Man",
        reqdata: ""
      },
      distributorsList: [],
      selectType: "",
      reqdata: {
        ID: 0,
        RuleName: "", //规则名称
        SalesTypeId: 0, //客户分类ID
        PayPoint: 0, //支付得积分
        SharePoint: 0, //分享得积分
        Remark: "", //备注
        // OrderPoint: 0, //使用积分
        OrderPercent: 0, //订使用积分百分比
        CreateID: Number(localStorage.getItem("CreateID"))
      }
    };
  },
  methods: {
    // 获取规则详情
    async getRuleDetails() {
      let res = await this.$Http.ruleDetails(this.ruleDetailsParameter, true);
      if (res.ResultFlag == "0") {
        this.currentRuleInfo = res.ResultSet;
        this.reqdata.ID = this.currentRuleInfo.ID;
        this.reqdata.RuleName = this.currentRuleInfo.RuleName;
        this.reqdata.PayPoint = this.currentRuleInfo.PayPoint;
        this.reqdata.SharePoint = this.currentRuleInfo.SharePoint;
        this.reqdata.Remark = this.currentRuleInfo.Remark;
        // this.reqdata.OrderPoint = Number(this.currentRuleInfo.OrderPoint);
        this.reqdata.OrderPercent = Number(this.currentRuleInfo.OrderPercent);
        this.reqdata.SalesTypeId = this.currentRuleInfo.SalesTypeId;
        this.distributorsList.forEach(item => {
          if (this.currentRuleInfo.SalesTypeId == item.ID) {
            this.selectType = item.SalesTypeName;
          }
        });
      }
    },

    // 客户列表
    async getDistributorsList() {
      let res = await this.$Http.distributorsList(
        this.distributorsListParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.distributorsList = res.ResultSet;
      }else{
        this.$message.error('数据加载失败')
      }
    },

    // 选择客户
    chooseDistributor(SalesTypeId) {
      this.reqdata.SalesTypeId = SalesTypeId;
      this.distributorsList.forEach(item => {
        if (SalesTypeId == item.ID) {
          this.selectType = item.SalesTypeName;
        }
      });
    },

    // 保存按钮
    save() {
      if (!this.reqdata.RuleName) {
        this.$message.warning("请填写规则名称");
      } else if (this.reqdata.RuleName != '默认规则' && !this.reqdata.SalesTypeId) {
        this.$message.warning("请选择客户分类");
      } else if (!this.reqdata.PayPoint) {
        this.$message.warning("请填写付款积分");
      } else if (!this.reqdata.SharePoint) {
        this.$message.warning("请填写分享积分");
      } else if (!this.reqdata.OrderPercent) {
        this.$message.warning("请填写使用积分百分比");
      } else {
        this.addNewRules();
      }
    },

    //新增规格
    async addNewRules() {
      this.newRulesParameter.reqdata = JSON.stringify(this.reqdata);
      let res = await this.$Http.newRules(this.newRulesParameter, true);
      if (res.ResultFlag == "0") {
        this.$message.success("保存成功");
        this.$router.push({
          path: "/ruleList"
        });
      } else {
        this.$message.warning(res.ResultMessage);
      }
    },
    back() {
      this.$router.push({
        path: "/ruleList"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/intergralRules";

.score {
  margin-left: 10px;
}
.tips-txt {
  color: #999;
  font-size: 14px;
  margin-left: 10px;
  color: red;
}

.border-none {
  border: none !important;
}

.border-top {
  border-top: 1px solid #e1dee7;
}

.tips {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  .el-icon-warning-outline {
    color: red;
    // font-weight: bold;
  }

  .text {
    color: #595959;
    font-size: 14px;
    margin-left: 10px;
  }
}
</style>
