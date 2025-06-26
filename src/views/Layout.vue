<script setup>
import { ref } from "vue";
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom,
  Finished,
  Stamp,
  PieChart,
  ChatLineSquare,
  ChatSquare
  
} from "@element-plus/icons-vue";
import avatar from "@/assets/default.png";
import { getuserInfo } from "@/api/user";
import useUserInfoStore from "@/stores/user.js";
let status = ref("");
async function getInfo() {
  let result = await getuserInfo();
  UserInfoStore.setInfo(result.data);
}
const UserInfoStore = useUserInfoStore();
  getInfo();

status.value = UserInfoStore.info.status;

import { useRouter } from "vue-router";
const router = useRouter();
import { ElMessage, ElMessageBox } from "element-plus";
import { useTokenStore } from "@/stores/token";
const t1 = useTokenStore();
const t2 = useUserInfoStore();
function handleCommand(command) {
  if (command === "logout") {
    ElMessageBox.confirm("您确定要退出吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(async () => {
        t1.removeToken();
        t2.removeInfo();
        router.push("/login");
        ElMessage({
          type: "success",
          message: "退出成功",
        });
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消",
        });
      });
  } else {
    router.push("/user/" + command);
  }
}

const openedSubMenu1 = ref(false); // 控制个人中心菜单展开
const openedSubMenu2 = ref(false);
</script>

    <template>
  <el-container class="layout-container">
    <!-- 左侧菜单 -->
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#1181f6"
        text-color="#fff"
        router
      >
        <!-- <el-menu-item index="/article/category" v-if="( UserInfoStore.info.status=== '创作者')">
          <el-icon>
            <Management />
          </el-icon>
          <span>文章分类</span>
        </el-menu-item>
        <el-menu-item index="/article/manage" v-if="(UserInfoStore.info.status === '创作者')">
          <el-icon>
            <Promotion />
          </el-icon>
          <span>文章管理</span>
        </el-menu-item> -->
        <el-menu-item index="/charge/operator" v-if="( UserInfoStore.info.status=== '创作者')">
          <el-icon>
            <Management />
          </el-icon>
          <span>运营商管理</span>
        </el-menu-item>

          <el-menu-item index="/charge/charge" v-if="( UserInfoStore.info.status=== '创作者')">
          <el-icon>
            <Management />
          </el-icon>
          <span>充电桩管理</span>
        </el-menu-item>


           <el-menu-item index="/charge/client" v-if="( UserInfoStore.info.status=== '普通用户')">
          <el-icon>
            <Management />
          </el-icon>
          <span>我要充电</span>
        </el-menu-item>
        



        <el-menu-item index="/normal/browse" v-if="(UserInfoStore.info.status === '普通用户')">
          <el-icon>
            <Promotion />
          </el-icon>
          <span>推荐</span>
        </el-menu-item>



        <el-menu-item index="/admin/adminadmin" v-if="(UserInfoStore.info.status === '超级管理员')">
          <el-icon><PieChart /></el-icon>
          <span>管理员管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/article" v-if="(UserInfoStore.info.status === '管理员'||UserInfoStore.info.status === '超级管理员')">
          <el-icon><Finished /></el-icon>
          <span>文章审核</span>
        </el-menu-item>
        <el-menu-item index="/admin/user" v-if="(UserInfoStore.info.status=== '管理员'||UserInfoStore.info.status === '超级管理员')">
          <el-icon><Stamp /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/statistic" v-if="(UserInfoStore.info.status=== '管理员'||UserInfoStore.info.status === '超级管理员')">
          <el-icon><PieChart /></el-icon>
          <span>用户统计视图</span>
        </el-menu-item>
        <el-menu-item index="/admin/statisticdata" v-if="(UserInfoStore.info.status=== '管理员'||UserInfoStore.info.status === '超级管理员')">
          <el-icon><PieChart /></el-icon>
          <span>数据统计视图</span>
        </el-menu-item>


        <el-menu-item index="/admin/superadminano" v-if="(UserInfoStore.info.status=== '超级管理员')">
          <el-icon><ChatLineSquare /></el-icon>
          <span>管理员公告管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/adminano" v-if="(UserInfoStore.info.status=== '管理员'||UserInfoStore.info.status === '超级管理员')">
          <el-icon><ChatLineSquare /></el-icon>
          <span>公告管理</span>
        </el-menu-item>
        <el-menu-item index="/user/userano">
          <el-icon><ChatSquare /></el-icon>
          <span>平台公告</span>
        </el-menu-item>
       

        <el-sub-menu v-model="openedSubMenu1">
          <template #title>
            <el-icon>
              <UserFilled />
            </el-icon>
            <span>个人中心</span>
          </template>
          <el-menu-item index="/user/info">
            <el-icon>
              <User />
            </el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon>
              <Crop />
            </el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/user/resetpassword">
            <el-icon>
              <EditPen />
            </el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
        <!-- 统计 -->
        <el-sub-menu v-if="(UserInfoStore.info.status==='创作者')">
          <!-- 父菜单标题部分 -->
          <template #title>
            <el-icon><PieChart /></el-icon>
            <span>统计视图</span>
          </template>

          <!-- 子菜单项 -->
          <el-menu-item index="/article/statistic" v-model="openedSubMenu2">
            <el-icon>
              <Promotion />
            </el-icon>
            <span>创作总览</span>
          </el-menu-item>
          <el-menu-item index="/article/hotstatistic">
            <el-icon>
              <Crop />
            </el-icon>
            <span>文章数据</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <!-- 右侧主区域 -->
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div>
          你好！<strong>{{ UserInfoStore.info.username }} </strong>
        </div>
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <span class="el-dropdown__box">
            <el-avatar :src=UserInfoStore.info.userPic />
            <el-icon>
              <CaretBottom />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="info" :icon="User"
                >基本资料</el-dropdown-item
              >
              <el-dropdown-item command="avatar" :icon="Crop"
                >更换头像</el-dropdown-item
              >
              <el-dropdown-item command="resetpassword" :icon="EditPen"
                >重置密码</el-dropdown-item
              >
              <el-dropdown-item command="logout" :icon="SwitchButton"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <!-- 中间区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
      <!-- 底部区域 -->
    </el-container>
  </el-container>
</template>

    <style lang="scss" scoped>
.layout-container {
  height: 100vh;

  .el-aside {
    background-color: #1181f6;

    &__logo {
      height: 120px;
      background: url("@/assets/reallogo.png") no-repeat center / 120px auto;
    }

    .el-menu {
      border-right: none;
    }
  }

  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-dropdown__box {
      display: flex;
      align-items: center;

      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>