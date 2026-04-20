# GitHub Actions CI / Release 设计

## 1. 目标

为当前仓库补齐两层自动化流程：

- `CI`：在日常开发和 PR 阶段自动执行基础校验
- `Release`：在推送版本标签时自动打包 Windows 安装产物并发布到 GitHub Release

本设计只覆盖 GitHub Actions 工作流，不改动产品功能范围。

## 2. 已确认范围

### CI

- 工作流文件：`.github/workflows/ci.yml`
- 触发条件：
  - `push` 到 `main`
  - `push` 到 `codex/**`
  - `pull_request` 指向 `main`
- 校验内容：
  - `npm ci`
  - `npm test`
  - `npm run build`
  - `cargo check --manifest-path src-tauri/Cargo.toml`

### Release

- 工作流文件：`.github/workflows/release.yml`
- 触发条件：
  - 推送标签 `v*`，例如 `v0.1.0`
- 发布平台：
  - 仅 `Windows`
- 发布行为：
  - 构建 Tauri Windows 安装包
  - 自动创建 GitHub Release
  - 上传安装包和对应构建产物

## 3. 方案选择

采用“`CI` 与 `Release` 完全独立”的方案，而不是把两类逻辑放进同一个 workflow。

原因：

- 日常校验和正式发布的职责不同
- CI 需要快且容易定位失败点
- Release 涉及打包、产物上传、版本标签与 Release 权限，复杂度更高
- 拆开后更方便后续单独调整平台矩阵、签名或发布策略

## 4. 工作流设计

### 4.1 `ci.yml`

建议拆成两个 job：

- `web`
  - 运行环境：`ubuntu-latest`
  - 安装 Node
  - 执行 `npm ci`
  - 执行 `npm test`
  - 执行 `npm run build`
- `rust`
  - 运行环境：`windows-latest`
  - 安装 Rust toolchain
  - 执行 `cargo check --manifest-path src-tauri/Cargo.toml`

这样可以把前端和宿主检查分开，失败定位更清楚，也便于后续单独扩展。

### 4.2 `release.yml`

建议使用单个 Windows 发布 job：

- 运行环境：`windows-latest`
- 检出代码
- 安装 Node 依赖
- 安装 Rust toolchain
- 执行 Tauri 打包
- 使用 GitHub Token 自动创建或更新标签对应的 GitHub Release
- 上传构建得到的安装包

## 5. 额外收口

为了避免发布产物继续带模板痕迹，实施时一并修正：

- `src-tauri/Cargo.toml` 中的包名、描述、作者
- 必要的 workflow `permissions`
- 若 Tauri 打包工作流依赖额外系统包，按 Windows 发布最小要求补齐

## 6. 验收标准

- 仓库出现 `.github/workflows/ci.yml` 与 `.github/workflows/release.yml`
- 新开 PR 时自动触发 CI
- 推送 `v*` 标签时自动触发 Release workflow
- Release workflow 能产出 Windows 安装包并附加到 GitHub Release

## 7. 风险与约束

- 当前实现优先保证 Windows 打包，不处理多平台矩阵
- 如后续接入代码签名，Release workflow 还需要扩展 secrets 与签名步骤
- GitHub Actions 中的实际打包成功与否仍依赖 Tauri 在 Windows runner 上的环境兼容性
