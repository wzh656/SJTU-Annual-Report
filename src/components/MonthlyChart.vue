<script setup lang="ts">
import { onMounted, ref, defineProps } from "vue";
import * as echarts from "echarts";
import { type ReportData } from "@/components/declare";

/* 获取 props 参数 */
const { data } = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
const arrayData = Object.entries(data as ReportData["months"]);

// 格式化金额
function round(num: number): number {
  return Math.round(num * 100) / 100;
}

const chartElem = ref<HTMLDivElement>();
let chart: echarts.ECharts | null = null;
onMounted(() => {
  chart = echarts.init(chartElem.value, null);
  display();
  window.addEventListener("resize", () => {
    console.log("[resize]");
    chart!.resize();
  });
});

function display() {
  if (!chart) return;

  chart.setOption({
    title: {
      text: "每月消费报告",
      textStyle: {
        color: "#fff",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross" },
    },
    legend: {
      textStyle: {
        color: "#fff",
      },
    },
    xAxis: {
      data: Object.keys(data),
      axisLabel: {
        // interval: 0,
        // rotate: 45,
        color: "#fff",
      },
    },
    yAxis: {},
    /* visualMap: {
      type: "piecewise",
      show: false,
      dimension: 0,
      seriesIndex: 0,
      pieces: periods.map((item) => ({
        gt: data[0].map((v) => v[0]).indexOf(item.start),
        lt: data[0].map((v) => v[0]).indexOf(item.end),
        color: item.type === DayType.Weekday ? "rgba(0, 0, 180, 0.4)" : "rgba(180, 0, 0, 0.4)",
      })),
    }, */
    series: [
      {
        name: "消费次数",
        type: "line",
        smooth: true,
        data: arrayData.map((item) => item[1].num),
        label: {
          show: true,
          position: "bottom",
          textStyle: {
            fontSize: 14,
            color: "#aaccff",
          },
        },
      },
      {
        name: "消费金额",
        type: "line",
        smooth: true,
        data: arrayData.map((item) => round(item[1].total)),
        label: {
          show: true,
          position: "top",
          textStyle: {
            fontSize: 14,
            color: "#ffee33",
          },
        },
      },
    ],
  });
}
</script>

<template>
  <div ref="chartElem" @touchsatrt.stop @touchmove.stop @touchend.stop></div>
</template>

<style scoped lang="scss">
div {
  width: 100%;
  height: 400px;
}
</style>
