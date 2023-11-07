<template>
  <div>
    <HModel>
      <template #head>
        <span style="font-weight: bolder">游戏版本 ({{ game_name }})</span>
        <div>
          <el-button type="primary" @click="dialogVisible = true"
            >添加</el-button
          >
        </div>
      </template>
      <template #body>
        <el-table :data="tableData" style="width: 100%" :loading="loading">
          <el-table-column label="ID">
            <template #default="{ row }">{{ row.game_version_id }}</template>
          </el-table-column>
          <el-table-column label="版本号">
            <template #default="{ row }">{{ row.banbenhao }}</template>
          </el-table-column>
          <el-table-column label="下载地址">
            <template #default="{ row }">{{ row.xiazai_url }}</template>
          </el-table-column>
          <el-table-column label="更新内容">
            <template #default="{ row }">{{ row.content }}</template>
          </el-table-column>
          <el-table-column label="创建时间">
            <template #default="{ row }">{{ formatTime(row.ctime) }}</template>
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
          <el-form-item label="版本号">
            <el-input v-model="form.banbenhao" />
          </el-form-item>
          <el-form-item label="下载地址">
            <el-input v-model="form.xiazai_url" />
          </el-form-item>
          <el-form-item label="更新内容">
            <el-input v-model="form.content" type="textarea" />
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
import { ref, onMounted } from 'vue'
import { getGameVersion, addGameVersion } from '../../api/software'
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
  banbenhao: '',
  xiazai_url: '',
  content: ''
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
// 查询
async function query() {
  try {
    loading.value = true
    const res = await getGameVersion({
      page: currentPage.value,
      banbenhao: '',
      game_id: game_id.value
    })
    tableData.value = res?.data?.list
    totalItems.value = res?.data?.count
    loading.value = false
  } catch (error) {
    console.error('Error fetching data: ', error)
  }
}
// 弹出框确认
async function confirm() {
  const res: any = await addGameVersion({
    game_id: game_id.value,
    ...form.value
  })
  if (res.code === 200) {
    ElMessage.success('添加成功')
    dialogVisible.value = false
    query()
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
</style>
