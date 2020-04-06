const node_ssh = require('node-ssh');
const ssh = new node_ssh();
let config = {};
try {
  config = require('../local.deploy.config.js');
  console.log('---deploy from local---');
}catch(e) {
  config.port = process.env.DEPLOY_SERVER_PORT;
  config.host = process.env.DEPLOY_SERVER_HOST;
  config.username = process.env.DEPLOY_SERVER_USERNAME;
  config.privateKey = process.env.DEPLOY_SERVER_PRIVATE_KEY;
  config.directory = process.env.DEPLOY_SERVER_DIRECTORY;
  console.log('---deploy from server---');
}
ssh.connect(config).then(async () => {
  // remove
  console.log('remove');
  const remove = await ssh.execCommand(
    `rm -rf ${config.directory}`
  ).catch(killIfError);
  killIfError(remove.stderr);
  console.log('done!');

  // upload
  console.log('upload');
  await ssh.putDirectory(
    './dist',
    config.directory
  ).catch(killIfError);
  console.log('done!');

  // exit with zero
  process.exit(0);
}).catch(killIfError);
function killIfError(error) {
  if (error) {
    console.error(`${error}`);
    process.exit(1);
  }
}