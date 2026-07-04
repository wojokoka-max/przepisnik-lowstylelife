import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RecipesProvider } from "@/context/RecipesContext";
import Home from "@/pages/Home";
import RecipeDetail from "@/pages/RecipeDetail";
import Planner from "@/pages/Planner";
import Kreator from "@/pages/Kreator";
import Lista from "@/pages/Lista";
import WelcomeScreen from "@/components/WelcomeScreen";
import BottomNav from "@/components/BottomNav";
import SiteHeader from "@/components/SiteHeader";

const queryClient = new QueryClient();

function Router() {
  return (
    <>
      <SiteHeader />
      <BottomNav />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/przepis/:id" component={RecipeDetail} />
        <Route path="/planer" component={Planner} />
        <Route path="/z-lodowki" component={Kreator} />
        <Route path="/lista" component={Lista} />
      </Switch>
    </>
  );
}

function App() {
  const [welcomed, setWelcomed] = useState(false);

  if (!welcomed) {
    return <WelcomeScreen onEnter={() => setWelcomed(true)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RecipesProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
      </RecipesProvider>
    </QueryClientProvider>
  );
}

export default App;
