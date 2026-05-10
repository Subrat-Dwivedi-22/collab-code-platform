import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import AppTheme from "../../shared-theme/AppTheme";
import AppAppBar from "../components/home-page/AppAppBar";
import Hero from "../components/home-page/Hero";
import LogoCollection from "../components/home-page/LogoCollection";
import Highlights from "../components/home-page/Highlights";
import Pricing from "../components/home-page/Pricing";
// import Features from '../components/home-page/Features';
import Testimonials from "../components/home-page/Testimonials";
import FAQ from "../components/home-page/FAQ";
import Footer from "../components/home-page/Footer";
import { useEffect } from "react";

export default function HomePage(props) {
  useEffect(() => {
    fetch("https://your-api.onrender.com/health").catch(() => {});
  }, []);
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Hero />
      <div>
        <LogoCollection />
        <Divider />
        <Testimonials />
        <Divider />
        <Highlights />
        <Divider />
        <Pricing />
        <Divider />
        <FAQ />
        <Divider />
        <Footer />
      </div>
    </AppTheme>
  );
}
