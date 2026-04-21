import { ReactNode } from "react";
import Navbar from "./Navbar";

const PageLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </main>
  </div>
);

export default PageLayout;
