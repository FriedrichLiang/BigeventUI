<script setup>
import { Edit, Delete } from "@element-plus/icons-vue";

import { ref } from "vue";
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
const operatorId = ref("");

//用户搜索时选中的发布状态
const status = ref("");
const location = ref("");

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

import { showOperator } from "@/api/newfunction";
async function getcate() {
  let result = await showOperator();
  categorys.value = result.data;
}
getcate();


import { admincharge } from "@/api/newfunction";
async function show() {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    operatorId: operatorId.value ? operatorId.value : null,
    status: status.value ? status.value : null,
    location: location.value ? location.value : null,
  };
  let result = await admincharge(params);
  total.value = result.data.total;
  articles.value = result.data.items;

  for (let i = 0; i < articles.value.length; i++) {
    let item = articles.value[i];
    for (let j = 0; j < categorys.value.length; j++) {
      if (categorys.value[j].id === item.operatorId) {
        item.operatorName = categorys.value[j].operatorName;
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
const chargeModel = ref({
  model: "",
  operatorId: "",
  location: ""
});
const dowhat=ref(0);

import { addCharge } from "@/api/newfunction";
import { ElMessage } from "element-plus";


async function add(){
 
  let result=await addCharge(chargeModel.value);
  ElMessage.success('添加成功');
  visibleDrawer.value=false;
  show();
}

function claer(){
  chargeModel.value.operatorId=''
  chargeModel.value.model=''
  chargeModel.value.location=' '
}

import { updateCharge } from "@/api/newfunction";
async function showDialog(row){

  visibleDrawer.value=true;
  chargeModel.value.model=row.model;
  chargeModel.value.operatorId=row.operatorId;
  chargeModel.value.location=row.location;
  chargeModel.value.id=row.id;
}
async function update(){

  let result = await updateCharge(chargeModel.value)
  ElMessage.success('修改成功');
  visibleDrawer.value=false;
  show();
}
import { ElMessageBox} from "element-plus";
import { deleteCharge } from "@/api/newfunction";
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
      let result=await deleteCharge(row.id);
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
        <span>充电桩管理</span>
        <div class="extra">
          <el-button type="primary" @click="dowhat=1;visibleDrawer = true;claer()"
            >添加充电桩</el-button
          >
        </div>
      </div>
    </template>
    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item label="运营商：" width="30px">
        <el-select
          placeholder="请选择"
          v-model="operatorId"
          style="width: 240px"
        >
          <el-option
            v-for="c in categorys"
            :key="c.id"
            :label="c.operatorName"
            :value="c.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态：">
        <el-select placeholder="请选择" v-model="status" style="width: 240px">
          <el-option label="空闲" value="空闲"></el-option>
          <el-option label="工作中" value="工作中"></el-option>
          <el-option label="故障" value="故障"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="地址：">
         <el-input
            v-model="location"
            placeholder="请输入地址"
          ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="show()">搜索</el-button>
        <el-button
          @click="
            operatorId = '';
            status = '';
            show();
          "
          >重置</el-button
        >

        <!-- <el-button type="success" @click="title = '添加文章'; visibleDrawer = true; claer()">添加</el-button> -->
      </el-form-item>
    </el-form>
    <!-- 文章列表 -->
    <el-table :data="articles" style="width: 100%">
      <el-table-column
        label="充电桩编号"
        width="400"
        prop="id"
      ></el-table-column>
      <el-table-column label="型号" prop="model"></el-table-column>
      <el-table-column label="运营商" prop="operatorName"></el-table-column>
      <el-table-column label="位置" prop="location"> </el-table-column>
      <el-table-column label="状态" prop="status"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="dowhat=0;showDialog(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="deletes(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 分页条 -->
    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :page-sizes="[3, 5, 10, 15]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 抽屉 -->
    <el-drawer
      v-model="visibleDrawer"
      :title="title"
      direction="rtl"
      size="50%"
    >
      <!-- 添加文章表单 -->
      <el-form :model="chargeModel" label-width="100px" >
        <el-form-item label="充电桩型号">
          <el-input
            v-model="chargeModel.model"
            placeholder="请输入型号"
            
          ></el-input>
        </el-form-item>
        <el-form-item label="运营商">
          <el-select placeholder="请选择" v-model="chargeModel.operatorId" >
            <el-option
              v-for="c in categorys"
              :key="c.id"
              :label="c.operatorName"
              :value="c.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="位置">
          <el-input
            v-model="chargeModel.location"
            placeholder="请输入位置"
            
          ></el-input>
        </el-form-item>
      
        <!-- <el-form-item label="位置" :disabled="true">
          <div class="editor" style="pointer-events: none;">
            <quill-editor
              theme="snow"
              v-model:content="chargeModel.location"
              contentType="html"
             
            >

            </quill-editor>
          </div>
        </el-form-item> -->


        <el-form-item>
          <el-button 
          v-if="dowhat === 0"
          type="success" @click="update()">修改</el-button>
          <el-button 
          v-else
          type="success" @click="add()">添加充电桩</el-button>
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