  <template>
  <div class="buildingPrice">
    <div class="search-part">
      <el-input clearable size="small" class="search-input" @keyup.enter.native="getBuildingPriceList" placeholder="请输入楼宇名称" v-model="buildingPriceListParameter.projectsel">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button class="search-btn" size="small" @click="getBuildingPriceList">搜索</el-button>
      <!-- <el-button class="add-btn" type="success" size="small" icon="el-icon-circle-plus-outline" @click="addBuilding">
        新增楼宇价格
      </el-button> -->
    </div>
    <!-- 表格数据 -->
    <el-table v-loading="loading" :data="buildingPriceList" style="width: 100%" :header-cell-style="$config.headerCellStyle" border>
      <el-table-column prop="ProjectName" label="楼宇名称" align="center"></el-table-column>
      <el-table-column prop="Director" label="负责人" align="center"></el-table-column>
      <el-table-column prop="CellPhone" label="联系电话" align="center"></el-table-column>
      <el-table-column prop="Address" label="地址" align="center"></el-table-column>
      <el-table-column prop="ProCnt" label="产品数量" align="center"></el-table-column>
      <!-- <el-table-column prop="Price" label="价格" align="center"></el-table-column>
      <el-table-column prop="StartDate" label="开始日期" align="center"></el-table-column> -->
      <el-table-column prop="Remark" label="备注" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <!-- <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="buildingPriceListParameter.pageNum" background layout="total, prev, pager, next, jumper" :total="ResultTotal">
      </el-pagination>
    </div>

    <!-- 新增产品价格 -->
    <el-dialog :close-on-click-modal="false" class="add-modal" title="编辑楼宇价格" :visible.sync="dialogVisible" width="650px">
      <div class="details-container">
        <div class="details-item">
          <div class="left">楼宇选择 :</div>
          <el-select class="right w-50" v-model="selectAddress" filterable placeholder="请选择" @change="handleChange">
            <el-option v-for="item in buildingList" :key="item.ID" :label="item.ProjectName" :value="item.ID">
            </el-option>
          </el-select>
        </div>
        <div class="details-item">
          <div class="left">开始日期 :</div>
          <el-date-picker class="right w-50" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="currentBuildingInfo.StartDate" type="date" placeholder="选择日期">
          </el-date-picker>
        </div>
        <div class="details-item">
          <div class="left">价格 :</div>
          <el-input-number class="right width-200" v-model="currentBuildingInfo.Price" controls-position="right" :min="0">
          </el-input-number>
          <span class="unit">元</span>
        </div>
        <div class="details-item">
          <div class="left">备注 :</div>
          <el-input class="right w-75" v-model="currentBuildingInfo.Remark" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addBuildingPrice">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "BuildingPrice",
  created() {
    this.getBuildingPriceList();
  },
  data() {
    return {
      selectAddress: "", //选择的地址
      dialogVisible: false, //弹窗显隐控制

      currentBuildingInfo: {
        ID: 0,
        ProjectId: null,
        ProductName: "",
        StartDate: "",
        Price: 0,
        Remark: "",
        CreateID: Number(localStorage.getItem("CreateID"))
      }, //弹窗展示的行数据
      /**
       * 楼宇价格列表部分
       */
      buildingPriceListParameter: {
        projectsflag: "All",
        projectsel: "",
        pageNum: 1,
        pageSize: 10
      },
      ResultTotal: 0,
      loading: true,
      buildingPriceList: [], //楼宇价格列表

      /**
       * 删除楼宇价格
       */
      delBuildingPriceParameter: {
        projectsflag: "Del",
        projectsid: null
      },

      // 地址列表传参
      queryCondition: {
        projectflag: "All",
        projectsel: "", //搜索条件
        ordertype: "",
        pageNum: 1,
        pageSize: 100000
      },
      buildingList: [],

      buildingPriceDetailsParameter: {
        projectsflag: "Detail",
        id: null
      },
      buildingPriceDetailsInfo: {}
    };
  },
  methods: {
    // 获取楼宇价格列表
    async getBuildingPriceList() {
      this.loading = true;
      let res = await this.$Http.buildingPriceList(
        this.buildingPriceListParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.buildingPriceList = res.ResultSet;
        this.ResultTotal = res.ResultTotal;
        this.loading = false;
      }else{
        this.$message.error('数据加载失败')
      }
    },
    // 编辑楼宇价格
    handleEdit(index, row) {
      this.buildingPriceDetailsParameter.id = row.ID;
      this.$router.push({
        path: "/editBuildingPrice",
        query: {
          id: row.ID
        }
      });
      this.getBuildingPriceDetails();
    },

    // 楼宇价格详情信息
    async getBuildingPriceDetails() {
      let res = await this.$Http.buildingPriceDetails(
        this.buildingPriceDetailsParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.buildingPriceDetailsInfo = res.ResultSet;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 删除楼宇弹窗
    handleDelete(index, row) {
      let _this = this;
      _this.delBuildingPriceParameter.projectsid = row.ID;
      _this
        .$confirm("此操作将永久删除该楼宇价格, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.deleteBuildingPrice();
        })
        .catch(() => {});
    },

    // 删除楼宇价格
    async deleteBuildingPrice() {
      let res = await this.$Http.delBuildingPrice(
        this.delBuildingPriceParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.$message.success("删除成功");
        this.getBuildingPriceList();
      } else {
        this.$message.error("删除失败");
      }
    },

    // 选择地址
    handleChange(val) {
      this.currentBuildingInfo.ProjectId = val;
    },

    handleCurrentChange(currentPage) {
      this.buildingPriceListParameter.pageNum = currentPage;
      this.getBuildingPriceList();
    },

    // 新增产品
    addBuilding() {
      this.currentBuildingInfo.ID = 0;
      this.currentBuildingInfo.ProjectId = null;
      this.currentBuildingInfo.ProductName = "";
      this.currentBuildingInfo.StartDate = "";
      this.currentBuildingInfo.Remark = "";
      this.currentBuildingInfo.Price = 0;
      this.selectAddress = "";
      this.dialogVisible = true;
    },

    // 新增楼宇价格
    async addBuildingPrice() {
      if (!this.currentBuildingInfo.ProjectId) {
        this.$message.warning("请选择地址");
      } else if (!this.currentBuildingInfo.StartDate) {
        this.$message.warning("请选择开始日期");
      } else if (!this.currentBuildingInfo.Price) {
        this.$message.warning("请填写价格");
      } else {
        let res = await this.$Http.newBuildingPrice(
          {
            projectsflag: "Man",
            reqdata: JSON.stringify(this.currentBuildingInfo)
          },
          true
        );
        if (res.ResultFlag == "0") {
          this.$message.success("添加成功");
          this.dialogVisible = false;
          this.getBuildingPriceList();
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/buildingPrice";
</style>