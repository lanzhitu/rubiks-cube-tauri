// Tauri 主进程自动启动 Python FastAPI 服务示例
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .setup(|_app| {
            // 自动启动 Python 服务，并输出启动结果
            let result = Command::new("python")
                .arg("src-tauri/python_service/app.py")
                .spawn();
            match result {
                Ok(_) => println!("Python service started."),
                Err(e) => println!("Failed to start Python service: {:?}", e),
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
