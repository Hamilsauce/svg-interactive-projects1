import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { date, array, utils, text } = ham;

export class EventMessage {
  constructor({ channelName, action, payload, source }) {
    console.warn('MESSAGE CONSTRUCTOR: ~~~channelName, payload, source~~~', { channelName, payload, source });
    if (!(channelName && action)) throw new Error(`Malformed Message: missing action or channelName; SOURCE: ${{source}}`);

    this._id = utils.uuid();
    this._channelName = channelName;
    this._action = action;
    this._payload = payload;
    this._source = this.source || null;
  }

  get id() { return this._id }

  get channelName() { return this._channelName }

  get action() { return this._action }

  get payload() { return this._payload }

  get source() { return this._source }
}
