
# Rubik's Cube Tauri App


这是一个开源的魔方桌面应用，前端采用 React/TypeScript，后端采用 Python FastAPI，桌面框架为 Tauri。

后端依赖第三方开源魔方核心库：[magiccube](https://github.com/trincaog/magiccube)

代码库地址：[https://github.com/lanzhitu/rubiks-cube-tauri](https://github.com/lanzhitu/rubiks-cube-tauri)

欢迎 Star、Fork、Issue、PR 参与共建！


## 主要依赖

- [magiccube](https://github.com/trincaog/magiccube)：后端魔方核心算法库（第三方开源项目）

## 使用技术栈

- **前端**: React, TypeScript, Vite
- **后端**: Python, FastAPI, Uvicorn
- **桌面框架**: Tauri

## 设置与安装

1.  **克隆仓库**:

    ```bash
    git clone https://github.com/lanzhitu/rubiks-cube-tauri.git
    cd rubiks-cube-tauri
    ```

2.  **前端设置**:

    进入 `src` 目录并安装依赖:

    ```bash
    cd src
    npm install
    cd ..
    ```

3.  **后端设置**:

    进入 `src-tauri/python_service` 目录，创建并激活 Python 虚拟环境，然后安装依赖:

    ```bash
    cd src-tauri/python_service
    python -m venv .venv
    # 在 Windows 上:
    .venv\Scripts\activate
    # 在 macOS/Linux 上:
    source .venv/bin/activate
    pip install -r requirements.txt
    cd ../..
    ```

## 运行应用

### 开发模式

1.  **启动后端服务 (在新终端中)**:

    ```bash
    cd src-tauri/python_service
    # 在 Windows 上:
    .venv\Scripts\activate
    # 在 macOS/Linux 上:
    source .venv/bin/activate
    uvicorn app:app --host 127.0.0.1 --port 8000
    ```

2.  **启动前端开发服务器 (在另一个新终端中)**:

    ```bash
    cd src
    npm run dev
    ```

3.  **运行 Tauri 应用 (在第三个终端中)**:

    ```bash
    npm run tauri dev
    ```

### 构建生产版本

```bash
npm run tauri build
```

这将为你的操作系统构建桌面应用。可执行文件将位于 `src-tauri/target/release`。

## Windows 下一键部署与打包

1. **后端打包为独立 exe**

   进入 `src-tauri/python_service` 目录，激活虚拟环境并安装依赖：

   ```powershell
   cd src-tauri/python_service
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   pip install pyinstaller
   ```

   用虚拟环境的 Python 打包后端：

   ```powershell
   python -m PyInstaller --onefile app.py --hidden-import=fastapi --hidden-import=uvicorn --hidden-import=magiccube --hidden-import=python_multipart
   ```

   生成的 exe 文件在 `src-tauri/python_service/dist/app.exe`。

2. **移动后端 exe 到 Tauri 资源目录**

   将 `src-tauri/python_service/dist/app.exe` 复制到 `src-tauri/bin/app.exe`。

3. **确认 Tauri 配置**

   在 `src-tauri/tauri.conf.json` 的 `bundle.resources` 字段添加：

   ```json
   "resources": ["bin/app.exe"]
   ```

4. **前端构建**

   在项目根目录运行：

   ```powershell
   npm install
   npm run build
   ```

5. **打包桌面应用**

   在项目根目录运行：

   ```powershell
   npm run tauri build
   ```

   构建完成后，Windows 可执行文件在 `src-tauri/target/release`，后端 exe 会自动包含在应用包内，无需用户单独安装 Python。

---

## 开源贡献说明

本项目已开源，欢迎任何开发者参与：

- 提交 Issue 反馈 bug 或建议
- Fork 后提交 Pull Request
- 代码、文档、测试、UI 优化等均欢迎贡献

如有疑问或合作意向，请在 GitHub Issue 区留言。

**注意事项**
- 后端所有依赖必须在虚拟环境中安装并用虚拟环境的 Python 打包。
- 每次后端代码或依赖变动都需重新打包并复制到 bin 文件夹。
- Tauri 配置必须包含 `bin/app.exe` 资源声明。