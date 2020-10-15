  <template>
  <div class="box">
    <div class="search-part">
      <el-input clearable size="small" class="search-input" placeholder="请输入促销/活动名称" v-model="salesPromotionListParameter.Promotionsel" @keyup.enter.native="getSalesPromotionList">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button class="search-btn" size="small" @click="getSalesPromotionList">搜索</el-button>
      <el-button class="add-btn" type="success" size="small" icon="el-icon-circle-plus-outline" @click="add">添加促销/活动
      </el-button>
    </div>
    <el-table v-loading="loading" :data="salesPromotionList" style="width: 100%" :header-cell-style="$config.headerCellStyle" border>
      <el-table-column prop="PromotName" label="促销/活动名称" align="center"></el-table-column>
      <el-table-column prop="PromotType" label="类型" align="center"></el-table-column>
      <el-table-column prop="BusinessType" label="业务类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.BusinessType == 'GH'">过户</span>
          <span v-else-if="scope.row.BusinessType == 'XF'">续费</span>
          <span v-else-if="scope.row.BusinessType == 'YJ'">移机</span>
          <span v-else-if="scope.row.BusinessType == 'WX'">维修</span>
          <span v-else-if="scope.row.BusinessType == 'BG'">业务变更</span>
          <span v-else-if="scope.row.BusinessType == 'CC'">拆除</span>
          <span v-else>其他</span>
        </template>
      </el-table-column>
      <el-table-column prop="OrderType" label="业务分类" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.OrderType=='GR'">住宅</span>
          <span v-else-if="scope.row.OrderType=='QY'">企业</span>
          <span v-else>其他</span>
        </template>
      </el-table-column>
      <el-table-column prop="UpdateName" label="更新人" align="center"></el-table-column>
      <el-table-column prop="UpdateTime" label="最后更新时间" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleView(scope.$index, scope.row)">查看详情</el-button>
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination :current-page.sync="salesPromotionListParameter.pageNum" @current-change="handleCurrentChange" background layout="total, prev, pager, next, jumper" :total="ResultTotal"></el-pagination>
    </div>

    <!-- 出校活动详情 -->
    <el-drawer class="sales-drawer" :title="currentSalesPromotionInfo.PromotName" :visible.sync="drawer">
      <div class="sales-promotion">
        <div class="list">
          <div class="title">促销/活动名称</div>
          <div class="content">{{currentSalesPromotionInfo.PromotName}}</div>
        </div>
        <div class="list">
          <div class="title">类型</div>
          <div class="content">{{currentSalesPromotionInfo.PromotType}}</div>
        </div>
        <div class="list">
          <div class="title">业务分类</div>
          <div class="content">{{selectType}}</div>
        </div>
        <div class="list">
          <div class="title">业务类型</div>
          <div class="content">{{selectBusinessType}}</div>
        </div>
        <div class="list">
          <div class="title">更新人</div>
          <div class="content">{{currentSalesPromotionInfo.UpdateName}}</div>
        </div>
        <div class="desc">
          <div class="title">促销/活动内容</div>
          <div class="content">{{currentSalesPromotionInfo.PromotContent}}</div>
        </div>
        <div class="img-container">
          <div class="title">促销/活动图片</div>
          <img class="pic" :src="currentSalesPromotionInfo.PicBase" :alt="currentSalesPromotionInfo.PromotName">
        </div>
      </div>
    </el-drawer>
  </div>
</template>

  <script>
export default {
  name: "salesOrActivity",
  created() {
    this.getTypeOptions();
    this.getBusinessOptions();
    this.getSalesPromotionList();
  },
  data() {
    return {
      loading: true,
      salesPromotionListParameter: {
        Promotionflag: "All",
        pageNum: 1,
        pageSize: 10,
        Promotionsel: ""
      },
      ResultTotal: 0,
      salesPromotionList: [],

      // 业务分类选择
      typeOptions: [],
      newOrderTypeParameter: {
        flag: "New"
      },
      selectType: "",

      // 促销活动详情参数
      salesPromotionDetailsPatameter: {
        Promotionflag: "Detail",
        Promotionid: null
      },
      currentSalesPromotionInfo: {},
      drawer: false,

      // 业务类型列表参数
      maintainOrderTypeParameter: {
        flag: "Maintain"
      },
      businessOptions: [],
      selectBusinessType: ""
    };
  },
  methods: {
    // 业务分类列表
    async getTypeOptions() {
      let res = await this.$Http.newOrderType(this.newOrderTypeParameter, true);
      if (res.ResultFlag == "0") {
        this.typeOptions = res.ResultSet;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 业务类型列表
    async getBusinessOptions() {
      let res = await this.$Http.maintainOrderType(
        this.maintainOrderTypeParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.businessOptions = res.ResultSet;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 获取促销活动详情（该接口应该在getTypeOptions、getBusinessOptions拿到数据后）
    async getSalesPromotionDetails() {
      let res = await this.$Http.salesPromotionDetails(
        this.salesPromotionDetailsPatameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.currentSalesPromotionInfo = res.ResultSet;
        this.typeOptions.forEach(item => {
          if (this.currentSalesPromotionInfo.OrderType == item.OrderCode) {
            this.selectType = item.OrderNotes;
          }
        });
        this.businessOptions.forEach(item => {
          if (this.currentSalesPromotionInfo.BusinessType == item.OrderCode) {
            this.selectBusinessType = item.OrderNotes;
          }
        });
        this.drawer = true;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 获取促销与活动列表
    async getSalesPromotionList() {
      this.loading = true;
      let res = await this.$Http.salesPromotionList(
        this.salesPromotionListParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.salesPromotionList = res.ResultSet;
        this.ResultTotal = res.ResultTotal;
        this.loading = false;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 页码切换
    handleCurrentChange(currentPage) {
      this.salesPromotionListParameter.pageNum = currentPage;
      this.getSalesPromotionList();
    },

    // 查看
    handleView(index, row) {
      this.salesPromotionDetailsPatameter.Promotionid = row.ID;
      this.getSalesPromotionDetails();
    },

    // 编辑
    handleEdit(index, row) {
      this.$router.push({
        path: "/addSalesOrActivity",
        query: {
          ID: row.ID
        }
      });
    },

    // 新增促销活动
    add() {
      this.$router.push({
        path: `/addSalesOrActivity`,
        query: {
          ID: 0
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/productList";
@import "../style/salesOrActivity";
</style>