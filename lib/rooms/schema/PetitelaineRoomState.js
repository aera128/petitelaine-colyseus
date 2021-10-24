"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetitelaineRoomState = exports.Settings = exports.Chat = exports.Message = exports.Player = void 0;
const schema_1 = require("@colyseus/schema");
class Player extends schema_1.Schema {
    constructor(id, username, avatar) {
        super();
        this.words = [];
        this.votes = [];
        this.hasVoted = false;
        this.id = id;
        this.username = username;
        this.avatar = avatar;
    }
}
__decorate([
    schema_1.type('string')
], Player.prototype, "id", void 0);
__decorate([
    schema_1.type('string')
], Player.prototype, "username", void 0);
__decorate([
    schema_1.type('string')
], Player.prototype, "avatar", void 0);
__decorate([
    schema_1.filter(function (client, value, root) {
        return root.state === 'end' || this.id === client.sessionId;
    }),
    schema_1.type('string')
], Player.prototype, "word", void 0);
__decorate([
    schema_1.type({ array: 'string' })
], Player.prototype, "words", void 0);
__decorate([
    schema_1.type({ array: 'string' })
], Player.prototype, "votes", void 0);
__decorate([
    schema_1.type('boolean')
], Player.prototype, "hasVoted", void 0);
exports.Player = Player;
class Message extends schema_1.Schema {
    constructor(clientId, username, avatar, message) {
        super();
        this.clientId = clientId;
        this.username = username;
        this.avatar = avatar;
        this.message = message;
    }
}
__decorate([
    schema_1.type('string')
], Message.prototype, "clientId", void 0);
__decorate([
    schema_1.type('string')
], Message.prototype, "message", void 0);
__decorate([
    schema_1.type('string')
], Message.prototype, "username", void 0);
__decorate([
    schema_1.type('string')
], Message.prototype, "avatar", void 0);
exports.Message = Message;
class Chat extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.messages = new schema_1.ArraySchema();
    }
    addMessage(clientId, username, avatar, message) {
        this.messages.push(new Message(clientId, username, avatar, message));
    }
}
__decorate([
    schema_1.type([Message])
], Chat.prototype, "messages", void 0);
exports.Chat = Chat;
class Settings extends schema_1.Schema {
    constructor(settings) {
        super();
        this.maxPlayers = settings.maxPlayers;
    }
}
__decorate([
    schema_1.type('int32')
], Settings.prototype, "maxPlayers", void 0);
exports.Settings = Settings;
class PetitelaineRoomState extends schema_1.Schema {
    constructor() {
        super();
        this.state = 'lobby';
        this.players = new schema_1.MapSchema();
        this.settings = new Settings({ maxPlayers: 10 });
        this.chat = new Chat();
        this.currentTurn = 0;
        this.round = 0;
        this.turns = [];
    }
}
__decorate([
    schema_1.type('string')
], PetitelaineRoomState.prototype, "state", void 0);
__decorate([
    schema_1.type({ map: Player })
], PetitelaineRoomState.prototype, "players", void 0);
__decorate([
    schema_1.type(Settings)
], PetitelaineRoomState.prototype, "settings", void 0);
__decorate([
    schema_1.type(Chat)
], PetitelaineRoomState.prototype, "chat", void 0);
__decorate([
    schema_1.type('string')
], PetitelaineRoomState.prototype, "leader", void 0);
__decorate([
    schema_1.type('int32')
], PetitelaineRoomState.prototype, "currentTurn", void 0);
__decorate([
    schema_1.type('int32')
], PetitelaineRoomState.prototype, "round", void 0);
__decorate([
    schema_1.type(['string'])
], PetitelaineRoomState.prototype, "turns", void 0);
__decorate([
    schema_1.filter(function (client, value, root) {
        return root.state === 'end';
    }),
    schema_1.type(['string'])
], PetitelaineRoomState.prototype, "words", void 0);
__decorate([
    schema_1.filter(function (client, value, root) {
        return root.state === 'end';
    }),
    schema_1.type('string')
], PetitelaineRoomState.prototype, "imposter", void 0);
__decorate([
    schema_1.filter(function (client, value, root) {
        return root.state === 'end';
    }),
    schema_1.type('int32')
], PetitelaineRoomState.prototype, "winner", void 0);
exports.PetitelaineRoomState = PetitelaineRoomState;
