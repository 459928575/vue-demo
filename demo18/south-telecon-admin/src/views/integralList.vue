  <template>
  <div class="box">
    <div class="search-part">
      <el-input clearable @keyup.enter.native="getIntegralList" size="small" class="search-input" placeholder="请输入姓名" v-model="integralListParameter.pointssearch">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-input clearable size="small" class="search-input" @keyup.enter.native="getIntegralList" placeholder="请输入联系电话" v-model="integralListParameter.phone" maxlength="11" show-word-limit type="number">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button size="small" class="search-btn" @click="getIntegralList">搜索</el-button>
    </div>
    <el-table v-loading="loading" :data="integralList" style="width: 100%" :header-cell-style="$config.headerCellStyle" border>
      <el-table-column prop="Name" label="姓名" align="center"></el-table-column>
      <el-table-column prop="UserAddress" label="地址" align="center"></el-table-column>
      <el-table-column prop="Point" label="积分数量" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.Point || 0}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="CellPhone" label="联系电话" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.CellPhone || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="UpdateTime" label="最后积分变更时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.UpdateTime || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleView(scope.$index, scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination :current-page.sync="integralListParameter.pageNum" @current-change="handleCurrentChange" background layout="total, prev, pager, next, jumper" :total="ResultTotal">
      </el-pagination>
    </div>
  </div>
</template>

  <script>
export default {
  name: "integralList",
  created() {
    this.getIntegralList();
  },
  data() {
    return {
      loading: true,
      integralList: [],
      ResultTotal: 0,
      integralListParameter: {
        flag: "All",
        pointssearch: "",
        phone: "",
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  methods: {
    // 积分列表
    async getIntegralList() {
      let res = await this.$Http.integralList(this.integralListParameter, true);
      if (res.ResultFlag == "0") {
        this.integralList = res.ResultSet;
        this.ResultTotal = res.ResultTotal;
        this.loading = false;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    //分页
    handleCurrentChange(currentPage) {
      this.integralListParameter.pageNum = currentPage;
      this.getIntegralList();
    },

    // 详情
    handleView(index, row) {
      this.$router.push({
        path: "/integralDetails",
        query: {
          UserType: row.UserType,
          userid: row.ID
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/productList";
</style>