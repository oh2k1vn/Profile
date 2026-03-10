import "zmp-ui/zaui.css";
import "./css/index.css";
import "@/css/tailwind.css";

import { createRoot } from "react-dom/client";
import appConfig from "../app-config.json";

if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig as any;
}

const root = createRoot(document.getElementById("app")!);
root.render(<></>);
