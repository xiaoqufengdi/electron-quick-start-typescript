

//1、注册、安装、激活、使用
//注册


const CACHE_KEY = 'demo';
const CACHE_FILES = [
/*    'index.html',
    "dist/main.js",
    "dist/preload.js",
    "dist/renderer.js",
    "dist/static/images/1.jpeg",*/
    "http://127.0.0.1:8080/2.jpeg",
    "http://127.0.0.1:8080/news.html"
];

//判断请求是否成功
const isValidResponse = function(response) {
    return response && response.status >= 200 && response.status < 400;
};

self.addEventListener('install', function(event) { // 监听worker的install事件
    console.log("install");
    event.waitUntil( // 延迟install事件直至Cache初始化完成
        caches.open(CACHE_KEY)
            .then(function(cache) {
                console.log('Cache created');
                debugger;
                return cache.addAll(CACHE_FILES);
            })
    );
});

self.addEventListener('activate', function(event) { // 监听worker的activate事件
    console.log("activate");
    event.waitUntil( // 延迟activate事件直到Cache初始化完成
        caches.keys().then(function(keys) {
            return Promise.all(keys.map(function(key, i) { // 清除旧版本缓存
                if (key !== CACHE_KEY) {
                    return caches.delete(keys[i]);
                }
            }))
        })
    )
});

self.addEventListener('fetch', function(event) { // 拦截资源请求
    console.log("fetch");
    console.log(event.request);
    if (!CACHE_FILES.includes(event.request.url)) {
        return;
    }
    //给跨域请求添加 {mode: 'cors'} 属性来使请求支持跨域
    const request =  new Request(event.request.url, {mode: 'cors'}) ;
    event.respondWith( // 返回资源请求
        caches.match(request).then(function(res) { // 判断是否命中缓存
            if (res)
            {  // 返回缓存的资源   同时也发出真实的请求以便下次更新
                fetch(request).then(function (res) {
                    if (isValidResponse(res)) {
                        const response = res.clone();
                        caches.open(CACHE_KEY).then(function (cache) {
                            cache.put(request, response);
                        })
                    }
                }).catch(function(error){
                    console.log(error);
                }) ;

                return res;
            }
            fallback(request); // 执行请求备份操作
        })
    )
});

function fallback(request) {  // 恢复原始请求
    // const url = event.request.clone();
    console.log(request);
    return fetch(request).then(function(res) { // 请求资源
        //if not a valid response send the error
        if (isValidResponse(res)) {
            const response = res.clone();
            caches.open(CACHE_KEY).then(function(cache)
            { // 缓存从刚刚下载的资源   缓存请求和请求结果
                cache.put(request, response);
            });
        }

        return res;
    }).catch(function (error) {
        console.log(error);
    })
}

