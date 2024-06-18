import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "antd";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Router";
import "./assets/styles/app.css";
import Footer from "./layouts/Footer";
import Header from "./layouts/Header";
import { Provider } from "react-redux";
// import store from "./redux/store.js";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 3,
      },
    },
  });
  console.log("hehe")
  const pages = import.meta.glob("./pages/**/!(*.test.[jt]sx)*.([jt]sx)", {
    eager: true,
  });
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Header />
        <Layout.Content
        // className="min-h-[calc(100vh-130px)] bg-[#f5f5f5]"
        >
          <Routes pages={pages} />
        </Layout.Content>
        <Footer />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
