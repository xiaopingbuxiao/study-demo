const path = require("path");
const http = require("http");
const multiparty = require("multiparty");
const fsExtra = require("fs-extra");
// const controller = require("./controller");

const server = http.createServer();

const UPLOAD_DIR = path.resolve(__dirname, "..", "target"); //文件存储路径;



const resolvePost = function (req) {
  return new Promise(resolve => {
    let chunk = "";
    req.on("data", data => {
      chunk += data
    })
    req.on("end", () => {
      resolve(JSON.parse(chunk))
    })
  })
}

const mergeFileChunk = async (filePath, filename) => {
  const chunkDir = `${UPLOAD_DIR}/${path.parse(filename).name}`;

  const chunkPaths = await fsExtra.readdir(chunkDir);
  await fsExtra.writeFile(filePath, "");
  chunkPaths.forEach(chunkPath => {
    fsExtra.appendFileSync(filePath, fsExtra.readFileSync(`${chunkDir}/${chunkPath}`));
    fsExtra.unlinkSync(`${chunkDir}/${chunkPath}`);
  });
  fsExtra.rmdirSync(chunkDir); // 合并后删除保存切片的目录
};


server.on("request", async (req, res) => {
  console.log(req.method);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.status = 200;
    res.end();
    return;
  }
  const multipart = new multiparty.Form();
  multipart.parse(req, async (err, fields, files) => {
    if (err) {
      return;
    }
    const [chunk] = files.chunk;
    const [hash] = fields.hash;
    const [filename] = fields.filename;
    const chunkDir = `${UPLOAD_DIR}/${path.parse(filename).name}`;
    if (!fsExtra.existsSync(chunkDir)) {
      await fsExtra.mkdirs(chunkDir);
    }
    /* 保存上传的文件 */
    await fsExtra.move(chunk.path, `${chunkDir}/${hash}`, { overwrite: true });
    res.end("received file chunk");
  });

  if (req.url === '/merge') {
    const data = await resolvePost(req);
    const { filename } = data;
    const filePath = `${UPLOAD_DIR}/${filename}`
    await mergeFileChunk(filePath, filename)
  }

});
server.listen(3000, function () {
  console.log("🍎 server is runing.............");
});
