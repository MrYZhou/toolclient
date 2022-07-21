import { copyFile, mkdirs } from "./fileUtil";

const exec = require("child_process").exec;
const path = require("path");
const pushChangeFile = (hashGitArr: string[], sourceDir: string | null) => {
  let outputDir = "";

  let getFileInfo = null;
  let setArr = new Set();
  let count = 0;
  let keySize = hashGitArr.length;
  return new Promise((resolve, reject) => {
    hashGitArr.forEach((hashKey) => {
      let direct = `git log ${hashKey} --stat`;
      getFileInfo = exec(direct, {
        cwd: sourceDir,
        timeout: 100000,
        maxBuffer: 2000 * 1024 * 1024 * 1024,
      });

      let save = false;
      getFileInfo.stdout.on("data", function (str: string) {
        console.log("解析文件明细", str);
        if (save) return;
        let reg = new RegExp(hashKey + "[^]*files changed", "ig");
        let result = str.match(reg);
        save = true;
        if (result) {
          result = result[0].split(/\r?\n/);
          result.forEach((line) => {
            if (line.includes("|")) {
              // 保存在全局变量
              let filePath = path.join(sourceDir, line.split("|")[0].trim());
              if (!filePath.includes("=>")) {
                setArr.add(filePath);
              }
            }
          });
        } else {
          console.log("无匹配", hashKey);
        }
      });
      getFileInfo.stderr.on("data", function (data: string) {
        console.log("解析文件失败", data);
      });

      getFileInfo.on("close", function (code: number) {
        if (code == 0) {
          //执行结束
          count++;
          if (count == keySize) {
            console.log(setArr);
            resolve(setArr);
          }
        } else {
          resolve([]);
          console.log("执行失败:Error");
        }
      });
    });
  });
};
const generateFile = (
  fileList: string[],
  sourceDir: string | null,
  outputDir: string | null
) => {
  return new Promise((resolve, reject) => {
    try {
      fileList.forEach(async (item) => {
        let pathUrl = item.replace(sourceDir as string, "") as string;
        let outputPath = "";
        outputPath = path.join(outputDir, pathUrl);
        if (pathUrl.includes("\\")) {
          await mkdirs(outputPath);
        }
        copyFile(item, outputPath);
      });

      resolve(1);
    } catch (error) {
      reject(1);
    }
  });
};
export { pushChangeFile, generateFile };
