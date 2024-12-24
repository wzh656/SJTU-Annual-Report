<script setup lang="ts">
import { useRoute } from "vue-router";
import { type ReportData } from "@/components/declare";
import { ref } from "vue";
import MonthlyChart from "@/components/MonthlyChart.vue";
import MerchantChart from "@/components/MerchantChart.vue";

// 获取数据
const route = useRoute();

console.log("[ReportView]", route.query);

const query = route.query.query as string | undefined;
if (!query) throw new Error("No data provided");

let data: ReportData;
try {
  data = JSON.parse(query);
} catch (e) {
  throw new Error(e as string | undefined);
}

console.log("[ReportView]", data);

// 格式化金额
function round(num: number): number {
  return Math.round(num * 100) / 100;
}

// 格式化日期
function formatDate(date: number): string {
  const d = new Date(date * 1000);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  return `${month.toString().padStart(2, "0")}月${day.toString().padStart(2, "0")}日 ${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

// 最常光顾商家
const mostVisitMerchant = Object.entries(data.merchants).sort((a, b) => b[1].num - a[1].num)[0];
// 消费最多的商家
const mostCostMerchant = Object.entries(data.merchants).sort((a, b) => b[1].total - a[1].total)[0];
// 最多消费月份
const mostMonth = Object.entries(data.months).sort((a, b) => b[1].total - a[1].total)[0];
// 早中晚平均消费
const averageCategories = {
  breakfast: data.categories.breakfast.total / data.categories.breakfast.num,
  lunch: data.categories.lunch.total / data.categories.lunch.num,
  dinner: data.categories.dinner.total / data.categories.dinner.num,
};

/* 页面滚动 */
const page = ref(0);
const PAGE_NUM = 11;
let lastScrollTop = 0;
const EASE = 0.05;
(function update() {
  requestAnimationFrame(update);
  // console.log(page.value);

  const scrollTop = page.value * innerHeight;
  const delta = scrollTop - lastScrollTop;
  lastScrollTop += delta * EASE;
  window.scrollTo(0, lastScrollTop);

  //   window.scroll({
  //     top: page.value * innerHeight,
  //     left: 0,
  //     behavior: "smooth",
  //   });
})();

let lastTime = 0;
const INTERVAL = 1 * 1000;
document.addEventListener("wheel", (e) => {
  e.preventDefault();

  if (Date.now() - lastTime < INTERVAL) return;
  lastTime = Date.now();

  if (e.deltaY > 0) {
    page.value++;
  } else if (e.deltaY < 0) {
    page.value--;
  }
  if (page.value < 0) page.value = 0;
  if (page.value >= PAGE_NUM) page.value = PAGE_NUM - 1;
});

let startY = 0;
let counted = false;
document.addEventListener("touchstart", (e) => {
  startY = e.touches[0].clientY;
  counted = false;

  e.preventDefault();
  return false;
});
document.addEventListener("touchmove", (e) => {
  const deltaY = e.touches[0].clientY - startY;

  if (counted) return;
  counted = true;

  if (Date.now() - lastTime < INTERVAL) return;
  lastTime = Date.now();

  if (deltaY < 0) {
    page.value++;
  } else if (deltaY > 0) {
    page.value--;
  }
  if (page.value < 0) page.value = 0;
  if (page.value >= PAGE_NUM) page.value = PAGE_NUM - 1;

  e.preventDefault();
  return false;
});
</script>

<template>
  <div class="report-view">
    <section>
      <p>
        2024 年，你在交大消费了 <i>{{ data.num }}</i> 次
      </p>
      <p>
        共花费 <i>{{ round(data.total) }}</i> 元
      </p>
      <p>
        平均每餐 <i>{{ round(data.total / data.num) }}</i> 元
      </p>
      <p>
        我的评价是：
        <i> {{ data.total / data.num > 20 ? "富哥v我50" : "要舍得在吃饭上花钱哦" }}</i>
      </p>
    </section>
    <section>
      <p>
        今年 <i>{{ formatDate(data.first.orderTime) }}</i>
      </p>
      <p>
        你在 <i>{{ data.first.merchant }}</i
        >开启了第一笔在交大的消费，花了 <i>{{ -data.first.amount }}</i> 元。
      </p>
    </section>
    <section>
      <p>
        你最常光顾的地方是
        <i>{{ mostVisitMerchant[0] }}</i>
      </p>
      <p>
        一共消费了 <i>{{ mostVisitMerchant[1].num }}</i> 次，共花费
        <i>{{ round(mostVisitMerchant[1].total) }}</i> 元。
      </p>
    </section>
    <section>
      <p>
        你在
        <i>{{ mostCostMerchant[0] }}</i
        >消费最多，
      </p>
      <p>
        <i>{{ mostCostMerchant[1].num }}</i> 次消费里，共花了
        <i>{{ round(mostCostMerchant[1].total) }}</i> 元。 这里的美食(?)真是让你回味无穷。
      </p>
    </section>
    <section>
      <p>你今年在交大一共吃了</p>
      <p>
        <i>{{ data.categories.breakfast.num }}</i> 顿早餐，
      </p>
      <p>
        <i>{{ data.categories.lunch.num }}</i> 顿午餐，
      </p>
      <p>
        <i>{{ data.categories.dinner.num }}</i> 顿晚餐。
      </p>
      <p>
        {{ data.categories.breakfast.num < data.categories.lunch.num / 2 ? "要记得吃早餐哦" : "" }}
      </p>
    </section>
    <section>
      <p>
        你早餐平均吃
        <i>{{ round(averageCategories.breakfast) }}</i> 元
      </p>
      <p>
        午餐平均吃
        <i>{{ round(averageCategories.lunch) }}</i> 元
      </p>
      <p>
        晚餐平均吃
        <i>{{ round(averageCategories.dinner) }}</i> 元
      </p>
      <p></p>
      <p>
        看起来你最舍得在
        <i>
          {{
            Math.max(...Object.values(averageCategories)) == averageCategories.breakfast
              ? "早餐"
              : Math.max(...Object.values(averageCategories)) == averageCategories.lunch
                ? "午餐"
                : "晚餐"
          }}
        </i>
        上花钱
      </p>
    </section>
    <section>
      <p>
        <i>{{ formatDate(data.earliest.orderTime) }} </i>是你今年最早的一次用餐，
      </p>
      <p>
        你一早就在 <i>{{ data.earliest.merchant }}</i> 消费了
        <i>{{ -data.earliest.amount }}</i> 元。
      </p>
    </section>
    <section>
      <p>
        你在 <i>{{ mostMonth[0] }} </i> 月消费最多，
      </p>
      <p>
        一共花了 <i>{{ round(mostMonth[1].total) }}</i> 元。
      </p>
    </section>
    <section>
      <MerchantChart :data="data.merchants"></MerchantChart>
    </section>
    <section>
      <MonthlyChart :data="data.months"></MonthlyChart>
    </section>
    <section>
      <p>不管怎样，吃饭要紧</p>
      <p>2025年也要记得好好吃饭喔(⌒▽⌒)☆</p>
    </section>
  </div>
</template>

<style>
body {
  overflow-y: hidden;
}
</style>

<style scoped lang="scss">
.report-view {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;

  section {
    width: 100vw;
    height: 100vh;
    background-color: rgba($color-dark, 0.5);
    color: white;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    p {
      font-size: 1.5em;
      text-align: center;
      margin: 1rem;
    }
  }
}

i {
  font-size: 1.5em;
  font-weight: bold;
  color: $color-primary2;
  text-shadow:
    1px 1px 3px #ffffffaa,
    2px 2px 5px #ffffffaa;
}
</style>
