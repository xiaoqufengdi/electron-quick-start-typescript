//1、注册、安装、激活、使用


//注册
function register():void {
    if ('serviceWorker' in navigator &&  navigator.onLine) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(reg) {
                // registration worked
                console.log('Registration succeeded. Scope is ' + reg.scope);
            }).catch(function(error) {
            // registration failed
            console.log('Registration failed with ' + error);
        });
    }
}


const CACHE_KEY: string = 'demo';


const CACHE_FILES: Array<string> = [
    '/index.html',
    "./dist/main.js",
    "./dist/preload.js",
    "./dist/renderer.js",
    "./dist/static/images/1.jpeg",
    "http://127.0.0.1:8080/2.jpeg",
    "http://127.0.0.1:8080/news.html"
];

//判断请求是否成功
const isValidResponse = function(response: any) {
    return response && response.status >= 200 && response.status < 400;
};

self.addEventListener('install', function(event: any) { // 监听worker的install事件
    console.log("install success");
    event.waitUntil( // 延迟install事件直至Cache初始化完成
        caches.open(CACHE_KEY)
            .then(function(cache) {
                console.log('Cache created');
                return cache.addAll(CACHE_FILES);
            })
    );
});

self.addEventListener('activate', function(event: any) { // 监听worker的activate事件
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

self.addEventListener('fetch', function(event: any) { // 拦截资源请求
    console.log("fetch");
    console.log(event);
    event.respondWith( // 返回资源请求
        caches.match(event.request).then(function(res) { // 判断是否命中缓存
            if (res)
            {  // 返回缓存的资源   同时也发出真实的请求以便下次更新
                /*const url = event.request.clone();
                fetch(url).then(function (res) {
                    if (isValidResponse(res)) {
                        caches.open(CACHE_KEY).then(function (cache) {
                            const response = res.clone();
                            cache.put(event.request, response);
                        })
                    }
                })*/

                return res;
            }
            fallback(event); // 执行请求备份操作
        })
    )
});

function fallback(event : any) {  // 恢复原始请求
    const url = event.request.clone();
    return fetch(url).then(function(res) { // 请求资源
        //if not a valid response send the error
        if (!res || res.status !== 200 || res.type !== 'basic') {
            return res;
        }

        const response = res.clone();
        caches.open(CACHE_KEY).then(function(cache)
        { // 缓存从刚刚下载的资源   缓存请求和请求结果
            cache.put(event.request, response);
        });

        return res;
    })
}


export default register;
// module.exports = {register};