<template>
  <div class="edit-container">
    <div class="info-item">
      <div class="left">产品名称</div>
      <div class="right">
        <el-input clearable size="small" class="content" v-model="productInfo.ProductName" placeholder="请输入产品名称">
        </el-input>
      </div>
    </div>
    <div class="info-item">
      <div class="left">图片</div>
      <div class="right">
        <img class="product-img" v-if="productInfo.ProductBase" :src="productInfo.ProductBase" alt="logo">
        <div class="tips-container" v-if="!productInfo.ProductBase">点击下方上传按钮上传图片</div>
        <div class="upload-part">
          <!-- <el-input clearable size="small" class="img-name" v-model="productInfo.Remark" placeholder="可修改图片名称">
          </el-input> -->
          <el-upload :multiple="false" class="upload-demo" action="/southtelpc/HandlerUpload.ashx" :on-change="getFile"
            :on-remove="handleRemove" :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed"
            :on-success="handleSuccess" :on-error="handleError">
            <el-button size="small" type="primary" v-if="!productInfo.ProductBase">点击上传图片</el-button>
            <el-button size="small" type="primary" v-if="productInfo.ProductBase">点击替换图片</el-button>
          </el-upload>
        </div>
      </div>
    </div>

    <div class="info-item">
      <div class="left">业务分类</div>
      <div class="right">
        <el-select size="small" class="content" v-model="productInfo.OrderType" placeholder="请选择业务分类"
          @change="typeChange">
          <el-option v-for="item in typeOptions" :key="item.OrderCode" :label="item.OrderNotes" :value="item.OrderCode">
          </el-option>
        </el-select>
      </div>
    </div>

    <div class="info-item">
      <div class="left">运营商</div>
      <div class="right">
        <el-select size="small" class="content" v-model="productInfo.MenuType" placeholder="请选择运营商"
          @change="operatorChange">
          <el-option v-for="item in operatorOptions" :key="item.OrderCode" :label="item.OrderNotes"
            :value="item.OrderCode">
          </el-option>
        </el-select>
      </div>
    </div>

    <div class="info-item">
      <div class="left">付费周期（月）</div>
      <div class="right">
        <el-input-number :min="0" placeholder="请输入付款时长" size="small" class="content"
          v-model="productInfo.ProductDeadline" :step="1" step-strictly></el-input-number>
      </div>
    </div>

    <div class="info-item">
      <div class="left">内容</div>
      <div class="right">
        <el-input clearable class="textarea" type="textarea" :autosize="{ minRows: 2, maxRows: 10}"
          v-model="productInfo.ProductContent" placeholder="请输入产品内容">
        </el-input>
      </div>
    </div>

    <div class="info-item">
      <div class="left">备注</div>
      <div class="right">
        <el-input clearable class="textarea" type="textarea" :autosize="{ minRows: 2, maxRows: 10}"
          v-model="productInfo.Remark" placeholder="请输入产品备注">
        </el-input>
      </div>
    </div>

    <!-- 新的业务逻辑中，服务费绑定楼宇而非服务费 -->
    <div class="info-item">
      <div class="left">服务费</div>
      <div class="right">
        <el-table border :row-class-name="row-style" :data="oldServices" style="width: 100%" height="300">
          <el-table-column prop="ServiceName" label="费用名称" align="center"></el-table-column>
          <el-table-column prop="OrderType" label="分类" width="60" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.OrderType == 'GR'">住宅</span>
              <span v-else-if="scope.row.OrderType == 'QY'">企业</span>
              <span v-else>其他</span>
            </template>
          </el-table-column>
          <el-table-column prop="ServiceFee" label="费用金额（元）" align="center">
            <template slot-scope="scope">
              <el-input-number size="mini" v-model="scope.row.ServiceFee" controls-position="right" :min="0">
              </el-input-number>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-button style="margin-left: 15px;" class="add-btn" size="mini" type="primary" plain icon="el-icon-plus"
        @click="dealClickServiceBtn">
        添加服务费</el-button>
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
        <el-button size="small" type="primary" plain class="back-btn" @click="back">返回</el-button>
      </div>
    </div>

    <!-- 服务费弹窗 -->
    <el-dialog width="650px" :close-on-click-modal="false" class="discount-modal" title="添加服务费"
      :visible.sync="isAddServiceFee">
      <div class="add-product-container">
        <el-table border ref="multipleTable" class="product-table" height="300" :data="serviceFeeList"
          style="width: 100%" @selection-change="selectionChangeServiceFee">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="ServiceName" label="服务费名称" align="center"></el-table-column>
          <!-- 注意：这里暂时的字段是ServiceFeeValue，但是实际插入服务费表格中的字段是ServiceFee，这个很重要 -->
          <el-table-column prop="ServiceFeeValue" label="服务费金额(元)" align="center"></el-table-column>
          <el-table-column prop="ServiceNotes" label="备注" align="center"></el-table-column>
        </el-table>
      </div>
    </el-dialog>

  </div>
