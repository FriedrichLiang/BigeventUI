<script setup>
import { ref, onMounted, nextTick, computed, watch } from 'vue';
import * as echarts from 'echarts';

// 数据：分类和文章
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

// 异步获取分类数据
import { showCategory } from "@/api/article";
async function getcate() {
  let result = await showCategory();
  categorys.value = result.data;
}
getcate();

// 异步获取文章数据
import { justGetAllArticle } from "@/api/article";
async function show() {
  let result = await justGetAllArticle();
  articles.value = result.data;

  // 为每个文章匹配类别名称
  for (let i = 0; i < articles.value.length; i++) {
    let item = articles.value[i];
    for (let j = 0; j < categorys.value.length; j++) {
      if (categorys.value[j].id === item.categoryId) {
        item.categoryName = categorys.value[j].categoryName;
      }
    }
  }
}
show();

// 计算每个类别下的文章数量
const categoryArticleCount = computed(() => {
  return categorys.value.map(category => {
    const articleCount = articles.value.filter(article => article.categoryId === category.id).length;
    return { name: category.categoryName, value: articleCount };
  });
});

// 计算每个类别的总浏览量并按降序排序
const categoryTotalBrowse = computed(() => {
  const sortedData = categorys.value.map(category => {
    const totalBrowse = articles.value
      .filter(article => article.categoryId === category.id)
      .reduce((sum, article) => sum + article.browse, 0);
    return { name: category.categoryName, value: totalBrowse };
  });

  // 按照浏览量降序排序
  sortedData.sort((a, b) => b.value - a.value);
  return sortedData;
});

// 计算每个类别的平均浏览量，并按降序排序
const categoryAverageBrowse = computed(() => {
  const data = categorys.value.map(category => {
    const filteredArticles = articles.value.filter(article => article.categoryId === category.id);
    const totalBrowse = filteredArticles.reduce((sum, article) => sum + article.browse, 0);
    const averageBrowse = filteredArticles.length ? totalBrowse / filteredArticles.length : 0;
    return { name: category.categoryName, value: averageBrowse };
  });

  // 按照平均浏览量降序排序
  data.sort((a, b) => b.value - a.value);
  return data;
});

// 图表容器的引用
const pieChartRef = ref(null);
const barChartRef = ref(null);
const browseBarChartRef = ref(null);
const avgBrowseBarChartRef = ref(null);

// 监听数据变化，重新渲染图表
watch([categorys, articles], () => {
  nextTick(() => {
    updateCharts();
  });
}, { deep: true });

// 更新图表的函数
function updateCharts() {
  // 饼状图
  const pieChart = echarts.init(pieChartRef.value);
  pieChart.setOption({
    title: {
      text: '我的作品构成图',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        name: '文章数',
        type: 'pie',
        radius: '50%',
        data: categoryArticleCount.value,
      },
    ],
  });

  // 每个类别的文章数柱状图
  const barChart = echarts.init(barChartRef.value);
  barChart.setOption({
    title: {
      text: '类型数量排列图',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: categoryArticleCount.value.map(item => item.name),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '文章数',
        type: 'bar',
        data: categoryArticleCount.value.map(item => item.value),
        itemStyle: {
          color: function (params) {
            const colors = ['#ff6347', '#87cefa', '#32cd32', '#ffb6c1', '#ff1493'];
            return colors[params.dataIndex % colors.length];
          },
        },
      },
    ],
  });

  // 每个类别的总浏览量柱状图
  const browseBarChart = echarts.init(browseBarChartRef.value);
  browseBarChart.setOption({
    title: {
      text: '类型浏览量排列图',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: categoryTotalBrowse.value.map(item => item.name),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '总浏览量',
        type: 'bar',
        data: categoryTotalBrowse.value.map(item => item.value),
        itemStyle: {
          color: function (params) {
            const colors = ['#ff6347', '#87cefa', '#32cd32', '#ffb6c1', '#ff1493'];
            return colors[params.dataIndex % colors.length];
          },
        },
        label: {
          show: true,
          position: 'top',
          color: '#000',
          fontSize: 14,
          formatter: '{c}', // 显示具体的数值
        },
      },
    ],
  });

  // 每个类别的平均浏览量柱状图
  const avgBrowseBarChart = echarts.init(avgBrowseBarChartRef.value);
  avgBrowseBarChart.setOption({
    title: {
      text: '每个类别的平均浏览量',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: categoryAverageBrowse.value.map(item => item.name),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '平均浏览量',
        type: 'bar',
        data: categoryAverageBrowse.value.map(item => item.value),
        itemStyle: {
          color: function (params) {
            const colors = ['#ff6347', '#87cefa', '#32cd32', '#ffb6c1', '#ff1493'];
            return colors[params.dataIndex % colors.length];
          },
        },
        label: {
          show: true,
          position: 'top',
          color: '#000',
          fontSize: 14,
          formatter: (params) => {
            return params.value.toFixed(2); // 保留两位小数
          },
        },
      },
    ],
  });
}

onMounted(() => {
  nextTick(() => {
    updateCharts();
  });
});
</script>

<template>
  <div class="card">
    <!-- 第一行：每个类别的文章数饼状图和柱状图 -->
    <div class="chart-row">
      <div ref="pieChartRef" style="height: 400px; flex: 1;"></div>
      <div ref="barChartRef" style="height: 400px; flex: 1;"></div>
    </div>

    <!-- 第二行：每个类别的总浏览量柱状图 -->
    <div class="chart-row">
      <div ref="browseBarChartRef" style="height: 400px; flex: 1;"></div>
    </div>

    <!-- 第三行：每个类别的平均浏览量柱状图 -->
    <div class="chart-row">
      <div ref="avgBrowseBarChartRef" style="height: 400px; flex: 1;"></div>
    </div>
  </div>
</template>

<style scoped>
.card {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.chart-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 40px;
}

div[ref="pieChartRef"],
div[ref="barChartRef"],
div[ref="browseBarChartRef"],
div[ref="avgBrowseBarChartRef"] {
  width: 48%;
  height: 400px;
}
</style>
