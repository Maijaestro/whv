import { AdminConnection, SocketClient } from "@iobroker/socket-client-backend";

export interface IoBrokerClientOptions {
  host: string;
  port: number;
  name?: string;
  useSsl?: boolean;
  onReady?: () => void;
  onError?: (err: any) => void;
  onLog?: (msg: any) => void;
}

export function createIoBrokerClient(options: IoBrokerClientOptions) {
  const connection = new AdminConnection({
    host: options.host,
    port: options.port,
    protocol: options.useSsl ? "https:" : "http:",
    name: options.name ?? "whv-frontend",
    doNotLoadAllObjects: true,
    doNotLoadACL: true,

    // Diese drei gehören HIERHIN
    onReady: options.onReady,
    onError: options.onError,
    onLog: options.onLog,

    connect: (url: string): any => {
      const socketClient = new SocketClient();
      const wsUrl = url.replace(/^http/, "ws");

      socketClient.connect(wsUrl, {
        name: options.name ?? "whv-frontend",
        WebSocket, // Browser-WebSocket
      });

      return socketClient;
    },
  });

  return connection;
}
