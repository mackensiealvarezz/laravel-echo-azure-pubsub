import Connector from 'laravel-echo';
import WebSocket from 'ws';
const { WebPubSubServiceClient } = require('@azure/web-pubsub');
import { AzureChannel } from './channel/azure-channel';

export class AzureConnector extends Connector {
  /**
   * The WebSocket connection instance.
   *
   * @type {object}
   */

  socket: any;

  /**
   * All of the subscribed channel names.
   */
  channels: any = {};

  /**
   * Create a fresh connection.
   */
  connect(): WebSocket {
    const connectionString = `Endpoint=${this.options.host};AccessKey=${this.options.key};Version=1.0;`;
    const serviceClient = new WebPubSubServiceClient(connectionString, 'Hub');
    const token = serviceClient.getAuthenticationToken();

    this.socket = new WebSocket(token.url);

    this.extendSocket();

    return this.socket;
  }

  /**
   * Attach event handlers to the socket.
   *
   * @return {void}
   */
  extendSocket(): void {
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
  listen(name: string, event: string, callback: Function): AzureChannel {
    return this.channel(name).listen(event, callback);
  }

  /**
   * Get a channel instance by name.
   */
  channel(channel: string): AzureChannel {
    if (!this.channels[channel]) {
      this.channels[channel] = new AzureChannel(this.socket, channel, this.options);
    }

    return this.channels[channel];
  }

  /**
   * Get a private channel instance by name.
   */
  privateChannel(name: any): void {
    console.log('channel');
  }

  /**
   * Get a presence channel instance by name.
   */
  presenceChannel(name: any) {
    console.log('channel');
  }

  /**
   * Leave the given channel, as well as its private and presence variants.
   */
  leave(name: any) {
    //
  }

  /**
   * Leave the given channel.
   */
  leaveChannel(name: any) {
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
  generateId(): string {
    var c = '0123456789ABCDEF'.split(''),
      id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.split(''),
      r;

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
