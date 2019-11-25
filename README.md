# MyWebSocket

基于浏览器 Websocket 扩展

增加功能:

- 断线重连，并重发注册消息
- 二进制流消息自动`gzip`解压
- 单消息可绑定多个处理函数

依赖引用方式：
`yarn add git+http://my-websocket:drxgxutdRXXw6xT4XsGw@git.tianrang-inc.com:TR-FRONT/MyWebsocket.git#master`

## ws 消息格式

```js
// sendMsg
{
  type: string // 标记消息类型
  data: any // 订阅信息
}

// receiveMsg
{
  type: string // 标记消息类型
  timestamp: Date // 消息时间戳
  data: any // 消息数据
}
```

## 使用项目

- 「智能匝道控制系统」
- 「交通运营系统」
- 「2050 项目-Game」

## 如何使用

### 配置

- isOpen 新建 ws 实例后是否连接 ws
- reconnectNum 重连次数(默认:生产环境 5 次，开发环境 0 次)

### 新建实例

```js
const ws = new MyWebSocket('/app/game/ws', {
  isOpen: false,
})
```

### 发送信息

注册信息：断线重现后需重发

```js
ws.register(WS_GAME_INIT, {
  playerid: global.User.id,
  gameid: gameId,
})
```

普通信息

```js
ws.send(WS_USER_PHASE, {
  id,
  //...
})
```

### 绑定消息处理函数

```js
const dealMsg = data => {
  //...
}
ws.message(WS_USER_PHASE, dealMsg)
```

### 解绑消息处理函数

```js
ws.removeMessage(WS_USER_PHASE)
// 或 解绑多个
ws.removeMessage([WS_USER_PHASE,...])
// 或 指定函数
ws.removeMessageFunc([WS_USER_PHASE,dealMsg)
```

### 删除注册消息

```js
ws.removeRegister(WS_GAME_INIT)
// 或 删除多个
ws.removeRegister([WS_GAME_INIT,...])
```
