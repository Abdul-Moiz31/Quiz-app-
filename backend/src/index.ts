
import { Iomanager } from './Managers/Iomanager';
import { UserManager } from './Managers/Usermanager';
 const io = Iomanager.getIo();

 io.listen(3000);
 io.listen(3000);
 const userManager = new UserManager();
 io.on('connection', (socket) => {
   userManager.addUser(socket);
 });
