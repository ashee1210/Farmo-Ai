import { useState, useEffect } from "react";
import { LandingPage } from "./krishi/LandingPage";
import { FeaturesPage } from "./krishi/FeaturesPage";
import { MarketPage } from "./krishi/MarketPage";
import { KrishiLoginPage } from "./krishi/LoginPage";
import { FarmerDashboard } from "./krishi/FarmerDashboard";
import { AdminDashboard } from "./krishi/AdminDashboard";
import { PricingPage } from "./krishi/PricingPage";
import { ContactPage } from "./krishi/ContactPage";
import { AIAssistant } from "./components/AIAssistant";
import { RegisterPage } from "./components/RegisterPage";

export default function App() {
  const [route, setRoute] = useState(() => {
    // 1. Check saved route in localStorage
    try {
      const savedRoute = localStorage.getItem("krishi_current_route");
      if (savedRoute) {
        const parsed = JSON.parse(savedRoute);
        if (parsed && parsed.page) return parsed;
      }
    } catch (e) {}

    // 2. Check logged-in user profile if route wasn't saved
    try {
      const profileStr = localStorage.getItem("krishi_user_profile");
      if (profileStr) {
        const profile = JSON.parse(profileStr);
        if (profile.role === "admin" || profile.email === "admin@gmail.com") {
          return { page: "admin" };
        } else if (profile.role === "farmer" || profile.email) {
          return { page: "farmer" };
        }
      }
    } catch (e) {}

    return { page: "home" };
  });

  const navigate = (page, params = {}) => {
    const newRoute = { page, ...params };
    setRoute(newRoute);
    try {
      localStorage.setItem("krishi_current_route", JSON.stringify(newRoute));
    } catch (e) {}
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { page } = route;

  if (page === "home")           return <LandingPage navigate={navigate} />;
  if (page === "features")       return <FeaturesPage navigate={navigate} />;
  if (page === "feature-detail") return <FeaturesPage navigate={navigate} featureId={route.featureId} />;
  if (page === "market")         return <MarketPage navigate={navigate} />;
  if (page === "crop-detail")    return <MarketPage navigate={navigate} cropId={route.cropId || route.id} />;
  if (page === "login")          return <KrishiLoginPage navigate={navigate} />;
  if (page === "pricing")        return <PricingPage navigate={navigate} />;
  if (page === "contact")        return <ContactPage navigate={navigate} />;
  if (page === "register")       return <RegisterPage onLogin={() => navigate("login")} onBack={() => navigate("home")} />;
  if (page === "ai-assistant")   return <AIAssistant navigate={navigate} />;
  if (page === "farmer")         return <FarmerDashboard navigate={navigate} initialSection={route.farmerSection} />;
  if (page === "admin")          return <AdminDashboard navigate={navigate} initialSection={route.adminSection} />;

  return <LandingPage navigate={navigate} />;
}
