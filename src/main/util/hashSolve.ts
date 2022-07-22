import { copyFile, mkdirs } from "./fileUtil";

const exec = require("child_process").exec;
const path = require("path");
const fs = require("fs");
// 生成修改文件列表
const pushChangeFile = (hashGitArr: string[], sourceDir: string | null) => {
  let outputDir = "";

  let getFileInfo = null;
  let setArr = new Set();
  let count = 0;
  let keySize = hashGitArr.length;
  return new Promise((resolve, reject) => {
    console.log(hashGitArr, "日志hash");
    hashGitArr.forEach((hashKey) => {
      let direct = `git show ${hashKey}  --name-only --pretty=format:"%b" -P -1`;
      getFileInfo = exec(direct, {
        cwd: sourceDir,
        timeout: 100000,
        maxBuffer: 2000 * 1024 * 1024 * 1024,
      });
      getFileInfo.stdout.on("data", function (str: string) {
        console.log("解析文件明细", str);
        let result = str.split(/\r?\n/);
        result.forEach((line) => {
          let fileUrl = line.trim();
          if (fileUrl.length > 0) {
            // 保存在全局变量
            let filePath = path.join(sourceDir, fileUrl);
            setArr.add(filePath);
          }
        });
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
// 生成删除文件脚本
const pushDeleteFile = (
  hashGitArr: string[],
  sourceDir: string | null,
  outputPath: string | null
) => {
  let getFileInfo = null;
  let setArr = new Set();
  let count = 0;
  let keySize = hashGitArr.length;
  return new Promise((resolve, reject) => {
    console.log(hashGitArr, "日志hash");
    hashGitArr.forEach((hashKey) => {
      let direct = `git show ${hashKey}  --name-status --pretty=format:"%b" -P -1`;
      getFileInfo = exec(direct, {
        cwd: sourceDir,
        timeout: 100000,
        maxBuffer: 2000 * 1024 * 1024 * 1024,
      });
      getFileInfo.stdout.on("data", function (str: string) {
        let result = str.split(/\r?\n/);
        result.forEach((line) => {
          let fileUrl = line.trim();
          if (fileUrl.length > 0) {
            // 保存在全局变量
            let content = fileUrl.replace("\t", " ").split(" ");
            if (content[0] == "D") {
              let filePath = path.join(outputPath, content[content.length - 1]);
              setArr.add(filePath);
            }
          }
        });
      });
      getFileInfo.stderr.on("data", function (data: string) {
        console.log("解析文件失败", data);
      });

      getFileInfo.on("close", function (code: number) {
        if (code == 0) {
          //执行结束
          count++;
          if (count == keySize) {
            console.log(setArr, "删除列表");
            // 生成脚本
            createDeleteShell(setArr as Set<string>, outputPath);
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
const createDeleteShell = (list: Set<string>, outputPath: string | null) => {
  list?.forEach((item: string) => {
    let direct = "del /f /s /Q " + item + "\r\n";
    let target = path.join(outputPath, "deleteFile.bat");
    fs.writeFile(
      target,
      direct,
      {
        encoding: "utf8",
        flag: "a",
      },
      (err: any) => {
        if (err) throw err;
        console.log("写入文件错误!");
      }
    );

    let direct2 = "rm -rf " + item;
    let target2 = path.join(outputPath, "deleteFile.bash");
    fs.writeFile(
      target2,
      direct2,
      {
        encoding: "utf8",
        flag: "a",
      },
      (err: any) => {
        if (err) throw err;
        console.log("写入文件错误!");
      }
    );
  });
};
// 生成文件
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
export { pushChangeFile, generateFile, pushDeleteFile };
