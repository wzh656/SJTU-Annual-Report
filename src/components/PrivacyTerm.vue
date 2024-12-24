<script setup lang="ts">
const emit = defineEmits(["agree", "close"]);

function agree() {
  emit("agree");
}

function disagree() {
  emit("close");
}
</script>

<template>
  <section>
    <div class="mask"></div>
    <div class="container">
      <h1>隐私协议</h1>
      <p>
        我们尊重并保护所有使用服务用户的个人隐私权。为了给您提供更准确、更有个性化的服务，本隐私权政策将帮助您了解我们如何收集、使用、保护您的个人信息。我们将保留这些信息，不会将其用于任何商业目的，除非得到您的许可或法律另有规定。
      </p>
      <p>本应用保证不会泄露或出售您的个人信息</p>
      <div class="button-container">
        <button class="button" @click="disagree()">不同意</button>
        <button class="button" @click="agree()">同意</button>
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

  p {
    text-align: start;
  }

  .button-container {
    display: flex;
    justify-content: space-around;
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
    .button-container {
      max-width: 500px;
    }
  }
}
</style>
