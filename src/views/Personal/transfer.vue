<template>
  <div style="width: 500px">
    <el-form :model="form" label-width="120px">
      <el-form-item label="转账">
        <el-input v-model="form.toid" placeholder="请输入转账id"></el-input>
      </el-form-item>
      <el-form-item label="云豆">
        <el-input v-model="form.tprice" placeholder="请输入云豆数量"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { transferAccounts } from '../../api/personal'
import { ref } from 'vue'

const form = ref<any>({
  toid: '',
  tprice: ''
})
async function submit() {
  const res: any = await transferAccounts({
    toid: form.value.toid,
    tprice: form.value.tprice
  })
  if (res.code === 200) {
    return ElMessage.success(res.data)
  }
  ElMessage.error(res.data)
}
function cancel() {
  form.value = {}
}
</script>

<style lang="less" scoped></style>
