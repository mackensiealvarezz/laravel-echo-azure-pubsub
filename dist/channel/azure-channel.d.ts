import { EventFormatter } from 'laravel-echo/dist/util/event-formatter';
import { Channel } from 'laravel-echo/dist/channel/channel';
/**
 * This class represents a Ratchet channel.
 */
export declare class AzureChannel extends Channel {
    /**
     * The Socket.io client instance.
     */
    socket: any;
    /**
     * The name of the channel.
     */
    name: any;
    /**
     * Channel options.
     */
    options: any;
    /**
     * The event formatter.
     */
    eventFormatter: EventFormatter;
    /**
     * The event callbacks applied to the socket.
     */
    events: any;
    /**
     * User supplied callbacks for events on this channel.
     */
    private listeners;
    /**
     * Create a new class instance.
     */
    constructor(socket: any, name: string, options: any);
    listen(event: string, callback: Function): AzureChannel;
    stopListening(event: string, callback?: Function): AzureChannel;
    /**
     * Subscribe to a Socket.io channel.
     */
    subscribe(): void;
    /**
     * Unsubscribe from channel and ubind event callbacks.
     */
    unsubscribe(): void;
    /**
     * Register a callback to be called anytime a subscription succeeds.
     */
    subscribed(callback: Function): AzureChannel;
    /**
     * Register a callback to be called anytime an error occurs.
     */
    error(callback: Function): AzureChannel;
    /**
     * Bind the channel's socket to an event and store the callback.
     */
    on(event: string, callback: Function): AzureChannel;
    /**
     * Unbind the channel's socket from all stored event callbacks.
     */
    unbind(): void;
    /**
     * Unbind the listeners for the given event.
     */
    protected unbindEvent(event: string, callback?: Function): void;
}
