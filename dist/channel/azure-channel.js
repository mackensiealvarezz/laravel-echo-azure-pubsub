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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureChannel = void 0;
var event_formatter_1 = require("laravel-echo/dist/util/event-formatter");
var channel_1 = require("laravel-echo/dist/channel/channel");
/**
 * This class represents a Ratchet channel.
 */
var AzureChannel = /** @class */ (function (_super) {
    __extends(AzureChannel, _super);
    /**
     * Create a new class instance.
     */
    function AzureChannel(socket, name, options) {
        var _this = _super.call(this) || this;
        /**
         * The event callbacks applied to the socket.
         */
        _this.events = {};
        /**
         * User supplied callbacks for events on this channel.
         */
        _this.listeners = {};
        _this.name = name;
        _this.socket = socket;
        _this.options = options;
        _this.eventFormatter = new event_formatter_1.EventFormatter(_this.options.namespace);
        _this.subscribe();
        return _this;
    }
    AzureChannel.prototype.listen = function (event, callback) {
        this.on(this.eventFormatter.format(event), callback);
        return this;
    };
    AzureChannel.prototype.stopListening = function (event, callback) {
        this.unbindEvent(this.eventFormatter.format(event), callback);
        return this;
    };
    /**
     * Subscribe to a Socket.io channel.
     */
    AzureChannel.prototype.subscribe = function () {
        this.socket.emit('subscribe', {
            channel: this.name,
            auth: this.options.auth || {},
        });
    };
    /**
     * Unsubscribe from channel and ubind event callbacks.
     */
    AzureChannel.prototype.unsubscribe = function () {
        this.unbind();
        this.socket.emit('unsubscribe', {
            channel: this.name,
            auth: this.options.auth || {},
        });
    };
    /**
     * Register a callback to be called anytime a subscription succeeds.
     */
    AzureChannel.prototype.subscribed = function (callback) {
        this.on('connect', function (socket) {
            callback(socket);
        });
        return this;
    };
    /**
     * Register a callback to be called anytime an error occurs.
     */
    AzureChannel.prototype.error = function (callback) {
        return this;
    };
    /**
     * Bind the channel's socket to an event and store the callback.
     */
    AzureChannel.prototype.on = function (event, callback) {
        var _this = this;
        this.listeners[event] = this.listeners[event] || [];
        if (!this.events[event]) {
            this.events[event] = function (channel, data) {
                if (_this.name === channel && _this.listeners[event]) {
                    _this.listeners[event].forEach(function (cb) { return cb(data); });
                }
            };
            this.socket.on(event, this.events[event]);
        }
        this.listeners[event].push(callback);
        return this;
    };
    /**
     * Unbind the channel's socket from all stored event callbacks.
     */
    AzureChannel.prototype.unbind = function () {
        var _this = this;
        Object.keys(this.events).forEach(function (event) {
            _this.unbindEvent(event);
        });
    };
    /**
     * Unbind the listeners for the given event.
     */
    AzureChannel.prototype.unbindEvent = function (event, callback) {
        this.listeners[event] = this.listeners[event] || [];
        if (callback) {
            this.listeners[event] = this.listeners[event].filter(function (cb) { return cb !== callback; });
        }
        if (!callback || this.listeners[event].length === 0) {
            if (this.events[event]) {
                this.socket.removeListener(event, this.events[event]);
                delete this.events[event];
            }
            delete this.listeners[event];
        }
    };
    return AzureChannel;
}(channel_1.Channel));
exports.AzureChannel = AzureChannel;
