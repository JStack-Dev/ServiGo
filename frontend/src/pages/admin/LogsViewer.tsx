import { useEffect, useState } from "react";
import { getSystemLogs } from "./api/admin";
import { io } from "socket.io-client";
import { Search } from "lucide-react";

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
}

export default function LogsViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await getSystemLogs();
      setLogs(res.data);
    };
    fetchLogs();

    // 🧠 Conexión al socket
    const socket = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],
    });

    // Escuchar nuevos logs del backend
    socket.on("system:log", (newLog: LogEntry) => {
      setLogs((prev) => [newLog, ...prev.slice(0, 99)]); // máximo 100 logs
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Filtros
  const filtered = logs.filter((log) => {
    const matchLevel = filter === "all" || log.level === filter;
    const matchText = log.message
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchLevel && matchText;
  });

  const levelColor = (level: string) => {
    switch (level) {
      case "error":
        return "text-red-500";
      case "warn":
        return "text-yellow-500";
      case "info":
        return "text-blue-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 mt-6">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h2 className="text-xl font-semibold">Logs del Sistema (Tiempo Real)</h2>
        <div className="flex gap-2 items-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 rounded-md border dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="all">Todos</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
          </select>

          <div className="relative">
            <Search
              size={16}
              className="absolute left-2 top-2.5 text-gray-500"
            />
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-md border dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto border-t dark:border-gray-700">
        {filtered.map((log, i) => (
          <div key={i} className="border-b border-gray-200 dark:border-gray-700 py-2">
            <span className={`font-semibold ${levelColor(log.level)}`}>
              [{log.level.toUpperCase()}]
            </span>{" "}
            <span>{log.message}</span>
            <div className="text-xs text-gray-500">
              {new Date(log.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
