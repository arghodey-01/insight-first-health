import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesGrid from "@/components/ServicesGrid";
import WorkflowSection from "@/components/WorkflowSection";
import AISuggestionsPanel from "@/components/AISuggestionsPanel";
import DoctorConsultation from "@/components/DoctorConsultation";
import NearbyLabs from "@/components/NearbyLabs";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ServicesGrid />
      <WorkflowSection />
      <AISuggestionsPanel />
      <DoctorConsultation />
      <NearbyLabs />
      <TrustSection />
      <Footer />
    </div>
  );
};

export default Index;
