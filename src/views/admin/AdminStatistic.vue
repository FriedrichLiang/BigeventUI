<script setup>
import { ref, onMounted } from 'vue';
import { getalluser } from '@/api/user'; // 引入获取用户数据的 API
import * as echarts from 'echarts'; // 导入 ECharts
import dayjs from 'dayjs'; // 导入 dayjs 用于时间处理

const users = ref([]); // 存储用户数据
const chartRef1 = ref(null); // 用于绑定第一个 ECharts 容器（注册量变化）
const chartRef2 = ref(null); // 用于绑定第二个 ECharts 容器（累计注册量变化）
const pieChartRef = ref(null); // 用于绑定饼状图容器（角色占比）
const chartRefTotal = ref(null); // 用于绑定总注册量折线图容器

// 获取所有用户数据并处理注册日期
async function getUsers() {
  let result = await getalluser();
  users.value = result.data;
  processData(); // 获取数据后处理并生成折线图和饼状图
}

// 处理数据，统计每天的注册量并计算累计注册量
function processData() {
  // 获取当前时间和10天前的时间
  const today = dayjs();
  const tenDaysAgo = today.subtract(10, 'day');
  
  // 创建一个对象来记录每一天的注册量
  const dailyCount = {};
  for (let i = 0; i <= 10; i++) {
    const date = tenDaysAgo.add(i, 'day').format('YYYY-MM-DD');
    dailyCount[date] = 0;
  }

  // 遍历用户数据，统计每天的注册量
  users.value.forEach(user => {
    const createDate = dayjs(user.createTime).format('YYYY-MM-DD');
    if (dailyCount.hasOwnProperty(createDate)) {
      dailyCount[createDate]++;
    }
  });

  // 转换数据为 ECharts 所需的格式
  const dates = Object.keys(dailyCount);
  const counts = Object.values(dailyCount);

  // 计算累计注册量
  const cumulativeCounts = counts.map((count, index) => {
    return counts.slice(0, index + 1).reduce((sum, val) => sum + val, 0);
  });

  // 绘制第一个折线图（用户注册量变化，普通折线图）
  renderChart(chartRef1.value, dates, counts, '用户注册量变化', '注册量', false);

  // 绘制第二个折线图（用户累计注册量变化，山状折线图）
  renderChart(chartRef2.value, dates, cumulativeCounts, '用户累计注册量变化', '累计注册量', true);

  // 绘制饼状图（用户角色占比）
  renderPieChart(pieChartRef.value);

  // 绘制角色累计注册量折线图
  renderRoleCumulativeChart(chartRef1.value, dates);

  // 绘制每天新增的注册量折线图（不是累计）
  renderTotalNewUsersChart(chartRefTotal.value, dates, counts);
}

// 渲染 ECharts 图表
function renderChart(chartRef, dates, data, title, yAxisLabel, isMountainChart) {
  const chart = echarts.init(chartRef); // 初始化 ECharts 实例
  const option = {
    title: {
      text: title,
      left: 'center',
      top: '10px',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: dates, // X轴为日期
    },
    yAxis: {
      type: 'value',
      name: yAxisLabel, // Y轴标签
    },
    series: [
      {
        data: data, // Y轴为注册量或累计注册量
        type: 'line',
        smooth: true, // 平滑曲线
        areaStyle: isMountainChart ? { color: 'rgba(63, 81, 181, 0.2)' } : null, // 如果是山状折线图，则填充颜色
        lineStyle: {
          color: '#3e8ef7', // 曲线颜色
        },
      },
    ],
  };
  chart.setOption(option); // 设置图表配置
}

