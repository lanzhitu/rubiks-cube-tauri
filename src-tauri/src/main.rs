// Tauri 主进程自动启动 Python FastAPI 服务示例
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;
use std::os::windows::process::CommandExt;
use std::sync::{Arc, Mutex};

fn main() {
    println!("Tauri main process started.");
    let backend_child = Arc::new(Mutex::new(None));
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .setup({
            let backend_child = backend_child.clone();
            move |_app| {
                println!("Setup function called.");
                let exe_dir = std::env::current_exe()
                    .unwrap()
                    .parent()
                    .unwrap()
                    .to_path_buf();
                let backend_exe = exe_dir.join("bin").join("app.exe");
                let mut cmd = Command::new(backend_exe);
                #[cfg(windows)]
                {
                    cmd.creation_flags(0x08000000);
                }
                match cmd.spawn() {
                    Ok(child) => {
                        *backend_child.lock().unwrap() = Some(child);
                        println!("后端服务已启动 (app.exe，窗口已隐藏)");
                    }
                    Err(e) => println!("后端服务启动失败: {:?}", e),
                }
                Ok(())
            }
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run({
            let backend_child = backend_child.clone();
            move |_app_handle, event| {
                if let tauri::RunEvent::Exit = event {
                    if let Some(mut child) = backend_child.lock().unwrap().take() {
                        let _ = child.kill();
                    }
                }
            }
        });
}
