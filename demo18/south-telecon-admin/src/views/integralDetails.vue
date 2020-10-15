  <template>
  <div class="box" v-loading="loading">
    <div class="header">
      <h3>会员信息</h3>
    </div>
    <el-table :data="userInfo" :header-cell-style="$config.headerCellStyle" border>
      <el-table-column prop="NickName" label="姓名" align="center"></el-table-column>
      <el-table-column prop="Phone" label="电话" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.Phone || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="Address" label="地址" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.Address || '--'}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="header">
      <h3>积分总数</h3>
      <span class="divider">:</span>
      <span class="num">{{ResultTotal || 0}}</span>
      <el-button class="refresh-btn" icon="el-icon-refresh-right" size="small" @click="changeScore">积分变更</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" :header-cell-style="$config.headerCellStyle" border>
      <el-table-column prop="ItemDescription" label="套餐名称" align="center"></el-table-column>
      <el-table-column prop="UpdateTime" label="更新时间" align="center"></el-table-column>
      <el-table-column prop="Point" label="积分明细" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.Point">
            <span class="red" v-if="scope.row.PointType=='0'">+</span>
            <span class="black" v-else>-</span>
            <span>{{scope.row.Point || 0}} 分</span>
          </div>
          <div v-else>0 分</div>

        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="viewDetails(scope.$index, scope.row)">查看明细</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <!-- <div class="page">
      <el-pagination background layout="total, prev, pager, next, jumper" :total="10">
      </el-pagination>
    </div> -->

    <!-- 积分变更的弹窗 -->
    <el-dialog :close-on-click-modal="false" class="use-modal" title="积分变更" :visible.sync="isShowModal">
      <el-form :model="form">
        <el-form-item label="变更名称" :label-width="formLabelWidth">
          <el-input clearable class="content-input" v-model="reqdata.PointName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="积分数量" :label-width="formLabelWidth">
          <el-input-number size="small" class="content-input" v-model="reqdata.Point" controls-position="right" :controls="false" :min="0" :step="1"></el-input-number>
        </el-form-item>
        <el-form-item label="积分规则" :label-width="formLabelWidth">
          <el-select :disabled="true" v-model="selectRule" placeholder="请选择积分规则" @change="num=>changeType(num,'B')">
            <el-option v-for="item in integralRuleOptions" :key="item.ID" :label="item.RuleName" :value="item.ID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变更类型" :label-width="formLabelWidth">
          <el-select v-model="selectType" placeholder="请选择积分变动类型" @change="num=>changeType(num,'A')">
            <el-option v-for="item in integralChangeOptions" :key="item.num" :label="item.text" :value="item.num">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变更日期" :label-width="formLabelWidth">
          <el-date-picker v-model="reqdata.PointDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="变更备注" :label-width="formLabelWidth">
          <el-input clearable class="content-input" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="reqdata.Remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowModal = false">取 消</el-button>
        <el-button type="primary" @click="confirmChange">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

  <script>
