<template>
  <h1>{{ msg }}</h1>

<button @click="handleClick">点击发送请求</button>
</template>

<script setup>
import { defineProps, reactive } from 'vue'
import axios from "axios"
defineProps({
  msg: String
})

const state = reactive({ count: 0 })

function handleClick(){
  console.log('fff')
  axios.post("/sso/login.htm",{
      userCode:'zhangliqun',
      userPassword:"qq123456"
  }).then(res=>{
    console.log(res,"res")
  })
}
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
