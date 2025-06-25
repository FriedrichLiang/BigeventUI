<template>
  <div class="feed-container">
    <!-- 循环渲染每篇文章 -->
    <el-card 
      v-for="(article, index) in browsedata" 
      :key="article.articleId" 
      class="article-card"
      
    >
      <!-- 文章头部: 用户头像、用户名、昵称、时间 -->
      <div class="header">
        <img v-if="article.username" :src="article.userPic" class="avatar" />
        <div class="user-info">
          <span class="username">{{ article.username }}</span>
          <span v-if="article.nickname" class="nickname">@{{ article.nickname }}</span>
          <span class="time">{{ formatDate(article.time) }}</span>
        </div>
        <!-- 关注按钮 -->
        <el-button 
          v-if="!isFollowing(article.username)" 
          size="small" 
          type="primary" 
          class="follow-btn"
          @click="followUser(article.articleId,article.username)">
          关注
        </el-button>
        <el-button 
          v-else 
          size="small" 
          type="success" 
          class="follow-btn"
          @click="unfollowUser(article.username)">
          已关注
        </el-button>
      </div>

      <!-- 文章内容 -->
      <div class="article-body"
      @click="
      openDialog(article);
      browseplus(article.articleId)
      "
      >
        <h3>{{ article.title }}</h3>
        <!-- 显示部分内容 -->
        <div v-html="getShortContent(article.content)" class="content"></div>
        <div class="category">{{ article.category }}</div>
      </div>

      <!-- 操作按钮 -->
      <div class="actions">
        <!-- <el-button size="small" icon="el-icon-thumb" @click="likeArticle(article.articleId)" class="action-btn like-btn">
          <span class="action-text">点赞</span>
        </el-button>
        <el-button size="small" icon="el-icon-chat-dot-round" @click="commentArticle(article.articleId)" class="action-btn comment-btn">
          <span class="action-text">评论</span>
        </el-button>
        <el-button size="small" icon="el-icon-share" @click="shareArticle(article.articleId)" class="action-btn share-btn">
          <span class="action-text">转发</span>
        </el-button> -->
      </div>
    </el-card>
  </div>

  <!-- 弹窗展示文章详情 -->
  <el-dialog
    v-model="dialogVisible"
    :title="selectedArticle?.title"
    width="70%"
    :before-close="handleClose"
  >
    <template #default>
      <div v-if="selectedArticle" class="dialog-content">
        <div class="header">
          <img v-if="selectedArticle.userPic" :src="selectedArticle.userPic" class="avatar" />
          <div class="user-info">
            <span class="username">{{ selectedArticle.username }}</span>
            <span v-if="selectedArticle.nickname" class="nickname">@{{ selectedArticle.nickname }}</span>
            <span class="time">{{ formatDate(selectedArticle.time) }}</span>
          </div>
        </div>

        <div class="article-body">
          <div class="content" v-html="selectedArticle.content"></div>
          <div class="category">分类: {{ selectedArticle.category }}</div>
        </div>
      </div>
    </template>
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>

import { ref ,onMounted} from 'vue';
import { ElCard, ElButton, ElDialog } from 'element-plus';
import { useRouter } from 'vue-router';
import { getbrowse } from '@/api/article';

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}
// 获取浏览数据
async function getbrowsedata() {
  let result = await getbrowse();
  browsedata.value = shuffleArray(result.data);;
}

getbrowsedata();

// 文章数据
const browsedata = ref([
  {
    articleId: 35,
    title: '我的文章333',
    content: '<p> grkkgorkog</p>',
    category: '哲学',
    username: '尼采的小屋',
    nickname: '',
    time: '2024-12-30T08:34:31.000+00:00',
  },
  {
    articleId: 34,
    title: '我的文章2',
    content: '<p>我拍的peek</p>',
    category: '哲学',
    username: '尼采的小屋',
    nickname: '',
    time: '2024-12-30T08:31:42.000+00:00',
  },
]);

// 弹窗可见性状态
const dialogVisible = ref(false);

// 当前选中的文章对象
const selectedArticle = ref(null);

// 打开弹窗并设置选中的文章
const openDialog = (article) => {
  selectedArticle.value = article;
  dialogVisible.value = true;
};

// 关闭弹窗时的清理逻辑
const handleClose = () => {
  dialogVisible.value = false;
  selectedArticle.value = null;
};

// 存储关注的用户列表
const followedUsers = ref([]);

