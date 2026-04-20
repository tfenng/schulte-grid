# 技术造型方案

## 1. 目标与边界

本软件定位为 Windows 桌面本地音频播放器，核心诉求是：

- 安装包体积相对轻量，运行资源占用可控
- 能访问本地文件系统、系统托盘、全局快捷键等桌面能力
- 前端迭代效率高，界面开发成本低
- 原生层可承接文件扫描、元数据解析、单实例控制等系统级逻辑

因此，本项目采用“Web UI + Rust 原生宿主”的桌面应用方案，而不是纯 Web 或 Electron 方案。

## 2. 技术栈选型

### 2.1 桌面宿主

- `Tauri 2`
- `Rust 2021`

选型原因：

- Tauri 通过系统 WebView 承载前端，较 Electron 更轻量
- Rust 适合处理文件系统扫描、音频元数据提取、系统集成与稳定性要求较高的逻辑
- Tauri 2 插件体系已覆盖本项目所需桌面能力

当前已使用的 Tauri 插件：

- `tauri-plugin-dialog`：文件/目录选择与系统消息框
- `tauri-plugin-fs`：本地文件访问
- `tauri-plugin-store`：播放列表与音量等本地持久化
- `tauri-plugin-global-shortcut`：全局快捷键
- `tauri-plugin-single-instance`：单实例运行
- `tauri-plugin-updater`：后续自动更新能力预留

### 2.2 前端界面层

- `React 18`
- `TypeScript 5`
- `Vite 6`

选型原因：

- React 适合快速构建播放器控制区、播放列表、导入交互等状态型界面
- TypeScript 已开启 `strict`，有利于约束播放器状态与 Tauri 命令返回结构
- Vite 启动快，适合桌面应用开发期热更新

前端当前直接使用：

- `HTMLAudioElement` 完成音频播放
- `@tauri-apps/api` 与原生层命令通信
- `@tauri-apps/plugin-dialog` / `plugin-store` 直接完成选择与持久化

## 3. 分层方案

### 3.1 前端负责

- 播放器 UI 与交互状态
- 当前曲目、进度、音量、播放列表展示
- 拖拽导入、文件选择、目录切换
- 对 Rust 命令的调用与结果渲染

目录落点：

- `src/App.tsx`：当前播放器主逻辑
- `src/components/`、`src/hooks/`、`src/stores/`：后续建议承接拆分后的 UI、行为和状态

### 3.2 Rust / Tauri 负责

- 本地文件和目录扫描
- `mp3/ogg` 文件过滤
- 基于 `lofty` 的音频元数据提取
- 系统托盘菜单与事件转发
- 全局快捷键注册
- 单实例控制与重复启动提示
- 应用退出、窗口显示等宿主能力

目录落点：

- `src-tauri/src/main.rs`

## 4. 构建与发布链路

- 前端构建：`tsc && vite build`
- 原生构建：`cargo check` / `tauri build`
- 统一入口：`build.bat`

推荐命令：

- `.\build.bat dev`：启动桌面开发环境
- `.\build.bat check`：执行前端构建校验 + Rust 校验
- `.\build.bat release`：生成 Windows 可执行文件与 NSIS 安装包

当前发布目标明确面向 Windows，安装包方案为 `Tauri Bundle + NSIS`。

## 5. 当前约束与后续演进

当前仅支持 `mp3`、`ogg`，播放能力依赖前端 `HTMLAudioElement`，适合本地播放器场景。若后续要支持 `cda/CD-DA`、更复杂媒体库、后台播放增强或更细粒度的音频能力，可继续保持现有架构，逐步把重逻辑下沉到 Rust 层，前端保持 UI 编排与状态展示职责。
