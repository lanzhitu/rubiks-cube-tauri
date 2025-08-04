// Tauri 主进程自动启动 Python FastAPI 服务示例
// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use tauri::Manager;

fn main() {
    println!("Tauri main process started.");
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .setup(|_app| {
            println!("Setup function called.");
            // 自动启动 Python 后端 exe（PyInstaller 打包，放在 bin/app.exe）
            let exe_dir = std::env::current_exe()
                .unwrap()
                .parent()
                .unwrap()
                .to_path_buf();
            let backend_exe = exe_dir.join("bin").join("app.exe");
            let result = Command::new(backend_exe)
                .spawn();
            match result {
                Ok(_) => println!("Python backend exe started."),
                Err(e) => println!("Failed to start Python backend exe: {:?}", e),
            }
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|_app_handle, _event| {
            println!("Tauri event loop running.");
        });
}
