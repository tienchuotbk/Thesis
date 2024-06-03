import { BrowserRouter } from "react-router-dom";
import Routes from "./Router";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import { Layout } from "antd";
import "./assets/styles/app.css";

function App() {
  const pages = import.meta.glob("./pages/**/!(*.test.[jt]sx)*.([jt]sx)", { eager: true });

  return (
    <BrowserRouter>
      <Header />
      <Layout.Content className="min-h-[calc(100vh-130px)] py-4 bg-[#f5f5f5]">
        <Routes pages={pages} />
      </Layout.Content>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
