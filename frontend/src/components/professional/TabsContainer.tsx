"use client";
import { useState } from "react";
import JobsActive from "./JobsActive";
import JobsCompleted from "./JobsCompleted";
import OffersIncoming from "./OffersIncoming";
import { ClipboardList, CheckCircle, Bell } from "lucide-react";

export default function TabsContainer() {
  const [activeTab, setActiveTab] = useState<"enCurso" | "finalizados" | "ofertas">("enCurso");

  return (
    <div className="mb-6">
      {/* 🧭 Navegación entre pestañas */}
      <div className="flex justify-around mb-4">
        <button
          onClick={() => setActiveTab("enCurso")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            activeTab === "enCurso" ? "bg-blue-600" : "bg-white/20 hover:bg-white/30"
          }`}
        >
          <ClipboardList size={18} /> En curso
        </button>
        <button
          onClick={() => setActiveTab("finalizados")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            activeTab === "finalizados" ? "bg-green-600" : "bg-white/20 hover:bg-white/30"
          }`}
        >
          <CheckCircle size={18} /> Finalizados
        </button>
        <button
          onClick={() => setActiveTab("ofertas")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            activeTab === "ofertas" ? "bg-yellow-500" : "bg-white/20 hover:bg-white/30"
          }`}
        >
          <Bell size={18} /> Ofertas
        </button>
      </div>

      {/* 📦 Contenido */}
      <div className="bg-white/10 rounded-xl p-4 min-h-[200px]">
        {activeTab === "enCurso" && <JobsActive />}
        {activeTab === "finalizados" && <JobsCompleted />}
        {activeTab === "ofertas" && <OffersIncoming />}
      </div>
    </div>
  );
}
