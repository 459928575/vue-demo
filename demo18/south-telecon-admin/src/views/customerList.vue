  <template>
  <div class="box">
    <div class="search-part">
      <el-input clearable @keyup.enter.native="getCustomerList" size="small" class="search-input" placeholder="请输入客户姓名" v-model="customerListParameter.name">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-input clearable @keyup.enter.native="getCustomerList" type="number" size="small" class="search-input" placeholder="请输入客户手机号" v-model="customerListParameter.tel" :maxlength="settingMaxlength" show-word-limit>
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-select size="small" class="search-select" v-model="customerListParameter.type" filterable placeholder="请选择用户类型" @change="typeChange">
        <el-option v-for="item in customerTypeOptions" :key="item.OrderCode" :label="item.OrderNotes" :value="item.OrderCode">
        </el-option>
      </el-select>
      <el-select size="small" class="search-select" v-model="currentClassification" filterable placeholder="请选择客户分类" @change="classificationChange">
        <el-option v-for="item in distributorsTypeOptions" :key="item.ID" :label="item.SalesTypeName" :value="item.ID">
        </el-option>
      </el-select>
      <el-button size="small" class="search-btn" @click="getCustomerList">搜索</el-button>
    </div>
    <!-- 表格数据 -->
    <el-table v-loading="loading" :data="customerList" style="width: 100%" :header-cell-style="$config.headerCellStyle" border>
      <!-- <el-table-column prop="PicBase" width="100" label="头像" align="center">
        <template slot-scope="scope">
          <el-avatar size="medium" :src="scope.row.PicBase"></el-avatar>
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="OpenId" label="客户openID" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="right">
            <p>{{ scope.row.OpenId }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">查看</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column> -->
      <el-table-column prop="NickName" label="用户姓名" align="center"></el-table-column>
      <el-table-column prop="SaleTypeName" label="分类" align="center"></el-table-column>
      <!-- <el-table-column prop="UserType" label="用户类型" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.UserType || '--'}}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="Phone" label="联系方式" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.Phone || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="Address" label="地址" width="300" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.Address || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="SalesName" label="推荐人" align="center"></el-table-column>
      <el-table-column prop="CreateTime" label="注册时间" width="240" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" width="240" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleSend(scope.$index, scope.row)">更改推荐人</el-button>
          <el-button type="warning" v-if="scope.row.SaleTypeID != 0" size="mini" @click="handleEdit(scope.$index, scope.row)">修改分类</el-button>
          <el-button type="primary" v-else size="mini" @click="handleEdit(scope.$index, scope.row)">设置分类</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination :current-page.sync="customerListParameter.pageNum" @current-change="handleCurrentChange" background layout="total, prev, pager, next, jumper" :total="ResultTotal">
      </el-pagination>
    </div>

    <!-- 设置分类 -->
    <el-dialog :close-on-click-modal="false" class="add-modal" title="分类设置" :visible.sync="dialogVisible" width="450px">
      <div class="details-container">
        <div class="details-item">
          <div class="left">选择分类 :</div>
          <el-select class="right w-75" v-model="currentClass" filterable placeholder="请选择" @change="handleChange">
            <el-option v-for="item in distributorsTypeList" :key="item.ID" :label="item.SalesTypeName" :value="item.ID">
            </el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSetting">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 客户转接 -->
    <el-dialog :close-on-click-modal="false" :show-close="false" class="add-modal" :title="'修改【' + tempUserName + '】推荐人'" :visible.sync="isShowSend" width="600px">
      <div class="search-part" style="padding-left: 0;padding-right: 0;margin-top: -30px">
        <el-input clearable @keyup.enter.native="getTableData" size="small" class="search-input" placeholder="请输入姓名" v-model="receiveListPara.name">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-input clearable @keyup.enter.native="getTableData" type="number" size="small" class="search-input" placeholder="请输入手机号" v-model="receiveListPara.tel" :maxlength="settingMaxlength" show-word-limit>
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button size="small" class="search-btn" style="margin-left: auto;" @click="getTableData">查询</el-button>
      </div>
      <div class="details-container">
        <el-table ref="singleTable" border height="400" v-loading="loading2" :data="tableData" style="width: 100%">
          <el-table-column label=" " width="55" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.checked"></el-checkbox>
              <div @click="handleClickBox(scope.$index, scope.row)" class="box" style="width:100%;height:100%;background: transparent;position: absolute;top: 0;left: 0;right: 0;bottom: 0;z-index: 100;"></div>
            </template>
          </el-table-column>
          <el-table-column property="NickName" label="推荐人" align="center"></el-table-column>
          <el-table-column property="Phone" label="联系方式" align="center"></el-table-column>
          <el-table-column prop="CreateTime" label="注册时间" width="200" align="center"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSend">取 消</el-button>
        <el-button type="primary" @click="confirmSend">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

  <script>
