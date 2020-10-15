<template>
  <div class="box">
    <!-- 1、筛选条件 -->
    <div class="search-part">
      <el-input clearable @keyup.enter.native="getContractList" size="small" class="search-input" placeholder="请输入合同名称"
        v-model="contractListParameter.search">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button class="search-btn" size="small" @click="getContractList">搜索</el-button>
      <el-button class="add-btn" type="success" size="small" icon="el-icon-circle-plus-outline" @click="handleAddBtn">
        新增合同
      </el-button>
    </div>

    <!-- 2、表格数据 -->
    <el-table v-loading="loading" :data="contractList" style="width: 100%" :header-cell-style="$config.headerCellStyle"
      border>
      <el-table-column prop="ContractName" label="合同名称" align="center"></el-table-column>
      <el-table-column prop="OrderType" label="业务分类" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.OrderType == 'GR'">住宅</span>
          <span v-else-if="scope.row.OrderType == 'QY'">企业</span>
          <span v-else>其他</span>
        </template>
      </el-table-column>
      <el-table-column prop="FileName" label="文件名称" align="center"></el-table-column>
      <el-table-column prop="Remark" label="备注" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.Remark || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="300" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleView(scope.$index, scope.row)">查看详情</el-button>
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination :current-page.sync="contractListParameter.pageNum" @current-change="handleCurrentChange" background
        layout="total, prev, pager, next, jumper" :total="ResultTotal">
      </el-pagination>
    </div>

    <!-- 3、详情 -->
    <el-drawer class="order-details" :direction="direction" :title="currentContractInfo.ContractName"
      :visible.sync="drawer">
      <div class="order-info">
        <div class="list">
          <div class="list-title">合同名称</div>
          <div class="list-content">{{currentContractInfo.ContractName}}</div>
        </div>
        <div class="list">
          <div class="list-title">文件名称</div>
          <div class="list-content">{{currentContractInfo.FileName}}</div>
        </div>
        <div class="list">
          <div class="list-title">业务分类</div>
          <div class="list-content">{{selectType}}</div>
        </div>
        <div class="agreement-part">
          <div class="agreement-title">备注</div>
          <div class="agreement-content">{{currentContractInfo.Remark || '未填写'}}</div>
        </div>
      </div>
    </el-drawer>

    <!-- 4、新增与编辑 -->
    <el-dialog :close-on-click-modal="false" class="add-modal" :destroy-on-close="true" :title="isNewAdd?'新增合同':'编辑合同'"
      :visible.sync="isShowModal" width="650px">
      <div class="details-container">
        <div class="details-item">
          <div class="left">合同名称 :</div>
          <el-input clearable class="right w-75" v-model="reqdata.ContractName" placeholder="请输入合同名称"></el-input>
        </div>
        <div class="details-item" v-if="!isNewAdd">
          <div class="left">文件名称 :</div>
          <el-input disabled clearable class="right w-75" v-model="reqdata.FileName" placeholder="请输入文件名称"></el-input>
        </div>
        <div class="details-item">
          <div class="left">文件上传 :</div>
          <el-upload :auto-upload="false" :limit="1" :multiple="false" :on-change="getFileInfo" accept=".doc,.docx"
            class="upload-demo right w-75" ref="upload" action="/southtelpc/HandlerUploadFile.ashx"
            :on-preview="handlePreview" :on-exceed="handleExceed" :on-error="handleError" :on-success="handleSuccess"
            :on-remove="handleRemove" :file-list="uploadFiles">
            <el-button slot="trigger" size="small" type="primary" v-if="!reqdata.FileGuid">选取文件</el-button>
            <el-button size="small" type="warning" v-if="reqdata.FileGuid">已上传，点击替换</el-button>
            <div slot="tip" class="el-upload__tip">支持格式：doc,docx</div>
          </el-upload>
        </div>
        <div class="details-item">
          <div class="left">业务分类 :</div>
          <el-select :disabled="!isNewAdd" size="small" class="right w-75" v-model="selectType" placeholder="请选择业务"
            @change="val=>chooseValue(val, '业务')">
            <el-option v-for="item in typeOptions" :key="item.OrderCode" :label="item.OrderNotes"
              :value="item.OrderCode">
            </el-option>
          </el-select>
        </div>

        <div class="details-item">
          <div class="left">楼宇选择 :</div>
          <el-select :disabled="!isNewAdd" size="small" class="right w-75" v-model="selectBuilding" placeholder="请选择楼宇"
            @change="val=>chooseValue(val, '楼宇')">
            <el-option v-for="item in buildingList" :key="item.ID" :label="item.ProjectName" :value="item.ID">
            </el-option>
          </el-select>
        </div>
        <div class="details-item">
          <div class="left">合同参数 :</div>
          <el-input clearable class="right w-75" type="textarea" :autosize="{ minRows: 3, maxRows: 6}"
            v-model="reqdata.RegionName" placeholder="请输入合同参数"></el-input>
        </div>
        <div class="details-item">
          <div class="left">备 注 :</div>
          <el-input clearable class="right w-75" type="textarea" :autosize="{ minRows: 3, maxRows: 6}"
            v-model="reqdata.Remark" placeholder="请输入备注信息"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowModal = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "contractList",
  created() {
    this.getTypeOptions(); //业务分类
    this.getContractUgrList(); //合同参数列表
    this.getContractList(); //合同列表
  },
  data() {
    return {
      /**
       * 合同参数列表
       */

      contractUgrParameter: {
        flag: "OrderModel"
      },
      contractUgrList: [],
      /**
       * 业务分类部分
       * 注意：针对于合同，flag的值不是New，接口仍是New
       */
      newOrderTypeParameter: {
        flag: "Contract"
      },
      /**
       * 合同上传部分
       */
      uploadFiles: [],

      /**
       * 新增编辑合同
       */
      isShowModal: false, //弹窗显隐控制
      newContractParameter: {
        flag: "Man",
        reqdata: ""
      },
      reqdata: {
        ID: 0, // 新增为0
        ContractName: "", // 合同名称
        ContractContent: "", //合同上传返回值文件路径
        FileGuid: "", //合同上传返回值
        FileName: "", //文件名称
        OrderType: "", //业务分类
        ProjectId: 0, //楼宇ID
        RegionName: "", //合同参数
        Remark: ""
      },
      selectType: "",
      isNewAdd: false,
      typeOptions: [], //分类配置列表

      /**
       * 合同详情部分
       */
      contractDetailsParameter: {
        Contractflag: "Detail",
        Contractid: null
      },
      currentContractInfo: {},
      direction: "rtl",
      drawer: false,

      /**
       * 合同列表部分
       */
      loading: true, //数据加载标识
      ResultTotal: 0, //数据总量
      contractListParameter: {
        Contractflag: "All",
        search: "", //搜索条件
        pageNum: 1,
        pageSize: 10
      },
      contractList: [], //表格数据

      /**
       * 合同删除部分
       */
      delContractParameter: {
        flag: "Del",
        Contractid: null
      },

      /**
       * 楼宇列表
       */
      buildingList: [],
      selectBuilding: "默认合同",
      queryCondition: {
        projectflag: "All",
        projectsel: "", //搜索条件
        ordertype: "",
        pageNum: 1,
        pageSize: 10000
      },

      /**
       * 判断是否绑定合同
       */
      isBindContractParameter: {
        Contractflag: "Check",
        projectid: null
      }
    };
  },
  methods: {
    // 加载合同参数列表
    async getContractUgrList() {
      let res = await this.$Http.contractUgr(this.contractUgrParameter, true);
      if (res.ResultFlag == "0") {
        this.contractUgrList = res.ResultSet;
        // let RegionName = {};
        // this.contractUgrList.forEach(item => {
        //   RegionName[item.OrderNotes] = item.OrderCode;
        // });
        // this.reqdata.RegionName = JSON.stringify(RegionName);
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 楼宇列表
    async getBuildingList() {
      let res = await this.$Http.buildingList(this.queryCondition, true);
      if (res.ResultFlag == "0") {
        this.buildingList = [
          {
            ID: 0,
            ProjectName: "默认合同"
          }
        ];
        res.ResultSet.forEach(item => {
          this.buildingList.push({
            ID: item.ID,
            ProjectName: item.ProjectName
          });
        });
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 上传到服务器
    submitUpload() {
      this.$refs.upload.submit();
    },

    // 删除文件
    handleRemove(file, fileList) {
      this.reqdata.FileGuid = "";
      this.reqdata.FileName = "";
      this.reqdata.ContractContent = "";
      this.$message.success("删除成功");
    },

    // 预览
    handlePreview(file) {
      // console.log(file);
    },

    // 文件数据最大量限制
    handleExceed(files, fileList) {
      if (fileList.length >= 1) {
        this.$message.warning("超出文件数量限制，请删除原有文件后重试");
      } else {
        this.uploadFiles = [];
        this.uploadFiles = files;
      }
    },

    // 文件替换
    changeFile() {
      this.$confirm("此操作会替换已上传文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.handleRemove(file, fileList);
        })
        .catch(() => {});
    },

    // 文件上传成功
    handleSuccess(response, file, fileList) {
      // console.log(response, file, fileList);
      if (response.ResultFlag == "0") {
        this.reqdata.FileGuid = response.ResultSet;
        this.reqdata.ContractContent = response.ResultSet1;
        this.$message.success("文件上传成功");
      } else {
        this.$message.error("文件上传失败");
      }
    },

    // 文件上传失败
    handleError(response, file, fileList) {
      // console.error(response, file, fileList, "upload error");
      this.reqdata.FileName = "";
      this.reqdata.FileGuid = "";
      this.reqdata.ContractContent = "";
    },

    // 业务分类列表----
    async getTypeOptions() {
      let res = await this.$Http.newOrderType(this.newOrderTypeParameter, true);
      if (res.ResultFlag == "0") {
        this.typeOptions = res.ResultSet;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 下拉框选择----
    chooseValue(value, str) {
      switch (str) {
        case "业务":
          this.reqdata.OrderType = value;
          this.queryCondition.ordertype = value; //楼宇查询的业务类型
          this.reqdata.ProjectId = 0; //选中楼宇的ID
          this.selectBuilding = ""; //选中楼宇的名称
          this.getBuildingList();
          this.typeOptions.forEach(item => {
            if (value == item.OrderCode) {
              this.selectType = item.OrderNotes;
            }
          });
          break;
        case "楼宇":
          this.reqdata.ProjectId = value; //楼宇ID
          this.typeOptions.forEach(item => {
            if (value == item.ID) {
              this.selectBuilding = item.ProjectName;
            }
          });
          this.isBindContractParameter.projectid = value;
          if (
            this.isBindContractParameter.projectid != 0 &&
            this.isBindContractParameter.projectid != null
          ) {
            this.judgeIsBind();
          }
          break;
      }
    },

    // 校验当前选中楼宇是不是已经绑定合同

    async judgeIsBind() {
      let res = await this.$Http.isBindContract(
        this.isBindContractParameter,
        true
      );
      if (res.ResultFlag == "0") {
        // this.$message.success(res.ResultSet)
      } else {
        this.$message.error(res.ResultSet);
      }
    },
    // 获取文件信息----
    getFileInfo(file) {
      if (
        file.raw.name.indexOf(".doc") == -1 &&
        file.raw.name.indexOf(".docx") == -1
      ) {
        this.$message.warning("文件格式不支持");
      } else {
        this.reqdata.FileName = file.raw.name;
        this.submitUpload();
      }
    },

    // 合同列表----
    async getContractList() {
      let res = await this.$Http.contractList(this.contractListParameter, true);
      if (res.ResultFlag == "0") {
        this.contractList = res.ResultSet;
        this.ResultTotal = res.ResultTotal;
        this.loading = false;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 查看详情----
    handleView(index, row) {
      this.contractDetailsParameter.Contractid = row.ID;
      this.getContractDetails();
      this.drawer = true;
    },

    // 编辑信息----
    handleEdit(index, row) {
      this.isNewAdd = false;
      this.contractDetailsParameter.Contractid = row.ID;
      this.reqdata.ID = row.ID;
      this.getContractDetails();
      this.isShowModal = true;
    },

    // 合同详情----
    async getContractDetails() {
      let res = await this.$Http.contractDetails(
        this.contractDetailsParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.currentContractInfo = res.ResultSet;
        this.reqdata.ID = this.currentContractInfo.ID;
        this.reqdata.ProjectId = this.currentContractInfo.ProjectId;
        this.reqdata.ContractContent = this.currentContractInfo.ContractContent;
        this.reqdata.ContractName = this.currentContractInfo.ContractName;
        this.reqdata.FileGuid = this.currentContractInfo.FileGuid;
        this.reqdata.Remark = this.currentContractInfo.Remark;
        this.reqdata.FileName = this.currentContractInfo.FileName;
        this.reqdata.OrderType = this.currentContractInfo.OrderType;
        this.reqdata.RegionName = this.currentContractInfo.RegionName;
        this.typeOptions.forEach(item => {
          if (item.OrderCode == this.currentContractInfo.OrderType) {
            this.selectType = item.OrderNotes;
          }
        });
        this.bindBuildingName(this.reqdata.ProjectId);
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 绑定楼宇名称
    async bindBuildingName(tempId) {
      let res = await this.$Http.buildingList(this.queryCondition, true);
      if (res.ResultFlag == "0") {
        let tempBuildingList = [
          {
            ID: 0,
            ProjectName: "默认合同"
          }
        ];
        res.ResultSet.forEach(item => {
          tempBuildingList.push({
            ID: item.ID,
            ProjectName: item.ProjectName
          });
        });
        tempBuildingList.forEach(item => {
          if (item.ID == tempId) {
            this.selectBuilding = item.ProjectName;
          }
        });
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 删除合同确认----
    handleDelete(index, row) {
      let _this = this;
      _this.delContractParameter.Contractid = row.ID;
      _this
        .$confirm("此操作将永久删除该合同, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.deleteContract();
        })
        .catch(() => {
          _this.delContractParameter.Contractid = null;
        });
    },

    // 删除
    async deleteContract() {
      let res = await this.$Http.delContract(this.delContractParameter, true);
      if (res.ResultFlag == "0") {
        this.$message.success("删除成功");
        this.getContractList();
      } else {
        this.$messge.error("删除失败，请稍后重试！");
      }
    },

    // 分页----
    handleCurrentChange(currentPage) {
      this.contractListParameter.pageNum = currentPage;
      this.getContractList();
    },

    // 新增合同----
    handleAddBtn() {
      this.reqdata.ID = 0;
      this.reqdata.ContractName = "";
      this.reqdata.ContractContent = "";
      this.reqdata.FileGuid = "";
      this.reqdata.FileName = "";
      this.reqdata.OrderType = "";
      this.reqdata.RegionName = "";
      this.reqdata.Remark = "";
      this.selectType = "";
      this.isShowModal = true;
      this.isNewAdd = true;
      this.reqdata.ProjectId = 0; //选中楼宇的ID
      this.selectBuilding = "默认合同"; //选中楼宇的名称
      this.buildingList = []; //点击新增，清空楼宇列表
    },

    confirmAdd() {
      if (!this.reqdata.ContractName) {
        this.$message.warning("请输入合同名称");
      } else if (!this.reqdata.FileName) {
        this.$message.warning("请上传文件");
      } else if (!this.reqdata.OrderType) {
        this.$message.warning("请选择业务分类");
      } else if (!this.reqdata.RegionName) {
        this.$message.warning("请输入合同参数");
      } else {
        this.newContractParameter.reqdata = JSON.stringify(this.reqdata);
        this.addContract();
      }
    },

    // 新增编辑合同
    async addContract() {
      let res = await this.$Http.newContract(this.newContractParameter, true);
      if (res.ResultFlag == "0") {
        this.$message.success("保存成功");
        this.isShowModal = false;
        this.getContractList();
      } else {
        this.$message.error(res.ResultSet);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/productList";
@import "../style/contractList";
</style>
