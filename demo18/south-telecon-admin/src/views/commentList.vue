  <template>
  <div class="box">
    <div class="search-part">
      <el-input clearable size="small" class="search-input" @keyup.enter.native="getCommentList" placeholder="请输入产品名称" v-model="commentListParamater.productname">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button size="small" class="search-btn" @click="getCommentList">搜索</el-button>
    </div>
    <el-table v-loading="loading" :data="commentList" style="width: 100%" :header-cell-style="$config.headerCellStyle" border>
      <el-table-column prop="ProductName" label="产品名称" align="center"></el-table-column>
      <el-table-column prop="Commentator" label="评论人" align="center"></el-table-column>
      <el-table-column prop="CommentContent" label="评论内容" align="center"></el-table-column>
      <el-table-column prop="CommentDate" label="评论日期" align="center"></el-table-column>
      <el-table-column prop="CommentScore" label="评分等级" align="center">
        <template slot-scope="scope">
          <el-rate :value="scope.row.CommentScore | stringtoNumber" disabled show-score text-color="#ff9900">
          </el-rate>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleView(scope.$index, scope.row)">查看详情</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination background :current-page.sync="commentListParamater.pageNum" @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="ResultTotal">
      </el-pagination>
    </div>

    <!-- 3、详情 -->
    <el-drawer class="order-details" :direction="direction" :title="currentCommentDetails.ProductName" :visible.sync="drawer">
      <div class="order-info" :style="{height:scrollerHeight}">
        <div class="list">
          <div class="list-title">评论人</div>
          <div class="list-content">{{currentCommentDetails.Commentator}}</div>
        </div>
        <div class="list">
          <div class="list-title">产品名称</div>
          <div class="list-content">{{currentCommentDetails.ProductName}}</div>
        </div>
        <div class="list">
          <div class="list-title">评分等级</div>
          <div class="list-content">{{currentCommentDetails.CommentScore}}星</div>
        </div>
        <div class="agreement-part border-none">
          <div class="agreement-title">评论内容</div>
          <div class="agreement-content">{{currentCommentDetails.CommentContent || '--'}}</div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

  <script>
export default {
  name: "commentList",
  created() {
    this.getCommentList();
  },
  data() {
    return {
      loading: true,
      commentList: [],
      ResultTotal: 0,
      commentListParamater: {
        commentflag: "All",
        productname: "",
        pageNum: 1,
        pageSize: 10
      },
      /**
       * 删除评论
       */
      delCommentListParamater: {
        commentflag: "Del",
        commentid: null
      },

      /**
       * 评论详情
       */
      commentDetailsParamater: {
        commentflag: "Detail",
        commentid: null
      },
      currentCommentDetails: {},
      viewportH: 0,
      drawer: false,
      direction: "rtl"
    };
  },
  methods: {
    // 获取评论列表
    async getCommentList() {
      this.loading = true;
      let res = await this.$Http.commentList(this.commentListParamater, true);
      if (res.ResultFlag == "0") {
        this.commentList = res.ResultSet;
        this.ResultTotal = res.ResultTotal;
        this.loading = false;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 点击详情按钮
    handleView(index, row) {
      this.commentDetailsParamater.commentid = row.ID;
      this.getCommentDetails();
    },

    // 评论详情
    async getCommentDetails() {
      let res = await this.$Http.commentDetails(
        this.commentDetailsParamater,
        true
      );
      if (res.ResultFlag == "0") {
        this.currentCommentDetails = res.ResultSet[0];  //注意：一数组的形式去除，但是只有一条数据
        this.drawer = true;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 点击删除按钮
    handleDelete(index, row) {
      let _this = this;
      _this.delCommentListParamater.commentid = row.ID;
      _this
        .$confirm("此操作将永久删除该评论, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.deleteComment();
        })
        .catch(() => {
          _this.delCommentListParamater.commentid = null;
        });
    },

    // 删除评论
    async deleteComment() {
      let res = await this.$Http.delComment(this.delCommentListParamater, true);
      if (res.ResultFlag == "0") {
        this.$message.success("删除成功");
        this.getCommentList();
      } else {
        this.$message.error("删除失败");
      }
    },

    // 分页
    handleCurrentChange(currentPage) {
      this.commentListParamater.pageNum = currentPage;
      this.getCommentList();
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
@import "../style/commentList";
</style>