import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { User, FileText, Calendar, ArrowLeft, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: "", phone: "" });

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const [profileRes, reportsRes, bookingsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user!.id).single(),
      supabase.from("reports").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
      supabase.from("bookings").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
    ]);
    if (profileRes.data) {
      setProfile(profileRes.data);
      setEditForm({ full_name: profileRes.data.full_name || "", phone: profileRes.data.phone || "" });
    }
    setReports(reportsRes.data || []);
    setBookings(bookingsRes.data || []);
    setLoading(false);
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: editForm.full_name,
      phone: editForm.phone,
      updated_at: new Date().toISOString(),
    }).eq("id", user!.id);
    if (error) toast({ title: "Update failed", variant: "destructive" });
    else { toast({ title: "Profile updated!" }); fetchData(); }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-hero-gradient text-2xl font-bold text-primary-foreground">
                {(profile?.full_name || user?.email || "U")[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{profile?.full_name || "User"}</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </div>

          <Tabs defaultValue="profile" className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center gap-2"><User className="h-4 w-4" /> Profile</TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2"><FileText className="h-4 w-4" /> Reports ({reports.length})</TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Bookings ({bookings.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <Input className="mt-1" value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input className="mt-1" placeholder="+91 9876543210" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input className="mt-1" value={user?.email || ""} disabled />
                </div>
                <Button className="bg-hero-gradient text-primary-foreground hover:opacity-90" onClick={handleUpdateProfile} disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Save Changes
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="mt-6">
              {reports.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-12 text-center shadow-card">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/40" />
                  <p className="mt-4 text-muted-foreground">No reports yet</p>
                  <Link to="/upload"><Button className="mt-4 bg-hero-gradient text-primary-foreground">Upload Your First Report</Button></Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((r) => (
                    <div key={r.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{r.file_name}</p>
                          <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()} · Age: {r.age} · {r.gender} · {r.food_preference}</p>
                        </div>
                        <span className="text-xs font-medium text-secondary">Analyzed</span>
                      </div>
                      {r.summary && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{r.summary}</p>}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="bookings" className="mt-6">
              {bookings.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-12 text-center shadow-card">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground/40" />
                  <p className="mt-4 text-muted-foreground">No bookings yet</p>
                  <Link to="/doctors"><Button className="mt-4 bg-hero-gradient text-primary-foreground">Book a Consultation</Button></Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map((b) => (
                    <div key={b.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{b.provider_name}</p>
                          <p className="text-xs text-muted-foreground">{b.provider_detail} · {b.slot} · ₹{b.fee}</p>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${b.status === "confirmed" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}`}>
                          {b.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{new Date(b.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
