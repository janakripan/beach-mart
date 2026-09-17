import { Outlet } from "react-router-dom";
import Header from "../../components/user/Header/Header";
import Footer from "../../components/user/Footer/Footer";
import ScrollToTopButton from "../../components/user/ScrollToTopButton";

const UserLayout = () => {
  return (
    <>
      <Header />
      <div className="grow">
        <Outlet />
      </div>
      <Footer />
      <ScrollToTopButton />
    </>
  );
};

export default UserLayout;
