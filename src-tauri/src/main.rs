// Tauri 主进程自动启动 Python FastAPI 服务示例
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            // 自动启动 Python 服务
            Command::new("python")
                .arg("src-tauri/python_service/app.py")
                .spawn()
                .expect("Failed to start Python service");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
