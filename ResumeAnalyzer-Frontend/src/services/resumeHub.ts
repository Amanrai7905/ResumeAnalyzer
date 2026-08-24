import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
} from "@microsoft/signalr";

const hubConnection: HubConnection =
  new HubConnectionBuilder()
    .withUrl("https://localhost:7024/hubs/resume")
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

export default hubConnection;