import * as pako from 'pako'

/**
 * websocket二次封装，隔离多个ws链接，处理指定消息
 *
 * @class myWebSocket
 */
type MessageFunc = (data: any, time: Date) => void

interface IMessageList {
  [type: string]: MessageFunc[]
}
interface IRegisterList {
  [type: string]: MessageFunc[]
}

type UnSentList = Array<{ type: string; data: any }>

enum WSStatus {
  未连接,
  连接中,
  已连接,
  断线,
  废弃,
}

interface IWsOpt {
  protocol?: 'ws' | 'wss'
  host?: string
  url: string
  isOpen?: boolean // 新建ws实例后是否连接ws
  reconnectNum?: number // 重连次数
  preFunc?: () => void
}
const defaults: IWsOpt = {
  protocol: 'ws',
  url: '',
  host: document.location.host,
  isOpen: true,
  reconnectNum: 5,
}
class MyWebSocket {
  ws: WebSocket

  constructor(opt?: IWsOpt) {
    this.opt = { ...defaults, ...opt }
    this.name = this.opt.url
    this.reconnectNum = this.opt.reconnectNum
    this.opt.isOpen && this.open()
  }

  private opt: IWsOpt // ws配置
  private status = WSStatus.未连接 // ws状态
  private name: string // ws名/ws地址
  private reconnectNum: number = 0 // 重连次数
  private timer: number // 重连定时器
  private messageList: IMessageList = {} // 消息处理函数集
  private registerList: IRegisterList = {} // 注册消息数据集
  private unSentList: UnSentList = [] // 未发送信息列表

  // 连接ws
  open = async () => {
    await this.init()
  }

  // 发送信息
  send(type: string, data?: any, extend = {}) {
    // 未连接，消息暂存未发送列表
    if (this.status !== WSStatus.已连接) {
      this.open()
      this.unSentList.push({ type, data })
      return
    }

    this.ws.send(JSON.stringify({ type, data, ...extend }))
  }

  // 添加指定消息与处理函数
  message(type = 'default', func: MessageFunc) {
    if (!this.messageList.hasOwnProperty(type)) {
      this.messageList[type] = []
    }
    this.messageList[type].push(func)
  }

  // 注册需发送的信息，重连时重新发送
  register(type: string, data: any, extend = {}) {
    this.registerList[type] = data
    if (this.status !== WSStatus.已连接) {
      this.open()
      return
    }
    this.send(type, data, extend)
  }

  // 删除指定信息
  removeMessage = (messages: string | string[]) => {
    // string
    if (typeof messages === 'string') {
      delete this.messageList[messages]
      return
    }

    // array
    messages.forEach(message => delete this.messageList[message])
  }

  // 删除指定信息的func
  removeMessageFunc = (message: string, func: MessageFunc) => {
    const funcList = this.messageList[message]
    const len = funcList.length
    for (let i = 0; i < len; i++) {
      if (funcList[i] === func) {
        funcList.splice(i, 1)
        break
      }
    }
  }

  // 删除注册事件
  removeRegister(registers: string | string[]) {
    // string
    if (typeof registers === 'string') {
      delete this.registerList[registers]
      return
    }

    // array
    registers.forEach(register => delete this.registerList[register])
  }

  close() {
    this.messageList = {}
    this.registerList = {}
    this.ws.close()
    // delete this.ws;
  }

  // 测试使用 console触发ws message
  console(type: string, timestamp: string, data: any) {
    const funcList = this.messageList[type]
    const time = new Date(timestamp)
    if (funcList) {
      funcList.forEach(func => func(data, time))
    } else {
      console.log('无法处理此类消息')
    }
  }

  // 初始化ws，绑定事件
  private init = () => {
    if (this.status === WSStatus.连接中 || this.status === WSStatus.废弃) {
      return
    }

    return new Promise((resolve, reject) => {
      this.status = WSStatus.连接中
      const ws: WebSocket = new WebSocket(
        `${this.opt.protocol}://${this.opt.host}${this.opt.url}`
      )

      ws.onopen = () => {
        this.onOpen()
        resolve && resolve()
      }

      ws.onmessage = this.dealMessage

      ws.onclose = () => {
        clearTimeout(this.timer)
        console.log('WebSocketClosed!')
        this.status = WSStatus.断线
        this.reconnect()
      }

      ws.onerror = () => {
        console.log('WebSocketError!')
        console.log(`${this.name}通讯失败!!!`)
        this.status = WSStatus.断线
        this.reconnect()
        reject && reject()
      }

      this.ws = ws
    })
  }

  // 连接成功回调函数
  private onOpen = () => {
    console.log('websocket 已连接', this.name)
    this.status = WSStatus.已连接
    // 注册相关信息
    for (const type in this.registerList) {
      if (this.registerList.hasOwnProperty(type)) {
        this.send(type, this.registerList[type])
      }
    }
    // 发送暂存列表数据
    for (const msg of this.unSentList) {
      const { type, data } = msg
      this.send(type, data)
    }

    // 清空未发送列表
    this.unSentList = []
  }

  // 重连
  private reconnect() {
    if (this.status === WSStatus.连接中) {
      return
    }

    if (this.reconnectNum === 0) {
      this.status = WSStatus.废弃
      console.log(`${this.name}已断线!!!请刷新`)
      alert('与服务器失去链接，请刷新')
      return
    }

    this.reconnectNum--
    console.log(this.name + '5s后开始第' + this.reconnectNum + '次重连')
    this.timer = window.setTimeout(() => {
      this.open()
    }, 5000)
  }

  // 处理message
  private dealMessage = async (evt: MessageEvent) => {
    let wsData

    if (evt.data instanceof Blob) {
      wsData = await this.dealUint8Array(evt.data)
    } else {
      wsData = evt.data
    }

    if (!wsData) {
      return
    }

    try {
      const { type, data, timestamp } = JSON.parse(wsData)
      const funcList = this.messageList[type || 'default']
      const time = new Date(timestamp)

      if (funcList) {
        funcList.forEach(func => func(data, time))
      } else {
        console.log(this.messageList, type, '无法处理此类消息')
      }
    } catch (e) {
      console.log(e)
    }
  }

  // 处理二进制文件流
  private dealUint8Array = (blob: Blob) =>
    new Promise(resolve => {
      const reader: FileReader = new FileReader()
      reader.readAsArrayBuffer(blob) // 将blob对象数据转化成ArrayBuffer类数组
      reader.onload = (e: any) => {
        if (e.target.readyState === FileReader.DONE) {
          // @ts-ignore
          const d = pako.inflate(reader.result) // 使用pako.js将ArrayBuffer类数组转化成Uint8Array
          const r = String.fromCharCode.apply(null, new Uint16Array(d)) // 转化成JSON字符串
          resolve(decodeURIComponent(r))
        }
      }
    })
}

export default MyWebSocket