</template>
<script>
export default {
  name: "modifyProductInfo",
  created() {
    this.getOperatorOptions();
    if (localStorage.getItem("typeOptions")) {
      this.typeOptions = JSON.parse(localStorage.getItem("typeOptions"));
    } else {
      this.getTypeOptions();
    }
    this.CreateID = Number(localStorage.getItem("CreateID"));
    this.ID = Number(this.$route.query.ID);
    this.productInfo.ID = Number(this.$route.query.ID);
    this.productDetailsInfoParameter.productid = Number(this.$route.query.ID);
    if (this.ID) {
      this.getProductDetailsInfo();
    }
  },
  data() {
    return {
      CreateID: 0, //当前用户id
      ID: 0, // 产品id

      // 分类配置参数
      typeOptionsParameter: {
        flag: "New"
      },
      productInfo: {
        ID: 0,
        OrderType: "",
        ProductName: "",
        ProductBase: "",
        ProductContent: "",
        ProductDeadline: 0,
        MenuType: "",
        Remark: ""
      },
      typeOptions: [], //分类配置列表
      fileList: [],
      serviceFeeList: [], //服务费列表
      selectServiceFeeList: [],
      productDetailsInfoParameter: {
        productflag: "Detail",
        productid: null
      },

      /**
       * 服务费部分
       */
      isAddServiceFee: false,
      multipleSelection: [], //弹窗中勾选的服务费
      oldServices: [], //当前产品原有的服务费里列表
      serviceFeeByTypeParameter: {
        feeflag: "All",
        ordertype: "",
        pageNum: 1,
        pageSize: 10000
      },

      /**
       * 运营商列表
       */
      operatorOptions: [],
      operatorOptionsParameter: {
        flag: "Menu"
      }
    };
  },
  methods: {
    // 产品详情
    async getProductDetailsInfo() {
      let res = await this.$Http.productDetailsInfo(
        this.productDetailsInfoParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.productInfo = res.ResultSet;
        this.serviceFeeByTypeParameter.ordertype = this.productInfo.OrderType;
        // 新的业务逻辑中，服务费绑定楼宇而非服务费
        let tempOldServices = res.ResultSet.ServiceList;
        tempOldServices.forEach(item => {
          this.oldServices.push({
            ServiceId: item.ServiceId,
            ServiceName: item.ServiceName,
            ServiceFee: item.ServiceFee, //注意：这里的字段是ServiceFee，但是服务费列表中字段为ServiceFeeValue，容易出错
            OrderType: item.OrderType
          });
        });
      }
    },

    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      }
    },

    // 服务费选中数据变化
    selectionChangeServiceFee(val) {
      /**
       * 逻辑梳理：
       * 1、点击添加服务费按钮之后，首先进行编辑
       * 2、如果在选中的弹窗数据中存在，并且在原有服务费列表中不存在，那么添加到服务费列表中去；
       */
      this.multipleSelection = val;
      this.oldServices = [];
      this.multipleSelection.forEach(item => {
        this.oldServices.push({
          ServiceId: item.ID,
          ServiceName: item.ServiceName,
          //注意：这里的字段是ServiceFee，但是产品详情中中字段为ServiceFee，
          /**
           * 特别注意：
           * 1、在拿到的服务费列表中，原始数据服务费金额字段是ServiceFeeValue;
           * 2、而后新增字段ServiceFee，为了保持产品详情中服务费字段的统一；
           * 3、为什么新增ServiceFee字段？
           * （1）在原有服务费是，如果重新选择了服务费，当原有的服务费金额不同于服务费总表中的金额时，再次选择回疆已经修改iahoade金额替换为固有金额；
           * （2）新增字段为了解决这个问题；
           * （3）在每次打开弹窗的时候，我们要修改总表总中新增字段ServiceFee的值与原有服务费相同（必须）
           */
          ServiceFee: item.ServiceFee,
          OrderType: item.OrderType
        });
      });

      // let arr = [];
      // this.oldServices.forEach(element => {
      //   this.multipleSelection.forEach(item => {
      //     if (element.ID != item.ID) {
      //       arr.push(item);
      //     }
      //   });
      // });
      // this.oldServices = this.oldServices.concat(arr);
    },

    // 业务分类列表
    async getTypeOptions() {
      let res = await this.$Http.newOrderType(this.typeOptionsParameter, true);
      if (res.ResultFlag == "0") {
        this.typeOptions = res.ResultSet;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 运营商列表
    async getOperatorOptions() {
      let res = await this.$Http.operator(this.operatorOptionsParameter, true);
      if (res.ResultFlag == "0") {
        this.operatorOptions = res.ResultSet;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 分类选择
    typeChange(type) {
      this.productInfo.OrderType = type;
      this.serviceFeeByTypeParameter.ordertype = type;
      // 新的业务逻辑中，服务费绑定楼宇而非服务费
      this.getServiceFeeByType();
    },

    // 分类选择
    operatorChange(type) {
      // selectMenuType = 
      this.operatorOptions.forEach(item => {
        if (type == item.OrderCode) {
          this.productInfo.MenuType = item.OrderNotes;
        }
      });
    },

    // 获取服务费列表
    async getServiceFeeByType() {
      let res = await this.$Http.serviceFeeByType(
        this.serviceFeeByTypeParameter,
        true
      );
      if (res.ResultFlag == "0") {
        res.ResultSet.forEach(item => {
          item["ServiceFee"] = item.ServiceFeeValue;
        });
        this.serviceFeeList = res.ResultSet;
        let arr = [];
        if (this.oldServices && this.oldServices.length > 0) {
          this.oldServices.forEach(item => {
            /**
             * 特别注意：
             * 1、在原有服务费列表中，服务费id字段为ServiceId
             * 2、在服务费总表中，服务费id字段为ID
             */
            this.serviceFeeList.forEach(unit => {
              if (item.ServiceId == unit.ID) {
                unit["ServiceFee"] = item.ServiceFee;
                arr.push(unit);
              }
            });
          });
          this.$nextTick(() => {
            this.toggleSelection(arr);
          });
        }
      }
    },

    // 添加服务费按钮
    dealClickServiceBtn() {
      if (!this.productInfo.OrderType) {
        this.$message.warning("请选择业务分类");
        return;
      }
      this.getServiceFeeByType();
      this.isAddServiceFee = true;
    },

    // 保存产品信息判断
    save() {
      if (!this.productInfo.ProductName) {
        this.$message.warning("请输入产品名称");
      } else if (!this.productInfo.ProductBase) {
        this.$message.warning("请上传产品图片");
      } else if (!this.productInfo.OrderType) {
        this.$message.warning("请选择业务分类");
      } else if (!this.productInfo.ProductContent) {
        this.$message.warning("请填写产品内容");
      } else if (!this.productInfo.ProductDeadline) {
        this.$message.warning("请填写付费周期（月）");
      } else if (!this.productInfo.MenuType) {
        this.$message.warning("请选择运营商类型");
      } else {
        this.saveProduct();
      }
    },

    // 保存信息（调用接口）
    async saveProduct() {
      // 新的业务逻辑中，服务费绑定楼宇而非服务费
      let arr = [];
      this.oldServices.forEach(item => {
        arr.push({
          ID: 0,
          ProductId: this.ID,
          OrderType: this.productInfo.OrderType,
          ServiceId: item.ServiceId, //注意字段为：ServiceId
          ServiceFee: item.ServiceFee //注意字段为：ServiceFee
        });
      });
      this.selectServiceFeeList = arr;
      let res = await this.$Http.saveProductInfo(
        {
          productflag: "Man",
          reqdata: JSON.stringify({
            ID: this.ID,
            OrderType: this.productInfo.OrderType,
            MenuType:this.productInfo.MenuType,
            ProductName: this.productInfo.ProductName,
            ProductContent: this.productInfo.ProductContent,
            ProductBase: encodeURIComponent(this.productInfo.ProductBase),
            ProductDeadline: this.productInfo.ProductDeadline,
            Remark: this.productInfo.Remark,
            // 新的业务逻辑中，服务费绑定楼宇而非服务费
            ServiceList: this.selectServiceFeeList,
            // 暂时传值为空数组
            // ServiceList:[],
            CreateID: Number(localStorage.getItem("CreateID"))
          })
        },
        true
      );
      if (res.ResultFlag == "0") {
        this.$message.success("保存成功");
        this.back();
      }
    },

    // 返回
    back() {
      this.$router.push({
        path: "/productList"
      });
    },

    handleRemove(file, fileList) {
      this.productInfo.ProductBase = "";
    },

    handleSuccess(response, file, fileList) {
      // console.log("上传成功");
    },

    handleError(err, file, fileList) {
      // console.log("上传失败");
    },

    // 获取图片的base64地址
    getFile(file, fileList) {
      this.getBase64(file.raw).then(res => {
        this.productInfo.ProductBase = res;
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

    // 处理用户选中的照片数量
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择1个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },

    // 删除照片之前的确认操作
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  },
  computed: {}
};
</script>
<style lang="scss">
@import "../style/edit";
// 默认全部选中
// selectAll() {
//   this.$nextTick(() => {
//     for (let i = 0; i < this.serviceFeeList.length; i++) {
//       this.$refs.multipleTable.toggleRowSelection(
//         this.serviceFeeList[i],
//         true
//       );
//     }
//   });
// },
</style>