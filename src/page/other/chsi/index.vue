<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import domToImage from 'dom-to-image'
import type { Action } from 'element-plus'
import ChsiPage from './components/chsi-page.vue'
import { getFiles } from '@/utils/inputFile'

const state = reactive({
  userInfo: {
    updateDate: 'August 25, 2022',
    avatar: 'https://assets.fedtop.com/picbed/202208251142290.png',
    // ===
    name: 'SuperMan',
    // ===
    gender: 'male',
    IDNumber: '350781196403000000',
    // ===
    nationality: 'Han nationality',
    birthday: 'February 1, 1998',
    // ===
    school: 'Tsinghua University',
    level: 'Undergraduate',
    // ===
    faculty: '',
    class: '',
    // ====
    specialized: 'Computer Science and Technology',
    studentId: 123456789101112,
    // ====
    form: 'full-time',
    AdmissionTime: 'February 1, 2021',
    AcademicSystem: '4 years',
    // ====
    type: 'general higher education',
    graduationTime: 'January 1, 2025',
    // ========
    code: 'ABCDEFGHIJKLMN',
  },
})

// 选择头像
async function selectAvatar() {
  const file = await getFiles()
  state.userInfo.avatar = file[0]
}

const handleFollow = ref(false)
// 下载报告图片
async function download() {
  if (handleFollow.value === true) {
    const imgData = await domToImage.toJpeg(
      document.querySelector('#printContainer')!,
      {
        quality: 1,
        bgcolor: '#fff',
      },
    )
    const link = document.createElement('a')
    link.download = 'canvas.png'
    link.href = imgData
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } else {
    ElMessageBox.alert(
      '如果这对你有所帮助，愿意在Github上顺便点一个 follow 嘛～💖谢谢！',
      '🥳哈喽～',
      {
        confirmButtonText: '这就去',
        callback: (action: Action) => {
          if (action === 'confirm') {
            window.open('https://github.com/wangrongding', '_blank')
            handleFollow.value = true
          }
        },
      },
    )
  }
  // ElMessageBox.confirm(
  //   '该页面用于申请Copilot的学生认证，禁止用于其他用途，否则后果自负！',
  //   '警告⚠️',
  //   {
  //     confirmButtonText: '同意',
  //     cancelButtonText: '不同意',
  //     type: 'error',
  //   },
  // ).then(async () => {
  //   const imgData = await domToImage.toJpeg(
  //     document.querySelector('#printContainer')!,
  //     {
  //       quality: 1,
  //       bgcolor: '#fff',
  //     },
  //   )
  //   const link = document.createElement('a')
  //   link.download = 'canvas.png'
  //   link.href = imgData
  //   document.body.appendChild(link)
  //   link.click()
  //   document.body.removeChild(link)
  // })
}
</script>
<template>
  <div class="page-container">
    <ChsiPage :user-info="state.userInfo" />
    <div style="padding-top: 80px; width: 350px">
      <p>一般改带*号的就可以了</p>
      <el-input v-model="state.userInfo.updateDate">
        <template #prepend>*更新时间：</template>
      </el-input>
      <el-input v-model="state.userInfo.name">
        <template #prepend>*姓名：</template>
      </el-input>
      <el-input v-model="state.userInfo.avatar">
        <template #prepend>*头像：</template>
      </el-input>
      <el-button
        type="primary"
        style="width: 100%"
        size="default"
        @click="selectAvatar"
      >
        选择头像
      </el-button>
      <el-input v-model="state.userInfo.gender">
        <template #prepend>*性别：</template>
      </el-input>
      <el-input v-model="state.userInfo.IDNumber">
        <template #prepend>*身份证号：</template>
      </el-input>
      <el-input v-model="state.userInfo.nationality">
        <template #prepend>民族：</template>
      </el-input>
      <el-input v-model="state.userInfo.birthday">
        <template #prepend>出生日期：</template>
      </el-input>
      <el-input v-model="state.userInfo.school">
        <template #prepend>*学校：</template>
      </el-input>
      <el-input v-model="state.userInfo.level">
        <template #prepend>层次：</template>
      </el-input>
      <el-input v-model="state.userInfo.faculty">
        <template #prepend>院系：</template>
      </el-input>
      <el-input v-model="state.userInfo.class">
        <template #prepend>班级：</template>
      </el-input>
      <el-input v-model="state.userInfo.specialized">
        <template #prepend>专业：</template>
      </el-input>
      <el-input v-model="state.userInfo.studentId">
        <template #prepend>学号：</template>
      </el-input>
      <el-input v-model="state.userInfo.form">
        <template #prepend>形式：</template>
      </el-input>
      <el-input v-model="state.userInfo.AdmissionTime">
        <template #prepend>*入学时间：</template>
      </el-input>
      <el-input v-model="state.userInfo.AcademicSystem">
        <template #prepend>学制：</template>
      </el-input>
      <el-input v-model="state.userInfo.type">
        <template #prepend>类型：</template>
      </el-input>
      <el-input v-model="state.userInfo.graduationTime">
        <template #prepend>*学籍状态（毕业时间）：</template>
      </el-input>
      <el-input v-model="state.userInfo.code">
        <template #prepend>验证码：</template>
      </el-input>
      <p>
        警告⚠️：该页面用于申请Copilot的学生认证，禁止用于其他用途，否则后果自负！'
      </p>
      <el-button
        type="success"
        style="width: 100%"
        size="default"
        @click="download"
      >
        同意上述内容 并 下载报告图片
      </el-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.page-container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
</style>
