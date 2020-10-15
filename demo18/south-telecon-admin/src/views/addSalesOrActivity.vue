<template>
  <div class="edit-container">
    <div class="info-item">
      <div class="left">名称</div>
      <div class="right">
        <el-input clearable size="small" class="content" v-model="reqdata.PromotName" placeholder="请输入名称"></el-input>
      </div>
    </div>

    <div class="info-item">
      <div class="left">促销/活动</div>
      <div class="right">
        <el-select size="small" v-model="reqdata.PromotType" placeholder="请选择类型" @change="type=>typeChange(type,'1')">
          <el-option v-for="item in salesOrActivityOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>

    <div class="info-item">
      <div class="left">业务分类</div>
      <div class="right">
        <el-select size="small" v-model="selectType" placeholder="请选择业务分类" @change="type=>typeChange(type,'2')">
          <el-option v-for="item in typeOptions" :key="item.OrderCode" :label="item.OrderNotes" :value="item.OrderCode">
          </el-option>
        </el-select>
      </div>
    </div>

    <div class="info-item">
      <div class="left">业务类型</div>
      <div class="right">
        <el-select size="small" v-model="selectBusinessType" placeholder="请选择业务类型" @change="type=>typeChange(type,'3')">
          <el-option v-for="item in  businessOptions" :key="item.OrderCode" :label="item.OrderNotes"
            :value="item.OrderCode">
          </el-option>
        </el-select>
      </div>
    </div>

    <div class="info-item">
      <div class="left">图片</div>
      <div class="right">
        <img class="product-img" v-if="reqdata.PicBase"
          :src="reqdata.PicBase || 'http://iph.href.lu/100x100?fg=6DAEEE&bg=6DAEEE'" alt="logo">
        <div class="tips-container" v-if="!reqdata.PicBase">点击下方上传按钮上传图片</div>
        <div class="upload-part">
          <el-upload :multiple="false" class="upload-demo" action="/southtelpc/HandlerUpload.ashx"
            :on-preview="handlePreview" :on-change="getFile" :on-remove="handleRemove" :before-remove="beforeRemove"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </div>
      </div>
    </div>

    <div class="info-item">
      <div class="left">内容</div>
      <div class="right">
        <el-input clearable class="textarea" type="textarea" :rows="2" v-model="reqdata.PromotContent"
          placeholder="请输入内容">
        </el-input>
      </div>
    </div>

    <div class="info-item">
      <div class="left"></div>
      <div class="right border">
      </div>
    </div>
    <div class="info-item">
      <div class="left"></div>
      <div class="right">
        <el-button size="small" type="primary" class="save-btn" @click="save">保存</el-button>
        <el-button size="small" type="primary" plain class="back-btn" @click="goBack">返回</el-button>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  name: "addSalesOrActivity",
  created() {
    this.getTypeOptions();
    this.getBusinessOptions();
    this.ID = Number(this.$route.query.ID);
    this.reqdata.ID = Number(this.$route.query.ID);
    this.salesPromotionDetailsPatameter.Promotionid = Number(this.$route.query.ID);
    if (this.salesPromotionDetailsPatameter.Promotionid) {
      this.getSalesPromotionDetails();
    }
  },
  data() {
    return {
      // 业务分类选择
      typeOptions: [],
      newOrderTypeParameter: {
        flag: "New"
      },
      selectType: "",

      // 促销活动详情参数
      salesPromotionDetailsPatameter: {
        Promotionflag: "Detail",
        Promotionid: null
      },
      currentSalesPromotionInfo: {},

      // 业务类型列表参数
      maintainOrderTypeParameter: {
        flag: "Maintain"
      },
      businessOptions: [],
      selectBusinessType: "",

      // 新增编辑促销活动
      newSalesPromotionParameter: {
        Promotionflag: "Man",
        reqdata: ""
      },
      reqdata: {
        ID: 0,
        PromotName: "", // 活动名称
        PromotType: "", //活动类型（促销/活动
        OrderType: "", //业务分类
        BusinessType: "", //业务类型
        PicBase: "", //  图片Base
        PromotContent: "", //内容
        CreateID: Number(localStorage.getItem("CreateID"))
      },
      // 图片地址需要单独处理（原因：因为数据需要）

      fileList: [],
      salesOrActivityOptions: [
        { value: "促销", label: "促销" },
        { value: "活动", label: "活动" }
      ]
    };
  },
  methods: {
    // 获取促销活动详情
    async getSalesPromotionDetails() {
      let res = await this.$Http.salesPromotionDetails(
        this.salesPromotionDetailsPatameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.currentSalesPromotionInfo = res.ResultSet;
        this.reqdata.PromotName = this.currentSalesPromotionInfo.PromotName;
        this.reqdata.PromotType = this.currentSalesPromotionInfo.PromotType;
        this.reqdata.OrderType = this.currentSalesPromotionInfo.OrderType;
        this.reqdata.PicBase = this.currentSalesPromotionInfo.PicBase;
        this.reqdata.BusinessType = this.currentSalesPromotionInfo.BusinessType;
        this.reqdata.PromotContent = this.currentSalesPromotionInfo.PromotContent;
        this.typeOptions.forEach(item => {
          if (this.currentSalesPromotionInfo.OrderType == item.OrderCode) {
            this.selectType = item.OrderNotes;
          }
        });
        this.businessOptions.forEach(item => {
          if (this.currentSalesPromotionInfo.BusinessType == item.OrderCode) {
            this.selectBusinessType = item.OrderNotes;
          }
        });
      }
    },

    // 业务分类列表
    async getTypeOptions() {
      let res = await this.$Http.newOrderType(this.newOrderTypeParameter, true);
      if (res.ResultFlag == "0") {
        this.typeOptions = res.ResultSet;
      }else{
        this.$message.error('数据加载失败')
      }
    },

    // 业务类型列表
    async getBusinessOptions() {
      let res = await this.$Http.maintainOrderType(
        this.maintainOrderTypeParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.businessOptions = res.ResultSet;
      }else{
        this.$message.error('数据加载失败')
      }
    },

    // 分类选择
    typeChange(type, str) {
      switch (str) {
        case "1":
          this.reqdata.PromotType = type;
          break;
        case "2":
          this.reqdata.OrderType = type;
          this.typeOptions.forEach(item => {
            if (type == item.OrderCode) {
              this.selectType = item.OrderNotes;
            }
          });
          break;
        case "3":
          this.reqdata.BusinessType = type;
          this.businessOptions.forEach(item => {
            if (type == item.OrderCode) {
              this.selectBusinessType = item.OrderNotes;
            }
          });
          break;
      }
    },

    // 保存按钮
    save() {
      if (!this.reqdata.PromotName) {
        this.$message.warning("请输入活动名称");
      } else if (!this.reqdata.PromotType) {
        this.$message.warning("请选择活动类型");
      } else if (!this.reqdata.OrderType) {
        this.$message.warning("请选择业务分类");
      } else if (!this.reqdata.BusinessType) {
        this.$message.warning("请选择业务类型");
      } else if (!this.reqdata.PicBase) {
        this.$message.warning("请上传活动图片");
      } else if (!this.reqdata.PromotContent) {
        this.$message.warning("请输入活动内容");
      } else {
        this.reqdata.PicBase = encodeURIComponent(this.reqdata.PicBase);
        this.newSalesPromotionParameter.reqdata = JSON.stringify(this.reqdata);
        this.addSalesPromotion();
      }
    },

    // 新增促销或者折扣信息
    async addSalesPromotion() {
      let res = await this.$Http.newSalesPromotion(
        this.newSalesPromotionParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.$message.success("保存成功");
        this.$router.push({
          path: "/salesOrActivity"
        });
      }
    },

    handleRemove(file, fileList) {
      this.reqdata.PicBase = "";
    },

    handleSuccess(response, file, fileList) {
      // console.log("上传成功");
    },

    handleError(err, file, fileList) {
      this.$message.error("上传失败");
    },

    // 获取图片的base64地址
    getFile(file, fileList) {
      this.getBase64(file.raw).then(res => {
        this.reqdata.PicBase = res;
      });
    },

    getBase64(file) {
      return new Promise(function(resolve, reject) {
        let reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function() {
          imgResult = reader.result;
        };
        reader.onerror = function(error) {
          reject(error);
        };
        reader.onloadend = function() {
          resolve(imgResult);
        };
      });
    },

    // 删除照片之前的确认操作
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    handlePreview(file) {
      // console.log(file);
    },

    goBack() {
      this.$router.push({
        path:'/salesOrActivity'
      })
    }
  }
};
</script>
<style lang="scss">
@import "../style/addSalesOrActivity";
</style>