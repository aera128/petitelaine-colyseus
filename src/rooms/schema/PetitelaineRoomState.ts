import { Schema, ArraySchema, filter, type, MapSchema } from '@colyseus/schema';

export class Player extends Schema {
    @type('string') id: string;
    @type('string') username: string;
    @type('string') avatar: string;

    @filter(function (this: Player, client, value, root: PetitelaineRoomState) {
        return root.state === 'end' || this.id === client.sessionId;
    })
    @type('string')
    word: string;
    @type({ array: 'string' }) words: string[] = [];
    @type({ array: 'string' }) votes: string[] = [];
    @type('boolean') hasVoted: boolean = false;

    constructor(id: string, username: string, avatar: string) {
        super();
        this.id = id;
        this.username = username;
        this.avatar = avatar;
    }
}

export class Message extends Schema {
    @type('string') clientId: string;
    @type('string') message: string;
    @type('string') username: string;
    @type('string') avatar: string;

    constructor(clientId: string, username: string, avatar: string, message: string) {
        super();
        this.clientId = clientId;
        this.username = username;
        this.avatar = avatar;
        this.message = message;
    }
}

export class Chat extends Schema {
    @type([Message]) messages: ArraySchema = new ArraySchema();
    addMessage(clientId: string, username: string, avatar: string, message: string) {
        this.messages.push(new Message(clientId, username, avatar, message));
    }
}

export class Settings extends Schema {
    @type('int32') maxPlayers: number;
    constructor(settings: any) {
        super();
        this.maxPlayers = settings.maxPlayers;
    }
}

export class PetitelaineRoomState extends Schema {
    @type('string') state: string = 'lobby';
    @type({ map: Player }) players = new MapSchema<Player>();

    @type(Settings) settings = new Settings({ maxPlayers: 10 });

    @type(Chat) chat = new Chat();

    @type('string') leader: string;
    @type('int32') currentTurn: number = 0;
    @type('int32') round: number = 0;
    @type(['string']) turns: string[] = [];

    @filter(function (client, value, root: PetitelaineRoomState) {
        return root.state === 'end';
    })
    @type(['string'])
    words: string[];

    @filter(function (client, value, root: PetitelaineRoomState) {
        return root.state === 'end';
    })
    @type('string')
    imposter: string;

    @filter(function (client, value, root: PetitelaineRoomState) {
        return root.state === 'end';
    })
    @type('int32')
    winner: number;

    constructor() {
        super();
    }
}
