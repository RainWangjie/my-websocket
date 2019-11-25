import MyWebsocket from '../index'

const ws = new MyWebsocket({
  host: '127.0.0.1:8080',
  url: '',
})

// 绑定onmessage
ws.message('aaa', data => {
  console.log(data)
})

// 发送信息
ws.send('aaa')
