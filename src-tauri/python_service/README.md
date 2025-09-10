# Rubik's Cube Python Backend

本目录为 Rubik's Cube 桌面应用的 Python 后端服务，基于 FastAPI 实现。

## 功能简介
- 提供魔方状态同步、旋转、重置、打乱、解法等接口
- 依赖第三方魔方核心库 [magiccube](https://github.com/trincaog/magiccube)
- 支持独立运行与 Tauri 桌面集成

## 依赖安装
建议使用虚拟环境：

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate
pip install -r requirements.txt
```

## 启动开发服务
```bash
uvicorn app:app --host 127.0.0.1 --port 8000
```

## 打包为独立 exe
```bash
pip install pyinstaller
python -m PyInstaller --onefile app.py --name rubiks_cube_backend --hidden-import=fastapi --hidden-import=uvicorn --hidden-import=magiccube --hidden-import=python_multipart
```

生成的 exe 文件在 `dist/rubiks_cube_backend.exe`，需复制到 Tauri 资源目录 `src-tauri/bin/`。

## API 接口说明
- `GET /cube/state` 获取当前魔方状态
- `POST /cube/rotate` 单步旋转
- `POST /cube/rotate_many` 批量旋转
- `POST /cube/set_state` 设置魔方状态
- `GET /cube/is_solved` 判断是否已解
- `GET /cube/solve` 获取解法
- `POST /cube/reset` 重置魔方
- `POST /cube/scramble` 打乱魔方

## 贡献与反馈
如有 bug、建议或合作意向，请在主仓库 [https://github.com/lanzhitu/rubiks-cube-tauri](https://github.com/lanzhitu/rubiks-cube-tauri) 提 Issue 或 PR。

## License
MIT
