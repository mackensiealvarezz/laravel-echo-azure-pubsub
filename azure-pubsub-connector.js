import Connector from 'laravel-echo';

export class AzureConnector extends Connector {

    /**
   * All of the subscribed channel names.
   */
    channels = {};

    /**
     * Create a fresh connection.
     */
    connect() {

    }

    /**
     * Listen for an event on a channel instance.
     */
    listen(name, event, callback) {
        console.log('listen');
    }

    /**
     * Get a channel instance by name.
     */
    channel(name) {
        console.log('channel');
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
        return 'fake-socket-id';
    }

    /**
     * Disconnect the connection.
     */
    disconnect() {
        console.log('disconnect');
    }

}
