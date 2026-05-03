import React from "react";
import { useProjectStats } from "../../hooks/useProjects";
import Spinner from "../Spinner";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

const OverviewTab = ({ projectId }) => {
  const { data: sData, isLoading } = useProjectStats(projectId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  const stats = sData?.data || { todo: 0, in_progress: 0, in_review: 0, done: 0, overdue: 0 };

  const chartData = [
    { name: "To Do", value: stats.todo, color: "#64748b" },
    { name: "In Progress", value: stats.in_progress, color: "#3b82f6" },
    { name: "In Review", value: stats.in_review, color: "#f59e0b" },
    { name: "Done", value: stats.done, color: "#10b981" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Stats Summary */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-slate-900">Task Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tasks</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{stats.total || 0}</p>
          </div>
          <div className="p-4 rounded-xl bg-red-50 border border-red-100">
            <p className="text-xs font-semibold text-red-500 uppercase tracking-wider">Overdue</p>
            <p className="text-3xl font-extrabold text-red-600 mt-1">{stats.overdue || 0}</p>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          {chartData.map((item) => (
            <div key={item.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-slate-500">{item.name}</span>
                <span className="text-slate-900">{item.value}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${stats.total > 0 ? (item.value / stats.total) * 100 : 0}%`,
                    backgroundColor: item.color 
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[400px]">
        <h3 className="text-xl font-bold text-slate-900 mb-8">Status Distribution</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip 
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
