<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import * as echarts from 'echarts'
import { justgetall, showOperator } from '@/api/newfunction'

const chargers = ref([])
const operators = ref([])

async function getcharges() {
  const result = await justgetall()
  chargers.value = result.data
}

async function getoperators() {
  const result = await showOperator()
  operators.value = result.data
}

onMounted(async () => {
  await Promise.all([getcharges(), getoperators()])
  nextTick(() => {
    drawAllCharts()
  })
})

// 所有充电桩状态饼图数据
const statusPieData = computed(() => {
  const statusCount = {}
  chargers.value.forEach(chg => {
    statusCount[chg.status] = (statusCount[chg.status] || 0) + 1
  })
  return Object.entries(statusCount).map(([k, v]) => ({ name: k, value: v }))
})

// 各运营商充电桩数量饼图数据
const operatorPieData = computed(() => {
  const count = {}
  chargers.value.forEach(chg => {
    count[chg.operatorId] = (count[chg.operatorId] || 0) + 1
  })
  return operators.value.map(op => ({
    name: op.operatorName,
    value: count[op.id] || 0,
  })).filter(item => item.value > 0)
})

// 各运营商下各状态统计，用于柱状图
const barChartData = computed(() => {
  const allStatuses = [...new Set(chargers.value.map(chg => chg.status))] // 所有状态种类
  const xData = operators.value.map(op => op.operatorName)
  const series = allStatuses.map(status => {
    return {
      name: status,
      type: 'bar',
      stack: '总量',
      emphasis: { focus: 'series' },
      data: operators.value.map(op => {
        const group = chargers.value.filter(c => c.operatorId === op.id)
        return group.filter(c => c.status === status).length
      }),
    }
  })
  return { xData, series }
})

// ref
const statusPieRef = ref(null)
const operatorPieRef = ref(null)
const operatorBarChartRef = ref(null)

function safeInitChart(dom) {
  if (!dom) return null
  let chart = echarts.getInstanceByDom(dom)
  if (!chart) {
    chart = echarts.init(dom)
  }
  return chart
}

function drawAllCharts() {
  // 所有充电桩状态饼图
  const statusChart = safeInitChart(statusPieRef.value)
  if (statusChart) {
    statusChart.setOption({
      title: { text: '所有充电桩状态占比', left: 'center' },
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: '50%',
        data: statusPieData.value,
      }],
    })
  }

  // 各运营商数量饼图
  const operatorChart = safeInitChart(operatorPieRef.value)
  if (operatorChart) {
    operatorChart.setOption({
      title: { text: '每个运营商的充电桩数量占比', left: 'center' },
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: '50%',
        data: operatorPieData.value,
      }],
    })
  }

  // 柱状图（每个运营商下各状态充电桩数量）
  const barChart = safeInitChart(operatorBarChartRef.value)
  if (barChart) {
    barChart.setOption({
      title: {
        text: '每个运营商下不同状态的充电桩数量',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {
        top: 'bottom'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: barChartData.value.xData
      },
      yAxis: {
        type: 'value'
      },
      series: barChartData.value.series
    })
  }
}
</script>

<template>
  <div class="card">
    <h2>充电桩与运营商数据可视化</h2>

    <div class="chart-row">
      <div ref="statusPieRef" class="chart"></div>
      <div ref="operatorPieRef" class="chart"></div>
    </div>

    <div class="bar-chart-container">
      <h3>每个运营商下不同状态的充电桩数量</h3>
      <div ref="operatorBarChartRef" class="chart"></div>
    </div>
  </div>
</template>

<style scoped>
.card {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgb(0 0 0 / 0.1);
}

.chart-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 30px;
}

.chart {
  width: 100%;
  height: 400px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.bar-chart-container {
  margin-top: 60px;
}
</style>
