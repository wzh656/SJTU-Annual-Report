<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["submit"]);

function handleOpen() {
  window.open("/login", "_blank");
}

const urlElem = ref<HTMLInputElement | null>(null);
function handleSubmit() {
  const url = urlElem.value?.value.trim();
  if (url) {
    const parser = new URL(url);
    if (parser.hostname === "net.sjtu.edu.cn") {
      const code = parser.searchParams.get("code");
      emit("submit", code);
    } else {
      alert("请确保输入的网页链接为 JAccount 登录后的返回页面");
    }
  } else {
    alert("请点击“打开”按钮登录后，再输入网页链接");
  }
}
</script>

<template>
  <section>
    <div class="mask"></div>
    <div class="container">
      <h1>出于权限原因，请遵循以下提示操作</h1>
      <p>点击<i>“登录”按钮</i>后，登录 JAccount 账号（如果已经登录可能会直接跳转）</p>
      <p>
        并在登录完成后的跳转网页中（其实就是网络信息中心），<b>复制完整的网页链接到以下文本框中</b>，点击<i>“提交”按钮</i>即可生成您的报告。
      </p>
      <input type="text" ref="urlElem" />
      <div class="button-container">
        <button class="button" @click="handleOpen()">登录</button>
        <button class="button" @click="handleSubmit()">提交</button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

b {
  font-weight: bold;
}

.container {
  display: flex;
  flex-direction: column;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 80%;
  max-height: 80%;
  overflow-y: auto;
  padding: 1rem;

  color: white;
  background-color: $color-dark;
  text-align: center;
  border-radius: 1rem;
  box-shadow: 1px 1px 3px rgba(255, 255, 255, 0.5);

  input {
    width: 100%;
    padding: 0.5rem;
    margin: 0 auto;
    margin-top: 1rem;
    border: none;
    border-radius: 0.5rem;

    background-color: $color-background-mute;
    color: $color-dark;
    font-size: 1.2rem;
    text-align: center;
    outline: $color-primary;
  }

  .button-container {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    margin: 0 auto;
    margin-top: 1rem;

    .button {
      width: 50%;
      margin: 0 1rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.5rem;
      background-color: $color-primary;
      color: white;
      cursor: pointer;
    }
  }
}

@media screen and (min-width: 768px) {
  .container {
    input {
      max-width: 500px;
    }

    .button-container {
      max-width: 500px;
    }
  }
}
</style>
