<template >
  <div class="building-price">
    <div class="info-container">
      <div class="info-list">
        <div class="left">活动名称</div>
        <div class="right">
          <el-input clearable class="right-input w-50" size="small" v-model="reqdata.CouponName" placeholder="请输入活动名称">
          </el-input>
        </div>
      </div>

      <div class="info-list">
        <div class="left">生效时间</div>
        <div class="right">
          <el-date-picker size="small" class="right-input" v-model="reqdata.CouponSDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="date=>recordValue(date,'start')">
          </el-date-picker>
        </div>
      </div>
      <div class="info-list">
        <div class="left">失效时间</div>
        <div class="right">
          <el-date-picker size="small" class="right-input" v-model="reqdata.CouponEDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="date=>recordValue(date,'end')">
          </el-date-picker>
        </div>
      </div>
      <div class="info-list">
        <div class="left">活动说明</div>
        <div class="right">
          <el-input clearable class="right-input w-75" type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model="reqdata.CouponNotes"></el-input>
        </div>
      </div>

      <div class="info-list">
        <div class="left">抵用金额</div>
        <div class="right">
          <el-input-number size="small" class="right-input" v-model="reqdata.CouponMoney" controls-position="right" :controls="false" :min="0" :step="1"></el-input-number>
          <span class="score">元</span>
        </div>
      </div>

      <div class="info-list">
        <div class="left">发行数量</div>
        <div class="right">
          <el-input-number size="small" class="right-input" v-model="reqdata.CouponQuantity" controls-position="right" :controls="false" :min="0" :step="1"></el-input-number>
          <span class="score">张</span>
        </div>
      </div>

      <div class="info-list">
        <div class="left">适用项目</div>
        <div class="right row-start-start">
          <div style="width: 100%">
            <el-table :data="practicablebuilding" style="width: 100%" height="300" :header-cell-style="$config.headerCellStyle" border>
              <el-table-column prop="ProjectName" label="楼宇名称" align="center"></el-table-column>
              <el-table-column property="Address" label="地址" align="center"></el-table-column>
            </el-table>
          </div>
          <el-button class="add-btn" size="small" icon="el-icon-plus" @click="handleAdd">添加项目</el-button>
        </div>
      </div>

      <div class="info-list">
        <div class="left"></div>
        <div class="right">
          <el-button size="small" type="primary" class="save-btn" @click="save">保存</el-button>
          <el-button size="small" type="primary" plain class="back-btn" @click="goBack">返回</el-button>
        </div>
      </div>

      <!-- 项目弹窗 -->
      <el-dialog :close-on-click-modal="false" :destroy-on-close="true" title="添加项目" :visible.sync="dialogTableVisible">
        <el-table :header-cell-style="$config.headerCellStyle" border class="add-product-modal" ref="multipleTable" height="400" :data="buildingList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column property="ProjectName" label="楼宇名称" align="center"></el-table-column>
          <el-table-column property="Address" label="地址" align="center"></el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAdd">确 定</el-button>
        </span>
      </el-dialog>

    </div>
  </div>
