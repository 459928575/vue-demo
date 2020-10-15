  <template>
  <div class="box">
    <!-- 1、筛选部分 -->
    <div class="search-part">
      <el-input clearable size="small" class="search-input" placeholder="请输入用户姓名" v-model="exchangeRecordListParameter.username" @keyup.enter.native="getExchangeRecordList">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-input clearable size="small" class="search-input" placeholder="请输入物品名称" v-model="exchangeRecordListParameter.sel" @keyup.enter.native="getExchangeRecordList">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-radio-group v-model="category" size="small" @change="changeSelect">
        <el-radio-button :label="item.label" v-for="(item, index) in priceOptions" :key="index"></el-radio-button>
      </el-radio-group>
      <el-button class="search-btn" size="small" @click="getExchangeRecordList">搜索</el-button>
      <!-- <el-button class="add-btn" type="success" size="small" icon="el-icon-circle-plus-outline" @click="add">添加兑换内容
      </el-button> -->
    </div>

    <!-- 2、表格数据 -->
    <el-table v-loading="loading" :data="exchangeRecordList" style="width: 100%" :header-cell-style="$config.headerCellStyle" border>
      <el-table-column prop="ItemDescription" label="物品" align="center"></el-table-column>
      <el-table-column prop="PointUser.UserName" label="姓名" align="center"></el-table-column>
      <el-table-column prop="PointUser.CellPhone" label="联系电话" align="center"></el-table-column>
      <el-table-column prop="PointUser.Address" label="地址" align="center"></el-table-column>
      <el-table-column prop="CreateTime" label="兑换日期" align="center" width="180"></el-table-column>
	  <el-table-column prop="Remark" label="备注" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" width="150" align="center">
        <template slot-scope="scope">
          <el-dropdown size="mini" @command="item=>chooseAction(scope.$index, scope.row, item)">
            <el-button class="current-status" v-if="scope.row.Flag== '0'" type="warning" size="mini">
              未完成
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-button class="current-status" v-else-if="scope.row.Flag== 'F'" type="success" size="mini">
              已完成
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="scope.row.Flag == item.Flag" v-for="(item,ind) in actionOptions" :key="ind" :command="item.Flag">{{item.status}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination :current-page.sync="exchangeRecordListParameter.pageNum" @current-change="handleCurrentChange" background layout="total, prev, pager, next, jumper" :total="ResultTotal"></el-pagination>
    </div>

    <!-- 3、兑换产品 -->
    <el-drawer class="sales-drawer" :title="currentExchangeInfo.ItemDescription" :visible.sync="drawer">
      <div class="sales-promotion" :style="{height:scrollerHeight}">
        <div class="list">
          <div class="title">物品名称</div>
          <div class="content">{{currentExchangeInfo.ItemDescription}}</div>
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
          <div class="content">{{currentExchangeInfo.CreateID}}</div>
        </div>
        <div class="desc">
          <div class="title">备注</div>
          <div class="content">{{currentExchangeInfo.Remark}}</div>
        </div>
        <div class="img-container">
          <div class="title">物品图片</div>
          <img class="pic" @click="viewPicture" :src="currentExchangeInfo.PicBase" :alt="currentExchangeInfo.ItemDescription">
        </div>
      </div>
    </el-drawer>

    <!-- 4、预览图片 -->
    <el-dialog :close-on-click-modal="false" :visible.sync="isViewPicture">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

    <!-- 修改状态-->
    <el-dialog :close-on-click-modal="false" class="add-modal" title="备注" :visible.sync="isShowSatusModal" width="450px">
      <div class="details-container">
        <div class="details-item">
          <div class="left">备注</div>
          <el-input class="right w-75" v-model="flagStatusParameter.comments" placeholder="请输入备注"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowSatusModal = false">取 消</el-button>
        <el-button type="primary" @click="confirmflagStatus">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

  <script>
export default {
  name: "exchangeRecordList",
  created() {
    this.getExchangeRecordList();
  },
  data() {
    return {
      actionOptions: [
        { status: "未完成", Flag: "0" },
        { status: "已完成", Flag: "F" }
      ],
      isShowSatusModal: false,
      flagStatusParameter: {
        flag: "updstatus",
        pointid: null,
        finish: "",
        comments: ""
      },
      viewportH: 0,
      /**
       * 图片预览
       */
      isViewPicture: false,
      dialogImageUrl: "",

      /**
       * 兑换列表
       */
      category: "未完成",
      priceOptions: [
        { label: "未完成", value: "false" },
        { label: "已完成", value: "true" }
      ],
      exchangeRecordListParameter: {
        flag: "pointlist",
        sel: "",
        finish: "false",
        username: "",
        pageNum: 1,
        pageSize: 10
      },
      ResultTotal: 0,
      exchangeRecordList: [],
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

    chooseAction(index, row, item) {
      this.flagStatusParameter.pointid = row.ID;
      this.flagStatusParameter.finish = row.Flag == "0" ? "True" : "False";
      this.isShowSatusModal = true;
    },

    // 标记状态
    async confirmflagStatus() {
      let res = await this.$Http.flagStatus(this.flagStatusParameter, true);
      if (res.ResultFlag == "0") {
        this.$message.success("标记成功");
        this.isShowSatusModal = false;
        this.getExchangeRecordList();
      } else {
        this.$message.error("标记失败");
      }
    },

    // 切换类型
    changeSelect(type) {
      this.category = type;
      this.priceOptions.forEach(item => {
        if (item.label == type) {
          this.exchangeRecordListParameter.finish = item.value;
        }
      });
      this.exchangeRecordListParameter.pageNum = 1;
      this.getExchangeRecordList();
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
    async getExchangeRecordList() {
      let res = await this.$Http.exchangeRecordList(
        this.exchangeRecordListParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.exchangeRecordList = res.ResultSet;
        this.ResultTotal = res.ResultTotal;
        this.loading = false;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 页码切换
    handleCurrentChange(currentPage) {
      this.exchangeRecordListParameter.pageNum = currentPage;
      this.getExchangeRecordList();
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
        this.getExchangeRecordList();
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
  computed: {
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