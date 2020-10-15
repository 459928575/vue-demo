  <template>
  <div class="box">
    <div class="search-part">
      <el-button class="add-btn" type="success" size="small" icon="el-icon-circle-plus-outline" @click="handleAdd">
        新增客户分类
      </el-button>
    </div>
    <el-table v-loading="loading" :default-sort="{prop: 'Sort', order: 'descending'}" :data="distributorsTypeList" style="width: 100%"
      :header-cell-style="$config.headerCellStyle" border>
      <el-table-column prop="SalesTypeName" label="分类名称" align="center"></el-table-column>
      <!-- <el-table-column prop="CreateID" label="更新人" align="center"></el-table-column> -->
      <el-table-column prop="Sort" label="排序" align="center"></el-table-column>
      <el-table-column prop="UpdateTime" label="更新时间" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" :disabled="scope.row.ID == 0" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" :disabled="scope.row.ID == 0" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination background layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange"
        :current-page.sync="distributorsTypeListParameter.pageNum" :total="ResultTotal">
      </el-pagination>
    </div>

    <!-- 新增弹窗 -->
    <el-dialog width="650px" :close-on-click-modal="false" class="add-modal" :title="isNewAdd?'新增客户分类':'编辑客户分类'" :visible.sync="isShowModal">
      <div class="details-container">
        <div class="details-item">
          <div class="left">分类名称 :</div>
          <div class="right w-50">
            <el-input class="content-input" v-model="reqdata.SalesTypeName" placeholder="请输入分类名称"></el-input>
          </div>
        </div>
        <div class="details-item">
          <div class="left">排序 :</div>
          <div class="right w-50">
            <el-input-number class="content-input" v-model="reqdata.Sort" controls-position="right" :controls="false"
              :min="0" :step="1"></el-input-number>
          </div>
        </div>
        <div class="details-item">
          <div class="left">备注 :</div>
          <div class="right w-75">
            <el-input clearable class="content-input big" type="textarea" :autosize="{ minRows: 3, maxRows: 6}"
              v-model="reqdata.Remark" placeholder="请输入备注信息"></el-input>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowModal = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

  <script>
export default {
  name: "distributorClassification",
  created() {
    this.getDistributorsTypeList();
  },
  data() {
    return {
      /**
       * 经销商部分
       */
      ResultTotal: 0,
      distributorsTypeList: [], //经销商分类列表
      loading: true,
      distributorsTypeListParameter: {
        flag: "saletype",
        pageNum: 1,
        pageSize: 10
      }, // 经销商列表参数

      /**
       * 新增客户分类部分
       */
      isNewAdd: true,
      newDistributorParameter: {
        flag: "Man",
        reqdata: ""
      },
      reqdata: {
        ID: 0,
        SalesTypeName: "", //规则名称
        Sort: 0, //排序
        Remark: "", //备注
        CreateID: Number(localStorage.getItem("CreateID"))
      }, // 当前修改规格参数
      isShowModal: false, // 弹窗显隐控制
      formLabelWidth: "80px",

      /**
       * 删除客户分类部分
       */
      delDistributorParameter: {
        flag: "Del",
        typeid: null
      }
    };
  },
  methods: {
    /**
     * getDistributorsTypeList 客户列表
     * handleAdd 新增客户分类按钮
     * handleEdit 编辑按钮
     * confirmAdd 保存按钮
     * addOrEditDistributor 新增编辑客户分类
     * handleDelete 确认删除
     */

    // 客户分类列表
    async getDistributorsTypeList() {
      this.loading = true;
      let res = await this.$Http.distributorsList(
        this.distributorsTypeListParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.distributorsTypeList = res.ResultSet;
        this.ResultTotal = res.ResultTotal;
        this.loading = false;
      }else{
        this.$message.error('数据加载失败')
      }
    },
    handleCurrentChange(currentPage) {
      this.distributorsTypeListParameter.pageNum = currentPage;
      this.getDistributorsTypeList();
    },

    // 新增客户分类按钮
    handleAdd() {
      this.isNewAdd = true;
      this.isShowModal = true;
      this.reqdata.ID = 0;
      this.reqdata.SalesTypeName = "";
      this.reqdata.Sort = 0;
      this.reqdata.Remark = "";
    },

    // 编辑按钮
    handleEdit(index, row) {
      this.isNewAdd = false;
      this.reqdata.ID = row.ID;
      this.reqdata.SalesTypeName = row.SalesTypeName;
      this.reqdata.Sort = row.Sort;
      this.reqdata.Remark = row.Remark;
      this.isShowModal = true;
    },

    // 保存按钮
    confirmAdd() {
      if (!this.reqdata.SalesTypeName) {
        this.$message.warning("请输入分类名称");
      } else if (!this.reqdata.Sort) {
        this.$message.warning("请输入排序");
      } else {
        this.addOrEditDistributor();
      }
    },

    // 新增编辑客户分类
    async addOrEditDistributor() {
      this.newDistributorParameter.reqdata = JSON.stringify(this.reqdata);
      let res = await this.$Http.newDistributor(
        this.newDistributorParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.isShowModal = false;
        this.getDistributorsTypeList();
        this.$message.success("保存成功");
      } else {
        this.$message.error("保存失败");
      }
    },

    // 删除按钮
    handleDelete(index, row) {
      this.delDistributorParameter.typeid = row.ID;
      this.$confirm("此操作将删除该客户分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.confirmDelete();
        })
        .catch(() => {});
    },

    // 确认删除
    async confirmDelete() {
      let res = await this.$Http.delDistributor(
        this.delDistributorParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.getDistributorsTypeList();
        this.$message.success("删除成功");
      } else {
        this.$message.error(res.ResultSet);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/productList";
@import "../style/distributorClassification";
</style>