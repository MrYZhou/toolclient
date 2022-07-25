<script setup lang="ts">
// 此处是sse方式的消息
let source = null;
let userId = 77777;
if (window.EventSource) {
  // 建立连接
  source = new EventSource("/api/msg/connect/" + userId);
  console.log("连接用户=" + userId);
  /**
   * 连接一旦建立，就会触发open事件
   * 另一种写法：source.onopen = function (event) {}
   */
  source.addEventListener(
    "open",
    function (e) {
      console.log("建立连接。。。");
    },
    false
  );
  /**
   * 客户端收到服务器发来的数据
   * 另一种写法：source.onmessage = function (event) {}
   */
  source.addEventListener("message", function (e) {
    console.log(e.data, 11);
  });
} else {
  console.log("你的浏览器不支持SSE");
}
</script>
