import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import Header from "./components/Header";
import Routes from "./SegmentSniper.routes";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import InitializeApp from "./components/InitializeApp";
import AuthenticatedUserMonitor from "./components/Authentication/AuthenticatedUserMonitor";
import "./App.css";

const client = new QueryClient();

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <QueryClientProvider client={client}>
    <AuthenticatedUserMonitor />
    <InitializeApp />
    <Router basename="/">
      <Header />
      <Routes />
    </Router>
    <Toaster />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
