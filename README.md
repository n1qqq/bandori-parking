# 邦多利控分计算器



## 远程web ver. (已部署，点开即用)

https://n1qqq.github.io/bandori-parking/



## 本地终端Node.js ver. (轻量级终端小工具)

先克隆仓库到本地

打开终端：
```
Windows：Windows+R，输入cmd，回车
Mac: Command+空格，输入Terminal，回车
Ubuntu, Linux: Alt+Ctrl+T
```

在项目根目录 (`$ bandori-parking/`) 打开命令行，输入

```

npm link

```

进行配置。

以后直接在终端命令行内输入命令即可，路径任意。命令格式示例：

```

bandori-parking --mode 6 --boost 1 --fire 0 --calculate 533 --num 167545

```

更多实例敬请参照`examples/sample-commands.txt`



## 本地唤起web/browser ver. (无网络环境下眼馋网页端ui？看过来)

常规

```

npx http-server .

```

禁用缓存

```

npx http-server . -c-1

```

