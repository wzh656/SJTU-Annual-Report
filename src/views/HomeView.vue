<script setup lang="ts">
import MessageInfo from "@/components/MessageInfo.vue";
import PrivacyTerm from "@/components/PrivacyTerm.vue";
import { type ReportData } from "@/components/declare";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const privacyTermDisplay = ref(false);
const MessageInfoDisplay = ref(false);

function handleClose() {
  privacyTermDisplay.value = false;
}

function handleAgree() {
  privacyTermDisplay.value = false;
  MessageInfoDisplay.value = true;
}

function handleSubmit(code: string) {
  MessageInfoDisplay.value = false;
  location.href = "/callback?code=" + code;
}

const query = new URL(location.href).searchParams.get("data");
if (query) {
  let data: ReportData;
  try {
    data = JSON.parse(query);
    console.log("[HomeView]", data);
    router.push({ name: "report", query: { query } });
  } catch (e) {
    throw new Error(e as string | undefined);
  }
}
</script>

<template>
  <div class="mask"></div>
  <header>
    <img class="logo" src="@/assets/images/header.png" />
    <h1>SJTU 2024 年度消费报告</h1>
  </header>
  <main>
    <img class="title" src="@/assets/images/title.png" alt="SJTU 2024 年度报告" />
    <img
      class="open"
      src="@/assets/images/open.png"
      alt="打开报告"
      @click="privacyTermDisplay = true"
    />
  </main>
  <Transition name="fade">
    <PrivacyTerm v-if="privacyTermDisplay" @agree="handleAgree" @close="handleClose" />
  </Transition>
  <Transition name="fade">
    <MessageInfo v-if="MessageInfoDisplay" @submit="handleSubmit" />
  </Transition>
</template>

<style>
body {
  background: url("@/assets/images/background.jpg") no-repeat 30% center fixed;
  background-size: cover;
}
</style>

<style scoped lang="scss">
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba($color-dark, 0.3);
  backdrop-filter: blur(2px);
}

header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba($color-primary, 0.7);

  img.logo {
    padding: 0 3rem;
    max-height: 5rem;
  }

  h1 {
    flex: none;
    color: #fff;
    font-style: italic;
    text-align: center;
    margin: 0;
  }
}

main {
  img.title {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 100%;
  }

  img.open {
    position: absolute;
    bottom: 10%;
    left: 50%;
    transform: translateX(-50%);
    max-width: 100%;
    cursor: pointer;
  }
}

@media screen and (min-width: 768px) {
  header {
    flex-direction: row;
  }

  main {
    img.title {
      max-width: 700px;
    }

    img.open {
      max-width: 600px;
    }
  }
}
</style>
