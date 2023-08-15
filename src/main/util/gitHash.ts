import { pushChangeFile, generateFile,pushDeleteFile } from "./hashSolve";

import { webContents } from "electron";

const exec = require("child_process").exec;

interface Model {
  basePath: string | null;
  outputPath: string | null;
  author: string | null;
  startDate: number | string;
  endDate: number | string;
  gitlog: string | null;
}

const gitLog = (model: Model) => {
  let sourceDir = model.basePath;
  let author = model.author;

  let outputPath = model.outputPath;

  let startDate = model.startDate;
  let endDate = model.endDate;
  let gitlog = model.gitlog;
  console.log(model, "数据");
  let direct = "";
  if (author) {
    direct = `git log --author=${author}`;
  } else {
    direct = `git log`;
  }

  if (startDate) {
    direct += ` --after="${startDate}"`;
  }
  if (endDate) {
    direct += ` --before="${endDate}"`;
  }
  console.log(direct, "输出命令");
  return new Promise((resolve, reject) => {
    try {
      const child = exec(direct, {
        cwd: sourceDir,
        timeout: 100000,
        maxBuffer: 2000 * 1024 * 1024,
      });

      let keyList: string[] = [];
      child.stdout.on("data", function (data: string) {
        console.log("数据解析");
        const lines = data.split(/\r?\n/);
        lines.forEach((line: string) => {
          if (line.includes("commit")) {
            let hashKey = line.split(" ")[1];

            if (hashKey != "") {
              keyList.push(hashKey);
            }
          }
        });
      });
      child.stderr.on("data", function (data: string) {
        console.log("执行错误: " + data);
      });
      child.on("close", async (code: number) => {
        console.log(keyList, "数据列表");
        if (code == 0) {
          //执行结束
          if (keyList.length > 0) {
            let result = (await pushChangeFile(keyList, sourceDir)) as string[];
            
            let deleteArr = []  as any
            // 判断是否输出修改记录副本
            if (outputPath) {

              // 生成删除文件脚本
              deleteArr = await pushDeleteFile(keyList, sourceDir,outputPath) as string[]

              generateFile(result, sourceDir, outputPath)
                .then((res) => {
                  
                  webContents?.getFocusedWebContents()
                  ?.send("handleGitFileComplete", 1);
                   
                })
                .catch((e) => {
                  webContents?.getFocusedWebContents()
                  ?.send("handleGitFileComplete", 2);
                });
            }
            let data ={
              list:result,
              deletelist:deleteArr
            }
            resolve(data);
          } else {
            resolve([]);
          }
        } else {
          resolve([]);
          console.log("Error");
        }
      });
    } catch (error) {
      console.log(error, "错误");
    }
  });
};

export { gitLog };
