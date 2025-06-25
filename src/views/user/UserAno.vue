<script setup>
import { Edit, Delete,Document } from "@element-plus/icons-vue";
import { ref } from "vue";

const anos = ref([]);
import { getallano } from "@/api/announcements";
async function getallanos() {
  let result = await getallano();
  anos.value = result.data;
}
getallanos();
const anoModel =ref({

});
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

import { showCategory } from "@/api/article.js";
async function show() {
  let result = await showCategory();
  categorys.value = result.data;
}
show();

//控制添加分类弹窗
const dialogVisible = ref(false);

//添加分类数据模型
const categoryModel = ref({
  categoryName: "",
  categoryAlias: "",
});
//添加分类表单校验
const rules = {
  categoryName: [
    { required: true, message: "请输入分类名称", trigger: "blur" },
  ],
  categoryAlias: [
    { required: true, message: "请输入分类别名", trigger: "blur" },
  ],
};
import { addCategory } from "@/api/article.js";
import { ElMessage } from "element-plus";
const title = ref("");
async function add() {
  let result = await addCategory(categoryModel.value);
  show();
  dialogVisible.value = false;
  ElMessage.success("添加成功");
}

function showDialog(row) {
  dialogVisible.value = true;
  title.value = row.title;
  anoModel.value.content = row.content;
}

import { updateCategory } from "@/api/article.js";
async function update() {
  console.log(categoryModel);
  let result = await updateCategory(categoryModel.value);
  show();
  dialogVisible.value = false;
  ElMessage.success("编辑成功");
}

function clear() {
  categoryModel.value.categoryName = "";
  categoryModel.value.categoryAlias = "";
}

import { ElMessageBox } from "element-plus";
import { deleteCategory } from "@/api/article.js";
async function deletes(row) {
  ElMessageBox.confirm("您确定要删除吗?此类别的文章也将会删除！", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let result = await deleteCategory(row.id);
      show();
      ElMessage({
        type: "success",
        message: "删除成功",
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "删除取消",
      });
    });
}
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>公告</span>
        <div class="extra"></div>
      </div>
    </template>
    <!-- 使用：data和prop进行数据绑定 -->
    <el-table :data="anos" style="width: 100%" >
      <el-table-column label="序号" width="100" type="index"> </el-table-column>
      <el-table-column label="标题" prop="title" ></el-table-column>
      <el-table-column label="时间" prop="time"></el-table-column>
      <el-table-column label="" width="100">
        <template #default="{ row }">
          <el-icon @click="showDialog(row)"><Document /></el-icon>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>

    <!-- 添加分类弹窗 -->
    <el-dialog v-model="dialogVisible" :title="title" width="30%">
      <div prop="anoModel.content">
        <div prop="anoModel.content" v-html="anoModel.content"></div>
      </div>
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