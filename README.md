## 用到api

[worker](https://www.ruanyifeng.com/blog/2018/07/web-worker.html)  
[offscreenCanvas介绍](https://developer.mozilla.org/zh-CN/docs/Web/API/OffscreenCanvas)  
[offscreenCanvas详细](https://yrq110.me/post/front-end/offscreen-canvas-practice/)  

## 优化前后对比
* 采用canvas离屏渲染加上worker计算
* offscreenCanvas是实验性的api（2023-10-10），因为worker里面操作不了dom，所以还可以把计算量大的部分移到worker中，canvas部分还在普通js中处理。随着时间推移offscreenCanvas肯定会正式发布

> index目录是优化前代码  

![fe99365dff5ee4eebdf8f203ce67131.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8e1ea73ec9b43b68b246378320d1ccd~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1880&h=901&s=363395&e=png&b=000035)  

> index-optimize目录是优化后代码


![a2f930d2678e980f8fbcb96c1d1c74e.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/acfc75b5b40644ef8e9e5c6e5f9167f6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1851&h=881&s=426014&e=png&b=000036)  

## 源码地址

[github源码对比](https://github.com/yrmatou/canvas-snow)  