import * as express from 'express';
import * as path from 'path';
import * as socket from 'socket.io';
import Config from '../../@config';

const app = express();
const io = socket(Config.wsPort);

app.use(express.static(Config.wwwDirectory));
app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(Config.wwwDirectory, 'index.html'));
});
app.listen(Config.wwwPort, () => {
  console.log(`http : listening on port ${Config.wwwPort}`);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('data', {
    message: 'hello from server'
  });
  socket.on('data', (data) => {
    console.log(data);
  })
});