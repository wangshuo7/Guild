<template>
  <el-form ref="ruleFormRef" :model="form" label-width="100px" :rules="rules">
    <el-form-item label="头像" prop="header_img">
      <el-input v-model="form.header_img"></el-input>
      <!-- <HUpload></HUpload> -->
    </el-form-item>
    <el-form-item label="工会名称" prop="gzs_title">
      <el-input v-model="form.gzs_title"></el-input>
    </el-form-item>
    <el-form-item label="工会简介" prop="gzs_desc">
      <el-input type="textarea" v-model="form.gzs_desc"></el-input>
    </el-form-item>
    <el-form-item label="账号" prop="username">
      <el-input v-model="form.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" type="password"></el-input>
    </el-form-item>
    <el-form-item label="手机号" prop="mobile">
      <el-input v-model="form.mobile"></el-input>
    </el-form-item>
    <el-form-item label="提现账号" prop="tx_card">
      <el-input v-model="form.tx_card"></el-input>
    </el-form-item>
    <el-form-item label="邀请码" prop="yq_code">
      <el-input v-model="form.yq_code"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit()">注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { register_type } from '../../../type/login'
import { register } from '../../../api/login'
// import HUpload from '../../../components/HUpload/index.vue'
const ruleFormRef = ref<FormInstance>()
const form = reactive<register_type>({
  header_img: '1',
  gzs_title: 'fdsfdfdsfdsfd1',
  gzs_desc: 'hgfhhfghgfhg1',
  username: 'fdsGHGJKJHf111dsf1',
  password: 'fdsfdsf1',
  mobile: '15563875111',
  tx_card: 'fdsfdsfdsf11',
  yq_code: '11111111111111111'
})
const rules = reactive<FormRules<register_type>>({
  header_img: [{ required: true, message: '头像不能为空', trigger: 'blur' }],
  gzs_title: [
    { required: true, message: '工作室名称不能为空', trigger: 'blur' }
  ],
  gzs_desc: [
    { required: true, message: '工作室简介不能为空', trigger: 'blur' }
  ],
  username: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
  password: [
    {
      required: true,
      message: '密码不能为空'
    }
  ],
  mobile: [
    {
      required: true,
      message: '手机号不能为空'
      // trigger: 'change'
    },
    {
      pattern: /^1[3|4|5|6|7|8|9]\d{9}$/,
      message: '手机号格式不正确',
      trigger: 'blur'
    }
  ],
  tx_card: [{ required: true, message: '提现账号不能为空', trigger: 'blur' }],
  yq_code: [{ required: true, message: '邀请码不能为空', trigger: 'blur' }]
})
async function onSubmit() {
  const send_data = {
    header_img: form.header_img,
    gzs_title: form.gzs_title,
    gzs_desc: form.gzs_desc,
    username: form.username,
    password: form.password,
    mobile: form.mobile,
    tx_card: form.tx_card,
    yq_code: form.yq_code
  }
  const res = await register(send_data)
  ElMessage.success('注册成功')
  console.log('res', res)
}
</script>

<style lang="less" scoped></style>
