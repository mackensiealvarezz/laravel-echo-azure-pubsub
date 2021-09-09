"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureConnector = void 0;
var laravel_echo_1 = __importDefault(require("laravel-echo"));
var ws_1 = __importDefault(require("ws"));
var WebPubSubServiceClient = require('@azure/web-pubsub').WebPubSubServiceClient;
var azure_channel_1 = require("./channel/azure-channel");
var AzureConnector = /** @class */ (function (_super) {
    __extends(AzureConnector, _super);
    function AzureConnector() {
        /**
         * The WebSocket connection instance.
         *
         * @type {object}
         */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * All of the subscribed channel names.
         */
        _this.channels = {};
        return _this;
    }
    /**
     * Create a fresh connection.
     */
    AzureConnector.prototype.connect = function () {
        var connectionString = "Endpoint=" + this.options.host + ";AccessKey=" + this.options.key + ";Version=1.0;";
        var serviceClient = new WebPubSubServiceClient(connectionString, 'Hub');
        var token = serviceClient.getAuthenticationToken();
        this.socket = new ws_1.default(token.url);
        this.extendSocket();
        return this.socket;
    };
    /**
     * Attach event handlers to the socket.
     *
     * @return {void}
     */
    AzureConnector.prototype.extendSocket = function () {
        // Extend the socket with a queue for events
        this.socket.queue = [];
        this.socket.id = this.generateId();
        // Extend the socket with an emit function (mimic SocketIO API)
        // this.socket.emit = (event: string, message: object) => {
        //     return this.emit(event, message);
        // };
        // // Add main event handlers
        // this.socket.addEventListener('open', () => {
        //     this.open();
        // });
        // this.socket.addEventListener('message', (message) => {
        //     this.receive(message);
        // });
    };
    /**
      * Listen for an event on a channel instance.
      *
      * @param  {string} name
      * @param  {string} event
      * @param  {Function} callback
      * @return {AzureChannel}
      */
    AzureConnector.prototype.listen = function (name, event, callback) {
        return this.channel(name).listen(event, callback);
    };
    /**
     * Get a channel instance by name.
     */
    AzureConnector.prototype.channel = function (channel) {
        if (!this.channels[channel]) {
            this.channels[channel] = new azure_channel_1.AzureChannel(this.socket, channel, this.options);
        }
        return this.channels[channel];
    };
    /**
     * Get a private channel instance by name.
     */
    AzureConnector.prototype.privateChannel = function (name) {
        console.log('channel');
    };
    /**
     * Get a presence channel instance by name.
     */
    AzureConnector.prototype.presenceChannel = function (name) {
        console.log('channel');
    };
    /**
     * Leave the given channel, as well as its private and presence variants.
     */
    AzureConnector.prototype.leave = function (name) {
        //
    };
    /**
     * Leave the given channel.
     */
    AzureConnector.prototype.leaveChannel = function (name) {
        console.log('leaveChannel');
    };
    /**
     * Get the socket ID for the connection.
     */
    AzureConnector.prototype.socketId = function () {
        return this.socket.id;
    };
    /**
     * Disconnect the connection.
     */
    AzureConnector.prototype.disconnect = function () {
        console.log('disconnect');
    };
    /**
     * Generate an ID for the socket.
     *
     * @see https://jsperf.com/uuid4/8
     * @return {string}
     */
    AzureConnector.prototype.generateId = function () {
        var c = '0123456789ABCDEF'.split(''), id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.split(''), r;
        id[0] = c[(r = Math.random() * 0x100000000) & 0xf];
        id[1] = c[(r >>>= 4) & 0xf];
        id[2] = c[(r >>>= 4) & 0xf];
        id[3] = c[(r >>>= 4) & 0xf];
        id[4] = c[(r >>>= 4) & 0xf];
        id[5] = c[(r >>>= 4) & 0xf];
        id[6] = c[(r >>>= 4) & 0xf];
        id[7] = c[(r >>>= 4) & 0xf];
        id[9] = c[(r = Math.random() * 0x100000000) & 0xf];
        id[10] = c[(r >>>= 4) & 0xf];
        id[11] = c[(r >>>= 4) & 0xf];
        id[12] = c[(r >>>= 4) & 0xf];
        id[15] = c[(r >>>= 4) & 0xf];
        id[16] = c[(r >>>= 4) & 0xf];
        id[17] = c[(r >>>= 4) & 0xf];
        id[19] = c[((r = Math.random() * 0x100000000) & 0x3) | 0x8];
        id[20] = c[(r >>>= 4) & 0xf];
        id[21] = c[(r >>>= 4) & 0xf];
        id[22] = c[(r >>>= 4) & 0xf];
        id[24] = c[(r >>>= 4) & 0xf];
        id[25] = c[(r >>>= 4) & 0xf];
        id[26] = c[(r >>>= 4) & 0xf];
        id[27] = c[(r >>>= 4) & 0xf];
        id[28] = c[(r = Math.random() * 0x100000000) & 0xf];
        id[29] = c[(r >>>= 4) & 0xf];
        id[30] = c[(r >>>= 4) & 0xf];
        id[31] = c[(r >>>= 4) & 0xf];
        id[32] = c[(r >>>= 4) & 0xf];
        id[33] = c[(r >>>= 4) & 0xf];
        id[34] = c[(r >>>= 4) & 0xf];
        id[35] = c[(r >>>= 4) & 0xf];
        return id.join('');
    };
    return AzureConnector;
}(laravel_echo_1.default));
exports.AzureConnector = AzureConnector;
