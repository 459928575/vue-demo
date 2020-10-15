<template>
  <div class="service-charge-management">
    <!-- 1、折扣信息部分 -->
    <div class="discount-part">
      <div class="discount-list">
        <div class="title">折扣名称</div>
        <el-input clearable class="content-input" size="small" v-model="discontInfo.OffName " placeholder="请输入折扣名称">
        </el-input>
      </div>
      <div class="discount-list">
        <div class="title">开始日期</div>
        <el-date-picker size="small" value-format="yyyy-MM-dd" @change="date=>chooseDate(date,'start')"
          v-model="discontInfo.StartDate" type="date" placeholder="开始日期"></el-date-picker>
      </div>
      <div class="discount-list">
        <div class="title">结束日期</div>
        <el-date-picker size="small" value-format="yyyy-MM-dd" @change="date=>chooseDate(date,'end')"
          v-model="discontInfo.EndDate" type="date" placeholder="结束日期"></el-date-picker>
      </div>
      <div class="discount-list">
        <div class="title">折扣方式</div>
        <el-radio-group v-model="currentMethod" size="small" @change="chooseOffMethod">
          <el-radio-button label="满减"></el-radio-button>
          <el-radio-button label="折扣"></el-radio-button>
        </el-radio-group>
        <el-button type="success" size="mini" v-if="currentMethod== '满减'" class="add-btn" icon="el-icon-plus"
          @click="addOffDetail">添加满减信息</el-button>
      </div>
      <div class="discount-list">
        <div class="title"></div>
        <div class="desc-container" v-if="currentMethod== '满减'">
          <div class="desc" v-for="(item, index) in OffDetail" :key="index">
            <span class="text">满</span>
            <el-input-number size="mini" class="number-input" v-model="item.MinBuy" controls-position="right" :min="0">
            </el-input-number>
            <span class="text">减</span>
            <el-input-number size="mini" class="number-input" v-model="item.OffAmount" controls-position="right"
              :min="0"></el-input-number>
            <el-button type="danger" size="mini" class="del-btn" @click="delOffDetail">删除</el-button>
          </div>
        </div>
        <el-input-number size="mini" class="content-input" v-if="currentMethod== '折扣'" v-model="OffDetailNumber"
          placeholder="请输入折扣百分比" controls-position="right" :min="0" :max="100">
        </el-input-number>
        <span class="percentage" v-if="currentMethod== '折扣'">%</span>

      </div>
    </div>

    <!-- 2、产品选择部分 -->
    <div class="middle">
      <div class="title">适用产品</div>
      <div class="right-content">
        <div class="content-container">
          <div class="content-list" v-for="(item, index) in productList" :key="index">
            <p class="product-name">{{item.ProductName}}</p>
          </div>
        </div>
        <el-button class="add-btn" size="mini" type="primary" plain icon="el-icon-plus"
          @click="isAddProductList = true;">添加产品</el-button>
      </div>
    </div>

    <!-- 3、操作按钮部分 -->
    <div class="bottom">
      <div class="title"></div>
      <div class="right-content">
        <el-button size="mini" type="primary" class="save-btn" @click="save">保存</el-button>
        <el-button size="mini" type="primary" plain class="back-btn">返回</el-button>
      </div>
    </div>

    <!-- 4、添加产品 -->
    <el-dialog :close-on-click-modal="false" class="discount-modal" title="添加产品" :visible.sync="isAddProductList">
      <div class="add-product-container">
        <div class="header">
          <el-input size="small" clearable class="search-input" placeholder="请输入产品名称" v-model="queryCondition.productsel">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <div class="right">
            <el-button class="search-btn" size="small" type="primary" plain icon="el-icon-search"
              @click="getProductList">搜索</el-button>
          </div>
        </div>
        <el-table border ref="multipleTable" class="product-table" height="300" :data="products" style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="ProductName" label="产品名称" align="center"></el-table-column>
          <el-table-column prop="ProductDeadline" label="付费周期（月）" align="center"></el-table-column>
          <!-- <el-table-column prop="CreateID" label="更新人" align="center"></el-table-column> -->
          <el-table-column prop="UpdateTime" label="更新日期" align="center"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddProductList = false">取 消</el-button>
        <el-button class="confirm-btn" type="primary" size="medium" @click="confirmAddProducts">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
