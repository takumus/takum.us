const node_ssh = require('node-ssh');
const path = require('path');
const ssh = new node_ssh();
ssh.connect({
  port: process.env.DEPLOY_SERVER_PORT,
  host: process.env.DEPLOY_SERVER_HOST,
  username: process.env.DEPLOY_SERVER_USERNAME,
  privateKey: process.env.DEPLOY_SERVER_PRIVATE_KEY
})
.then(async () => {
  // remove
  console.log('remove');
  const rmResult = await ssh.execCommand(`rm -rf ${process.env.DEPLOY_SERVER_DIRECTORY}`);
  if (rmResult.stderr) {
    console.log(rmResult.stderr);
    process.exit(1);
  }
  // upload
  console.log('upload');
  const uploadResult = await ssh.putDirectory('./dist', process.env.DEPLOY_SERVER_DIRECTORY);
  if (uploadResult.stderr) {
    console.log(uploadResult.stderr);
    process.exit(1);
  }
  // exit
  process.exit(0);
});