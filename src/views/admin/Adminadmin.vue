<script setup>
import { Edit, Delete ,Check} from "@element-plus/icons-vue";

import { ref } from "vue";
//文章分类数据模型

const users=ref([]);
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

//用户搜索时选中的分类id
const categoryId = ref("");

//用户搜索时选中的发布状态
const status = ref("创作者");
const isclose=ref()

//文章列表数据模型

const adminmodel=ref(
    {
        'username':'',
        'password':''
    }
);
//分页条数据模型
const pageNum = ref(1); //当前页
const total = ref(20); //总条数
const pageSize = ref(5); //每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size;
  show();
};
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num;
  show();
};

import { admingetusers } from "@/api/user";

import { getalladmin } from "@/api/user";

async function show(){
  let result = await getalladmin();
  users.value = result.data;
  console.log(users.value);
}
show();

import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { Plus } from "@element-plus/icons-vue";
//控制抽屉是否显示
const visibleDrawer = ref(false);


import { addArticle } from "@/api/article";
import { ElMessage } from "element-plus";


async function add(state){
  articleModel.value.state=state;
  let result=await addArticle(articleModel.value);
  ElMessage.success('添加成功');
  visibleDrawer.value=false;
  show();
}

function claer(){
  articleModel.value.categoryId=''
  articleModel.value.title=''
  articleModel.value.content=' '
}

import { updateArticle } from "@/api/article";
async function showDialog(row){
  visibleDrawer.value=true;
  articleModel.value.title=row.title;
  articleModel.value.categoryId=row.categoryId;
  articleModel.value.content=row.content;
  articleModel.value.id=row.id;
}
async function update(state){
  articleModel.value.state=state;
  console.log(articleModel)
  let result = await updateArticle(articleModel.value)
  ElMessage.success('修改成功');
  visibleDrawer.value=false;
  show();
}
import { ElMessageBox} from "element-plus";
import { deleteArticle } from "@/api/article";
async function deletes(row){
  ElMessageBox.confirm(
    '您确定要删除吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async() => {
      let result=await deleteArticle(row.id);
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

import { adminclose,adminunclose } from "@/api/user";

async function close (row){
  ElMessageBox.confirm(
    '您确定要封禁该账号吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async() => {
      let result=await adminclose(row.id);
      show();
      ElMessage({
        type: 'success',
        message: '封禁成功',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消',
      })
    })
}

async function unclose (row){
  ElMessageBox.confirm(
    '您确定要解除封禁该账号吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async() => {
      let result=await adminunclose(row.id);
      show();
      ElMessage({
        type: 'success',
        message: '解除封禁成功',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消',
      })
    })
}

import { createadmin } from "@/api/user";

async function newadmin(){
    let result = await createadmin(adminmodel.value);
    ElMessage.success("添加成功");
    visibleDrawer.value=false;
    show();
}
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>管理员管理</span>
        <div class="extra">
          <el-button type="primary" @click="title='添加文章';visibleDrawer = true;"
            >添加管理员</el-button
          >
        </div>
      </div>
    </template>
    <!-- 搜索表单 -->
    <!-- <el-form inline>
      <el-form-item label="角色：">
        <el-select placeholder="请选择" v-model="status" style="width: 240px">
          <el-option label="创作者" value="创作者"></el-option>
          <el-option label="普通用户" value="普通用户"></el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="状态：">
        <el-select placeholder="请选择" v-model="isclose" style="width: 240px">
          <el-option label="封禁中" value="true"></el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item>
        <el-button type="primary" @click="show()">搜索</el-button>
        <el-button
          @click="
            status = '';
            isclose=''
            show();
          "
          >重置</el-button
        >
      </el-form-item>
    </el-form> -->
    <!-- 文章列表 -->
    <el-table :data="users" style="width: 100%">
      <el-table-column
        label="用户名"
        width="400"
        prop="username"
      ></el-table-column>
      <el-table-column label="昵称" prop="nickname"></el-table-column>
      <el-table-column label="权限" prop="status"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"> </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <!-- <el-button :icon="Edit" circle plain type="primary" @click="title='修改文章';showDialog(row)"></el-button>  -->
          <el-button v-if="row.isclose === null" :icon="Delete" circle plain type="danger" @click="close(row);show()"></el-button>
          <el-button v-if="row.isclose === 'true'" type="success" :icon="Check" circle @click="unclose(row);show()"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 分页条 -->

    <el-drawer
      v-model="visibleDrawer"
      :title="title"
      direction="rtl"
      size="50%"
    >
      <!-- 添加文章表单 -->
      <el-form :model="adminmodel" label-width="100px">
        <el-form-item label="账号">
          <el-input
            placeholder="请输入管理员账号"
            v-model="adminmodel.username"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码">
          <el-input
            placeholder="请输入管理员密码"
            v-model="adminmodel.password"
          ></el-input>
        </el-form-item>
       
        <el-form-item>
          <el-button type="primary" @click="newadmin()">添加</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
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

/* 抽屉样式 */
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>