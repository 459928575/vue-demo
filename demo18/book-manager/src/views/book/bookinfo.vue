<template>
  <div>
    <el-form
    ref="searchForm"
      :inline="true"
      class="demo-form-inline"
      :model="searchWhere"
      style="margin-top: 20px"
    >
      <el-form-item label="书名" size="mini" prop="bookName">
        <el-input
          v-model="searchWhere.bookName"
          placeholder="书名"
          style="width: 150px"
        ></el-input>
      </el-form-item>
      <el-form-item label="出版社" size="mini" prop="press">
        <el-input
          v-model="searchWhere.press"
          placeholder="出版社"
          style="width: 150px"
        ></el-input>
      </el-form-item>

      <el-form-item label="图书类型" size="mini" prop="bookType">
        <el-select v-model="searchWhere.bookType" placeholder="图书类型" style="width:120px">
          <el-option
            v-for="option in bookTypeOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          ></el-option>
        </el-select>
      </el-form-item>
      </el-form-item>
      <el-form-item label="出版日期" size="mini" prop="publicationdate">
        <el-date-picker
          v-model="searchWhere.publicationdate"
           style="width:250px"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item size="mini">
        <el-button type="primary" @click="fetchData">查询</el-button>
         <el-button @click="resetForm('searchForm')">重置</el-button>
         <el-button type="primary" @click="addHandle">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="bookinfoList" style="width: 100%" max-height="450">
      <el-table-column fixed type="index" label="序号" width="80">
      </el-table-column>
      <el-table-column prop="bookISBN" label="书号" width="150">
      </el-table-column>
      <el-table-column prop="bookName" label="书名" width="200">
      </el-table-column>
      <el-table-column prop="author" label="作者" width="100">
      </el-table-column>
      <el-table-column prop="press" label="出版社" width="150">
      </el-table-column>
      <el-table-column prop="publicationdate" label="出版日期" width="150">
      </el-table-column>
      <el-table-column prop="price" label="价格" width="100"> </el-table-column>
      <el-table-column prop="quantity" label="库存数量" width="100">
      </el-table-column>
      <el-table-column prop="bookType" label="类型" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.bookType | bookTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="160">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 新增 -->
       <el-dialog title="编辑图书信息" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="form" label-width="100px" label-position="right" ref="addForm" style="width:400px;margin-top:-20px; " :rules="rules" >
        <el-form-item label="书号" prop="bookISBN">
          <el-input v-model="form.bookISBN" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="书名" prop="bookName">
          <el-input v-model="form.bookName" size="mini" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="form.author" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="出版社" prop="press">
          <el-input v-model="form.press" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="出版日期" prop="publicationdate" >
          <el-date-picker
            size="mini"
            v-model="form.publicationdate"
            align="right"
            type="date"
            placeholder="选择日期"
           
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input v-model.number="form.quantity" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="图书类型" prop="bookType">
          <el-select v-model="form.bookType" placeholder="请选择图书类型" size="mini">
            <el-option
              v-for="option in bookTypeOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
       <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
         <el-button type="primary" @click="form.id===null?addData('addForm'):updateData('addForm')" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import bookinfoApi from "../../api/bookinfo.js";

const bookTypeOptions = [
  { type: "1", name: "编程类" },
  { type: "2", name: "前端类" },
  { type: "3", name: "设计类" },
  { type: "4", name: "移动开发类" },
];

export default {
  data() {
    return {
      dialogFormVisible: false,
      form: {
        id: null,
        bookISBN: "",
        bookName: "",
        author: "",
        press: "",
        publicationdate: "",
        quantity: 500,
        price: 0,
        bookType: "",
      },
      bookinfoList: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      searchWhere: {
        id: null,
        bookName: "",
        press: "",
        bookType: "",
        publicationdate: "",
      },
      rules: {
        bookISBN: [{ required: true, message: "请输入书号", trigger: "blur" }],
        bookName: [{ required: true, message: "请输入书名", trigger: "blur" }],
        publicationdate: [
          {
            required: true,
            message: "请选择日期",
            trigger: ["blur", "change"],
          },
        ],
        quantity: [
          { required: true, message: "数量不能为空", trigger: "blur" },
          { type: "number", message: "数量必须为数字", trigger: "blur" },
        ],
      },
      bookTypeOptions,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  filters: {
    bookTypeFilter(type) {
      const booktypeobj = bookTypeOptions.find((obj) => obj.type === type);
      return booktypeobj ? booktypeobj.name : null;
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handleSizeChange(size) {
      this.pageSize = size;
      console.log(`每页：${size}`);
      this.fetchData();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      console.log(`当前页：${currentPage}`);
      this.fetchData();
    },
    fetchData() {
      // bookinfoApi.getBookInfoList()
      bookinfoApi
        .search(this.currentPage, this.pageSize, this.searchWhere)
        .then((resp) => {
          const resp1 = resp.data;
          this.bookinfoList = resp1.data.rows;
          console.log(resp1.data.rows);
          this.total = resp1.data.total;
        })
        .catch((err) => {
          console.log("错误!");
        });
    },
    addHandle() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["addForm"].resetFields();
      });
    },
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //
          console.log("add");
          bookinfoApi.add(this.form).then((response) => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "warning",
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style>
</style>