<template>
  <div class="applicant-information">
    <div class="content">
      <div class="list">
        <div class="left">
          <span>公司名称</span>
          <span class="require">*</span>
        </div>
        <div class="right">
          <el-input clearable class="right-input " size="small" v-model="companyInfo.companyName" placeholder="请输入公司名称">
          </el-input>
        </div>
      </div>

      <div class="list">
        <div class="left">
          <span>公司地址</span>
          <span class="require">*</span>
        </div>
        <div class="right">
          <el-input clearable class="right-input w-600" size="small" v-model="companyInfo.address"
            placeholder="请输入公司地址">
          </el-input>
        </div>
      </div>

      <div class="list">
        <div class="left">
          <span>法人姓名</span>
          <span class="require">*</span>
        </div>
        <div class="right">
          <el-input clearable class="right-input " size="small" v-model="companyInfo.legalName" placeholder="请输入法人姓名">
          </el-input>
        </div>
      </div>

      <div class="list">
        <div class="left">
          <span>联系电话</span>
          <span class="require">*</span>
        </div>
        <div class="right">
          <el-input clearable class="right-input " size="small" :maxlength="11" v-model="companyInfo.legalTel" placeholder="请输入联系电话">
          </el-input>
        </div>
      </div>

      <div class="list">
        <div class="left">
          <span>固定电话</span>
          <span class="require">*</span>
        </div>
        <div class="right">
          <el-input clearable class="right-input " size="small" v-model="companyInfo.tel" placeholder="请输入固定电话">
          </el-input>
        </div>
      </div>

      <div class="list">
        <div class="left">
          <span>E-MAIL</span>
          <span class="require">*</span>
        </div>
        <div class="right">
          <el-input clearable class="right-input" size="small" v-model="companyInfo.email" placeholder="请输入邮箱">
          </el-input>
        </div>
      </div>

      <div class="list">
        <div class="left">
          <span>身份证号</span>
          <span class="require">*</span>
        </div>
        <div class="right">
          <el-input clearable class="right-input" size="small" :maxlength="18" v-model="companyInfo.idCard" placeholder="请输入身份证号">
          </el-input>
        </div>
      </div>

      <div class="action-btns">
        <div class="left"></div>
        <div class="right">
          <el-button size="small" type="primary" class="save-btn" @click="goNext">下一步</el-button>
          <el-button size="small" type="primary" plain class="back-btn" @click="goBack">返回上一步</el-button>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  name: "companyInformation",
  data() {
    return {
      companyInfo: {
        companyName: "",
        legalName: "",
        tel: "",
        email: "",
        idCard: "",
        address: "",
        legalTel: ""
      }
    };
  },
  methods: {
    goNext() {
       this.$router.push({
          path: "/pictureUpload"
        });
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/applicantInformation";
</style>