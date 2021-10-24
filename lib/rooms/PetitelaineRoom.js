"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetitelaineRoom = void 0;
const colyseus_1 = require("colyseus");
const PetitelaineRoomState_1 = require("./schema/PetitelaineRoomState");
const fs_1 = __importDefault(require("fs"));
class PetitelaineRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.LOBBY_CHANNEL = 'petitelaine';
    }
    onAuth(client, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options.username === undefined) {
                throw new Error('player do not have a username');
            }
            if (this.state.state !== 'lobby') {
                throw new Error('Room started');
            }
            if (this.state.players.size >= this.state.settings.maxPlayers) {
                throw new Error('Room full');
            }
            return true;
        });
    }
    onCreate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.setState(new PetitelaineRoomState_1.PetitelaineRoomState());
            this.onMessage('settings', (client, settings) => {
                try {
                    if (client.sessionId === this.state.leader) {
                        try {
                            if (settings.maxPlayers >= this.state.players.size) {
                                this.state.settings = new PetitelaineRoomState_1.Settings(settings);
                            }
                        }
                        catch (e) { }
                    }
                }
                catch (e) { }
            });
            this.onMessage('start', (client) => {
                try {
                    if (client.sessionId === this.state.leader &&
                        ['lobby', 'end'].includes(this.state.state)) {
                        this.resetGame();
                        this.startGame();
                    }
                }
                catch (e) {
                    console.error(e);
                }
            });
            this.onMessage('write', (client, data) => {
                try {
                    if (this.state.state === 'game' &&
                        client.sessionId === this.state.turns[this.state.currentTurn]) {
                        this.state.players.get(client.sessionId).words[this.state.round] = data.word;
                        if (data.submit) {
                            this.nextTurn();
                        }
                    }
                    this.broadcast('stateChange', this.state);
                }
                catch (e) {
                    console.error(e);
                }
            });
            this.onMessage('vote', (client, vote) => {
                try {
                    if (this.state.state === 'vote' &&
                        !this.state.players.get(client.sessionId).hasVoted) {
                        this.state.players.get(vote['id']).votes.push(client.sessionId);
                        this.state.players.get(client.sessionId).hasVoted = true;
                    }
                    let end = true;
                    this.state.players.forEach((p) => {
                        if (!p.hasVoted) {
                            end = false;
                        }
                    });
                    if (end) {
                        let maxVotesPlayer = [...this.state.players.entries()].reduce((a, e) => (e[1].votes.length > a[1].votes.length ? e : a));
                        if (maxVotesPlayer[1].votes.length <
                            this.state.players.get(this.state.imposter).votes.length) {
                            this.state.winner = 0;
                        }
                        if (maxVotesPlayer[1].votes.length >
                            this.state.players.get(this.state.imposter).votes.length) {
                            this.state.winner = 1;
                        }
                        if (maxVotesPlayer[1].votes.length ===
                            this.state.players.get(this.state.imposter).votes.length &&
                            this.state.imposter === maxVotesPlayer[0]) {
                            this.state.winner = 0;
                        }
                        if (maxVotesPlayer[1].votes.length ===
                            this.state.players.get(this.state.imposter).votes.length &&
                            this.state.imposter !== maxVotesPlayer[0]) {
                            this.state.winner = 2;
                        }
                        this.state.state = 'end';
                    }
                    setTimeout(() => {
                        this.broadcast('stateChange', this.state);
                    }, 500);
                }
                catch (e) {
                    console.error(e);
                }
            });
            this.onMessage('restart', (client) => {
                try {
                    if (client.sessionId === this.state.leader) {
                        this.resetGame();
                        this.startGame();
                    }
                }
                catch (e) {
                    console.error(e);
                }
            });
            this.onMessage('backToLobby', (client) => {
                try {
                    if (client.sessionId === this.state.leader) {
                        this.resetGame();
                        this.state.state = 'lobby';
                    }
                }
                catch (e) {
                    console.error(e);
                }
            });
            this.onMessage('kickPlayer', (client, playerId) => {
                try {
                    if (client.sessionId === this.state.leader) {
                        this.broadcast('kicked', playerId);
                        this.leaveGame(playerId);
                    }
                    this.broadcast('stateChange', this.state);
                }
                catch (e) {
                    console.error(e);
                }
            });
            this.onMessage('sendMessage', (client, message) => {
                try {
                    this.state.chat.addMessage(client.sessionId, this.state.players.get(client.sessionId).username, this.state.players.get(client.sessionId).avatar, message);
                    this.broadcast('stateChange', this.state);
                }
                catch (e) {
                    console.error(e);
                }
            });
        });
    }
    onJoin(client, options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(client.sessionId, 'joined!');
            this.state.players.set(client.sessionId, new PetitelaineRoomState_1.Player(client.sessionId, options.username, options.avatar));
            if ([null, undefined, ''].includes(this.state.leader)) {
                this.state.leader = client.sessionId;
            }
            this.broadcast('stateChange', this.state);
        });
    }
    onLeave(client, consented) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(client.sessionId, 'left!');
            this.leaveGame(client.sessionId);
            this.broadcast('stateChange', this.state);
        });
    }
    onDispose() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('room', this.roomId, 'disposing...');
        });
    }
    resetGame() {
        this.state.players.forEach((p) => {
            p.hasVoted = false;
            p.word = null;
            p.words = [];
            p.votes = [];
        });
        this.state.currentTurn = 0;
        this.state.round = 0;
        this.state.turns = [];
        this.state.words = [];
        this.state.imposter = null;
        this.state.winner = null;
    }
    startGame() {
        this.state.turns = Array.from(this.state.players.keys());
        for (let i = this.state.turns.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.state.turns[i], this.state.turns[j]] = [this.state.turns[j], this.state.turns[i]];
        }
        let words = fs_1.default.readFileSync(`${__dirname}/../words/fr.json`, 'utf8');
        let words_tab = JSON.parse(words).words;
        this.state.words = words_tab[Math.floor(Math.random() * words.length)];
        let susWord = Math.round(Math.random());
        this.state.imposter = this.state.turns[Math.floor(Math.random() * this.state.turns.length)];
        this.state.turns.forEach((t) => {
            this.state.players.get(t).word =
                this.state.words[t === this.state.imposter ? susWord : Math.abs(susWord - 1)];
        });
        this.state.currentTurn = 0;
        this.state.round = 0;
        this.state.state = 'game';
    }
    nextTurn() {
        if (this.state.currentTurn + 1 >= this.state.turns.length) {
            if (this.state.round + 1 >= 3) {
                this.state.state = 'vote';
                this.state.round = 0;
                this.state.currentTurn = 0;
            }
            else {
                this.state.round++;
            }
            this.state.currentTurn = 0;
        }
        else {
            this.state.currentTurn++;
        }
    }
    leaveGame(id) {
        if (this.state.state === 'game') {
            this.state.turns = this.state.turns.filter((t) => t !== id);
            this.nextTurn();
        }
        this.state.players.delete(id);
        if (this.state.leader === id) {
            let [key] = this.state.players.keys();
            this.state.leader = key;
        }
        if (this.state.players.size < 3 || id === this.state.imposter) {
            this.state.state = 'lobby';
            this.state.words = [];
            this.state.currentTurn = 0;
            this.state.round = 0;
            this.state.turns = [];
        }
    }
}
exports.PetitelaineRoom = PetitelaineRoom;
