const fs = require("fs");
const path = require("path");

let sourceDir = "",
  targetDir = "";

// 复制文件夹
let copyFolder = (srcDir: string, tarDir: string, cb?: Function) => {
  let isExit = fs.existsSync(tarDir);
  if (!isExit) {
    fs.mkdirSync(tarDir, 777);
  }
  //readdir只能读取基于这个sourceDir下的那一级文件和文件夹
  fs.readdir(srcDir, function (err: any, files: any[]) {
    if (err) {
      return;
    }
    files.forEach((file) => {
      let srcPath = path.join(srcDir, file);
      let tarPath = path.join(tarDir, file);

      fs.stat(srcPath, (err: any, stats: { isDirectory: () => any }) => {
        if (stats.isDirectory()) {
          fs.existsSync(tarPath)
            ? copyFolder(srcPath, tarPath)
            : fs.mkdirSync(tarPath, 777) && copyFolder(srcPath, tarPath);
        } else {
          copyFile(srcPath, tarPath);
        }
      });
    });

    //为空时直接回调
    files.length === 0 && cb && cb();
  });
};
// 复制文件,前提是文件夹存在
let copyFile = function (
  srcPath: any,
  tarPath: any,
  cb?: ((arg0: any) => any) | undefined
) {
  let rs = fs.createReadStream(srcPath);
  rs.on("error", function (err: any) {
    if (err) {
      console.log("read error", srcPath);
    }
    cb && cb(err);
  });

  let ws = fs.createWriteStream(tarPath);
  ws.on("error", function (err: any) {
    if (err) {
      console.log("write error", tarPath);
    }
    cb && cb(err);
  });
  ws.on("close", function (ex: any) {
    cb && cb(ex);
  });

  rs.pipe(ws);
};

// 初始化文件夹,某个文件路径中间文件夹不存在就生成,只用于文件
// 也可以理解创建上一级的目录
// C:\Users\JNPF\Desktop\temp\src\main\main.ts
let mkdirs = (tarDir: string) => {
  return new Promise((resolve, reject) => {
    // console.log(tarDir, "create");
    let dir = path.resolve(tarDir, "../");
    if (tarDir && !fs.existsSync(dir)) {
      mkdirs(dir);
      fs.mkdirSync(dir, 777);
    }
    resolve(1);
  });
};

export { copyFolder, copyFile, mkdirs };
