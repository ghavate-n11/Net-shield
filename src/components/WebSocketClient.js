import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const socket = new SockJS('http://localhost:8080/ws');
const stompClient = new Client({
  webSocketFactory: () => socket,
  onConnect: () => {
    console.log('Connected to WebSocket');

    stompClient.subscribe('/topic/scan', (message) => {
      const data = JSON.parse(message.body);
      console.log("Live Scan Data:", data);
      // You can set state here to show live alerts on the UI
    });
  },
  onStompError: (frame) => {
    console.error('STOMP Error:', frame);
  },
});

stompClient.activate();

export default stompClient;
