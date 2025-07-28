# 魔方 Tauri 应用

这是一个使用 Tauri 构建的魔方应用，前端采用 React/TypeScript，后端采用 Python FastAPI。

## 使用技术栈

- **前端**: React, TypeScript, Vite
- **后端**: Python, FastAPI, Uvicorn
- **桌面框架**: Tauri

## 设置与安装

1.  **克隆仓库**:

    ```bash
    git clone https://github.com/your-username/rubiks-cube-tauri.git
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