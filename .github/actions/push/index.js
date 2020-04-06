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
  // upload
  console.log("UPLOAD!!!");
  const uploadResult = await ssh.putDirectory(path.resolve(__dirname, "../../../dist"), "./takum.us/dist");
  console.log('STDOUT: ' + uploadResult.stdout);
  console.log('STDERR: ' + uploadResult.stderr);
});