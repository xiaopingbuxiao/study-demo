<template>
  <div id="app">
    <el-row>
      <el-button type="primary" @click="simpleGet">简单请求get</el-button>
    </el-row>
    <el-row>
      <el-button type="primary" @click="simplePost">简单请求post</el-button>
    </el-row>
    <el-row>
      <el-button type="primary" @click="preflightPost">预检请求post</el-button>
    </el-row>
    <el-row>
      <el-button type="primary" @click="simpleGetWithCookie">携带cookie的get请求</el-button>
    </el-row>
    <el-row>
      <el-button type="primary" @click="simplePostWithCookie">携带cookie的post简单请求</el-button>
    </el-row>
    <el-row>
      <el-button type="primary" @click="preflightPostWithCookie">携带cookie的post预检请求请求</el-button>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "app",
  data() {
    return {
      user: {
        name: "",
        password: ""
      }
    };
  },
  methods: {
    /* 简单请求 */
    simpleGet() {
      axios({
        url: "http://localhost:3000/simple-get",
        method: "get",
        params: { message: "此请求为get请求" }
      }).then(res => {
        console.log(res);
      });
    },
    simplePost() {
      const data = new URLSearchParams();
      data.append("message", "此时是post的简单请求");
      axios({
        url: "http://localhost:3000/simple-post",
        method: "post",
        data: data
      }).then(res => {
        console.log(res);
      });
    },
    preflightPost() {
      const data = {
        message: "此时是一个post的预检请求"
      };
      axios({
        url: "http://localhost:3000/preflight-post",
        method: "post",
        data: data
      }).then(res => {
        console.log(res);
      });
    },
    simpleGetWithCookie() {
      axios({
        url: "http://localhost:3000/simple-with-cookie",
        method: "get",
        params: { message: "此请求为携带cookie的get请求" },
        withCredentials: true
      }).then(res => {
        console.log(res);
      });
    },
    simplePostWithCookie() {
      const data = new URLSearchParams();
      data.append("message", "此时是post的简单请求");
      axios({
        url: "http://localhost:3000/simple-with-cookie",
        method: "post",
        data: data,
        withCredentials: true
      }).then(res => {
        console.log(res);
      });
    },
    preflightPostWithCookie() {
      const data = {
        message: "此时是一个写到cookie的post的预检请求"
      };
      axios({
        url: "http://localhost:3000/preflight-post-with-cookie",
        method: "post",
        data: data,
        withCredentials:true,
        headers:{
          Authorization:Math.random().toString(16).slice(2)
        }
      }).then(res => {
        console.log(res);
      });
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  width: 600px;
}
.el-row {
  margin-bottom: 10px;
}
</style>
