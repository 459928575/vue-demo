<template>
  <div class="service-charge-management">
    <!-- 1、业务类型 -->
    <div class="header">
      <div class="title">业务类型</div>
      <div class="right">
        <el-radio-group v-model="selectType" size="small" @change="typeChange">
          <el-radio-button :label="item.OrderNotes" v-for="(item, index) in typeOptions" :key="index"></el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 2、字段列表部分 -->
    <div class="top">
      <div class="title">内容输入</div>
      <div class="right-table">
        <el-table v-loading="loading" :data="chargeList" style="width: 100%"
          :header-cell-style="$config.headerCellStyle" border>
          <el-table-column prop="PropName" label="字段名称" align="center" width="240">
            <template slot-scope="scope">
              <el-input clearable size="mini" v-model="scope.row.PropName" placeholder="请输入字段名称">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="classText" label="类型" align="center" width="100">
            <template slot-scope="scope">
              <el-select size="small" v-model="scope.row.classText" @change="classChange($event,scope.$index)">
                <el-option v-for="item in classOptions" :key="item.OrderCode" :label="item.OrderNotes"
                  :value="item.OrderCode">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="PicNum" label="图片数量" align="center" width="160">
            <template slot-scope="scope">
              <el-input-number size="mini" v-model="scope.row.PicNum" controls-position="right" :min="0" placeholder=""
                :disabled="scope.row.classText == '文本'">
              </el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="PropSort" label="排序" align="center" width="160">
            <template slot-scope="scope">
              <el-input-number size="mini" v-model="scope.row.PropSort" controls-position="right" :min="0"
                placeholder="">
              </el-input-number>
            </template>
          </el-table-column>
          <el-table-column prop="requiredText" label="是否必填" align="center">
            <template slot-scope="scope">
              <el-select size="small" v-model="scope.row.requiredText" @change="requiredChange($event,scope.$index)">
                <el-option v-for="item in requiredOptions" :key="item.OrderCode" :label="item.OrderNotes"
                  :value="item.OrderCode">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="delProject(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="add-btn" size="mini" type="primary" plain @click="addProject">添加新字段</el-button>
      </div>

    </div>

    <!-- 3、底部按钮操作 -->
    <div class="bottom">
      <div class="title"></div>
      <div class="right-content">
        <el-button size="mini" type="primary" class="save-btn" @click="save">保存</el-button>
        <el-button size="mini" type="primary" plain class="back-btn" @click="goBack">返回</el-button>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  name: "customOrder",
  created() {
    this.customFieldDetailsParameter.ordertype = "GR";
    this.newCustomFieldParameter.ordertype = "GR";
    this.selectType = "住宅";
    this.getTypeOptions(); //注意：列表加载结束，进行详情加载
  },
  data() {
    return {
      // 分类配置参数
      typeOptions: [],
      allOrderTypeParameter: {
        flag: "All"
      },
      selectType: "",
      /**
       * 新增/编辑自定义字段
       */
      newCustomFieldParameter: {
        propflag: "Man",
        ordertype: "",
        reqdata: ""
      },

      loading: true,
      chargeList: [],
      requiredOptions: [
        { OrderCode: 1, OrderNotes: "是" },
        { OrderCode: 0, OrderNotes: "否" }
      ],
      classOptions: [
        { OrderCode: 1, OrderNotes: "图片" },
        { OrderCode: 0, OrderNotes: "文本" }
      ],
      customFieldDetailsParameter: {
        propflag: "Detail",
        ordertype: ""
      }
    };
  },
  methods: {
    // 分类列表
    async getTypeOptions() {
      let res = await this.$Http.newOrderType(this.allOrderTypeParameter, true);
      if (res.ResultFlag == "0") {
        this.typeOptions = res.ResultSet;
        this.getCustomFieldDetails();
      }
    },

    // 字段详情
    async getCustomFieldDetails() {
      this.loading = true;
      let res = await this.$Http.customFieldDetails(
        this.customFieldDetailsParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.chargeList = [];
        res.ResultSet.forEach(item => {
          this.chargeList.push({
            ID: item.ID || 0,
            OrderType: item.OrderType,
            PropName: item.PropName,
            PropEmpty: Number(item.PropEmpty),
            PicNum: item.PicNum,
            Flag: Number(item.Flag),
            PropSort: item.PropSort,
            classText: item.Flag == 1 ? "图片" : "文本",
            requiredText: item.PropEmpty == 1 ? "是" : "否"
          });
        });
        this.loading = false;
      } else {
        this.$message.error("数据加载失败");
      }
    },

    // 分类选择
    typeChange(txt) {
      this.selectType = txt;
      this.typeOptions.forEach(item => {
        if (item.OrderNotes == txt) {
          this.newCustomFieldParameter.ordertype = item.OrderCode;
          this.customFieldDetailsParameter.ordertype = item.OrderCode;
        }
      });
      this.getCustomFieldDetails();
    },

    /**
     * 表格数据操作
     */

    // 必填选择
    requiredChange(type, index) {
      this.requiredOptions.forEach(item => {
        if (item.OrderCode == type) {
          this.chargeList[index]["requiredText"] = item.OrderNotes;
        }
      });
      this.chargeList[index].PropEmpty = type;
    },

    // 类型选择
    classChange(type, index) {
      this.classOptions.forEach(item => {
        if (item.OrderCode == type) {
          this.chargeList[index]["classText"] = item.OrderNotes;
        }
      });
      this.chargeList[index].Flag = type;
      if (this.chargeList[index].Flag) {
        this.chargeList[index].PicNum = 0;
      }
    },

    /**
     * 数据的增删
     */
    // 添加项目
    addProject() {
      this.chargeList.push({
        requiredText: "",
        classText: "",
        OrderType: "",
        PropName: "",
        PropEmpty: 0,
        PicNum: 0,
        Flag: 0,
        PropSort: 0,
        CreateID: Number(localStorage.getItem("CreateID"))
      });
    },

    // 删除项目
    delProject(index) {
      this.chargeList.splice(index, 1);
    },

    /**
     * 保存提交
     */

    // 保存按钮
    save() {
      if (!this.newCustomFieldParameter.ordertype) {
        this.$message.warning("请选择业务分类");
      } else if (!this.chargeList.length) {
        this.preAdd();
      } else {
        for (let index = 0; index < this.chargeList.length; index++) {
          // 图片类型
          if (this.chargeList[index].Flag) {
            if (
              !this.chargeList[index].PropName ||
              !this.chargeList[index].PropSort ||
              !this.chargeList[index].requiredText ||
              !this.chargeList[index].PicNum
            ) {
              this.$message.warning("请填写完整第" + (index + 1) + "字段信息");
              return;
            }
          } else {
            // 文本类型
            if (
              !this.chargeList[index].PropName ||
              !this.chargeList[index].PropSort ||
              !this.chargeList[index].requiredText
            ) {
              this.$message.warning("请填写完整第" + (index + 1) + "字段信息");
              return;
            }
          }
        }
        this.preAdd();
      }
    },

    preAdd() {
      /**
       * 保存说明：
       * 1、当传入为空数据时，也要保存。
       * 2、传入不是空数据时，组合数据保存。
       */
      let reqdata = [];
      if (this.chargeList.length > 0) {
        this.chargeList.forEach(item => {
          item["OrderType"] = this.newCustomFieldParameter.ordertype;
          item["CreateID"] = Number(localStorage.getItem("CreateID"));
        });
        this.chargeList.forEach(item => {
          reqdata.push({
            ID: item.ID || 0,
            OrderType: item.OrderType,
            PropName: item.PropName,
            PropEmpty: item.PropEmpty,
            PicNum: item.PicNum,
            Flag: item.Flag,
            PropSort: item.PropSort,
            CreateID: Number(localStorage.getItem("CreateID"))
          });
        });
      }
      this.newCustomFieldParameter.reqdata = JSON.stringify(reqdata);
      this.addCustomField();
    },

    // 新增/编辑自定义字段
    async addCustomField() {
      let res = await this.$Http.newCustomField(
        this.newCustomFieldParameter,
        true
      );
      if (res.ResultFlag == "0") {
        this.open();
      } else {
        this.$message.error("保存失败");
      }
    },

    // 离开确认
    open() {
      this.$confirm("保存成功, 是否离开?", "提示", {
        confirmButtonText: "离开",
        cancelButtonText: "取消",
        type: "success"
      })
        .then(() => {
          // 点击确定，返回产品列表
          this.goBack();
        })
        .catch(() => {
          // 点击取消，重新加载列表
          this.getCustomFieldDetails();
        });
    },

    // 返回
    goBack() {
      this.$router.push({
        path: "/productList"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/customOrder";
</style>