</template>
<script>
export default {
  name: "addCoupon",
  created() {
    this.getBuildingList();
    this.reqdata.ID = Number(this.$route.query.couponid);
    this.couponDetailsParameter.couponid = Number(this.$route.query.couponid);
    if (Number(this.$route.query.couponid)) {
      this.getCouponDetails();
    }
  },
  data() {
    return {
      /**
       * 优惠券详情部分
       */

      couponDetailsParameter: {
        couponflag: "Detail",
        couponid: 0
      },
      currentCouponInfo: {},

      /**
       *新增编辑优惠券部分
       */
      newCouponParameter: {
        couponflag: "Man",
        reqdata: ""
      },
      reqdata: {
        ID: 0,
        CouponName: "", //活动名称
        CouponMoney: 0,
        CouponQuantity: 0,
        CouponSDate: "",
        CouponEDate: "",
        CouponNotes: "",
        CreateID: Number(localStorage.getItem("CreateID")),
        Projects: []
      },

      /**
       * 项目部分
       */
      buildingList: [],

      queryCondition: {
        projectflag: "All",
        projectsel: "", //搜索条件
        ordertype: "",
        pageNum: 1,
        pageSize: 100000
      },
      buildingList: [],
      practicablebuilding: [], //使用的项目
      dialogTableVisible: false,
      multipleSelection: [] //用户选择的数据列表
    };
  },
  methods: {
    /**
     * 日期部分
     * recordValue(date, str) 选择日期
     * dealDate(date1, date2) 处理日期，比较起止日期大小关系
     */

    // 选择日期
    recordValue(date, str) {
      switch (str) {
        case "start":
          this.reqdata.CouponSDate = date;
          break;
        case "end":
          this.reqdata.CouponEDate = date;
          break;
      }
    },

    // 处理日期，比较起止日期大小关系
    dealDate() {
      let date1 = this.reqdata.CouponSDate;
      let date2 = this.reqdata.CouponEDate;
      if (date1.replace("-", "") <= date2.replace("-", "")) {
        return true;
      } else {
        return false;
      }
    },

    /**
     * 产品操作
     * handleAdd  添加按钮
     * getBuildingList 加载楼宇列表
     * handleSelectionChange(val) 选择要添加的项目
     * confirmAdd 确定添加适用项目
     */

    // 加载楼宇列表
    async getBuildingList() {
      let res = await this.$Http.buildingList(this.queryCondition, true);
      if (res.ResultFlag == "0") {
        this.buildingList = res.ResultSet;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 添加按钮
    handleAdd() {
      this.dialogTableVisible = true;
      let arr = [];
      this.practicablebuilding.forEach(item => {
        this.buildingList.forEach(unit => {
          if (item.ID == unit.ID) {
            arr.push(unit);
          }
        });
      });

      /**
       * 在使用这个方法的时候，需要给dialog设置destroy-on-close为true， 关闭时销毁 Dialog 中的元素;
       * 结合this.$nextTick
       * 否则，有的时候执行，有的时候不执行标记方法。
       */

      this.$nextTick(() => {
        this.toggleSelection(arr);
      });
    },

    // 选择要添加的项目
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 确定添加适用项目
    confirmAdd() {
      this.dialogTableVisible = false;
      this.practicablebuilding = this.multipleSelection;
    },

    /**
     * 保存与取消操作
     * save 保存按钮
     * addCoupon 添加优惠券
     * goBack 取消操作
     */

    // 保存按钮
    save() {
      if (!this.reqdata.CouponName) {
        this.$message.warning("请填写活动名称");
      } else if (!this.reqdata.CouponSDate) {
        this.$message.warning("生效时间不能为空");
      } else if (!this.reqdata.CouponEDate) {
        this.$message.warning("失效时间不能为空");
      } else if (!this.dealDate()) {
        this.$message.warning("失效时间不能小于生效时间");
      } else if (!this.reqdata.CouponNotes) {
        this.$message.warning("请填写活动说明");
      } else if (!this.reqdata.CouponMoney) {
        this.$message.warning("请填写抵用金额");
      } else if (!this.reqdata.CouponQuantity) {
        this.$message.warning("请填写发行数量");
      } else if (!this.practicablebuilding.length) {
        this.$message.warning("请选择适用项目");
      } else {
        this.reqdata.Projects = [];
        this.practicablebuilding.forEach(item => {
          this.reqdata.Projects.push({
            ID: 0,
            CouponId: Number(this.couponDetailsParameter.couponid),
            ProjectId: item.ID
          });
        });
        this.newCouponParameter.reqdata = JSON.stringify(this.reqdata);
        this.addCoupon();
      }
    },

    // 添加优惠券
    async addCoupon() {
      let res = await this.$Http.newCoupon(this.newCouponParameter, true);
      if (res.ResultFlag == "0") {
        this.$message.success("添加成功");
        this.$router.push({
          path: "/couponsList"
        });
      } else {
        this.$message.error("添加失败");
      }
    },

    // 取消操作
    goBack() {
      this.$router.push({
        path: "/couponsList"
      });
    },

    // 优惠券详情
    async getCouponDetails() {
      let res = await this.$Http.couponDetails(
        this.couponDetailsParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.currentCouponInfo = res.ResultSet;
        this.reqdata.CouponName = this.currentCouponInfo.CouponName;
        this.reqdata.CouponMoney = this.currentCouponInfo.CouponMoney;
        this.reqdata.CouponQuantity = this.currentCouponInfo.CouponQuantity;
        this.reqdata.CouponNotes = this.currentCouponInfo.CouponNotes;
        this.reqdata.CouponSDate = this.currentCouponInfo.CouponSDate;
        this.reqdata.CouponEDate = this.currentCouponInfo.CouponEDate;
        this.practicablebuilding = this.currentCouponInfo.ProjectList;
      }
    },

    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/addCoupon";
.w-50 {
  width: 50% !important;
}
.w-75 {
  width: 75% !important;
}
.row-start-start {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
}
.add-btn {
  margin-left: 15px;
}
.border-1 {
  border-top: 1px solid #e1dee7;
}
.score {
  margin-left: 10px;
}
</style>