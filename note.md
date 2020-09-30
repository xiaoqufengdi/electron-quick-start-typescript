
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