export default {
  name: "customerList",
  created() {
    this.getDistributorsTypeList();
    this.getCustomerTypeOptions();
    this.getCustomerList();
  },
  data() {
    return {
      /**
       * 客户转接
       */
      loading2: false,
      tableData: [],
      currentRow: null,
      isShowSend: false,
      tempUserName: "",
      receiveListPara: {
        userflag: "All",
        name: "",
        tel: "",
        type: "",
        usertypeid: "",
        pageNum: 1,
        pageSize: 100000000
      },
      settingMaxlength: 11,
      changeReferrerPara: {
        userflag: "UpdSalesId",
        openid: "",
        salesid: 0
      },

      /**
       * 客户分类下拉
       */
      currentClassification: "全部",
      distributorsTypeOptions: [{ ID: "", SalesTypeName: "全部" }],
      ResultTotal: 0,
      customerList: [],
      loading: true,
      customerListParameter: {
        userflag: "All",
        name: "",
        tel: "",
        type: "",
        usertypeid: "", //默认选中的分类筛选条件(需要根据接口确定)
        pageNum: 1,
        pageSize: 10
      },

      // 分类配置列表
      customerTypeOptions: [
        {
          OrderCode: "",
          OrderNotes: "全部"
        }
      ],
      customerTypeParameter: {
        userflag: "Show"
      },

      /**
       * 操作部分
       */
      dialogVisible: false,
      currentClass: "",
      settingCustomerClassificationParameter: {
        userflag: "UpdateType",
        reqdata: ""
      },
      reqdata: {
        ID: 0,
        SaleTypeID: 0
      },
      distributorsTypeList: [],
      distributorsTypeListParameter: {
        flag: "saletype",
        pageNum: 1,
        pageSize: 1000
      } // 客户列表参数
    };
  },
  methods: {
    // 点击修改推荐人行数据
    handleSend(i, row) {
      this.tempUserName = row.NickName;
      this.isShowSend = true;
      this.currentRow = row;
      this.receiveListPara.tel = "";
      this.receiveListPara.name = "";
      this.changeReferrerPara.openid = this.currentRow.OpenId;
      this.getTableData();
    },

    // 点击复选框厦上面的蒙层
    handleClickBox(i, row) {
      row.checked = !row.checked;
      this.tableData.forEach(item => {
        if (row.ID != item.ID) {
          item.checked = false;
        }
      });
      this.currentRow = row.checked ? row : null;
      if (this.currentRow) {
        this.changeReferrerPara.salesid = this.currentRow.ID;
      } else {
        this.changeReferrerPara.salesid = 0;
      }
    },

    // 获取接收人列表数据
    async getTableData() {
      this.loading2 = true;
      let res = await this.$Http.customerList(this.receiveListPara, true);
      if (res.ResultFlag == "0") {
        let temparr = [];
        res.ResultSet.forEach(item => {
          if (item.OpenId != this.changeReferrerPara.openid) {
            item.checked = false;
            temparr.push(item);
          }
        });
        this.tableData = temparr;
        this.loading2 = false;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 确认转接（调用接口）
    confirmSend() {
      if (!this.changeReferrerPara.salesid) {
        this.$message.warning("请选择新的推荐人");
      } else {
        this.confirmChangeReferrer();
      }
    },

    async confirmChangeReferrer() {
      let res = await this.$Http.apiChangeReferrer(
        this.changeReferrerPara,
        true
      );
      if (res.ResultFlag == "0") {
        this.isShowSend = false;
        this.changeReferrerPara.openid = "";
        this.changeReferrerPara.salesid = 0;
        this.tempUserName = "";
        this.$message.success("更改成功");
        this.getCustomerList();
      } else {
        this.$message.error("更改失败");
      }
    },

    // 取消转接
    cancelSend() {
      this.isShowSend = false;
      this.currentRow = null;
      this.changeReferrerPara.openid = "";
      this.changeReferrerPara.salesid = 0;
      this.tempUserName = "";
    },

    /**
     * 列表部分
     * getCustomerList 客户列表
     * getDistributorsTypeList 客户分类列表
     * getCustomerTypeOptions 业务分类列表
     */

    // 客户列表
    async getCustomerList() {
      this.loading = true;
      let res = await this.$Http.customerList(this.customerListParameter, true);
      if (res.ResultFlag == "0") {
        this.customerList = res.ResultSet;
        this.ResultTotal = res.ResultTotal;
        this.loading = false;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 分销商分类列表
    async getDistributorsTypeList() {
      let res = await this.$Http.distributorsList(
        this.distributorsTypeListParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.distributorsTypeList = res.ResultSet;
        res.ResultSet.forEach(item => {
          this.distributorsTypeOptions.push({
            ID: item.ID,
            SalesTypeName: item.SalesTypeName
          });
        });
      }
    },

    // 业务分类列表
    async getCustomerTypeOptions() {
      let res = await this.$Http.customerType(this.customerTypeParameter, true);
      if (res.ResultFlag == "0") {
        this.customerTypeOptions = this.customerTypeOptions.concat(
          res.ResultSet
        );
      }
    },

    /**
     * 设置客户分类部分
     * handleEdit(index, row) 点击设置按钮
     * confirmSetting 确定设置
     * settingCurrentCustomerClass 设置客户分类
     */

    // 点击设置按钮
    handleEdit(index, row) {
      this.reqdata.SaleTypeID = row.SaleTypeID;
      this.reqdata.ID = row.ID;
      this.currentClass = "";
      this.distributorsTypeList.forEach(unit => {
        if (unit.ID == row.SaleTypeID) {
          this.currentClass = unit.SalesTypeName;
        }
      });
      this.dialogVisible = true;
    },

    // 确定设置
    confirmSetting() {
      this.settingCustomerClassificationParameter.reqdata = JSON.stringify(
        this.reqdata
      );
      this.settingCurrentCustomerClass();
    },

    // 设置客户分类
    async settingCurrentCustomerClass() {
      let res = await this.$Http.settingClassification(
        this.settingCustomerClassificationParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.$message.success("设置成功");
        this.dialogVisible = false;
        this.getCustomerList();
      } else {
        this.$message.error("设置失败");
      }
    },

    // 选择分类（弹窗下拉选择）
    handleChange(type) {
      this.reqdata.SaleTypeID = type;
    },

    // 分页
    handleCurrentChange(currentPage) {
      this.customerListParameter.pageNum = currentPage;
      this.getCustomerList();
    },

    // 分类选择（筛选条件选择）
    typeChange(type) {
      this.customerListParameter.type = type;
      this.customerListParameter.pageNum = 1;
      this.getCustomerList();
    },

    // 客户所属分类选择（classification）
    classificationChange(usertypeid) {
      this.customerListParameter.usertypeid = usertypeid;
      this.distributorsTypeOptions.forEach(item => {
        /**
         * 特别注意：这里我们要区分全部与默认分类，需要使用===
         * 1、全部的id为空字符串；
         * 2、默认分类的id是0；
         */
        if (usertypeid === "") {
          this.currentClassification = "全部";
        } else {
          if (usertypeid === item.ID) {
            this.currentClassification = item.SalesTypeName;
          }
        }
      });
      this.customerListParameter.pageNum = 1;
      this.getCustomerList();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/productList";
@import "../style/customerList";
</style>
<style lang="scss">
// 处理input type = number的上下箭头
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>