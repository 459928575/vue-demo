  <template>
  <div class="box">
    <div class="search-part">
      <el-input clearable size="mini" class="search-input" placeholder="请输入订单名称" v-model="input4">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <!-- <el-select size="mini" class="search-select" v-model="value" filterable placeholder="请选择订单状态">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select size="mini" class="search-select" v-model="value2" filterable placeholder="请选择带宽">
        <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select> -->
      <el-button size="mini" class="search-btn" type="success" icon="el-icon-search">搜索</el-button>
      <el-button size="mini" type="warning" icon="el-icon-circle-close">清空</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" :header-cell-style="$config.headerCellStyle" border >
      <el-table-column prop="orderId" label="订单编号" align="center" ></el-table-column>
      <!-- <el-table-column prop="name" label="订单名称" align="center"></el-table-column> -->
      <!-- <el-table-column prop="description" label="订单描述" ></el-table-column> -->
      <!-- <el-table-column prop="price" label="价格" align="center"></el-table-column> -->
      <!-- <el-table-column prop="bandwidth" label="带宽" align="center">
        <template slot-scope="scope">
          <el-button size="mini" plain v-if="scope.row.bandwidth===0" type="warning">50M</el-button>
          <el-button size="mini" plain v-if="scope.row.bandwidth===1" type="primary">100M</el-button>
          <el-button size="mini" plain v-if="scope.row.bandwidth===2" type="success">200M</el-button>
        </template>
      </el-table-column> -->

      <el-table-column prop="package" label="套餐类型" align="center"></el-table-column>
      <el-table-column prop="type" label="业务分类" align="center">
        <template slot-scope="scope">
          <el-button size="mini" plain v-if="scope.row.type===0" type="warning">商户</el-button>
          <el-button size="mini" plain v-if="scope.row.type===1" type="primary">住户</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="servicetype" label="业务类型" align="center">
        <template slot-scope="scope">
          <el-button size="mini" plain v-if="scope.row.classification===0" type="warning">新安装</el-button>
          <el-button size="mini" plain v-if="scope.row.classification===1" type="primary">续费</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="applicant" label="申请人" align="center"></el-table-column>
      <el-table-column prop="applicantTime" label="申请时间" align="center"></el-table-column>

      <!-- <el-table-column prop="startTime" label="开始时间"  align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间"  align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.endTime }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="status" label="订单状态" align="center">
        <template slot-scope="scope">
          <el-button size="mini" round v-if="scope.row.status===0" type="warning">待提交</el-button>
          <el-button size="mini" round v-if="scope.row.status===1" type="primary">待受理</el-button>
          <el-button size="mini" round v-if="scope.row.status===2" type="info">已完成</el-button>
          <el-button size="mini" round v-if="scope.row.status===3" type="danger">待付款</el-button>
          <el-button size="mini" round v-if="scope.row.status===4" type="success">使用中</el-button>
        </template>
      </el-table-column> -->

    </el-table>
    <div class="page">
      <el-pagination background layout="total, prev, pager, next, jumper" :total="1000">
      </el-pagination>
    </div>
  </div>
</template>

  <script>
export default {
  name: "newOrders",
  created() {
    this._initData();
  },
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "使用中"
        },
        {
          value: "选项2",
          label: "待受理"
        },
        {
          value: "选项3",
          label: "待提交"
        },
        {
          value: "选项4",
          label: "待付款"
        },
        {
          value: "选项5",
          label: "已完成"
        }
      ],
      value2: "",
      options2: [
        {
          value: "选项1",
          label: "50M"
        },
        {
          value: "选项2",
          label: "100M"
        }
      ],
      value: "",
      input4: "",
      tableData: []
    };
  },
  methods: {
    _initData() {
      for (let i = 0; i < 20; i++) {
        this.tableData.push({
          orderId: "ASDFG22GDGFD2E" + i,
          name: "电信自定义业务申请" + i,
          description:
            "中国电信是国有特大型通信骨干企业，是领先的综合智能信息服务运营商，助力网络强国，服务社会民生。",
          price: 1000 + i,
          bandwidth: Math.floor(Math.random() * 3), //0 1 2
          classification: Math.floor(Math.random() * 2), // 0 1
          startTime: "2019-01-01",
          endTime: "2019-01-31",
          status: Math.floor(Math.random() * 5), //0 1 2 3 4
          type: Math.floor(Math.random() * 2), // 0 1
          servicetype: Math.floor(Math.random() * 2), // 0 1
          package: "2019新春套餐",
          applicant: "张三",
          applicantTime: "2019-06-15 08:15"
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/productList";
</style>