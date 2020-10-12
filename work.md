#electron (最新稳定版)
##离线检测
+ 要求
    + 检测当前电脑是否连网
    + 监听网络状态的变化

+ 实现思路
    + window.navigator.onLine 属性值去判断是否联网
    + offline/online 事件去监听网络的状态变化
    + 针对window.navigator.onLine === true 时不准以及不支持的浏览器的兼容处理，比如请求一个接口成功则为在线，否则为离线


##在线更新
+ 要求
    + 每次打开软件在连网情况下能检测到线上是否有新版本
    + 可选择是否更新
+ 实现思路
    + electron-builder 打包方案
    >electron-builder有比electron-packager更丰富的功能、支持macOS\Windows\Linux、并且支持在线自动更新功能
    + electron-updater 在线自动更新
    >支持平台macOS/Windows/Linux
    + 服务器地址特定目录存放新包
    + 真实项目中新增一个接口用于提供版本号及版本更新信息


##离线存储
+ 要求
    + 应用第一次正常加载后，以后在弱网或者离线情况下可用
+ 实现思路
    + 资源文件 Server Worker Cache API 
    + 数据缓存 IndexDB(Dexie)


### Server Worker Cache API

+ 静态资源会默认缓存下来（除非主动清除缓存）
+ Server Worker 浏览器支持（https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API）
>Chrome\Firefox支持，Opera部分支持，IE/Safari基本不支持
+ 


##月例会每个月1号