<script setup>
import { Edit, Delete } from "@element-plus/icons-vue";
import { ref } from "vue";
const categorys = ref([
  {
    id: 3,
    categoryName: "美食",
    categoryAlias: "my",
    createTime: "2023-09-02 12:06:59",
    updateTime: "2023-09-02 12:06:59",
  },
  {
    id: 4,
    categoryName: "娱乐",
    categoryAlias: "yl",
    createTime: "2023-09-02 12:08:16",
    updateTime: "2023-09-02 12:08:16",
  },
  {
    id: 5,
    categoryName: "军事",
    categoryAlias: "js",
    createTime: "2023-09-02 12:08:33",
    updateTime: "2023-09-02 12:08:33",
  },
]);

import {showOperator} from "@/api/newfunction.js";
async function show() {
  let result = await showOperator();
  categorys.value = result.data;
}
show();



//控制添加分类弹窗
const dialogVisible = ref(false)

//添加分类数据模型
const categoryModel = ref({
    operatorName: ''
})
//添加分类表单校验
const rules = {
    categoryName: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
    ],
    categoryAlias: [
        { required: true, message: '请输入分类别名', trigger: 'blur' },
    ]
}
import {addCategory} from '@/api/article.js'
import { ElMessage } from "element-plus";
const title=ref('');
async function add (){
  let result= await addCategory(categoryModel.value);
  show();
  dialogVisible.value=false;
  ElMessage.success('添加成功');
}

function showDialog(row){
  dialogVisible.value=true;
  title.value='编辑分类'
  categoryModel.value.categoryName=row.categoryName;
  categoryModel.value.categoryAlias=row.categoryAlias;
  categoryModel.value.id=row.id;
}

import { updateCategory } from "@/api/article.js";
async function update(){
  console.log(categoryModel)
  let result=await updateCategory(categoryModel.value);
  show();
  dialogVisible.value=false;
  ElMessage.success('编辑成功');
}

function clear(){
    categoryModel.value.operatorName=''
}

import { ElMessageBox } from "element-plus";
import {deleteCategory} from '@/api/article.js'
async function deletes(row){
  ElMessageBox.confirm(
    '您确定要删除吗?此类别的文章也将会删除！',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async() => {
      let result=await deleteCategory(row.id);
      show();
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除取消',
      })
    })
}
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>运营商管理</span>
        <div class="extra">
          <el-button type="primary" @click="dialogVisible=true;title='添加分类';clear();">添加运营商</el-button>
        </div>
      </div>
    </template>
    <!-- 使用：data和prop进行数据绑定 -->
    <el-table :data="categorys" style="width: 100%">
      <el-table-column label="序号" width="100" type="index"> </el-table-column>
      <el-table-column label="运营商名称" prop="operatorName"></el-table-column>
      <!-- <el-table-column label="分类别名" prop="categoryAlias"></el-table-column> -->
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="deletes(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>

    <!-- 添加分类弹窗 -->
    <el-dialog v-model="dialogVisible" :title="title" width="30%">
      <el-form
        v-model="categoryModel"
        :model="categoryModel"
        :rules="rules"
        label-width="100px"
        style="padding-right: 30px"
      >
        <el-form-item label="分类名称" prop="categoryName">
          <el-input
            v-model="categoryModel.categoryName"
            :model="categoryModel.categoryName"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="categoryAlias">
          <el-input
            v-model="categoryModel.categoryAlias"
            :model="categoryModel.categoryAlias"
            minlength="1"
            maxlength="15"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="title=='添加分类'? add():update()"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>