import Connector from 'laravel-echo';
import { AzureChannel } from './channel/azure-channel';
export declare class AzureConnector extends Connector {
    /**
     * The WebSocket connection instance.
     *
     * @type {object}
     */
    socket: any;
    /**
     * All of the subscribed channel names.
     */
    channels: any;
    /**
     * Create a fresh connection.
     */
    connect(): Promise<WebSocket>;
    fetchToken(): Promise<any>;
    /**
     * Attach event handlers to the socket.
     *
     * @return {void}
     */
    extendSocket(): void;
    emit(event: string, message: object): void;
    open(): void;
    /**
     * Handle a message received from the server.
     *
     * @param  {MessageEvent} event
     * @return {void}
     */
    receive(message: MessageEvent): void;
    /**
     * Listen for an event on a channel instance.
     *
     * @param  {string} name
     * @param  {string} event
     * @param  {Function} callback
     * @return {AzureChannel}
     */
    listen(name: string, event: string, callback: Function): AzureChannel;
    /**
     * Get a channel instance by name.
     */
    channel(channel: string): AzureChannel;
    checkChannel(channel: string): AzureChannel;
    /**
     * Get a private channel instance by name.
     */
    privateChannel(name: any): void;
    /**
     * Get a presence channel instance by name.
     */
    presenceChannel(name: any): void;
    /**
     * Leave the given channel, as well as its private and presence variants.
     */
    leave(name: any): void;
    /**
     * Leave the given channel.
     */
    leaveChannel(name: any): void;
    /**
     * Get the socket ID for the connection.
     */
    socketId(): any;
    /**
     * Disconnect the connection.
     */
    disconnect(): void;
    /**
     * Generate an ID for the socket.
     *
     * @see https://jsperf.com/uuid4/8
     * @return {string}
     */
    generateId(): string;
}