onMounted(async () => {
  await getmyfollow();
});

import { myfollow } from '@/api/articledata';
async function getmyfollow(){
  let result = await myfollow();
  followedUsers.value=result.data;
  console.log(followedUsers.value)
}
// 检查用户是否已关注
const isFollowing = (username) => {
  for (let i=0;i<followedUsers.value.length;i++){
    if (username === followedUsers.value[i]){
      return true;
    }
  }
  return false;
};

import { followeplus } from '@/api/articledata';
// 关注用户
const followUser =  (articleid,username) => {
  let result =  followeplus(articleid);
  followedUsers.value.push(username);
};

// 取消关注用户
const unfollowUser = (username) => {
  followedUsers.value = followedUsers.value.filter(user => user !== username);
};

// 格式化时间
const formatDate = (time) => {
  const date = new Date(time);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const timeString = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  return timeString;
};

// 截取文章内容展示部分
const getShortContent = (content) => {
  const maxLength = 35;  // 限制显示的字符数
  const strippedContent = content.replace(/<\/?[^>]+(>|$)/g, "");  // 去除 HTML 标签
  return strippedContent.length > maxLength ? strippedContent.slice(0, maxLength) + '...' : strippedContent;
};

// 模拟点赞、评论、转发事件
const likeArticle = (articleId) => {
  console.log(`点赞了文章ID: ${articleId}`);
};

const commentArticle = (articleId) => {
  console.log(`评论文章ID: ${articleId}`);
};

const shareArticle = (articleId) => {
  console.log(`转发文章ID: ${articleId}`);
};

import { browseplus } from '@/api/articledata';

async function plusbrowse(articleid){
  let result = await browseplus(articleid);
}
</script>

<style scoped>
.feed-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.article-card {
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.article-card:hover {
  background-color: #f1f1f1;
  transform: translateY(-5px);
}

.header {
  display: flex;
  gap: 15px;
  align-items: center;
}

.avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 600;
  font-size: 18px;
  color: #333;
}

.nickname {
  color: #888;
  font-size: 14px;
}

.time {
  font-size: 13px;
  color: #aaa;
}

.follow-btn {
  width: 60px;
  height: 30px;
  margin-left: auto;
  border-radius: 20px;
}

.article-body {
  margin-bottom: 15px;
}

h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
}

.content {
  font-size: 15px;
  color: #555;
  line-height: 1.6;
}

.category {
  font-size: 14px;
  color: #fff;
  background-color: rgba(0, 123, 255, 0.3);  /* 透明蓝色背景 */
  padding: 5px 10px;
  border-radius: 15px;
  display: inline-block;
  margin-top: 10px;
}

.actions {
  display: flex;
  gap: 20px;
  margin-top: 15px;
  justify-content: start;
  align-items: center;
}

.action-btn {
  font-size: 14px;
  background-color: #f1f1f1;
  color: #555;
  border-radius: 30px;
  padding: 8px 16px;
  transition: background-color 0.3s, transform 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.action-btn:hover {
  background-color: #e8e8e8;
  transform: scale(1.05);
}

.like-btn:hover {
  color: #e74c3c;
}

.comment-btn:hover {
  color: #3498db;
}

.share-btn:hover {
  color: #2ecc71;
}

.action-text {
  font-size: 14px;
}

/* 弹窗内容的样式 */
.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
}

.dialog-content .header {
  display: flex;
  gap: 15px;
  align-items: center;
}

.dialog-content .avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.dialog-content .user-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.dialog-content .username {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.dialog-content .nickname {
  font-size: 14px;
  color: #888;
}

.dialog-content .time {
  font-size: 14px;
  color: #aaa;
}

.dialog-content .article-body {
  margin-top: 15px;
}

.dialog-content .content {
  font-size: 16px;
  line-height: 1.8;
  color: #555;
  margin-bottom: 15px;
}

.dialog-content .category {
  font-size: 14px;
  color: #fff;
  background-color: rgba(0, 123, 255, 0.3);  /* 透明蓝色背景 */
  padding: 5px 10px;
  border-radius: 15px;
  display: inline-block;
}

.el-dialog__footer {
  padding: 10px;
  text-align: right;
}

.el-dialog__footer .el-button {
  background-color: #3eaf7c;
  color: white;
  border-radius: 25px;
  padding: 10px 20px;
}

.el-dialog__footer .el-button:hover {
  background-color: #2c9f6b;
}
</style>
