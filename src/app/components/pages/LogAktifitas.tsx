import React from 'react';
import { useAppData } from '../../hooks/AppDataContext';
import { Clock, User, Activity, AlertCircle } from 'lucide-react';

export function LogAktifitas() {
  const { activityLogs } = useAppData();

  return (
    <div className="space-y-6">

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {activityLogs.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <div className="text-lg font-medium text-gray-900 mb-1">Belum ada aktifitas</div>
            <div className="text-sm">Log aktifitas akan muncul di sini ketika ada perubahan data.</div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {activityLogs.map((log) => (
              <div key={log.id} className="p-5 hover:bg-slate-50 transition-colors">
                <div className="flex gap-4">
                  <div className="mt-1">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <User className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">{log.user}</div>
                        <div className="text-sm font-medium text-blue-600 mt-0.5">{log.action}</div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(log.timestamp).toLocaleString('id-ID')}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{log.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
