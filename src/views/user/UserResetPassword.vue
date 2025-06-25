<script setup>
import { ref } from 'vue';
const resetmodel=ref(
    {
        'old_pwd':'',
        'new_pwd':'',
        're_pwd':''
    }
)

import { updatepassword } from '@/api/user';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
const router = useRouter();
async function updatepwd(){
    let result = await updatepassword(resetmodel.value)
    ElMessage.success("修改成功,请重新登录");
    router.push('/login')
}
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>重置密码</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="resetmodel"  label-width="100px" size="large">
                    <el-form-item label="原密码">
                        <el-input v-model="resetmodel.old_pwd" ></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" >
                        <el-input v-model="resetmodel.new_pwd"></el-input>
                    </el-form-item>
                    <el-form-item label="用户邮箱" >
                        <el-input v-model="resetmodel.re_pwd"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updatepwd()">提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>