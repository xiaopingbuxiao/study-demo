<template>
  <div id="app">
    <input type="file" @change="handleFileChange" />
    <el-button @click="handleUpload">上传</el-button>
    <el-row v-for="(item,index) in data" :key="index" style="margin:10px">
      <el-col :span="4">{{item.hash}}</el-col>
      <el-col :span="20">
        <el-progress :text-inside="true" :stroke-width="14" :percentage="item.percentage"></el-progress>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { request } from "./utils/request";
const LENGTH = 10; // 切片数量
export default {
  name: "app",
  data() {
    return {
      container: {
        file: null
      },
      data: []
    };
  },
  computed: {
    uploadPercentage() {
      if (!this.container.file || !this.data.length) return 0;
      const loaded = this.data
        .map(item => item.size * item.percentage)
        .reduce((acc, cur) => acc + cur);
      return parseInt((loaded / this.container.file.size).toFixed(2));
    }
  },
  methods: {
    handleFileChange(e) {
      const [file] = e.target.files;
      if (!file) return;
      Object.assign(this.$data, this.$options.data());
      this.container.file = file;
    },
    /* 生成切片 */
    createFileChunk(file, lenght = LENGTH) {
      // [{file:xx},{file:xx}]
      const fileChunkList = [];
      const chunkSize = Math.ceil(file.size / lenght); // 每一个片的大小
      let cur = 0;
      while (cur < file.size) {
        fileChunkList.push({ file: file.slice(cur, cur + chunkSize) });
        cur += chunkSize;
      }
      return fileChunkList;
    },
    /* 上传切片 */
    async uploadChunks() {
      const requestlist = this.data
        .map(({ chunk, hash, index }) => {
          const formData = new FormData();
          formData.append("chunk", chunk);
          formData.append("hash", hash);
          formData.append("filename", this.container.file.name);
          return { formData, index };
        })
        .map(async ({ formData, index }) => {
          request({
            url: "http://localhost:3000",
            method: "post",
            data: formData,
            onProgress: this.createProgressHandler(this.data[index])
          });
        });

      await Promise.all(requestlist);
      /* 通知服务端 此时已经上传完毕了 可以合并了 */
      await this.mergeRequest();
    },
    async handleUpload() {
      if (!this.container.file) return;
      const fileChunkList = this.createFileChunk(this.container.file);
      this.data = fileChunkList.map(({ file }, index) => {
        return {
          chunk: file,
          index: index,
          hash: this.container.file.name + "-" + index,
          percentage: 0
        };
      });
      await this.uploadChunks();
    },
    async mergeRequest() {
      await request({
        url: "http://localhost:3000/merge",
        headers: {
          "content-type": "application/json"
        },
        data: JSON.stringify({
          filename: this.container.file.name
        })
      });
    },
    createProgressHandler(item) {
      return e => {
        item.percentage = parseInt((e.loaded / e.total) * 100);
      };
    }
  }
};
</script>

<style></style>
