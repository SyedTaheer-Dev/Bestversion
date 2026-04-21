import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Calendar, X } from "lucide-react";
import { toast } from "sonner";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Booking, Mentor } from "@/types/app";

const Mentors = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [notes, setNotes] = useState("");
  const [myBookings, setMyBookings] = useState<Booking[]>([]);

  const fetchPage = async () => {
    try {
      const mentorsData = await api<{ mentors: Mentor[] }>("/mentors");
      setMentors(mentorsData.mentors);
      if (user) {
        const bookingsData = await api<{ bookings: Booking[] }>("/mentors/bookings/me", { auth: true });
        setMyBookings(bookingsData.bookings);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load mentors");
    }
  };

  useEffect(() => {
    void fetchPage();
  }, [user]);

  const handleBook = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!bookingDate || !selectedMentor) {
      toast.error("Please select a date");
      return;
    }

    try {
      await api("/mentors/bookings", {
        method: "POST",
        auth: true,
        body: JSON.stringify({ mentorId: selectedMentor._id || selectedMentor.id, bookingDate: new Date(bookingDate).toISOString(), notes }),
      });
      toast.success("Session booked!");
      setSelectedMentor(null);
      setBookingDate("");
      setNotes("");
      const bookingsData = await api<{ bookings: Booking[] }>("/mentors/bookings/me", { auth: true });
      setMyBookings(bookingsData.bookings);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Booking failed");
    }
  };

  return (
    <PageLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-3">Find Your Mentor</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">Connect with industry experts who can guide your journey to becoming your best version.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {mentors.map((m, i) => (
          <motion.div key={m._id || m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6 hover:border-primary/50 border border-border/50 transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <img src={m.avatarUrl} alt={m.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/30" />
              <div>
                <h3 className="font-semibold text-foreground">{m.name}</h3>
                <p className="text-xs text-muted-foreground">{m.title}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{m.bio}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {m.expertise?.map((e) => (
                <span key={e} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{e}</span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-secondary">₹{m.hourlyRate}/session</span>
              <button onClick={() => setSelectedMentor(m)} className="px-4 py-2 rounded-full text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition">Book Session</button>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass rounded-2xl p-6 max-w-md w-full border border-border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">Book Session with {selectedMentor.name}</h3>
              <button onClick={() => setSelectedMentor(null)}><X className="text-muted-foreground" size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Select Date & Time</label>
                <input type="datetime-local" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="w-full bg-muted rounded-lg px-4 py-2 text-foreground border border-border focus:border-primary outline-none text-sm" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Notes (optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What do you want to discuss?" className="w-full bg-muted rounded-lg px-4 py-2 text-foreground border border-border focus:border-primary outline-none text-sm h-24 resize-none" />
              </div>
              <button onClick={handleBook} className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold hover:opacity-90 transition">Confirm Booking</button>
            </div>
          </motion.div>
        </div>
      )}

      {user && myBookings.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
          <h2 className="text-xl font-display font-bold text-foreground mb-4">My Bookings</h2>
          <div className="space-y-3">
            {myBookings.map((b) => (
              <div key={b.id} className="glass rounded-xl p-4 flex items-center justify-between border border-border/50">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{b.mentor?.name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(b.bookingDate).toLocaleString()}</p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${b.status === "confirmed" ? "bg-green-500/20 text-green-400" : b.status === "cancelled" ? "bg-destructive/20 text-destructive" : "bg-yellow-500/20 text-yellow-400"}`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </PageLayout>
  );
};

export default Mentors;
