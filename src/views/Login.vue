        <script setup>
import { User, Lock } from "@element-plus/icons-vue";
import { ref } from "vue";
import { ElMessage } from "element-plus";
//控制注册与登录表单的显示， 默认显示注册
const isRegister = ref(false);
const registerData = ref({
  username: "",
  password: "",
  rePassword: "",
  status: "创作者",
});
function checkPassword(rule, value, callback) {
  if (value !== registerData.value.password) {
    callback(new Error("两次密码不一致"));
  } else {
    callback();
  }
}
//自定义表单校验规则
const rules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 5, max: 16, message: "只能再5~16个字符之间", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 5, max: 16, message: "只能再5~16个字符之间", trigger: "blur" },
  ],
  rePassword: [{ validator: checkPassword, trigger: "blur" }],
};

import { userLogin, userRegister } from "@/api/user.js";
async function register() {
  console.log(registerData.value);
  let result = await userRegister(registerData.value);
  ElMessage.success("注册成功");
}

import { useRouter } from "vue-router";
import { useTokenStore } from "@/stores/token.js";

const router = useRouter();
const tokenStore = useTokenStore();

async function login() {
  console.log(registerData.value);
  let result = await userLogin(registerData.value);
  tokenStore.setToken(result.data);
  localStorage.setItem('token', tokenStore);
  ElMessage.success("登录成功");
  router.push("/");
}
</script>

        <template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册表单 -->
      <!-- ：model是绑定与规则的名一致，仅对应于rules场域 -->
      <!-- v-model是与数据绑定的，位于数据场域 -->
      <el-form
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
        v-model="registerData"
        :model="registerData"
        :rules="rules"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            placeholder="请输入用户名"
            v-model="registerData.username"
            :model="registerData.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            v-model="registerData.password"
            :model="registerData.password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="rePassword">
          <el-input
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
            v-model="registerData.rePassword"
            :model="registerData.rePassword"
          ></el-input>
          <el-radio-group
            v-model="registerData.status"
            :model="registerData.status"
          >
            <el-radio label="创作者">创作者</el-radio>
            <el-radio label="普通用户">普通用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 注册按钮 -->
        <el-form-item>
          <el-button
            class="button"
            type="primary"
            auto-insert-space
            @click="register"
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>

      <!-- 登录表单 -->
      <el-form
        ref="form"
        size="large"
        autocomplete="off"
        v-else
        v-model="registerData"
        :model="registerData"
        :rules="rules"
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            placeholder="请输入用户名"
            v-model="registerData.username"
            :model="registerData.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            v-model="registerData.password"
            :model="registerData.password"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色选择" prop="status" class="role-label">
          <el-radio-group
            v-model="registerData.status"
            :model="registerData.status"
          >
            <el-radio label="创作者">创作者</el-radio>
            <el-radio label="管理员">管理员</el-radio>
            <el-radio label="普通用户">普通用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button
            class="button"
            type="primary"
            auto-insert-space
            @click="login"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

        <style lang="scss" scoped>
/* 样式 */
.login-page {
  height: 100vh;
  background-color: #fff;

  .bg {
    background: 
    // url("@/assets/reallogo.png") no-repeat 60% center / 240px auto,
      url("@/assets/bg.jpg") no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
/* 角色选择标签的效果 */
</style>