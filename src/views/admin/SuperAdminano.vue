<script setup>
import { Edit, Delete } from "@element-plus/icons-vue";

import { ref } from "vue";

const anos = ref([]);
import { justgetallano } from "@/api/announcements";
async function getallanos() {
  let result = await justgetallano('管理员');
  anos.value = result.data;
}
getallanos();

//文章分类数据模型
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
const state = ref("");

//文章列表数据模型
const articles = ref([
  {
    id: 5,
    title: "陕西旅游攻略",
    content: "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
    coverImg:
      "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
    state: "草稿",
    categoryId: 2,
    createTime: "2023-09-03 11:55:30",
    updateTime: "2023-09-03 11:55:30",
  },
  {
    id: 5,
    title: "陕西旅游攻略",
    content: "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
    coverImg:
      "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
    state: "草稿",
    categoryId: 2,
    createTime: "2023-09-03 11:55:30",
    updateTime: "2023-09-03 11:55:30",
  },
  {
    id: 5,
    title: "陕西旅游攻略",
    content: "兵马俑,华清池,法门寺,华山...爱去哪去哪...",
    coverImg:
      "https://big-event-gwd.oss-cn-beijing.aliyuncs.com/9bf1cf5b-1420-4c1b-91ad-e0f4631cbed4.png",
    state: "草稿",
    categoryId: 2,
    createTime: "2023-09-03 11:55:30",
    updateTime: "2023-09-03 11:55:30",
  },
]);

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

import { showCategory } from "@/api/article";
async function getcate() {
  let result = await showCategory();
  categorys.value = result.data;
}
getcate();

import { getAllArticle } from "@/api/article";
async function show() {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    categoryId: categoryId.value ? categoryId.value : null,
    state: state.value ? state.value : null,
  };
  let result = await getAllArticle(params);
  total.value = result.data.total;
  articles.value = result.data.items;

  for (let i = 0; i < articles.value.length; i++) {
    let item = articles.value[i];
    for (let j = 0; j < categorys.value.length; j++) {
      if (categorys.value[j].id === item.categoryId) {
        item.categoryName = categorys.value[j].categoryName;
      }
    }
  }
}
show()

import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { Plus } from "@element-plus/icons-vue";
//控制抽屉是否显示
const visibleDrawer = ref(false);
//添加表单数据模型
const articleModel = ref({
  title: "",
  categoryId: "",
  coverImg: "",
  content: "",
  state: ""
});
const anoModel=ref({
    id:"",
    title:"",
    content:"",
    scope:""
})


import { ElMessage } from "element-plus";

import { addannounce,deleteannounce,updateannounce } from "@/api/announcements";

async function add(){
    anoModel.value.scope="管理员";
  let result=await addannounce(anoModel.value);
  ElMessage.success('添加成功');
  visibleDrawer.value=false;
  getallanos();
}

function claer(){
  anoModel.value.id=''
  anoModel.value.title=''
  anoModel.value.content=' '
}

import { updateArticle } from "@/api/article";
async function showDialog(row){
  visibleDrawer.value=true;
  anoModel.value.title=row.title;
  anoModel.value.content=row.content;
  anoModel.value.id=row.id;
}
async function update(){
  console.log(articleModel)
  let result = await updateannounce(anoModel.value)
  ElMessage.success('修改成功');
  visibleDrawer.value=false;
  getallanos()
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
      let result=await deleteannounce(row.id);
      getallanos();
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

const uploadSuccess=(result)=>{
  articleModel.value.coverImg=result.data;
  img(articleModel.value.id,articleModel.value.coverImg);
}

import { updateimg } from "@/api/article";

async function img(id,url){
  let result=updateimg(id,url)
  ElMessage.success('添加成功');
}
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>管理员公告管理</span>
        <div class="extra">
          <el-button type="primary" @click="title='添加公告';visibleDrawer = true;claer()"
            >添加公告</el-button
          >
        </div>
      </div>
    </template>
    <el-table :data="anos" style="width: 100%">
        <el-table-column
        label="序号"
        width="400"
        type="index"
      ></el-table-column>
      <el-table-column
        label="公告标题"
        width="400"
        prop="title"
      ></el-table-column>
      <el-table-column label="发表时间" prop="time"> </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="title='修改公告';showDialog(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="deletes(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>

    <!-- 抽屉 -->
    <el-drawer
      v-model="visibleDrawer"
      :title="title"
      direction="rtl"
      size="50%"
    >
      <!-- 添加文章表单 -->
      <el-form :model="anoModel" label-width="100px">
        <el-form-item label="公告标题">
          <el-input
            v-model="anoModel.title"
            placeholder="请输入标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="公告内容">
          <div class="editor">
            <quill-editor
              theme="snow"
              v-model:content="anoModel.content"
              contentType="html"
            >
            </quill-editor>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="title=='添加公告'? add():update()">发布</el-button>
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