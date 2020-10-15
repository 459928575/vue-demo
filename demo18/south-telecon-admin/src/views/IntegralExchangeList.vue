  <template>
  <div class="box">
    <!-- 1、筛选部分 -->
    <div class="search-part">
      <el-input clearable size="small" class="search-input" placeholder="请输入物品名称" v-model="exchangeListParameter.search" @keyup.enter.native="getExchangeList">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <!-- <el-radio-group v-model="category" size="small" @change="changeSelect">
        <el-radio-button :label="item.label" v-for="(item, index) in priceOptions" :key="index"></el-radio-button>
      </el-radio-group> -->
      <el-button class="search-btn" size="small" @click="getExchangeList">搜索</el-button>
      <el-button class="add-btn" type="success" size="small" icon="el-icon-circle-plus-outline" @click="add">添加兑换内容
      </el-button>
    </div>

    <!-- 2、表格数据 -->
    <el-table v-loading="loading" :data="exchangeList" style="width: 100%" :header-cell-style="$config.headerCellStyle" border>
      <el-table-column prop="ExchangeName" label="物品名称" align="center"></el-table-column>
      <el-table-column prop="ExchangeContent" label="物品描述" align="center"></el-table-column>
      <el-table-column prop="Point" label="所需积分值" align="center"></el-table-column>
      <el-table-column prop="Remark" label="备注" align="center"></el-table-column>
      <el-table-column prop="UpdateName" label="更新人" align="center"></el-table-column>
      <el-table-column prop="UpdateTime" label="最后更新时间" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" width="300" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleView(scope.$index, scope.row)">查看详情</el-button>
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination :current-page.sync="exchangeListParameter.pageNum" @current-change="handleCurrentChange" background layout="total, prev, pager, next, jumper" :total="ResultTotal"></el-pagination>
    </div>

    <!-- 3、兑换产品 -->
    <el-drawer class="sales-drawer" :title="currentExchangeInfo.ExchangeName" :visible.sync="drawer">
      <div class="sales-promotion" :style="{height:scrollerHeight}">
        <div class="list">
          <div class="title">物品名称</div>
          <div class="content">{{currentExchangeInfo.ExchangeName}}</div>
        </div>
        <div class="desc">
          <div class="title">物品描述</div>
          <div class="content">{{currentExchangeInfo.ExchangeContent}}</div>
        </div>
        <div class="list">
          <div class="title">所需积分</div>
          <div class="content">{{currentExchangeInfo.Point}}</div>
        </div>
        <div class="list">
          <div class="title">更新人</div>
          <div class="content">{{currentExchangeInfo.UpdateName}}</div>
        </div>
        <div class="desc">
          <div class="title">备注</div>
          <div class="content">{{currentExchangeInfo.Remark}}</div>
        </div>
        <div class="img-container">
          <div class="title">物品图片</div>
          <img class="pic" @click="viewPicture" :src="currentExchangeInfo.PicBase" :alt="currentExchangeInfo.ExchangeName">
        </div>
      </div>
    </el-drawer>

    <!-- 4、预览图片 -->
    <el-dialog :close-on-click-modal="false" :visible.sync="isViewPicture">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

  <script>
export default {
  name: "IntegralExchangeList",
  created() {
    this.getExchangeList();
  },
  data() {
    return {
      viewportH:0,
      /**
       * 图片预览
       */
      isViewPicture: false,
      dialogImageUrl: "",

      /**
       * 兑换列表
       */
      category: "全部",
      priceOptions: [
        { label: "全部", value: "" },
        { label: "未兑换", value: "False" },
        { label: "已兑换", value: "True" }
      ],
      exchangeListParameter: {
        flag: "All",
        search: "",
        // goingprice: "",
        pageNum: 1,
        pageSize: 10
      },
      ResultTotal: 0,
      exchangeList: [],
      loading: true, //数据加载标识

      /**
       * 兑换详情
       */
      exchangeDetailsParameter: {
        flag: "Detail",
        Exchangeid: null
      },
      currentExchangeInfo: {},
      drawer: false,
      /**
       * 删除兑换
       */
      delExchangeParameter: {
        flag: "Del",
        Exchangeid: null
      }
    };
  },
  methods: {
    // 图片预览
    viewPicture() {
      this.dialogImageUrl = this.currentExchangeInfo.PicBase;
      this.isViewPicture = true;
    },

    // 切换类型
    changeSelect(type) {
      this.category = type;
      this.priceOptions.forEach(item => {
        if (item.label == type) {
          this.exchangeListParameter.goingprice = item.value;
        }
      });
      this.getExchangeList();
    },

    // 兑换详情
    async getExchangeDetails() {
      let res = await this.$Http.exchangeDetails(
        this.exchangeDetailsParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.currentExchangeInfo = res.ResultSet;
         this.drawer = true;
      } else {
        this.$message.error("加载失败");
      }
    },

    // 兑换列表
    async getExchangeList() {
      let res = await this.$Http.exchangeList(this.exchangeListParameter, true);
      if (res.ResultFlag == "0") {
        this.exchangeList = res.ResultSet;
        this.ResultTotal = res.ResultTotal;
        this.loading = false;
      } else {
        this.$message.error("列表加载失败");
      }
    },

    // 页码切换
    handleCurrentChange(currentPage) {
      this.exchangeListParameter.pageNum = currentPage;
      this.getExchangeList();
    },

    // 查看
    handleView(index, row) {
      this.exchangeDetailsParameter.Exchangeid = row.ID;
      this.getExchangeDetails();
     
    },

    // 编辑
    handleEdit(index, row) {
      this.$router.push({
        path: "/addExchange",
        query: {
          ID: row.ID
        }
      });
    },
    // 删除确认
    handleDelete(index, row) {
      let _this = this;
      _this.delExchangeParameter.Exchangeid = row.ID;
      _this
        .$confirm("此操作将永久删除该兑换信息, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.deleteExchange();
        })
        .catch(() => {
          _this.delExchangeParameter.Exchangeid = null;
        });
    },

    // 功能删除
    async deleteExchange() {
      let res = await this.$Http.delExchange(this.delExchangeParameter, true);
      if (res.ResultFlag == "0") {
        this.$message.success("删除成功");
        this.getExchangeList();
      } else {
        this.$message.error("删除失败");
      }
    },

    // 新增
    add() {
      this.$router.push({
        path: `/addExchange`,
        query: {
          ID: 0
        }
      });
    }
  },
  computed:{
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
@import "../style/IntegralExchangeList";
</style>