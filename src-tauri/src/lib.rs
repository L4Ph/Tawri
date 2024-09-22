use tauri::{
    menu::{MenuBuilder, MenuItemBuilder, SubmenuBuilder},
    Emitter, Manager,
};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            let open_file = MenuItemBuilder::with_id("open_file", "開く").build(app)?;
            let save_file = MenuItemBuilder::with_id("save_file", "保存").build(app)?;
            let save_as = MenuItemBuilder::with_id("save_as", "名前を付けて保存").build(app)?;
            let file_menu = SubmenuBuilder::with_id(app, "file_menu", "ファイル")
                .items(&[&open_file, &save_file, &save_as])
                .build()?;
            let menu = MenuBuilder::new(app).items(&[&file_menu]).build()?;

            app.set_menu(menu.clone())?;
            app.on_menu_event(move |app, event| {
                let window_list = app.webview_windows();
                let window_tuple = window_list.iter().next().unwrap();
                let window = window_tuple.1;
                match event.id().0.as_str() {
                    "open_file" => {
                        let _ = window.emit("open_file", "");
                    }

                    "save_file" => {
                        let _ = window.emit("save_file", "");
                    }

                    "save_as" => {
                        let _ = window.emit("save_as", "");
                    }
                    _ => {}
                }
            });
            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
