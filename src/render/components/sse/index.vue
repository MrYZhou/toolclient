<script setup lang="ts">
let id = 666
let ws = new WebSocket("ws://192.168.20.43:3003/websocket");
//监听是否连接成功
ws.onopen = function () {
  console.log("ws连接状态：" + ws.readyState);
  //连接成功则发送一个数据
  ws.send("test1");
};
// 接听服务器发回的信息并处理展示
ws.onmessage = function (data) {
  console.log("接收到来自服务器的消息：");
  console.log(data);
  //完成通信后关闭WebSocket连接
  ws.close();
};
// 监听连接关闭事件
ws.onclose = function () {
  // 监听整个过程中websocket的状态
  console.log("ws连接状态：" + ws.readyState);
};
// 监听并处理error事件
ws.onerror = function (error) {
  console.log(error);
};
</script>

<template>websocket</template>

<style scoped></style>
