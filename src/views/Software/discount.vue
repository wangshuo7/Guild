<template>
  <div>
    <div class="query">
      <el-form :form="queryForm" label-width="80px" @submit.prevent inline>
        <el-form-item :label="$t('table.title')">
          <el-input
            placeholder="请输入标题"
            @keyup.enter="query"
            v-model="queryForm.title"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="queryForm.type" placeholder="请选择" clearable>
            <el-option value="1" label="折扣券" />
            <el-option value="2" label="免费激活券" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button style="margin: 0 20px" type="primary" @click="query">{{
            $t('button.query')
          }}</el-button>
          <el-button @click="onClear">{{ $t('button.clear') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <HModel>
      <template #head>
        <span style="font-weight: bolder">游戏折扣 ({{ game_name }})</span>
        <div>
          <el-button type="primary" @click="dialogVisible = true"
            >添加</el-button
          >
        </div>
      </template>
      <template #body>
        <el-table :data="tableData" style="width: 100%" :loading="loading">
          <el-table-column label="ID">
            <template #default="{ row }">{{ row.id }}</template>
          </el-table-column>
          <el-table-column label="标题">
            <template #default="{ row }">{{ row.title }}</template>
          </el-table-column>
          <el-table-column label="类型">
            <template #default="{ row }">{{
              row.type === 1 ? '折扣券' : '免费激活券'
            }}</template>
          </el-table-column>
          <el-table-column label="折扣">
            <template #default="{ row }">{{
              row.type == 1 ? row.dazhe : '-'
            }}</template>
          </el-table-column>
          <el-table-column label="创建时间">
            <template #default="{ row }">{{ formatTime(row.ctime) }}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="danger" @click="deleteDiscount(row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #foot>
        <div class="pagination">
          <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            :page-sizes="[10, 20, 30]"
            :total="totalItems"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </template>
    </HModel>
    <el-dialog v-model="dialogVisible" :title="$t('button.add')" width="50%">
      <div>
        <el-form :model="form" label-width="120px">
          <el-form-item label="类型">
            <el-radio-group v-model="form.type" class="ml-4">
              <el-radio value="1">折扣券</el-radio>
              <el-radio value="2">免费激活券</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="form.title" />
          </el-form-item>
          <el-form-item label="折扣">
            <el-input v-model="form.dazhe" :disabled="form.type == 2" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{
            $t('button.cancel')
          }}</el-button>
          <el-button type="primary" @click="confirm">{{
            $t('button.confirm')
          }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { addDiscount, delDiscount, getDiscountList } from '../../api/software'
import Moment from 'moment'
import HModel from '../../components/HModel/index.vue'
import router from '../../router'
import { ElMessage } from 'element-plus'
const game_id = ref<any>()
const game_name = ref<any>()
const tableData = ref<any>()
const loading = ref<boolean>(false)
const dialogVisible = ref<boolean>(false)
const form = ref<any>({
  type: '1',
  title: '',
  dazhe: ''
})
const queryForm = ref<any>({
  title: '',
  type: ''
})
// 分页相关
const currentPage = ref<number>(1) // 当前页
const pageSize = ref<number>(10) // 每页显示条数
const totalItems = ref<number>(0) // 总数据条数
// 当每页显示条数发生变化时触发
function handleSizeChange(newSize: number) {
  pageSize.value = newSize
  currentPage.value = 1 // 切换每页显示条数时，重置到第一页
  query()
}

// 当页码发生变化时触发
function handleCurrentChange(newPage: number) {
  currentPage.value = newPage
  query()
}

// 弹出框确认
async function confirm() {
  const res: any = await addDiscount({
    game_id: game_id.value,
    ...form.value
  })
  if (res.code === 200) {
    ElMessage.success('添加成功')
    dialogVisible.value = false
    query()
  }
}
// 删除折扣
async function deleteDiscount(row: any) {
  const res: any = await delDiscount({ ids: [row.id] })
  if (res.code === 200) {
    ElMessage.success('删除成功')
    query()
  } else {
    ElMessage.error(res.msg)
  }
}
// 清空
function onClear() {
  queryForm.value = {}
}
watch(dialogVisible, () => {
  form.value = {
    type: '1',
    title: '',
    dazhe: ''
  }
})
// 查询
async function query() {
  try {
    loading.value = true
    const res = await getDiscountList({
      page: currentPage.value,
      title: queryForm.value.title,
      type: queryForm.value.type,
      game_id: game_id.value
    })
    tableData.value = res?.data?.list
    totalItems.value = res?.data?.count
    loading.value = false
  } catch (error) {
    console.error('Error fetching data: ', error)
  }
}
onMounted(() => {
  game_id.value = router.currentRoute.value.query.id
  game_name.value = router.currentRoute.value.query.name
  query()
})

// 时间格式化
function formatTime(time: number) {
  return time ? Moment(time * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'
}
</script>

<style lang="less" scoped>
.pagination {
  margin-top: 20px;
  margin-right: 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.query {
  margin-top: 40px;
  .el-input {
    width: 250px;
  }
}
</style>
