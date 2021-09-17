import { io } from 'socket.io-client';

import { BASE_URL } from '../../BASE_URL/baseUrl';

const socket = io(BASE_URL + '/chat', { autoConnect: false });

export default socket;
