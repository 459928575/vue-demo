<template>
  <div class="box">
    <!-- 1、新增部分 -->
    <div class="search-part">
      <el-button class="add-btn" type="success" size="small" icon="el-icon-circle-plus-outline" @click="addRule">新增积分规则
      </el-button>
    </div>
    <!-- 2、表格数据 -->
    <el-table v-loading="loading" :data="ruleList" style="width: 100%" :header-cell-style="$config.headerCellStyle" border>
      <el-table-column prop="RuleName" label="规则名称" align="center"></el-table-column>
      <el-table-column prop="PayPoint" label="付款积分" align="center"></el-table-column>
      <el-table-column prop="SharePoint" label="分享积分" align="center"></el-table-column>
      <el-table-column prop="OrderPercent" label="积分比例" align="center"></el-table-column>
      <el-table-column prop="UpdateName" label="更新人" align="center"></el-table-column>
      <el-table-column prop="UpdateTime" label="更新时间" align="center"></el-table-column>
      <el-table-column prop="Remark" label="备注" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" width="300" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleView(scope.$index, scope.row)">查看详情</el-button>
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" :disabled="scope.row.SalesTypeId == 0" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination :current-page.sync="ruleListParameter.pageNum" @current-change="handleCurrentChange" background layout="total, prev, pager, next, jumper" :total="ResultTotal">
      </el-pagination>
    </div>

    <!-- 3、详情 -->
    <el-drawer class="order-details" :direction="direction" :title="currentRuleInfo.RuleName" :visible.sync="dialogFormVisible">
      <div class="order-info">
        <div class="list">
          <div class="list-title">积分规则名称</div>
          <div class="list-content">{{currentRuleInfo.RuleName}}</div>
        </div>
        <div class="list">
          <div class="list-title">付款积分</div>
          <div class="list-content">{{currentRuleInfo.PayPoint}}分</div>
        </div>
        <div class="list">
          <div class="list-title">分享积分</div>
          <div class="list-content">{{currentRuleInfo.SharePoint}}分</div>
        </div>
        <div class="list">
          <div class="list-title">积分比例</div>
          <div class="list-content">{{currentRuleInfo.OrderPercent}}%</div>
        </div>
        <div class="list">
          <div class="list-title">备注</div>
          <div class="list-content">{{currentRuleInfo.Remark}}</div>
        </div>
        <div class="list">
          <div class="list-title">更新人</div>
          <div class="list-content">{{currentRuleInfo.UpdateName}}</div>
        </div>
        <div class="list">
          <div class="list-title">更新日期</div>
          <div class="list-content">{{currentRuleInfo.UpdateTime}}</div>
        </div>
      </div>
    </el-drawer>

  </div>
</template>

<script>
export default {
  name: "ruleList",
  created() {
    this.getRuleList();
  },
  data() {
    return {
      /**
       * 规则列表部分
       */
      ResultTotal: 0, //数据总量
      ruleListParameter: {
        flag: "All",
        pageNum: 1,
        pageSize: 10
      },
      ruleList: [], //规则数据

      /**
       * 规则详情部分
       */
      ruleDetailsParameter: {
        flag: "Detail",
        ruleid: null
      },
      currentRuleInfo: {},

      /**
       * 抽屉部分
       */

      dialogFormVisible: false,
      direction: "rtl",
      loading: true, //数据加载标识

      /**
       * 删除规则部分
       */
      delRuleParameter: {
        flag: "Del",
        ruleid: null
      }
    };
  },
  methods: {
    // 获取积分规则列表
    async getRuleList() {
      let res = await this.$Http.ruleList(this.ruleListParameter, true);
      if (res.ResultFlag == "0") {
        this.ruleList = res.ResultSet;
        this.ResultTotal = res.ResultTotal;
        this.loading = false;
      } else {
        this.$message.error(res.ResultSet);
      }
    },

    // 查看详情
    handleView(index, row) {
      this.ruleDetailsParameter.ruleid = row.ID;
      this.getRuleDetails();
    },

    handleEdit(index, row) {
      this.$router.push({
        path: "/intergralRules",
        query: {
          ruleid: row.ID
        }
      });
    },
    // 获取规则详情
    async getRuleDetails() {
      let res = await this.$Http.ruleDetails(this.ruleDetailsParameter, true);
      if (res.ResultFlag == "0") {
        this.currentRuleInfo = res.ResultSet;
        this.dialogFormVisible = true;
      } else {
        this.$message.error(res.ResultSet);
      }
    },

    // 删除产品弹窗
    handleDelete(index, row) {
      let _this = this;
      _this.delRuleParameter.ruleid = row.ID;
      _this
        .$confirm("此操作将永久删除该规则, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.deleteRule();
        })
        .catch(() => {
          _this.delRuleParameter.ruleid = null;
        });
    },

    // 删除规则
    async deleteRule() {
      let res = await this.$Http.delRule(this.delRuleParameter, true);
      if (res.ResultFlag == "0") {
        this.$message.success("删除成功");
        this.getRuleList();
      } else {
        this.$message.error("删除失败");
      }
    },

    // 分页
    handleCurrentChange(currentPage) {
      this.ruleListParameter.pageNum = currentPage;
      this.getRuleList();
    },

    // 新增产品
    addRule() {
      this.$router.push({
        path: "/intergralRules",
        query: {
          ruleid: 0
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/productList";
@import "../style/ruleList";
</style>
