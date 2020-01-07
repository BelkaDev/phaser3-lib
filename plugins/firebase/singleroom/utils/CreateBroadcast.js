import Broadcast from '../../broadcast/Broadcast.js';
import GetValue from '../../../utils/object/GetValue.js';

var CreateBroadcast = function (config) {
    var broadcast = new Broadcast({
        eventEmitter: this.getEventEmitter(),
        eventNames: {
            receive: 'broadcast.receive'
        },

        root: this.rootPath,
        receiverID: 'broadcast',
        senderID: this.userInfo,
        history: GetValue(config, 'broadcast.history', false)
    });

    this
        .on('join', function () {
            broadcast.startReceiving()
        })
        .on('leave', function () {
            broadcast.stopReceiving()
        })
        .on('userlist.changename', function (userID, userName) {
            broadcast.changeUserName(userID, userName);
        }, this)

    return broadcast;
}

export default CreateBroadcast;