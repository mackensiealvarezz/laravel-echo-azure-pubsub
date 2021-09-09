'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Connector = require('laravel-echo');
var WebSocket = require('ws');
var eventFormatter = require('laravel-echo/dist/util/event-formatter');
var channel = require('laravel-echo/dist/channel/channel');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Connector__default = /*#__PURE__*/_interopDefaultLegacy(Connector);
var WebSocket__default = /*#__PURE__*/_interopDefaultLegacy(WebSocket);

/**
 * This class represents a Ratchet channel.
 */
class AzureChannel extends channel.Channel {
    /**
     * Create a new class instance.
     */
    constructor(socket, name, options) {
        super();
        /**
         * The event callbacks applied to the socket.
         */
        this.events = {};
        /**
         * User supplied callbacks for events on this channel.
         */
        this.listeners = {};
        this.name = name;
        this.socket = socket;
        this.options = options;
        this.eventFormatter = new eventFormatter.EventFormatter(this.options.namespace);
        this.subscribe();
    }
    listen(event, callback) {
        this.on(this.eventFormatter.format(event), callback);
        return this;
    }
    stopListening(event, callback) {
        this.unbindEvent(this.eventFormatter.format(event), callback);
        return this;
    }
    /**
     * Subscribe to a Socket.io channel.
     */
    subscribe() {
        this.socket.emit('subscribe', {
            channel: this.name,
            auth: this.options.auth || {},
        });
    }
    /**
     * Unsubscribe from channel and ubind event callbacks.
     */
    unsubscribe() {
        this.unbind();
        this.socket.emit('unsubscribe', {
            channel: this.name,
            auth: this.options.auth || {},
        });
    }
    /**
     * Register a callback to be called anytime a subscription succeeds.
     */
    subscribed(callback) {
        this.on('connect', (socket) => {
            callback(socket);
        });
        return this;
    }
    /**
     * Register a callback to be called anytime an error occurs.
     */
    error(callback) {
        return this;
    }
    /**
     * Bind the channel's socket to an event and store the callback.
     */
    on(event, callback) {
        this.listeners[event] = this.listeners[event] || [];
        if (!this.events[event]) {
            this.events[event] = (channel, data) => {
                if (this.name === channel && this.listeners[event]) {
                    this.listeners[event].forEach((cb) => cb(data));
                }
            };
            this.socket.on(event, this.events[event]);
        }
        this.listeners[event].push(callback);
        return this;
    }
    /**
     * Unbind the channel's socket from all stored event callbacks.
     */
    unbind() {
        Object.keys(this.events).forEach((event) => {
            this.unbindEvent(event);
        });
    }
    /**
     * Unbind the listeners for the given event.
     */
    unbindEvent(event, callback) {
        this.listeners[event] = this.listeners[event] || [];
        if (callback) {
            this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
        }
        if (!callback || this.listeners[event].length === 0) {
            if (this.events[event]) {
                this.socket.removeListener(event, this.events[event]);
                delete this.events[event];
            }
            delete this.listeners[event];
        }
    }
}

const { WebPubSubServiceClient } = require('@azure/web-pubsub');
class AzureConnector extends Connector__default['default'] {
    constructor() {
        /**
         * The WebSocket connection instance.
         *
         * @type {object}
         */
        super(...arguments);
        /**
         * All of the subscribed channel names.
         */
        this.channels = {};
    }
    /**
     * Create a fresh connection.
     */
    connect() {
        const connectionString = `Endpoint=${this.options.host};AccessKey=${this.options.key};Version=1.0;`;
        const serviceClient = new WebPubSubServiceClient(connectionString, 'Hub');
        const token = serviceClient.getAuthenticationToken();
        this.socket = new WebSocket__default['default'](token.url);
        this.extendSocket();
        return this.socket;
    }
    /**
     * Attach event handlers to the socket.
     *
     * @return {void}
     */
    extendSocket() {
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
    }
    /**
     * Listen for an event on a channel instance.
     *
     * @param  {string} name
     * @param  {string} event
     * @param  {Function} callback
     * @return {AzureChannel}
     */
    listen(name, event, callback) {
        return this.channel(name).listen(event, callback);
    }
    /**
     * Get a channel instance by name.
     */
    channel(channel) {
        if (!this.channels[channel]) {
            this.channels[channel] = new AzureChannel(this.socket, channel, this.options);
        }
        return this.channels[channel];
    }
    /**
     * Get a private channel instance by name.
     */
    privateChannel(name) {
        console.log('channel');
    }
    /**
     * Get a presence channel instance by name.
     */
    presenceChannel(name) {
        console.log('channel');
    }
    /**
     * Leave the given channel, as well as its private and presence variants.
     */
    leave(name) {
        //
    }
    /**
     * Leave the given channel.
     */
    leaveChannel(name) {
        console.log('leaveChannel');
    }
    /**
     * Get the socket ID for the connection.
     */
    socketId() {
        return this.socket.id;
    }
    /**
     * Disconnect the connection.
     */
    disconnect() {
        console.log('disconnect');
    }
    /**
     * Generate an ID for the socket.
     *
     * @see https://jsperf.com/uuid4/8
     * @return {string}
     */
    generateId() {
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
    }
}

exports.AzureConnector = AzureConnector;
