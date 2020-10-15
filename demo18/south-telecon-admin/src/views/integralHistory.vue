  <template>
  <div class="box">
    <div class="search-part">
      <el-input size="small" clearable class="search-input" placeholder="请输入名称" v-model="input4">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-select size="small" class="search-select" v-model="value" filterable placeholder="请选择星级">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker size="small" v-model="value2" type="daterange" align="right" unlink-panels range-separator="至"
        start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
      </el-date-picker>
      <el-button size="small" class="search-btn" type="success" icon="el-icon-search">搜索</el-button>
      <el-button size="small" type="warning" icon="el-icon-circle-close">清空</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" :header-cell-style="$config.headerCellStyle" border   :default-sort = "{prop: 'time', order: 'descending'}">
      <el-table-column prop="openID" label="产品编号"  align="center"></el-table-column>
      <el-table-column prop="username" label="客户姓名" align="center"></el-table-column>
      <el-table-column prop="proname" label="套餐名称"  align="center"></el-table-column>
      <el-table-column prop="time" label="时间" sortable  align="center" :formatter="formatter"></el-table-column>
      <el-table-column prop="score" label="积分变动"  align="center"></el-table-column>
      <el-table-column prop="remark" label="积分变动说明" align="center"></el-table-column>
      <el-table-column prop="currentScore" label="当前积分" align="center"></el-table-column>
    </el-table>
    <div class="page">
      <el-pagination background layout="total, prev, pager, next, jumper" :total="1000">
      </el-pagination>
    </div>
  </div>
</template>

  <script>
export default {
  name: "integralHistory",
  created() {
    this.openID = this.$route.params.openID;
    this._initData();
  },
  data() {
    return {
      openID:'', //当前用户的openID
      options: [
        {
          value: "选项1",
          label: "1星"
        },
        {
          value: "选项2",
          label: "2星"
        },
        {
          value: "选项3",
          label: "3星"
        },
        {
          value: "选项4",
          label: "4星"
        },
        {
          value: "选项5",
          label: "5星"
        }
      ],
      value2:'',
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value: "",
      input4: "",
      tableData: []
    };
  },
  methods: {
    _initData() {
      for (let i = 0; i < 20; i++) {
        this.tableData.push({
          openID: this.openID,
          username: "张三",
          proname:'电信新春套餐' + i,
          time:"2019-06-" + i,
          score: 20,
          currentScore: 555,
          remark: "新订单获得积分"
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

@import '../style/productList';
</style>