<template>
  <div class="card-container">
    <!-- 第一行：今日总浏览量和净增粉丝数 -->
    <div class="data-card">
      <div class="card-content">
        <h3>今日总浏览数</h3>
        <p>{{ totalBrowse }}</p>
      </div>
      <div class="card-content">
        <h3>净增粉丝数</h3>
        <p>{{ netIncreaseFans }}</p>
      </div>
      <div class="card-content">
        <h3>粉丝数</h3>
        <p>{{ currentFans }}</p>
      </div>
    </div>

    <!-- 第二行：柱状图 和 折线图并排显示 -->
    <div class="chart-row">
      <el-card class="chart-card" style="flex: 1;">
        <div ref="barChartRef" style="height: 400px"></div>
      </el-card>
      <el-card class="chart-card" style="flex: 1;">
        <div ref="lineChartRefFloating" style="height: 400px"></div>
      </el-card>
    </div>

    <!-- 第三行：主页面中的折线图 -->
    <el-card class="chart-card">
      <div ref="lineChartRefMain" style="height: 400px"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch } from "vue";
import * as echarts from "echarts";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

// 数据
const articles = ref([]);
const articledatas = ref([]);
const followdata = ref([]);
const articleItem = ref([]);
let isShow = ref(false);

// 引用
const barChartRef = ref(null);
const lineChartRefMain = ref(null); // 用于主页面中的折线图
const lineChartRefFloating = ref(null); // 用于点击柱状图后显示的折线图

// 异步获取文章数据
import { gettoday, getfollowdata } from "@/api/articledata";
import { justGetAllArticle } from "@/api/article";

async function getArticleData() {
  const articleResult = await justGetAllArticle();
  const browseResult = await gettoday();
  const followResult = await getfollowdata();
  articles.value = articleResult.data;
  articledatas.value = browseResult.data;
  followdata.value = followResult.data;

  // 格式化 articledatas 中的时间字段为 UTC 时间
  articledatas.value = articledatas.value.map((data) => ({
    ...data,
    time: dayjs(data.time).utc().format("YYYY-MM-DD"), // 将时间转换为 UTC 格式
  }));
}
getArticleData();

// 计算总浏览量和净增粉丝数
const totalBrowse = computed(() =>
  articledatas.value.reduce((sum, data) => sum + data.browse, 0)
);
const netIncreaseFans =ref();

import { gettodaycount } from "@/api/articledata";
async function getcount(){
  let result = await gettodaycount();
  netIncreaseFans.value=result.data;
}
getcount();


// 文章浏览量匹配和排序
const sortedArticleBrowse = computed(() => {
  return articles.value
    .map((article) => {
      const browseData = articledatas.value.find(
        (data) => data.articleId === article.id
      );
      return {
        articleId: article.id, // 这里加入了 articleId
        title: article.title,
        browse: browseData ? browseData.browse : 0,
      };
    })
    .sort((a, b) => b.browse - a.browse);
});

// 粉丝增长数据（累积）
const monthlyFans = computed(() => {
  let cumulativeCount = 0;
  return followdata.value.map((data) => {
    // 累积粉丝数
    cumulativeCount += data.count;
    return {
      month: dayjs(data.time).local().format('YYYY-MM'), // 格式化为 YYYY-MM
      count: cumulativeCount,
    };
  });
});

const currentFans = computed(() => {
  const latestFanData = monthlyFans.value[monthlyFans.value.length - 1];
  return latestFanData ? latestFanData.count : 0; // 若没有数据则返回 0
});

// 获取文章详细数据并展示折线图
import { getalldatabyaid } from "@/api/articledata";
async function getbyaid(aid) {
  let result = await getalldatabyaid(aid);
  articleItem.value = result.data;
  console.log(articleItem.value);
  // 初始化折线图
  nextTick(() => {
    initializeLineChartFloating();
  });
}

// 初始化柱状图
function initializeBarChart() {
  if (!barChartRef.value || !barChartRef.value.offsetWidth) return;

  const barChart = echarts.init(barChartRef.value);
  barChart.setOption({
    title: { text: "今日各文章浏览量", left: "center" },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: sortedArticleBrowse.value.map((item) => item.title),
      axisLabel: {
        rotate: 30,
        interval: 0,
        formatter: (value) =>
          value.length > 6 ? value.slice(0, 6) + "..." : value,
        textStyle: { fontSize: 12 },
      },
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "浏览量",
        type: "bar",
        data: sortedArticleBrowse.value.map((item) => item.browse),
        itemStyle: {
          color: (params) => {
            const colors = [
              "#ff6347",
              "#87cefa",
              "#32cd32",
              "#ffb6c1",
              "#ff1493",
            ];
            return colors[params.dataIndex % colors.length];
          },
        },
        label: { show: true, position: "top", formatter: "{c}" },
      },
    ],
    grid: { left: "10%", right: "10%", bottom: "20%", top: "20%" },
  });

  // 点击柱状图时更新折线图的标题
  barChart.on("click", function (params) {
    const articleId = sortedArticleBrowse.value[params.dataIndex].articleId;
    const articleTitle = sortedArticleBrowse.value[params.dataIndex].title; // 获取文章标题

    console.log(`你点击了文章 ID: ${articleId}, 标题: ${articleTitle}`);

    // 获取文章详细数据
    isShow.value = true; // 显示折线图
    getbyaid(articleId); // 获取该文章的详细数据

    Ptitle.value = articleTitle + " 日结浏览量";
  });
}
const Ptitle = ref("<-点击左边查看文章数据详情>");

