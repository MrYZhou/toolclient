import { copyFile, mkdirs } from "./fileUtil";

const exec = require("child_process").exec;
const path = require("path");
const pushChangeFile = (hashGitArr: string[], sourceDir: string | null) => {
  // let sourceDir = "C:\\Users\\lg\\Desktop\\toolbox";
  let outputDir = "";

  // hashGitArr = [
  //   "cf3ccd676e11abf7eb9df27b43f7358cfee2e51f",
  //   "d9a65afd02900c4ff77c07f6677573df9771993b",
  //   "2378e4af378c59dd07f6039f0e50f66f0101c46a",
  // ];
  let getFileInfo = null;
  let setArr = new Set();
  let count = 0;
  let keySize = hashGitArr.length;
  return new Promise((resolve, reject) => {
    hashGitArr.forEach((hashKey) => {
      let direct = `cd ${sourceDir} && git log ${hashKey} --stat`;
      getFileInfo = exec(direct);

      let save = false;
      getFileInfo.stdout.on("data", function (str: string) {
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
          console.log("fail", hashKey);
        }
      });
      getFileInfo.stderr.on("data", function (data: string) {
        console.log("stderr: " + data);
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
          console.log("Error");
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
    fileList.forEach(async (item) => {
      let outputPath = path.join(
        outputDir,
        item.replace(sourceDir as string, "")
      );
      // console.log(outputDir, outputPath, "---");
      await mkdirs(outputPath);
      copyFile(item, outputPath);
    });

    resolve(1);
  });
};
export { pushChangeFile, generateFile };
