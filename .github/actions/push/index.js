const node_ssh = require("node-ssh");
const path = require("path");
const ssh = new node_ssh();
ssh.connect({
  port: process.env.DEPLOY_SERVER_PORT,
  host: process.env.DEPLOY_SERVER_HOST,
  username: process.env.DEPLOY_SERVER_USERNAME,
  privateKey: process.env.DEPLOY_SERVER_PRIVATE_KEY
})
.then(async () => {
  // remove dist
  console.log("REMOVE!!!");
  const rmResult = await ssh.execCommand("rm -rf ./takum.us/dist");
  console.log('STDOUT: ' + rmResult.stdout);
  console.log('STDERR: ' + rmResult.stderr);
  // upload 1
  console.log("UPLOAD1!!!");
  const uploadResult = await ssh.putDirectory("./dist", "./takum.us/dist");
  console.log('STDOUT: ' + uploadResult.stdout);
  console.log('STDERR: ' + uploadResult.stderr);
  // upload 2
  console.log("UPLOAD2!!!");
  const uploadResult2 = await ssh.putDirectory(path.resolve(__dirname,  "../../../dist"), "./takum.us/dist");
  console.log('STDOUT: ' + uploadResult2.stdout);
  console.log('STDERR: ' + uploadResult2.stderr);
});