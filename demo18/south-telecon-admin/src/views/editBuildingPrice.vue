<template>
  <div class="service-charge-management">
    <div class="details-container" v-loading="loading">
      <div class="details-item">
        <div class="left">楼宇名称</div>
        <div class="right">{{buildingBaseInfo.ProjectName}}</div>
      </div>
      <div class="details-item">
        <div class="left">楼宇地址</div>
        <div class="right">{{buildingBaseInfo.Address}}</div>
      </div>
      <div class="details-item">
        <div class="left">负责人</div>
        <div class="right">{{buildingBaseInfo.Director}}</div>
      </div>
      <div class="details-item">
        <div class="left">电话</div>
        <div class="right">{{buildingBaseInfo.CellPhone}}</div>
      </div>
      <div class="details-item">
        <div class="left">备注</div>
        <div class="right">{{buildingBaseInfo.Remark || '--'}}</div>
      </div>
      <div class="details-item">
        <div class="left">使用产品</div>
        <div class="right w-75">
          <el-table border :row-class-name="row-style" :data="oldProductList" style="width: 100%" height="300">
            <el-table-column prop="ProductName" label="产品名称" align="center"></el-table-column>
            <el-table-column prop="Price" label="价格(元)" align="center"></el-table-column>
            <el-table-column label="楼宇价格(元)" align="center">
              <template slot-scope="scope">
                <el-input-number size="mini" v-model="scope.row.ProjectPrice" controls-position="right" :min="0">
                </el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="details-item" style="padding-top: 24px;">
        <div class="left"></div>
        <div class="right w-75">
          <el-button size="mini" type="primary" class="save-btn" @click="handleClickSaveBtn">保存</el-button>
          <el-button size="mini" type="primary" plain class="back-btn" @click="goBack">返回</el-button>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  name: "editBuildingPrice",
  created() {
    this.buildingPriceDetailsParameter.id = Number(this.$route.query.id);
    this.getBuildingPriceDetails();
  },
  data() {
    return {
      loading: true,
      saveBuildingPriceParameter: {
        projectsflag: "Man",
        reqdata: ""
      },
      oldProductList: [], //之前已经添加的产品
      buildingPriceDetailsParameter: {
        projectsflag: "Detail",
        id: null
      },
      buildingPriceDetailsInfo: {},
      buildingBaseInfo: {} //楼宇基础信息
    };
  },
  methods: {
    // 楼宇价格详情信息
    async getBuildingPriceDetails() {
      let res = await this.$Http.buildingPriceDetails(
        this.buildingPriceDetailsParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.buildingPriceDetailsInfo = res.ResultSet;
        this.buildingBaseInfo = this.buildingPriceDetailsInfo.ProjectModel;
        this.buildingPriceDetailsInfo.ProductList.forEach(item => {
          this.oldProductList.push({
            ID: item.ID,
            ProductName: item.ProductName,
            Price: item.Price,
            ProjectPrice: item.ProjectPrice
          });
        });
        this.loading = false;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 点击保存按钮
    handleClickSaveBtn() {
      let lastAddedArr = [];
      this.oldProductList.forEach(item => {
        lastAddedArr.push({
          ID: 0,
          ProjectId: this.buildingPriceDetailsParameter.id,
          ProductId: item.ID,
          Price: item.ProjectPrice,
          Remark: this.buildingBaseInfo.Remark,
          CreateID: Number(localStorage.getItem("CreateID"))
        });
      });
      this.saveBuildingPriceParameter.reqdata = JSON.stringify(lastAddedArr);
      this.submitBuildingPrice();
    },

    // 点击返回
    goBack() {
      this.$router.push({
        path: "/buildingPrice"
      });
    },

    // 提交保存
    async submitBuildingPrice() {
      let res = await this.$Http.saveBuildingPrice(
        this.saveBuildingPriceParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.$message.success("保存成功");
        this.goBack();
      } else {
        this.$message.error("保存失败");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/editBuildingPrice";
</style>