// 渲染饼状图（用户角色占比）
function renderPieChart(pieChartRef) {
  const chart = echarts.init(pieChartRef);

  // 统计不同角色的用户数量
  const roleCount = { 普通用户: 0, 创作者: 0, 管理员: 0 };
  users.value.forEach(user => {
    switch (user.status) {
      case '普通用户':
        roleCount['普通用户']++;
        break;
      case '创作者':
        roleCount['创作者']++;
        break;
      case '管理员':
        roleCount['管理员']++;
        break;
      default:
        break;
    }
  });

  const option = {
    title: {
      text: '用户角色占比',
      left: 'center',
      top: '10px',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['普通用户', '创作者', '管理员'],
    },
    series: [
      {
        name: '用户角色',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [
          { value: roleCount['普通用户'], name: '普通用户' },
          { value: roleCount['创作者'], name: '创作者' },
          { value: roleCount['管理员'], name: '管理员' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  chart.setOption(option); // 设置饼状图配置
}

// 渲染角色累计注册量折线图
function renderRoleCumulativeChart(chartRef, dates) {
  // 初始化角色累计注册量
  const roleCumulativeCount = {
    普通用户: new Array(dates.length).fill(0),
    创作者: new Array(dates.length).fill(0),
    管理员: new Array(dates.length).fill(0),
  };

  // 遍历用户数据，根据角色和注册日期计算累计注册量
  users.value.forEach(user => {
    const createDate = dayjs(user.createTime).format('YYYY-MM-DD'); // 格式化注册时间
    const role = user.status;
    const index = dates.indexOf(createDate); // 获取该注册日期在日期数组中的位置

    // 确保 index 是有效的索引
    if (index !== -1) {
      if (!roleCumulativeCount[role]) {
        roleCumulativeCount[role] = new Array(dates.length).fill(0); // 确保角色的数组初始化
      }
      roleCumulativeCount[role][index]++; // 增加该日期的注册量
    }
  });

  // 计算累计注册量
  Object.keys(roleCumulativeCount).forEach(role => {
    for (let i = 1; i < roleCumulativeCount[role].length; i++) {
      roleCumulativeCount[role][i] += roleCumulativeCount[role][i - 1]; // 累加注册量
    }
  });

  // 绘制角色累计注册量折线图
  const chart = echarts.init(chartRef);
  const option = {
    title: {
      text: '角色累计注册量变化',
      left: 'center',
      top: '10px',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['普通用户', '创作者', '管理员'],
      left: 'center',
      top: '40px',
    },
    xAxis: {
      type: 'category',
      data: dates, // X轴为日期
    },
    yAxis: {
      type: 'value',
      name: '累计注册量',
    },
    series: [
      {
        name: '普通用户',
        type: 'line',
        data: roleCumulativeCount['普通用户'],
        smooth: true,
        lineStyle: {
          color: '#FF6347', // 红色
        },
        itemStyle: {
          color: '#FF6347', // 确保数据点与折线颜色一致
        },
      },
      {
        name: '创作者',
        type: 'line',
        data: roleCumulativeCount['创作者'],
        smooth: true,
        lineStyle: {
          color: '#32CD32', // 绿色
        },
        itemStyle: {
          color: '#32CD32', // 确保数据点与折线颜色一致
        },
      },
      {
        name: '管理员',
        type: 'line',
        data: roleCumulativeCount['管理员'],
        smooth: true,
        lineStyle: {
          color: '#3e8ef7', // 蓝色
        },
        itemStyle: {
          color: '#3e8ef7', // 确保数据点与折线颜色一致
        },
      },
    ],
  };

  chart.setOption(option); // 设置角色累计注册量折线图配置
}

// 渲染每天新增用户的折线图
function renderTotalNewUsersChart(chartRef, dates, counts) {
  const chart = echarts.init(chartRef);
  const option = {
    title: {
      text: '每天新增用户',
      left: 'center',
      top: '10px',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: dates,
    },
    yAxis: {
      type: 'value',
      name: '新增用户',
    },
    series: [
      {
        name: '新增用户',
        type: 'line',
        data: counts,
        smooth: true,
        lineStyle: {
          color: '#3e8ef7', // 蓝色
        },
      },
    ],
  };

  chart.setOption(option); // 设置每天新增用户折线图配置
}

onMounted(() => {
  getUsers();
});
</script>

<template>
  <div>
    <div class="card" style="margin-bottom: 20px;">
      <!-- 饼状图 -->
      <div ref="pieChartRef" style="height: 300px;"></div>
    </div>

    <div class="card" style="margin-bottom: 20px;">
      <!-- 角色累计注册量折线图 -->
      <div ref="chartRef1" style="height: 300px;"></div>
    </div>

    <div class="card" style="margin-bottom: 20px;">
      <!-- 用户注册量变化折线图 -->
      <div ref="chartRef2" style="height: 300px;"></div>
    </div>

    <div class="card">
      <!-- 每天新增用户折线图 -->
      <div ref="chartRefTotal" style="height: 300px;"></div>
    </div>
  </div>
</template>

<style scoped>
.card {
  margin: 20px;
  border: 1px solid white;
  background: white;
  padding: 15px;
  border-radius: 10px;
}
</style>
