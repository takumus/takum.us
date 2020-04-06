const node_ssh = require('node-ssh');
const ssh = new node_ssh();
ssh.connect({
  port: process.env.DEPLOY_SERVER_PORT,
  host: process.env.DEPLOY_SERVER_HOST,
  username: process.env.DEPLOY_SERVER_USERNAME,
  privateKey: process.env.DEPLOY_SERVER_PRIVATE_KEY
}).then(async () => {
  // remove
  console.log('remove');
  const remove = await ssh.execCommand(
    `rm -rf ${process.env.DEPLOY_SERVER_DIRECTORY}`
  ).catch(killIfError);
  killIfError(remove.stderr);
  console.log('done!');

  // upload
  console.log('upload');
  await ssh.putDirectory(
    './dist',
    process.env.DEPLOY_SERVER_DIRECTORY
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