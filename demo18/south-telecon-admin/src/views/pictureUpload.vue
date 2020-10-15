<template>
  <div class="picture-upload">

    <div class="certificate-part" v-if="ordertype == 'GR'">
      <div class="left">证件类型</div>
      <el-radio-group class="right-radio" size="small" v-model="radio1" @change='chooseCertificate'>
        <el-radio-button :label="element.text" v-for="(element,index) in certificateList" :key="index">
        </el-radio-button>
      </el-radio-group>
    </div>
    <div class="content">

      <!-- A、头部证件号码填写 -->
      <div class="list" :class="element.PropName == '身份证'?'add-list-width':''" v-for="(element, ind) in photoListDetails" :key="ind">
        <div class="left">
          <div class="left-title">证件名称<span class="require" v-if="element.PropEmpty == '1'">*</span></div>
          <div class="card-title">{{element.PropName}}</div>
        </div>
        <div class="input-value">
          <div class="input-value-title">证件号码<span class="require" v-if="element.PropEmpty == '1'">*</span></div>
          <el-input class="input-content" size="small" v-model="element.PropNotes" :placeholder="'请输入'+element.PropName + '号码'"></el-input>
        </div>
        <div class="right">
          <div class="item" :class="element.PropName == '身份证'?'add-width':''" v-for="(item, index) in element.picList" :key="index">
            <div class="img-container" @click="previewImage(ind, index)">
              <div class="img-txt" v-if="item.PicBase == '' && element.PropName == '身份证' && index == 0">身份证正面照</div>
              <div class="img-txt" v-else-if="item.PicBase == '' && element.PropName == '身份证' && index == 1">身份证反面照
              </div>
              <div class="img-txt" v-else-if="item.PicBase == '' && element.PropName != '身份证'">
                {{element.PropName}}</div>
              <img class="img" v-else :src="item.PicBase" alt="photo">
            </div>
            <div class="upload-part">
              <el-upload class="upload-demo" :on-change="(file,fileList)=>getFile(ind, index,file, fileList)" :action="item.action" :file-list="item.files" 
                :on-remove="(file, fileList)=>handleRemove(ind, index,file, fileList)" :on-success="(response, file, fileList)=>handleSuccess(ind, index, response, file, fileList)"
                :before-remove="(file,fileList)=>beforeRemove(ind, index, file, fileList)" :multiple='false'>
                <el-button size="mini" type="primary">点击上传</el-button>
              </el-upload>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮部分 -->
    <div class="action-btns">
      <div class="right">
        <el-button size="small" type="primary" class="save-btn" @click="handleClickNext">下一步</el-button>
        <el-button size="small" type="primary" plain class="back-btn" @click="goBack">返回上一步</el-button>
      </div>
    </div>

    <!-- 预览图片 -->
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "pictureUpload",
  created() {
    this.orderid = Number(this.$route.query.orderid);
    this.ordertype = this.$route.query.ordertype;
    this.updateOrderImgParameter.orderid = Number(this.$route.query.orderid); //更新订单图片信息
    this.orderDetailsParameter.orderid = Number(this.$route.query.orderid); //订单详情信息
    this.customPropParameter.ordertype = this.ordertype; //自定义字段信息
    this.getOrderDetails(); //获取当前订单
  },
  data() {
    return {
      radio1: "",
      selectCertificate: null,
      originalData: [], //原始数据（没有根据证类型进行过滤的数据）
      certificateList: [],
      /**
       * 接受的参数
       *
       */
      orderid: null, //订单id
      ordertype: "", //类型

      /**
       * 一、订单详情相关
       */

      orderDetailsParameter: {
        orderflag: "Detail",
        orderid: null
      }, // 订单详情参数
      // 订单信息
      orderInfo: {},

      /**
       * 二、订单详情相关
       */

      updateOrderImgParameter: {
        orderflag: "pics",
        orderid: null,
        reqdata: ""
      }, // 更新图片参数

      /**
       * 三、自定义相关
       */

      customFields: [], //上传照片类型选择
      photoListDetails: [], //循环的照片配置数组
      filterPhotoListDetails: [], //经过非空筛选后的参数，作为实际上传的照片
      customPropParameter: {
        ordertype: "",
        pageNum: 1,
        pageSize: 10
      }, // 自定义字段参数

      /**
       * 图片预览部分
       */

      dialogVisible: false,
      dialogImageUrl: ""
    };
  },
  methods: {
    // 证件类切换
    chooseCertificate(val) {
      this.certificateList.forEach(item => {
        if (val == item.text) {
          this.selectCertificate = item.value;
        }
      });
      if (this.selectCertificate) {
        this.photoListDetails = [];
        this.photoListDetails = this.originalData.filter(item => {
          return item.ID == this.selectCertificate;
        });
      }
    },

    //加载当前订单信息
    async getOrderDetails() {
      let res = await this.$Http.orderDetails(this.orderDetailsParameter, true);
      if (res.ResultFlag == "0") {
        this.orderInfo = res.ResultSet;
        switch (this.orderInfo.OrderType) {
          case "GR":
            this.getCustomFieldsGR();
            break;
          case "QY":
            this.getCustomFieldsQY();
            break;
          default:
            this.getCustomFieldsQY();
            break;
        }
      }else{
        this.$message.error('数据加载失败')
      }
    },

    // 获取业务自定义字段(个人)
    async getCustomFieldsGR() {
      let res = await this.$Http.customProp(this.customPropParameter, true);
      if (res.ResultFlag == "0") {
        /**
         * 第一部分：配置顶部下拉菜单按钮
         */

        res.ResultSet.forEach(item => {
          this.certificateList.push({
            value: item.ID,
            text: item.PropName
          });

          /**
           * 逻辑说明：
           * 1、当存在身份证字段时，首先默认使用身份证作为证件上传类型；
           * 2、当没有身份证时，默认使用配置列表的第一项作为选择的证件上传类型；
           */
          if (item.PropName == "身份证") {
            this.selectCertificate = item.ID;
            this.radio1 = item.text;
          } else {
            this.selectCertificate = this.certificateList[0].value;
            this.radio1 = this.certificateList[0].text;
          }
        });


        /**
         * 第二部分：配置上传照片信息
         */

        let Arr = [];
        res.ResultSet.forEach(item => {
          let tempObj = {
            PropName: item.PropName, //自定义名称
            PropEmpty: item.PropEmpty, //是否必传照片
            OrderType: item.OrderType, //业务类型
            PropValue: item.PropNotes, //填写的证件号码
            PropNotes: item.PropNotes, //填写的证件号码
            OrderID: this.orderid, //订单id
            ID: item.ID, //自定义id
            ImageIdList: [], //图片的id组合数组
            picList: []
          };

          // 根据字段PicNum（用户需要上传的照片数量），添加上传组件数量及配置信息
          for (let index = 0; index < item.PicNum; index++) {
            tempObj.picList.push({
              ID: item.ID,
              files: [],
              action: "/southtelpc/HandlerUpload.ashx",
              PicBase: "",
              PropId: item.ID,
              PropValue: item.PropName,
              PropNotes: "",
              CreateID: localStorage.getItem("CreateID"),
              OrderType: this.ordertype,
              ImgId: "",
              PicType: ""
            });
          }
          Arr.push(tempObj);
        });
        /**
         * 逻辑说明：
         * 1、在通过接口加载自定义字段之后，配置照片上传的数据结构；
         * 2、根据用户选择上传的照片类型，进行过滤配置当前所需要的照片上传结构；
         * 3、注意：过滤不会改变总的数据结构，用户再次进行选择照片上传类型的时候，不会受到影响。
         */

        this.originalData = Arr;
        this.photoListDetails = this.originalData.filter(item => {
          return item.ID == this.selectCertificate;
        });

        // this.photoListDetails = Arr;
      }
    },

    // 获取业务自定义字段(企业)
    async getCustomFieldsQY() {
      let res = await this.$Http.customProp(this.customPropParameter, true);
      if (res.ResultFlag == "0") {
        let Arr = [];
        res.ResultSet.forEach(item => {
          let tempObj = {
            PropName: item.PropName, //自定义名称
            PropEmpty: item.PropEmpty, //是否必传照片
            OrderType: item.OrderType, //业务类型
            PropValue: item.PropNotes, //填写的证件号码
            PropNotes: item.PropNotes, //填写的证件号码
            OrderID: this.orderid, //订单id
            ID: item.ID, //自定义id
            ImageIdList: [], //图片的id组合数组
            picList: []
          };

          for (let index = 0; index < item.PicNum; index++) {
            tempObj.picList.push({
              ID: item.ID,
              files: [],
              action: "/southtelpc/HandlerUpload.ashx",
              PicBase: "",
              PropId: item.ID,
              PropValue: item.PropName,
              PropNotes: "",
              CreateID: localStorage.getItem("CreateID"),
              OrderType: this.ordertype,
              ImgId: "",
              PicType: ""
            });
          }
          Arr.push(tempObj);
        });
        this.originalData = Arr;
        this.photoListDetails = JSON.parse(JSON.stringify(this.originalData));
      }
    },

    // 文件列表移除文件时的钩子
    handleRemove(ind, index, file, fileList) {
      this.photoListDetails[ind].picList[index].PicBase = "";
    },

    // 获取图片的base64地址
    getFile(ind, index, file, fileList) {
      this.getBase64(file.raw).then(res => {
        this.photoListDetails[ind].picList[index].PicBase = res;
        let dataPicUpload = {
          picdata: JSON.stringify({
            PicBase: encodeURIComponent(
              this.photoListDetails[ind].picList[index].PicBase
            ), //图片后缀
            OrderType: this.ordertype,
            PropId: this.photoListDetails[ind].picList[index].PropId,
            PropValue: this.photoListDetails[ind].picList[index].PropValue, //图片对应的证件号码
            PicType: this.photoListDetails[ind].picList[index].PicType, //图片前缀
            CreateID: this.photoListDetails[ind].picList[index].CreateID
          })
        };
        this.uploadImg(ind, index, dataPicUpload); //文件上传
      });
    },

    // 封装获取文件base64函数
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



    // 文件上传成功时的钩子
    handleSuccess(ind, index, response, file, fileList) {
      // console.log("on-success");
    },

    // 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。
    beforeRemove(ind, index, file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    // 预览图片
    previewImage(ind, index) {
      if (!this.photoListDetails[ind].picList[index].PicBase) {
        this.$message.warning("请上传图片");
      } else {
        this.dialogImageUrl = this.photoListDetails[ind].picList[index].PicBase;
        this.dialogVisible = true;
      }
    },

    // 点击下一步
    handleClickNext() {
      switch (this.orderInfo.OrderType) {
        case "GR":
          this.bindOrderPicGR();
          break;
        case "QY":
          this.bindOrderPicQY();
          break;
        default:
          break;
      }
    },

    // 绑定订单的图片-个人
    bindOrderPicGR() {
      this.photoListDetails.forEach((element, i) => {
        let arr = [];
        element.picList.forEach((item, k) => {
          if (element.ID == item.ID && item.ImgId && item.PropValue) {
            arr.push(item.ImgId);
          }
        });
        element.ImageIdList = arr;
      });
      // 使用filterPhotoListDetails作为经过过滤后的上传照片列表
      this.filterPhotoListDetails = JSON.parse(
        JSON.stringify(this.photoListDetails)
      );
      if (this.filterPhotoListDetails[0].PropEmpty == "1") {
        if (!this.filterPhotoListDetails[0].PropNotes) {
          this.$message.warning(
            "请填写" + this.filterPhotoListDetails[0].PropName + "号码"
          );
          return;
        }
        let arr = this.filterPhotoListDetails[0].picList;
        let upFlag = true;
        for (let index = 0; index < arr.length; index++) {
          // 身份证情况
          if (this.filterPhotoListDetails[0].PropName == "身份证") {
            if (!arr[index].PicBase) {
              switch (index) {
                case 0:
                  this.$message.warning("请上传身份证正面照");
                  break;
                case 1:
                  this.$message.warning("请上传身份证反面照");
                  break;
              }
              upFlag = false;
              break;
            }
          } else {
            // 非身份证的情况
            if (!arr[index].PicBase) {
              this.$message.warning("请上传" + arr[index].PropValue + "照片");
              upFlag = false;
              break;
            }
          }
        }
        if (upFlag) {
          this.updateOrderImg();
        }
      }
    },

    // 绑定订单图片-企业
    bindOrderPicQY() {
      this.photoListDetails.forEach((element, i) => {
        let arr = [];
        element.picList.forEach((item, k) => {
          if (element.ID == item.ID && item.ImgId && item.PropValue) {
            arr.push(item.ImgId);
          }
        });
        element.ImageIdList = arr;
      });
      this.filterPhotoListDetails = JSON.parse(
        JSON.stringify(this.photoListDetails)
      );

      let upFlag = true;
      for (let i = 0; i < this.filterPhotoListDetails.length; i++) {
        // 注意：只需要处理必填项目的照片与号码
        if (this.filterPhotoListDetails[i].PropEmpty == "1") {
          // 1、未填写号码
          if (!this.filterPhotoListDetails[i].PropNotes) {
            this.$message.warning(
              "请填写" + this.filterPhotoListDetails[i].PropName + "号码"
            );
            upFlag = false;
          } else {
            // 2、照片没有上传
            let tempPicList = this.filterPhotoListDetails[i].picList;
            for (let k = 0; k < tempPicList.length; k++) {
              if (!tempPicList[k].PicBase) {
                this.$message.warning(
                  "请上传" + tempPicList[k].PropValue + "照片"
                );
                upFlag = false;
              }
            }
          }
          // 特别注意：中断循环的时机一定要确认好。
          if (!upFlag) {
            break;
          }
        }
      }
      if (upFlag) {
        this.updateOrderImg();
      }
    },

    // 上传图片接口对接
    async uploadImg(ind, index, dataPicUpload) {
      let res = await this.$Http.uploadPhoto(dataPicUpload, true);
      if (res.ResultFlag == "0") {
        this.photoListDetails[ind].picList[index].ImgId = res.ResultSet;
        this.$message.success("上传成功");
      } else {
        this.$message.error("上传失败");
      }
    },

    // 更新订单中的照片
    async updateOrderImg() {
      let reqdata = [];
      this.filterPhotoListDetails.forEach(item => {
        reqdata.push({
          PropId: item.ID, //自定义字段的id
          PropName: item.PropName, //自定义字段的名称
          OrderType: item.OrderType, //业务类型
          PropValue: item.PropNotes, //填写的证件号码
          OrderID: this.orderid, //订单id
          ImageIdList: item.ImageIdList //图片的组合id
        });
      });
      this.updateOrderImgParameter.reqdata = JSON.stringify(reqdata);
      let res = await this.$Http.updateOrderImg(
        this.updateOrderImgParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.$message.success("订单提交成功");
        this.$router.push({
          path: "/agreement",
          query: {
            orderid: Number(this.$route.query.orderid),
            ordertype: this.orderInfo.OrderType
          }
        });
      }
    },

    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/pictureUpload";
</style>