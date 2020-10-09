
## 打包及更新配置

+ npm install electron-updater --save
+ npm install electron-builder -D
+ package.json
```angular2
  "build": {
    "appId": "myElectron",
    "mac": {
      "target": ["dmg", "zip"]
    },
    "win": {
      "target": ["nsis", "zip"]
    }
  },
```
    "files": [
      "./index.html",
      "./src/main.ts",
            {
              "from": "dist/main.js",
              "to": "./main.js"
            },
      "./package.json",
      "dist/electron/**/*"
    ],
    
        "module": "commonjs",
        
查看文件
asar list app.asar
解压文件
asar extract app.asar ./myapp