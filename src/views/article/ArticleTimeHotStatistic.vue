<script setup>
import { ref, onMounted, nextTick } from "vue";
import { justGetAllArticle } from "@/api/article"; // 获取所有文章
import { getalldatabyaid } from "@/api/articledata"; // 获取每篇文章每天的浏览量数据

const articles = ref([]); // 存储所有文章
const articleItem = ref([]); // 存储每篇文章的浏览量数据
const isLoaded = ref(false); // 数据是否加载完成

const lineChartRef = ref(null); // 用于渲染折线图的 ref

// 获取所有文章
async function getArticleData() {
  const articleResult = await justGetAllArticle();
  articles.value = articleResult.data;

  // 获取每篇文章的浏览量数据
  for (const article of articles.value) {
    await getbyaid(article.id);
  }

  isLoaded.value = true; // 数据加载完成
}

// 获取文章的每日浏览量
async function getbyaid(aid) {
  let result = await getalldatabyaid(aid);
  articleItem.value.push({
    articleId: aid,
    data: result.data,
  });
}

// 格式化日期，取月和日
function formatDate(dateString) {
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // 月份从0开始，所以要加1
  const day = date.getDate();
  return `${month}-${day}`;
}

// 计算每篇文章的累积浏览量
function calculateCumulativeData(articleData) {
  const cumulativeData = [];
  let totalBrowse = 0;

  articleData.forEach((entry) => {
    totalBrowse += entry.browse;
    cumulativeData.push({
      date: formatDate(entry.time),
      totalBrowse,
    });
  });

  return cumulativeData;
}

// 初始化折线图
function initializeLineChart() {
  if (!lineChartRef.value || !lineChartRef.value.offsetWidth) return;

  const lineChart = echarts.init(lineChartRef.value);

  const seriesData = articles.value.map((article) => {
    const articleData = articleItem.value.find(
      (item) => item.articleId === article.id
    );
    const cumulativeData = calculateCumulativeData(articleData.data);

    return {
      name: article.title,
      type: "line",
      data: cumulativeData.map((item) => item.totalBrowse),
      lineStyle: { width: 2 },
      itemStyle: { color: "#409eff" },
      label: { show: true, position: "top", formatter: "{c}" },
    };
  });

  const dates = articleItem.value[0]?.data.map((item) => formatDate(item.time)); // 使用第一篇文章的日期作为 x 轴

  lineChart.setOption({
    title: {
      text: "文章日累计浏览量",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: dates,
      axisLabel: {
        rotate: 30,
        interval: 0,
        textStyle: { fontSize: 12 },
      },
    },
    yAxis: {
      type: "value",
    },
    series: seriesData,
    grid: { left: "10%", right: "10%", bottom: "20%", top: "20%" },
  });
}

onMounted(() => {
  getArticleData(); // 获取文章数据并生成折线图
});
</script>

<template>
  <div class="chart-container" v-if="isLoaded">
    <el-card class="chart-card">
      <div ref="lineChartRef" style="height: 500px;"></div>
    </el-card>
  </div>
  <p v-else>加载中...</p>
</template>

<style scoped>
.chart-container {
  padding: 20px;
}

.chart-card {
  width: 100%;
  height: 500px;
}

div[ref="lineChartRef"] {
  width: 100%;
  height: 100%;
}
</style>
