<template>
    <div class="article-detail-container">
      <el-card>
        <h1>{{ article.title }}</h1>
        <div class="author-info">
          <img :src="article.userPic" class="avatar" alt="Author's Avatar" />
          <span class="author-name">{{ article.username }}</span>
          <span class="publish-time">{{ formatDate(article.time) }}</span>
        </div>
        <div v-html="article.content" class="article-content"></div>
        <div class="article-category">{{ article.category }}</div>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
//   import { getArticleDetail } from '@/api/article'; // 替换为实际的 API
  
  const route = useRoute();
  const article = ref({});
  
  // 获取文章详情
  const fetchArticleDetail = async () => {
    const articleId = route.params.id; // 从路由参数获取文章 ID
    const response = await getArticleDetail(articleId); // 调用 API 获取文章详情
    article.value = response.data;
  };
  
  // 格式化时间
  const formatDate = (time) => {
    const date = new Date(time);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  };
  
  // 页面加载时获取文章详情
  onMounted(fetchArticleDetail);
  </script>
  
  <style scoped>
  .article-detail-container {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
  }
  
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .author-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .author-name {
    font-weight: bold;
    margin-right: 10px;
  }
  
  .publish-time {
    color: #888;
    font-size: 14px;
  }
  
  .article-content {
    font-size: 16px;
    line-height: 1.8;
    margin-top: 20px;
  }
  
  .article-category {
    margin-top: 20px;
    font-size: 14px;
    color: #fff;
    background-color: rgba(0, 123, 255, 0.3);
    padding: 5px 10px;
    border-radius: 15px;
    display: inline-block;
  }
  </style>
  