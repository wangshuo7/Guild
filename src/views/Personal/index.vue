<template>
  <div>
    <div>头像:{{ infos?.header_img }}</div>
    <div>用户名:{{ infos?.username }}</div>
    <div>云豆:{{ infos?.current_price }}</div>
    <div>uid:{{ infos?.uid }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getPersonalInfo } from '../../api/personal'

const infos = ref<any>()
async function query() {
  const res = await getPersonalInfo()
  infos.value = res?.data?.one
}
onMounted(() => {
  query()
})
</script>

<style lang="less" scoped></style>
