/*!
 * MyWebsocket v1.0.0 by Mr.Rain🌹
 * (c) 2019-2019 
 * http://git.tianrang-inc.com:city-simulator/canalization.git
 * Released under the MIT License.
 */
import{inflate as t}from"pako";
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */var e,n=function(){return(n=Object.assign||function(t){for(var e,n=1,s=arguments.length;n<s;n++)for(var o in e=arguments[n])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)};function s(t,e,n,s){return new(n||(n=Promise))((function(o,r){function i(t){try{c(s.next(t))}catch(t){r(t)}}function a(t){try{c(s.throw(t))}catch(t){r(t)}}function c(t){t.done?o(t.value):new n((function(e){e(t.value)})).then(i,a)}c((s=s.apply(t,e||[])).next())}))}function o(t,e){var n,s,o,r,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return r={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(r[Symbol.iterator]=function(){return this}),r;function a(r){return function(a){return function(r){if(n)throw new TypeError("Generator is already executing.");for(;i;)try{if(n=1,s&&(o=2&r[0]?s.return:r[0]?s.throw||((o=s.return)&&o.call(s),0):s.next)&&!(o=o.call(s,r[1])).done)return o;switch(s=0,o&&(r=[2&r[0],o.value]),r[0]){case 0:case 1:o=r;break;case 4:return i.label++,{value:r[1],done:!1};case 5:i.label++,s=r[1],r=[0];continue;case 7:r=i.ops.pop(),i.trys.pop();continue;default:if(!(o=(o=i.trys).length>0&&o[o.length-1])&&(6===r[0]||2===r[0])){i=0;continue}if(3===r[0]&&(!o||r[1]>o[0]&&r[1]<o[3])){i.label=r[1];break}if(6===r[0]&&i.label<o[1]){i.label=o[1],o=r;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(r);break}o[2]&&i.ops.pop(),i.trys.pop();continue}r=e.call(t,i)}catch(t){r=[6,t],s=0}finally{n=o=0}if(5&r[0])throw r[1];return{value:r[0]?r[1]:void 0,done:!0}}([r,a])}}}!function(t){t[t["未连接"]=0]="未连接",t[t["连接中"]=1]="连接中",t[t["已连接"]=2]="已连接",t[t["断线"]=3]="断线",t[t["废弃"]=4]="废弃"}(e||(e={}));var r={protocol:"ws",url:"",host:document.location.host,isOpen:!0,reconnectNum:5},i=function(){function i(i){var a=this;this.status=e.未连接,this.reconnectNum=0,this.messageList={},this.registerList={},this.unSentList=[],this.open=function(){return s(a,void 0,void 0,(function(){return o(this,(function(t){switch(t.label){case 0:return[4,this.init()];case 1:return t.sent(),[2]}}))}))},this.removeMessage=function(t){"string"!=typeof t?t.forEach((function(t){return delete a.messageList[t]})):delete a.messageList[t]},this.removeMessageFunc=function(t,e){for(var n=a.messageList[t],s=n.length,o=0;o<s;o++)if(n[o]===e){n.splice(o,1);break}},this.init=function(){if(a.status!==e.连接中&&a.status!==e.废弃)return new Promise((function(t,n){a.status=e.连接中;var s=new WebSocket(a.opt.protocol+"://"+a.opt.host+a.opt.url);s.onopen=function(){a.onOpen(),t&&t()},s.onmessage=a.dealMessage,s.onclose=function(){clearTimeout(a.timer),console.log("WebSocketClosed!"),a.status=e.断线,a.reconnect()},s.onerror=function(){console.log("WebSocketError!"),console.log(a.name+"通讯失败!!!"),a.status=e.断线,a.reconnect(),n&&n()},a.ws=s}))},this.onOpen=function(){for(var t in console.log("websocket 已连接",a.name),a.status=e.已连接,a.registerList)a.registerList.hasOwnProperty(t)&&a.send(t,a.registerList[t]);for(var n=0,s=a.unSentList;n<s.length;n++){var o=s[n],r=(t=o.type,o.data);a.send(t,r)}a.unSentList=[]},this.dealMessage=function(t){return s(a,void 0,void 0,(function(){var e,n,s,r,i,a,c;return o(this,(function(o){switch(o.label){case 0:return t.data instanceof Blob?[4,this.dealUint8Array(t.data)]:[3,2];case 1:return e=o.sent(),[3,3];case 2:e=t.data,o.label=3;case 3:if(!e)return[2];try{n=JSON.parse(e),s=n.type,r=n.data,i=n.timestamp,a=this.messageList[s||"default"],c=new Date(i),a?a.forEach((function(t){return t(r,c)})):console.log(this.messageList,s,"无法处理此类消息")}catch(t){console.log(t)}return[2]}}))}))},this.dealUint8Array=function(e){return new Promise((function(n){var s=new FileReader;s.readAsArrayBuffer(e),s.onload=function(e){if(e.target.readyState===FileReader.DONE){var o=t(s.result),r=String.fromCharCode.apply(null,new Uint16Array(o));n(decodeURIComponent(r))}}}))},this.opt=n({},r,i),this.name=this.opt.url,this.reconnectNum=this.opt.reconnectNum,this.opt.isOpen&&this.open()}return i.prototype.send=function(t,s,o){if(void 0===o&&(o={}),this.status!==e.已连接)return this.open(),void this.unSentList.push({type:t,data:s});this.ws.send(JSON.stringify(n({type:t,data:s},o)))},i.prototype.message=function(t,e){void 0===t&&(t="default"),this.messageList.hasOwnProperty(t)||(this.messageList[t]=[]),this.messageList[t].push(e)},i.prototype.register=function(t,n,s){void 0===s&&(s={}),this.registerList[t]=n,this.status===e.已连接?this.send(t,n,s):this.open()},i.prototype.removeRegister=function(t){var e=this;"string"!=typeof t?t.forEach((function(t){return delete e.registerList[t]})):delete this.registerList[t]},i.prototype.close=function(){this.messageList={},this.registerList={},this.ws.close()},i.prototype.console=function(t,e,n){var s=this.messageList[t],o=new Date(e);s?s.forEach((function(t){return t(n,o)})):console.log("无法处理此类消息")},i.prototype.reconnect=function(){var t=this;if(this.status!==e.连接中){if(0===this.reconnectNum)return this.status=e.废弃,console.log(this.name+"已断线!!!请刷新"),void alert("与服务器失去链接，请刷新");this.reconnectNum--,console.log(this.name+"5s后开始第"+this.reconnectNum+"次重连"),this.timer=window.setTimeout((function(){t.open()}),5e3)}},i}();export default i;
//# sourceMappingURL=index.es.js.map
