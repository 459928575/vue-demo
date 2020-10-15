<template>
  <div class="box">
    <!-- 1、筛选部分  -->
    <div class="search-part">
      <el-radio-group v-model="category" size="small" @change="changeType">
        <el-radio-button :label="item.OrderNotes" v-for="(item, index) in typeOptions" :key="index"></el-radio-button>
      </el-radio-group>
      <el-button class="add-btn" type="success" size="small" icon="el-icon-circle-plus-outline" @click="handleAddBtn">
        新增服务费
      </el-button>
    </div>

    <!-- 2、表格数据 -->
    <el-table v-loading="loading" :data="serviceFeeList" style="width: 100%"
      :header-cell-style="$config.headerCellStyle" border>
      <el-table-column prop="ServiceName" label="服务费名称" align="center"></el-table-column>
      <el-table-column prop="OrderType" label="业务分类" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.OrderType == 'GR'">住宅</span>
          <span v-else-if="scope.row.OrderType == 'QY'">企业</span>
          <span v-else>其他</span>
        </template>
      </el-table-column>
      <el-table-column prop="ServiceFeeValue" label="价格" align="center"></el-table-column>
      <el-table-column prop="ServiceNotes" label="备注" align="center"></el-table-column>
      <el-table-column prop="UpdateName" label="更新人" align="center"></el-table-column>
      <el-table-column prop="UpdateTime" label="更新时间" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" width="300" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleView(scope.$index, scope.row)">查看详情</el-button>
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination :current-page.sync="serviceFeeByTypeParameter.pageNum" @current-change="handleCurrentChange"
        background layout="total, prev, pager, next, jumper" :total="ResultTotal">
      </el-pagination>
    </div>

    <!-- 3、详情 -->
    <el-drawer class="order-details" :direction="direction" :title="currentServiceFeeInfo.ServiceName"
      :visible.sync="dialogVisible">
      <div class="order-info" :style="{height:scrollerHeight}">
        <div class="list">
          <div class="list-title">服务费名称</div>
          <div class="list-content">{{currentServiceFeeInfo.ServiceName}}</div>
        </div>
        <div class="list">
          <div class="list-title">产品类型</div>
          <div class="list-content" v-if="currentServiceFeeInfo.OrderType == 'GR'">住宅</div>
          <div class="list-content" v-else-if="currentServiceFeeInfo.OrderType == 'QY'">企业</div>
          <div class="list-content" v-else>其他</div>
        </div>
        <div class="list">
          <div class="list-title">金额</div>
          <div class="list-content">¥ {{currentServiceFeeInfo.ServiceFeeValue}}</div>
        </div>
        <div class="remark">
          <div class="list-title">备注</div>
          <div class="list-content" v-if="!currentServiceFeeInfo.ServiceNotes">--</div>
          <div class="list-content" v-else v-html="currentServiceFeeInfo.ServiceNotes"></div>
        </div>
        <div class="list">
          <div class="list-title">更新人</div>
          <div class="list-content">{{currentServiceFeeInfo.UpdateName}}</div>
        </div>
        <div class="list">
          <div class="list-title">更新日期</div>
          <div class="list-content">{{currentServiceFeeInfo.UpdateTime}}</div>
        </div>
      </div>
    </el-drawer>

    <!-- 4、新增/编辑 -->
    <el-dialog :close-on-click-modal="false" class="add-modal" :title="isNewAdd?'新增服务费':'编辑服务费'"
      :visible.sync="isShowModal" width="650px">
      <div class="details-container">
        <div class="details-item">
          <div class="left">分类 :</div>
          <el-select class="right w-50" v-model="selectType" placeholder="请选择业务分类" @change="chooseType">
            <el-option v-for="item in modalTypeOptions" :key="item.OrderCode" :label="item.OrderNotes"
              :value="item.OrderCode">
            </el-option>
          </el-select>
        </div>
        <div class="details-item">
          <div class="left">名称 :</div>
          <el-input class="right w-50" v-model="currentServiceFeeInfo.ServiceName" placeholder="请输入名称"></el-input>
        </div>
        <div class="details-item">
          <div class="left">金额 :</div>
          <el-input-number class="right width-200" v-model="currentServiceFeeInfo.ServiceFeeValue"
            controls-position="right" :min="0">
          </el-input-number>
          <span class="unit">元</span>
        </div>
        <div class="details-item">
          <div class="left">备注 :</div>
          <el-input class="right w-75" v-model="currentServiceFeeInfo.ServiceNotes" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowModal = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddServiceFee">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "serviceChargeList",
  created() {
    this.getTypeOptions();
  },
  data() {
    return {
      viewportH: 0,
      /**
       * 分类配置部分
       */
      category: "全部",
      typeOptions: [{ OrderCode: "", OrderNotes: "全部" }],
      typeOptionsParameter: {
        flag: "New"
      },

      /**
       * 服务费部分
       */
      loading: true, //数据加载标识
      serviceFeeList: [],
      ResultTotal: 0, //数据总量
      serviceFeeByTypeParameter: {
        feeflag: "All",
        ordertype: "",
        pageNum: 1,
        pageSize: 10
      },

      /**
       * 服务费详情
       */
      serviceFeeDetailsParameter: {
        feeflag: "Detail",
        serviceid: null
      },
      dialogVisible: false, //弹窗显隐控制
      direction: "rtl",

      /**
       * 新增/编辑服务费部分
       */
      modalTypeOptions: [],
      isNewAdd: true,
      isShowModal: false,
      selectType: "",
      newServiceFeeParameter: {
        feeflag: "Man",
        reqdata: ""
      },
      currentServiceFeeInfo: {
        ID: 0, //  新增为0，修改传ID
        OrderType: "", //  个人：GR 企业：QY 其他：QT
        ServiceName: "", //费用名称
        ServiceFeeValue: 100, // 费用金额(默认)
        ServiceNotes: "", // 服务费备注
        CreateID: Number(localStorage.getItem("CreateID"))
      },

      /**
       * 删除服务费
       */
      delServiceFeeParamater: {
        feeflag: "Del",
        servicefeeid: null
      }
    };
  },
  methods: {
    // 业务分类列表
    async getTypeOptions() {
      let res = await this.$Http.newOrderType(this.typeOptionsParameter, true);
      if (res.ResultFlag == "0") {
        this.modalTypeOptions = res.ResultSet; //用户选择分类
        this.typeOptions.push(...res.ResultSet); //用户筛选列表
        this.getServiceFeeByType();
      }
    },

    // 服务费列表
    async getServiceFeeByType() {
      let res = await this.$Http.serviceFeeByType(
        this.serviceFeeByTypeParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.serviceFeeList = res.ResultSet;
        this.ResultTotal = res.ResultTotal;
        this.loading = false;
      }else{
        this.$message.error('数据加载失败')
      }
    },

    // 切换分类(筛选部分)
    changeType(type) {
      this.category = type;
      this.typeOptions.forEach(item => {
        if (item.OrderNotes == type) {
          this.serviceFeeByTypeParameter.ordertype = item.OrderCode;
        }
      });
      this.serviceFeeByTypeParameter.pageNum = 1;
      this.getServiceFeeByType();
    },

    // 选择分类（新增下拉部分）
    chooseType(type) {
      this.currentServiceFeeInfo.OrderType = type;
      this.modalTypeOptions.forEach(item => {
        if (item.OrderCode == type) {
          this.selectType = item.OrderNotes;
        }
      });
    },

    // 服务费详情
    async getServiceFeeDetails() {
      let res = await this.$Http.serviceFeeDetails(
        this.serviceFeeDetailsParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.currentServiceFeeInfo = res.ResultSet;
        this.modalTypeOptions.forEach(item => {
          if (item.OrderCode == this.currentServiceFeeInfo.OrderType) {
            this.selectType = item.OrderNotes;
          }
        });
        
      }else{
        this.$message.error('数据加载失败')
      }
    },

    // 添加服务费确认按钮
    confirmAddServiceFee() {
      if (!this.currentServiceFeeInfo.OrderType) {
        this.$message.warning("请选择分类");
      } else if (!this.currentServiceFeeInfo.ServiceName) {
        this.$message.warning("请输入服务费名称");
      } else if (!this.currentServiceFeeInfo.ServiceFeeValue) {
        this.$message.warning("请输入服务费金额");
      } else {
        let tempObj = {
          ID: this.isNewAdd ? 0 : this.currentServiceFeeInfo.ID,
          OrderType: this.currentServiceFeeInfo.OrderType,
          ServiceName: this.currentServiceFeeInfo.ServiceName,
          ServiceFeeValue: this.currentServiceFeeInfo.ServiceFeeValue,
          ServiceNotes: this.currentServiceFeeInfo.ServiceNotes,
          CreateID: Number(localStorage.getItem("CreateID"))
        };
        this.newServiceFeeParameter.reqdata = JSON.stringify(tempObj);
        this.addServiceFee();
      }
    },

    //新增/编辑服务费
    async addServiceFee() {
      let res = await this.$Http.newServiceFee(
        this.newServiceFeeParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.$message.success("保存成功");
        this.isShowModal = false;
        this.getServiceFeeByType(); //数据刷新
      } else {
        this.$message.error("保存失败");
      }
    },
    // 查看详情
    handleView(index, row) {
      this.serviceFeeDetailsParameter.serviceid = row.ID;
      this.getServiceFeeDetails();
      this.dialogVisible = true;
    },
    // 新增产品
    handleAddBtn() {
      this.isNewAdd = true;
      this.isShowModal = true;
      this.currentServiceFeeInfo.ID = 0;
      this.currentServiceFeeInfo.OrderType = "";
      this.currentServiceFeeInfo.ServiceName = "";
      this.currentServiceFeeInfo.ServiceFeeValue = 100;
      this.currentServiceFeeInfo.ServiceNotes = "";
      this.selectType = "";
    },
    // 编辑信息
    handleEdit(index, row) {
      this.isShowModal = true;
      this.isNewAdd = false;
      this.serviceFeeDetailsParameter.serviceid = row.ID;
      this.currentServiceFeeInfo.ID = row.ID;
      this.getServiceFeeDetails();
    },

    // 删除产品弹窗
    handleDelete(index, row) {
      let _this = this;
      _this.delServiceFeeParamater.servicefeeid = row.ID;
      _this
        .$confirm("此操作将永久删除该服务费, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.deleteServiceFee();
        })
        .catch(() => {
          _this.delServiceFeeParamater.servicefeeid = null;
        });
    },

    // 删除服务费
    async deleteServiceFee() {
      let res = await this.$Http.delServiceFee(
        this.delServiceFeeParamater,
        true
      );
      if (res.ResultFlag == "0") {
        this.$message.success("删除成功");
        this.getServiceFeeByType();
      } else {
        this.$message.error("删除失败");
      }
    },

    // 分页
    handleCurrentChange(currentPage) {
      this.serviceFeeByTypeParameter.pageNum = currentPage;
      this.getServiceFeeByType();
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
@import "../style/drawer";
@import "../style/serviceChargeList";
</style>
