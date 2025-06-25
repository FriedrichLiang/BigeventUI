<template>
    <div class="welcome-container">
      <h1 class="welcome-text">欢迎进入蝶闻系统</h1>
    </div>
  </template>
  
  <script>
  export default {
    name: "WelcomePage",
  };
  </script>
  
  <style scoped>
  /* 容器样式 */
  .welcome-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #e0f7fa, #f6f9ff);
    overflow: hidden;
    animation: backgroundAnimation 15s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
  
  /* 文字样式 */
  .welcome-text {
    font-size: 3rem;
    font-weight: bold;
    color: #1181f6;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    opacity: 0;
    transform: translateY(30px);
    animation: textFadeIn 3s ease-in-out forwards, textSway 4s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate;
  }
  
  /* 背景动态渐变动画 */
  @keyframes backgroundAnimation {
    0% {
      background: linear-gradient(135deg, #e0f7fa, #f6f9ff);
    }
    50% {
      background: linear-gradient(135deg, #a7d5f1, #d0effe);
    }
    100% {
      background: linear-gradient(135deg, #f6f9ff, #e0f7fa);
    }
  }
  
  /* 文字淡入效果 */
  @keyframes textFadeIn {
    0% {
      opacity: 0;
      transform: translateY(30px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* 文字左右摇摆轻微移动 */
  @keyframes textSway {
    0% {
      transform: translateX(-5px);
    }
    100% {
      transform: translateX(5px);
    }
  }
  </style>
  