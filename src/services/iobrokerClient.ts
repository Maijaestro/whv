import { AdminConnection, SocketClient } from "@iobroker/socket-client-backend";

export enum WsConnectionStatus {
  Connected = "connected",
  Disconnected = "disconnected",
  Connecting = "connecting",
}

export interface IoBrokerClient {
  connection: AdminConnection;
  status: WsConnectionStatus;
  lastPing: number;
}

export interface IoBrokerClientOptions {
  host: string;
  port: number;
  name?: string;
  useSsl?: boolean;

  // Events
  onConnectionStatusChange?: (status: WsConnectionStatus) => void;
  onReady?: () => void;
  onError?: (err: any) => void;
  onLog?: (msg: any) => void;
}

export function createIoBrokerClient(
  options: IoBrokerClientOptions
): IoBrokerClient {
  const client: IoBrokerClient = {
    connection: null as any,
    status: WsConnectionStatus.Connecting,
    lastPing: 0,
  };

  client.connection = new AdminConnection({
    host: options.host,
    port: options.port,
    protocol: options.useSsl ? "https:" : "http:",
    name: options.name ?? "whv-frontend",
    doNotLoadAllObjects: true,
    doNotLoadACL: true,

    onReady: options.onReady,
    onError: options.onError,
    onLog: options.onLog,

    connect: (url: string): any => {
      const socketClient = new SocketClient();
      const wsUrl = url.replace(/^http/, "ws");
      socketClient.connect(wsUrl, {
        name: options.name ?? "whv-frontend",
        WebSocket,
      });

      const setStatus = (status: WsConnectionStatus) => {
        client.status = status;
        options.onConnectionStatusChange?.(status);
        console.log(
          "iobrokerClient-Status aktualisiert, jetzt: " + client.status
        );
      };

      // Verbindung aufgebaut
      socketClient.on("connect", () => {
        setStatus(WsConnectionStatus.Connected);
      });

      // Verbindung verloren
      socketClient.on("disconnect", () => {
        setStatus(WsConnectionStatus.Disconnected);
      });

      // Verbindung verloren
      socketClient.on("error", () => {
        setStatus(WsConnectionStatus.Connecting);
      });

      // Verbindung verloren
      socketClient.on("reconnect", () => {
        setStatus(WsConnectionStatus.Connected);
      });

      return socketClient;
    },
  });

  return client;
}
