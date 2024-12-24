<script setup lang="ts">
import { onMounted, ref, defineProps } from "vue";
import * as echarts from "echarts";

/* 获取 props 参数 */
const { data } = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
const largeCategory: Record<string, number> = { 其它: 0 };
const KNOWN_MERCHANTS = [
  "闵行一餐",
  "闵行二餐",
  "闵行三餐",
  "闵行四餐",
  "闵行五餐",
  "闵行六餐",
  "闵行七餐",
  "徐汇一餐",
  "徐汇二餐",
  "徐汇三餐",
];
for (const [name, value] of Object.entries(data)) {
  const category = name.slice(0, 4);
  if (KNOWN_MERCHANTS.includes(category)) {
    if (!largeCategory[category]) {
      largeCategory[category] = value.total;
    } else {
      largeCategory[category] += value.total;
    }
  } else {
    largeCategory["其它"] += value.total;
  }
}
console.log(largeCategory);

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
      text: "餐厅消费报告",
      textStyle: {
        color: "#fff",
      },
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      type: "scroll",
      orient: "vertical",
      right: 10,
      top: 20,
      bottom: 20,
      data: data.legendData,
      textStyle: {
        color: "#fff",
      },
    },
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
        name: "食堂",
        type: "pie",
        radius: ["30%", "50%"],
        padAngle: 2,
        itemStyle: {
          borderRadius: 10,
        },
        data: Object.entries(largeCategory).map((item) => ({
          name: item[0],
          value: round(item[1]),
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
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
  height: 70%;
}
</style>