export default {
  name: "integralDetails",
  created() {
    this.integralDetailsParameter.type = this.$route.query.UserType;
    this.integralDetailsParameter.userid = Number(this.$route.query.userid);
    this.reqdata.UserID = Number(this.$route.query.userid);
    this.saletypeidParameter.userid = Number(this.$route.query.userid);
    this.getSaletypeid();
    this.getIntegralDetails(); //积分详情
    // this.getRuleList(); //积分规则
  },
  data() {
    return {
      /**
       * 获取用户的saleTypeId
       */
      saletypeidParameter: {
        userflag: "Detail",
        userid: null
      },
      /**
       * 获取规则名称
       */
      rulesNameParameter: {
        flag: "getrulesname",
        saletypeid: null
      },

      /**
       *  积分详情
       */
      loading: true,
      integralDetailsParameter: {
        flag: "Detail",
        userid: 0,
        type: ""
      },
      ResultTotal: 0,
      tableData: [],
      userInfo: [],

      /**
       * 积分变更
       */
      formLabelWidth: "80px",
      isShowModal: false,
      integralChangeParameter: {
        flag: "Man",
        reqdata: ""
      },
      reqdata: {
        ID: 0, //新增为0
        Point: 0, // 积分
        PointRuleId: 0, //积分规则
        PointType: 0, // 0:新增积分 1：使用积分
        UserID: 0, //
        PointDate: "", //积分日期
        PointName: "", //积分名称
        Remark: "", //备注
        CreateID: Number(localStorage.getItem("CreateID"))
      },
      integralChangeOptions: [
        { num: 0, text: "新增" },
        { num: 1, text: "使用" }
      ],
      selectType: "",
      selectRule: "",

      /**
       * 积分规则列表
       */
      ruleListParameter: {
        flag: "All",
        pageNum: 1,
        pageSize: 10000
      },
      integralRuleOptions: []
    };
  },
  methods: {
    // 获取SaleTypeID
    async getSaletypeid() {
      let res = await this.$Http.saleTypeId(this.saletypeidParameter, true);
      if (res.ResultFlag == "0") {
        let tempObj = res.ResultSet;
        this.rulesNameParameter.saletypeid = tempObj.SaleTypeID;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 获取规则名称
    async getRuleName() {
      let res = await this.$Http.rulesname(this.rulesNameParameter, true);
      if (res.ResultFlag == "0") {
        this.reqdata.PointRuleId = res.ResultSet.ID;
        this.selectRule = res.ResultSet.RuleName;
        this.isShowModal = true;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 获取积分规则列表下拉选择
    async getRuleList() {
      let res = await this.$Http.ruleList(this.ruleListParameter, true);
      if (res.ResultFlag == "0") {
        this.integralRuleOptions = res.ResultSet;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 积分详情
    async getIntegralDetails() {
      this.loading = true;
      let res = await this.$Http.integralDetails(
        this.integralDetailsParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.userInfo = res.ResultSet;
        this.tableData = res.ResultSet1;
        this.ResultTotal = res.ResultTotal;
        this.loading = false;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 积分变更类型选择
    changeType(num, str) {
      switch (str) {
        case "A":
          this.reqdata.PointType = num;
          this.integralChangeOptions.forEach(item => {
            if (num == item.num) {
              this.selectType = item.text;
            }
          });
          break;
        default:
          this.reqdata.PointRuleId = num;
          this.integralChangeOptions.forEach(item => {
            if (num == item.ID) {
              this.selectRule = item.RuleName;
            }
          });
          break;
      }
    },

    // 确定变更积分
    confirmChange() {
      if (!this.reqdata.PointName) {
        this.$message.warning("请输入积分名称");
      } else if (!this.reqdata.Point) {
        this.$message.warning("请输入积分数量");
      } else if (!this.selectType) {
        this.$message.warning("请选择积分变更类型");
      } else if (!this.reqdata.PointDate) {
        this.$message.warning("请选择积分日期");
      } else if (!this.reqdata.Remark) {
        this.$message.warning("请输入积分备注");
      } else {
        this.integralChangeParameter.reqdata = JSON.stringify(this.reqdata);
        this.integralChange(); //积分变更函数
      }
    },

    // 积分变更
    async integralChange() {
      let res = await this.$Http.integralChange(
        this.integralChangeParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.$message.success("保存成功");
        this.isShowModal = false;
        this.$router.push({
          path: "/integralList"
        });
      } else {
        this.$message.error("保存失败");
      }
    },



    // 积分变更
    changeScore() {
      this.reqdata.Point = 0;
      this.reqdata.PointRuleId = 0;
      this.selectType = "";
      // this.selectRule = "";
      this.reqdata.PointDate = "";
      this.reqdata.PointName = "";
      this.reqdata.Remark = "";
      this.getRuleName();
    },

    // 查看明细
    viewDetails(index, row) {
      this.$router.push({
        path: `/integralHistory`
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../style/integralDetails';

</style>