  <template>
  <div class="box">
    <div class="header">
      <h3>产品信息</h3>
    </div>
    <el-table :data="productInfo" :header-cell-style="$config.headerCellStyle" border>
      <el-table-column prop="name" label="产品名称" align="center"></el-table-column>
      <el-table-column prop="productId" label="产品编号" align="center"></el-table-column>
      <el-table-column prop="type" label="产品分类" align="center"></el-table-column>
      <el-table-column prop="score" label="综合评分" align="center"></el-table-column>
    </el-table>
    <div class="header">
      <h3>综合评分</h3>
      <span class="divider">:</span>
      <span class="num">4.5</span>
    </div>
    <el-table :data="tableData" style="width: 100%" :header-cell-style="$config.headerCellStyle" border>
      <el-table-column prop="username" label="用户姓名" align="center"></el-table-column>
      <el-table-column prop="content" label="评论内容" align="center"></el-table-column>
      <el-table-column prop="score" label="评分" align="center"></el-table-column>
      <el-table-column prop="updateTime" label="评价时间" align="center"></el-table-column>
    </el-table>
    <div class="page">
      <el-pagination background layout="total, prev, pager, next, jumper" :total="1000">
      </el-pagination>
    </div>

    <!-- 使用积分的弹窗 -->
    <el-dialog :close-on-click-modal="false" class="use-modal" title="使用积分" :visible.sync="isShowModal">
      <el-form :model="form">
        <el-form-item label="积分数量" :label-width="formLabelWidth">
          <el-input clearable class="content-input" v-model="form.num" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="使用名称" :label-width="formLabelWidth">
          <el-input clearable class="content-input" v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="使用日期" :label-width="formLabelWidth">
          <el-date-picker v-model="form.date" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="使用备注" :label-width="formLabelWidth">
          <el-input clearable class="content-input" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="form.remark"
            autocomplete="off" format="yyyy-MM-dd"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowModal = false">取 消</el-button>
        <el-button type="primary" @click="isShowModal = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

  <script>
export default {
  name: "commentDetails",
  created() {
    this.openID = this.$route.params.openID;
    this._initData();
  },
  data() {
    return {
      isShowModal: false,
      openID: "", //当前用户的openID
      tableData: [],
      form: {
        name: "2019新春套餐抵扣",
        num: 0,
        remark: "这里可以填写相关备注信息",
        date: ""
      },
      formLabelWidth: "80px",
      productInfo: [
        {
          name: "2019电信新春套餐",
          productId: "ZGDX-002",
          type: "商户",
          score: "4.5"
        }
      ]
    };
  },
  methods: {
    _initData() {
      for (let i = 0; i < 20; i++) {
        this.tableData.push({
          openID: this.openID,
          username: "张三",
          proname: "电信新春套餐" + i,
          updateTime: "2019-06-16 15:20",
          score: 20,
          currentScore: 555,
          remark: "新订单获得积分",
          username: "2019-06-05 20:20",
          content: "很不错的产品，推荐大家使用...",
          score: "4.5",
          isAdded: Math.floor(Math.random() * 2)
        });
      }
    },
    formatter(row, column) {
      return row.time;
    }
  }
};
</script>
<style lang="scss" scoped>
.box {
  background-color: #fff;
  padding: 15px;
  .header {
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    h3 {
      padding: 0;
      margin: 0;
    }
    .divider {
      margin: 0 10px;
      font-weight: bold;
    }
    .num {
      color: red;
      font-weight: bold;
    }
  }
  .red {
    color: red;
    font-weight: bold;
    margin-right: 3px;
  }
  .black {
    font-weight: bold;
    margin-right: 3px;
  }

  .use-modal {
    .content-input {
      width: 50%;
    }
    .dialog-footer {
      padding: 15px 0;
    }
  }
}
</style>