// 初始化浮动折线图
// 初始化浮动折线图
function initializeLineChartFloating() {
  if (!lineChartRefFloating.value || !lineChartRefFloating.value.offsetWidth) return;

  const lineChart = echarts.init(lineChartRefFloating.value);

  // 获取 articleItem 数据并设置折线图
  const articleData = articleItem.value;

  // 确保日期处理一致，使用 dayjs 将时间转换为 "YYYY-MM-DD" 格式
  const dates = articleData.map((item) => dayjs(item.time).format('YYYY-MM-DD')); // 转换为统一格式

  // 累积计算
  let cumulativeValues = [];
  articleData.reduce((sum, item, index) => {
    cumulativeValues[index] = sum + item.browse;
    return cumulativeValues[index];
  }, 0);

  const newcumulativeValues = cumulativeValues.slice(-6);
  const newdates = dates.slice(-6);

  lineChart.setOption({
    title: { text: Ptitle.value, left: "center" },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: newdates,
      axisLabel: {
        rotate: 30,
        interval: 0,
        textStyle: { fontSize: 12 },
      },
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "累计浏览量",
        type: "line",
        data: newcumulativeValues,
        lineStyle: { color: "#409eff", width: 2 },
        itemStyle: { color: "#409eff" },
        label: { show: true, position: "top", formatter: "{c}" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(64, 158, 255, 0.5)" },
              { offset: 1, color: "rgba(64, 158, 255, 0)" },
            ],
          },
        },
      },
    ],
    grid: { left: "10%", right: "10%", bottom: "20%", top: "20%" },
  });
}

// 初始化主页面中的折线图
function initializeLineChartMain() {
  if (!lineChartRefMain.value || !lineChartRefMain.value.offsetWidth) return;

  const lineChart = echarts.init(lineChartRefMain.value);

  // 根据 monthlyFans 数据生成 xAxis 和 yAxis
  const months = monthlyFans.value.map((item) => item.month); // 使用已格式化的 "YYYY-MM"
  const fanCounts = monthlyFans.value.map((item) => item.count);

  lineChart.setOption({
    title: { text: "每月粉丝增长（累积）", left: "center" },
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: months,
      axisLabel: {
        rotate: 30,
        interval: 0,
        textStyle: { fontSize: 12 },
      },
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "累计粉丝数",
        type: "line",
        data: fanCounts,
        lineStyle: { color: "#FFA500", width: 2 },
        itemStyle: { color: "#FFA500" },
        label: { show: true, position: "top", formatter: "{c}" },
      },
    ],
    grid: { left: "10%", right: "10%", bottom: "20%", top: "20%" },
  });
}

// 初始化图表
onMounted(() => {
  nextTick(() => {
    initializeBarChart();
    initializeLineChartMain();
  });
});

// 监听数据变化更新图表
watch([articles, articledatas, followdata], () => {
  nextTick(() => {
    initializeBarChart();
    initializeLineChartMain();
  });
});

// 监听 isShow 和 articleItem 的变化，确保折线图重新渲染
watch([isShow, articleItem], () => {
  if (isShow.value && articleItem.value.length > 0) {
    nextTick(() => {
      initializeLineChartFloating(); // 初始化悬浮卡片中的折线图
    });
  }
});

// 监听窗口尺寸变化，重新初始化图表
window.addEventListener("resize", () => {
  nextTick(() => {
    initializeBarChart();
    initializeLineChartMain();
    if (isShow.value && articleItem.value.length > 0) {
      initializeLineChartFloating();
    }
  });
});
</script>

<style scoped>
.card-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.data-card {
  background: white;
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.card-content {
  flex: 1;
  text-align: center;
}

.card-content h3 {
  font-size: 16px;
  margin-bottom: 8px;
}

.card-content p {
  font-size: 24px;
  color: #409eff;
}

.el-card {
  border: 1px solid #ddd;
  box-shadow: none;
}

.chart-card {
  width: 100%;
  margin-top: 20px;
  height: 400px;
}

div[ref="barChartRef"],
div[ref="lineChartRefMain"],
div[ref="lineChartRefFloating"] {
  width: 100%;
  height: 100%;
}

.chart-row {
  display: flex;
  gap: 20px;
}
</style>
