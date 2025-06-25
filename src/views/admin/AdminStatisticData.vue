<script setup>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts'; 
import { getuserbrowse, getusercount, getuserfollow } from '@/api/user';

// 定义数据
const browsedata = ref([]);
const countdata = ref([]);
const followdata = ref([]);

// 获取数据
async function getdata() {
    let re1 = await getuserbrowse();
    let re2 = await getusercount();
    let re3 = await getuserfollow();

    browsedata.value = re1.data;
    countdata.value = re2.data;
    followdata.value = re3.data;

    console.log(browsedata.value)
    console.log(countdata.value)
    console.log(followdata.value)
}

// 初始化图表
let browseChart, countChart, followChart;

onMounted(() => {
    browseChart = echarts.init(document.getElementById('browseChart'));
    countChart = echarts.init(document.getElementById('countChart'));
    followChart = echarts.init(document.getElementById('followChart'));

    // 在组件挂载时设置图表的初始配置
    updateCharts();

    // 如果数据发生变化，重新渲染图表
    watch([browsedata, countdata, followdata], updateCharts, { deep: true });
});

// 更新图表的配置
function updateCharts() {
    // 更新浏览量图表
    browseChart.setOption({
        title: {
            text: '浏览量最高的创作者',
        },
        tooltip: {},
        xAxis: {
            type: 'category',
            data: browsedata.value.map(item => item.username),
        },
        yAxis: {
            type: 'value',
        },
        series: [{
            data: browsedata.value.map(item => item.totalBrowse),
            type: 'bar',
            color: '#4E73DF', // 自定义颜色
        }]
    });

    // 更新作品数量图表
    countChart.setOption({
        title: {
            text: '作品数量最多的创作者',
        },
        tooltip: {},
        xAxis: {
            type: 'category',
            data: countdata.value.map(item => item.username),
        },
        yAxis: {
            type: 'value',
        },
        series: [{
            data: countdata.value.map(item => item.totalBrowse),
            type: 'bar',
            color: '#1CC88A', // 自定义颜色
        }]
    });

    // 更新粉丝数量图表
    followChart.setOption({
        title: {
            text: '粉丝最多的创作者',
        },
        tooltip: {},
        xAxis: {
            type: 'category',
            data: followdata.value.map(item => item.username),
        },
        yAxis: {
            type: 'value',
        },
        series: [{
            data: followdata.value.map(item => item.totalBrowse),
            type: 'bar',
            color: '#FF5A5F', // 自定义颜色
        }]
    });
}

// 获取数据
getdata();
</script>

<template>
  <div class="charts-container">
    <div class="chart-card">
      <div id="browseChart" style="width: 100%; height: 400px;"></div>
    </div>
    <div class="chart-card">
      <div id="countChart" style="width: 100%; height: 400px;"></div>
    </div>
    <div class="chart-card">
      <div id="followChart" style="width: 100%; height: 400px;"></div>
    </div>
  </div>
</template>

<style scoped>
/* 设置整个容器，确保卡片之间有适当的间距 */
.charts-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 20px;
}

/* 定义每个柱状图卡片的样式 */
.chart-card {
  background-color: white; /* 白色背景 */
  border-radius: 8px; /* 卡片圆角 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 设置阴影 */
  padding: 20px; /* 内边距 */
  box-sizing: border-box; /* 确保边距和内边距不会影响宽高 */
  border: 1px solid #ddd; /* 为卡片添加细边框 */
}

/* 在卡片的顶部添加标题 */
.chart-card h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
}

</style>