export default {
  name: "discountManagement",
  created() {
    this.getProductList();
  },
  data() {
    return {
      /**
       * 折扣部分
       */

      ProductOffId: 0,
      currentMethod: "满减",
      discontInfo: {
        ID: 0,
        OffName: "",
        EndDate: "", //结束日期
        StartDate: "", //开始日期
        OffMethod: 0, //折扣方式
        OffDetail: "", //注意：这个变量的类型满减的时候是Array、折扣的时候是Number
        ListOffDetail: [],
        CreateID: Number(localStorage.getItem("CreateID")) 
      },
      OffDetail: [], //满减列表
      OffDetailNumber:0,

      /**
       * 产品部分
       */

      queryCondition: {
        productflag: "All",
        productsel: "", //搜索条件
        ordertype: "",
        payment: 0,
        pageNum: 1,
        pageSize: 10000
      },
      productList: [], //使用的产品列表
      isAddProductList: false,
      products: [], //产品列表
      multipleSelection: [] //选中的数据
    };
  },
  methods: {
    /**
     * chooseOffMethod(way) 选择折扣方式
     * addOffDetail 添加满减活动
     * delOffDetail(index) 删除当前满减活动
     * isTrueOffDetail 判断折扣方式是否符合要求
     * save 保存按钮
     * submitDiscount 提交折扣管理
     */

    // 选择折扣方式
    chooseOffMethod(way) {
      switch (way) {
        case "满减":
          this.discontInfo.OffMethod = 0;
          break;
        case "折扣":
          this.discontInfo.OffMethod = 1;
          break;
        default:
          break;
      }
    },

    // 添加满减活动
    addOffDetail() {
      this.OffDetail.push({
        MinBuy: 0,
        OffAmount: 0
      });
    },

    // 删除当前满减活动
    delOffDetail(index) {
      this.OffDetail.splice(index, 1);
    },

    // 判断折扣方式是否符合要求
    isTrueOffDetail() {
      let flag = true;
      // 满减
      if (this.discontInfo.OffMethod == 0) {
        if (this.OffDetail.length == 0) {
          flag = false;
          this.$message.warning("满减折扣不能为空");
          return flag;
        } else {
          let tempBooleanFlag = this.OffDetail.every(item => {
            return (
              item.MinBuy && item.OffAmount && item.MinBuy > item.OffAmount
            );
          });
          if (!tempBooleanFlag) {
            flag = false;
            this.$message.warning("存在满减数字不合格或者未填写");
            return flag;
          }
        }
      }

      // 折扣方式
      if (this.discontInfo.OffMethod == 1) {
        flag = this.OffDetail ? true : false;
        if (!flag) {
          this.$message.warning("请输入折扣百分比");
          return flag;
        }
      }

      return flag;
    },

    // 保存
    save() {
      if (!this.discontInfo.OffName) {
        this.$message.warning("请输入折扣名称");
      } else if (!this.discontInfo.StartDate) {
        this.$message.warning("请选择开始日期");
      } else if (!this.discontInfo.EndDate) {
        this.$message.warning("请选择结束日期");
      } else if (!this.discontInfo.EndDate) {
        this.$message.warning("请选择结束日期");
      } else if (!this.productList.length) {
        this.$message.warning("请添加产品");
      } else if (!this.isTrueOffDetail()) {
        // 什么都不用做，所有的判断都是在isTrueOffDetail函数中
      } else {
        this.submitDiscount();
      }
    },

    // 提交折扣管理
    async submitDiscount() {
      this.productList.forEach(item => {
        this.discontInfo.ListOffDetail.push({
          ID: this.discontInfo.ID,
          ProductId: item.ID,
          ProductOffId: this.discontInfo.ID
        });
      });
      if (this.discontInfo.OffMethod == "0") {
        // 满减
        this.discontInfo.OffDetail = JSON.stringify(this.OffDetail);
      } else {
        // 折扣
        this.discontInfo.OffDetail = Number(this.OffDetailNumber)* 0.01
      }


      let newDiscountInfoParameter = {
        prooffflag: "Man",
        reqdata: JSON.stringify(this.discontInfo)
      };
      let res = await this.$Http.newDiscountInfo(
        newDiscountInfoParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.$message.success("保存成功");
        this.$router.push({
          path: "/salesOrActivity"
        });
      } else {
        this.$message.error("保存失败");
      }
    },

    /**
     * 产品列表选择操作
     * getProductList 产品列表
     * handleSelectionChange(val) 表格数据选择操作
     * confirmAddProducts 确定添加产品擦操作
     */

    // 产品列表
    async getProductList() {
      let res = await this.$Http.getProductList(this.queryCondition, true);
      if (res.ResultFlag == "0") {
        this.products = res.ResultSet;
      }else{
        this.$message.error('数据加载失败')
      }
    },

    // 表格数据选择操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 确定添加产品擦操作
    confirmAddProducts() {
      this.isAddProductList = false;
      this.productList = this.multipleSelection;
    },

    // 选择的日期
    chooseDate(date, str) {
      switch (str) {
        case "start":
          this.discontInfo.StartDate = date;
          break;
        case "end":
          this.discontInfo.EndDate = date;
          break;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/discountManagement";
</style>