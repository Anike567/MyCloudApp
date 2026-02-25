import { useEffect } from "react";
import TabRouter from "../components/routing/Tab";
import registerForPushNotificationsAsync from "../utility/registerNotification";
export default function App() {
  useEffect(()=>{
    registerForPushNotificationsAsync();
  },[]);
  return (
    <TabRouter />
  );
}