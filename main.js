//kütüphane istekleri
const electron = require('electron')
const url = require('url')
const path = require('path')
const { BrowserWindow, protocol, Menu, ipcMain } = require('electron');
const { kill } = require('process');

//app = electron.App
const { app } = electron


//mainWindow tanım
let mainWindow;

//uygulama hazır olduğunda () =>
//                         fonksiyonu çalıştır
app.on('ready', () => {

    //mainWindows değer atama
    mainWindow = new BrowserWindow({
        //pencere özellikleri tanımlanabilir
        
        //node entegrasyonu - main.html dosyasında gerekli özellikleri kullanmak için
        webPreferences: {
            nodeIntegration: true
        }

    });

    

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "main.html"), 
            protocol: "file",
            slashes: true 
        })
    )

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate); //menü oluştur
    Menu.setApplicationMenu(mainMenu); //oluşturulan menüyü uygulama menüsü olarak seç


    //main.html dosyasından gelen veriyi konsola yazdırıyoruz
    ipcMain.on('key', (err, data) =>{
        //main.html dosyasından gelen veriyi konsola yaz
        console.log(data);
    })

    //main.html dosyasından gelen inputValue verisini konsola yazdırıyoruz
    ipcMain.on('key:inputValue', (err, data) =>{
        //main.html dosyasından gelen input değerini konsola yaz
        console.log(data);
    })

    //yeni pencere isteği
    ipcMain.on('key:newWindowRequest', ()=>{
        //createNewWindow isimli fonksiyonu çalıştır
        createNewWindow();
    })

    //mainWindow kapanma isteği aldığında uygulamadan çıkış yap
    mainWindow.on('close', ()=>{
        //uygulamadan çıkış yap
        app.quit();
    })

})

//menü, label: başlıklar, submenu: altmenü oluşturur, menüler dizi olmak zorunda mainMenuTemplate adında boş bir dizi tanımlıyoruz
const mainMenuTemplate = [
    {
        label: "Dosya",
        submenu: [
            {
                label: "Yeni görev ekle"
            },
            {
                label: "Görev sil"
            },
            {
                label: "Çıkış",
                role: "quit"
            }
        ]
    }
];

//işletim sistemi kontrolü
if (process.platform == "darwin") {
    mainMenuTemplate.unshift({
        label: app.getName(),
        role: "todo"
    })
}

//uygulama ürün kontrolü
if (process.env.NODE__ENV !== "production") {
    mainMenuTemplate.push(
        {
            label: "Araçlar",
            submenu: [
                {
                    label: "Geliştirici Araçları",
                    click(item, focusedWindow) {
                        focusedWindow.toggleDevTools();
                    }
                },
                {
                    label: "Yenile",
                    role: "reload"
                }
            ]
        }
    )
}

//yeni pencere oluşturmak için fonksiyon
function createNewWindow() {

    //addWindow özelliklerini tanımlıyoruz
    addWindow = new BrowserWindow({
        width: 482,
        height: 200,
        tittle: 'yeni pencere'
    });

    //addWindow özelliklerini tanımlıyoruz
    addWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "newWindow.html"),
            protocol: "file",
            slashes: true
        })
    );

    //addWindow kapanma isteği aldığında addWindow değerini boş değere eşitle
    addWindow.on('close', ()=>{
        addWindow = null
    })
}

