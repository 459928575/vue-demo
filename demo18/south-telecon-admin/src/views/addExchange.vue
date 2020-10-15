<template>
  <div class="edit-container">
    <div class="info-item">
      <div class="left">兑换名称</div>
      <div class="right">
        <el-input clearable size="small" class="content" v-model="reqdata.ExchangeName" placeholder="请输入名称"></el-input>
      </div>
    </div>

    <div class="info-item">
      <div class="left">兑换图片</div>
      <div class="right">
        <img class="product-img" v-if="currentPicBase"
          :src="currentPicBase || 'http://iph.href.lu/100x100?fg=6DAEEE&bg=6DAEEE'" alt="logo">
        <div class="tips-container" v-if="!currentPicBase">点击下方上传按钮上传图片</div>
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
      <div class="left">所需积分</div>
      <div class="right">
        <el-input-number class="content w-100" size="small" v-model="reqdata.Point" controls-position="right"  :min="1"></el-input-number>
      </div>
    </div>

    <div class="info-item">
      <div class="left">兑换内容</div>
      <div class="right">
        <el-input clearable class="textarea" type="textarea" :rows="2" v-model="reqdata.ExchangeContent"
          placeholder="请输入内容">
        </el-input>
      </div>
    </div>

    <div class="info-item">
      <div class="left">备注</div>
      <div class="right">
        <el-input clearable class="textarea" type="textarea" :rows="2" v-model="reqdata.Remark" placeholder="请输入备注">
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
  name: "addExchange",
  created() {
    this.ID = Number(this.$route.query.ID);
    this.reqdata.ID = Number(this.$route.query.ID);
    this.exchangeDetailsParameter.Exchangeid = Number(this.$route.query.ID);
    if (this.exchangeDetailsParameter.Exchangeid) {
      this.getExchangeDetails();
    }
  },
  data() {
    return {
      // 兑换详情
      exchangeDetailsParameter: {
        flag: "Detail",
        Exchangeid: null
      },
      currentExchangeInfo: {},

      // 新增兑换
      newExchangeParameter: {
        flag: "Man",
        reqdata: ""
      },
      reqdata: {
        ID: 0,
        ExchangeName: "", // 活动名称
        PicBase: "", //  图片Base
        ExchangeContent: "", //内容
        Remark: "",
        Point: 0,
        CreateID: Number(localStorage.getItem("CreateID"))
      },
      currentPicBase:'',  //当前照片地址

      fileList: []
    };
  },
  methods: {
    // 兑换详情 ---
    async getExchangeDetails() {
      let res = await this.$Http.exchangeDetails(
        this.exchangeDetailsParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.currentExchangeInfo = res.ResultSet;
        this.reqdata.ExchangeName = this.currentExchangeInfo.ExchangeName;
        this.currentPicBase = this.currentExchangeInfo.PicBase;
        this.reqdata.ExchangeContent = this.currentExchangeInfo.ExchangeContent;
        this.reqdata.Remark = this.currentExchangeInfo.Remark;
        this.reqdata.Point = this.currentExchangeInfo.Point;
      } else {
        this.$message.error("加载失败");
      }
    },

    // 保存按钮 ---
    save() {
      if (!this.reqdata.ExchangeName) {
        this.$message.warning("请输入兑换名称");
      } else if (!this.currentPicBase) {
        this.$message.warning("请上传活动图片");
      } else if (!this.reqdata.ExchangeContent) {
        this.$message.warning("请输入兑换内容");
      } else if (!this.reqdata.Point) {
        this.$message.warning("请输入所需积分");
      } else {
        this.reqdata.PicBase = encodeURIComponent(this.currentPicBase);
        this.newExchangeParameter.reqdata = JSON.stringify(this.reqdata);
        this.addExchange();
      }
    },

    // 新增兑换信息 ---
    async addExchange() {
      let res = await this.$Http.newExchange(this.newExchangeParameter, true);
      if (res.ResultFlag == "0") {
        this.$message.success("保存成功");
        this.$router.push({
          path: "/IntegralExchangeList"
        });
      } else {
        this.$message.error("保存失败");
      }
    },

    handleRemove(file, fileList) {
      this.currentPicBase = "";
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
        this.currentPicBase = res;
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
        path: "/IntegralExchangeList"
      });
    }
  }
};
</script>
<style lang="scss">
@import "../style/addExchange";
</style>