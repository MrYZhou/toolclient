import { pushChangeFile } from "./hashSolve";

const exec = require('child_process').exec;


interface Model{  
  basePath: string | null;
  outputPath: string | null;
  author: string | null;
  startDate:number | string;
  endDate:number | string;
}

const gitLog = (model:Model)=>{
  let sourceDir = model.basePath
 //C:\\Users\\lg\\Desktop\\toolbox
  let author = model.author

  let outputDir = ""

  let startDate = model.startDate
  let endDate = model.endDate

  console.log(model)
  let direct = ''
  if(author){
     direct = `cd ${sourceDir} && git log --author=${author}`
  }else{
     direct = `cd ${sourceDir} && git log`
  }

  if(startDate){
    direct += ` --after="${startDate}"`
  }
  if(endDate){
    direct += ` --before="${endDate}"`
  }
  return  new Promise((resolve, reject)=>{
    const child = exec(direct)
    
    let keyList: string[] = []
    child.stdout.on('data', function(data: string ) {
      const lines = data.split(/\r?\n/);
      
      lines.forEach((line: string)=>{
        if(line.includes('commit')){
          let hashKey = line.split(' ')[1]
          
          if(hashKey != ''){
            keyList.push(hashKey)
          }
          
        }
      })
    })
    child.stderr.on('data', function(data: string ) {
      console.log('stderr: ' + data)

    })
    child.on('close', async (code: number ) => {
      if(code == 0){
        //执行结束
        if(keyList.length>0){
          let result = await pushChangeFile(keyList,sourceDir)
          resolve(result)
        }else{
          resolve([])
        }
        
        
        
      }else{
        console.log('Error');
      }
    })
  })
}

export{ gitLog}