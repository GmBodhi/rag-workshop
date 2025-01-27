"use client";
import React, { useEffect, useState } from "react";
import { Ticket } from "lucide-react";
import { useParams } from "next/navigation";
import CommunityDialog from "./dialog";

const api = "https://rag-workshop-registration.exstd.workers.dev/card?id=";

const ModernTicket = () => {
  const { id } = useParams();

  const [isOpen, setIsOpen] = useState(false);

  const setDialogOff = () => {
    setIsOpen(false);
  };

  const [ticketData, set] = useState({
    branch: "Unknown",
    college: "Unknown",
    email: "Unknown",
    fullName: "Unknown",
    phone_number: "Unknown",
    registration_date: "2025-01-26",
    semester: "s0",
  });

  async function fetchURL() {
    try {
      const res = await fetch(api + id).then((res) => res.json());
      console.log("Ticket data:", res);
      if (res.email) {
        set(res);
        setIsOpen(localStorage.getItem("community-dialog") !== "true");
      } else {
        alert(res.errors?.join?.(", ") || "Failed to fetch ticket data");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to fetch ticket data");
    }
  }

  useEffect(() => {
    fetchURL().catch(fetchURL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-xl relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern
              id="pattern-circles"
              x="0"
              y="0"
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="15" cy="15" r="5" fill="#A855F7" />
            </pattern>
            <pattern
              id="pattern-stars"
              x="10"
              y="10"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M20 0l4.33 13.33h14.01l-11.34 8.23 4.33 13.33-11.33-8.23-11.34 8.23 4.33-13.33-11.33-8.23h14.01z"
                fill="#3B82F6"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#pattern-circles)" />
            <rect
              width="100%"
              height="100%"
              fill="url(#pattern-stars)"
              opacity="0.5"
            />
          </svg>
        </div>

        {/* Animated top gradient */}
        <div className="relative h-2 overflow-hidden">
          <div
            className="absolute inset-0 animate-[gradient_3s_ease_infinite]"
            style={{
              background:
                "linear-gradient(90deg, #3B82F6, #A855F7, #F59E0B, #3B82F6)",
              backgroundSize: "200% 100%",
            }}
          ></div>
        </div>

        {/* Ticket content */}
        <div className="p-6 relative">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Ticket className="w-6 h-6 text-blue-400" />
              <h1 className="text-blue-400 font-bold text-xl">RAG Workshop</h1>
            </div>
            <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
              Active
            </span>
          </div>

          {/* Ticket details */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-slate-400 text-sm">Attendee</label>
              <p className="text-white font-medium">{ticketData.fullName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm">Date</label>
                <p className="text-white font-medium">Feb 1, 2025</p>
              </div>
              <div>
                <label className="text-slate-400 text-sm">Time</label>
                <p className="text-white font-medium">09:30 AM</p>
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-sm">Location</label>
              <p className="text-white font-medium">
                <a
                  href="https://maps.app.goo.gl/vP8kNfNgYbrqzhXEA"
                  target="_blank"
                  className="text-blue-400 hover:underline"
                >
                  SCT, Tvm (Offline)
                </a>
              </p>
            </div>
          </div>

          {/* Neural Network ASCII art section */}
          <div className="relative p-6 bg-slate-900/50 rounded-xl text-center overflow-hidden font-mono">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-amber-300/10"></div>
            <div className="w-full min-h-max p-0 flex items-center justify-center">
              <p className="text-purple-400 p-0 m-0 h-min w-min text-md rotate-90 ">
                {`         ○       
       ╱╱│╲╲       
       ○──○─○──○     
       ╱│╲╱│╲│╱│╲    
       ○─○─○─○─○─○   
       │╲│╱│╲│╱│╲│   
       ○─○─○─○─○─○   
       ╲│╱│╲│╱│╱    
       ○──○─○──○     
       ╲╲│╱╱       
       ○         `
                  .split("\n")
                  .map((line, i) => (
                    <span key={i} className="block">
                      {" "}
                      {line}{" "}
                    </span>
                  ))}
              </p>
            </div>

            <p className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-amber-300 bg-clip-text text-transparent">
              Get Ready to Build Amazing AI Apps!
            </p>
            <p className="text-slate-300 text-sm mt-2">
              Your journey to RAG mastery begins here
            </p>
          </div>

          {/* Workshop highlights */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <p className="text-slate-300 text-sm">
                Vector databases & embeddings
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              <p className="text-slate-300 text-sm">
                Prompt engineering mastery
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-amber-300"></div>
              <p className="text-slate-300 text-sm">Real-world applications</p>
            </div>
          </div>
        </div>

        {/* Animated bottom gradient */}
        <div className="relative h-2 overflow-hidden">
          <div
            className="absolute inset-0 animate-[gradient_3s_ease_infinite]"
            style={{
              background:
                "linear-gradient(90deg, #F59E0B, #A855F7, #3B82F6, #F59E0B)",
              backgroundSize: "200% 100%",
            }}
          ></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
      <CommunityDialog isOpen={isOpen} onClose={() => setDialogOff()} />
    </div>
  );
};

export default ModernTicket;
