import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { kalenderEvents } from '../lib/data';

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export function KalenderKegiatan() {
  const [currentMonth, setCurrentMonth] = useState(5); // Juni (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025);
  const [filterBagian, setFilterBagian] = useState('semua');

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return kalenderEvents.filter(event => event.date === dateStr);
  };

  const calendarDays = [];
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-32 bg-gray-50"></div>);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const events = getEventsForDate(day);
    const isToday = day === 12 && currentMonth === 5 && currentYear === 2025;

    calendarDays.push(
      <div
        key={day}
        className={`h-32 border border-gray-200 p-2 ${isToday ? 'bg-blue-50' : 'bg-white'} hover:bg-gray-50 transition-colors`}
      >
        <div className={`text-sm font-medium mb-2 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
          {day}
          {isToday && <span className="ml-1 text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">Hari Ini</span>}
        </div>
        <div className="space-y-1">
          {events.map((event, idx) => (
            <div
              key={idx}
              className={`text-xs p-1.5 rounded border ${event.color} truncate cursor-pointer hover:opacity-80`}
              title={event.title}
            >
              {event.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">


      {/* Filters & Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">
                {months[currentMonth]} {currentYear}
              </h2>
            </div>

            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filterBagian}
              onChange={(e) => setFilterBagian(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="semua">Semua Bidang</option>
              <option value="sekretariat">Sekretariat DPRD</option>
              <option value="humas">Humas</option>
              <option value="persidangan">Persidangan</option>
              <option value="umum">Umum</option>
              <option value="keuangan">Keuangan</option>
            </select>

            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                Bulanan
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
                Mingguan
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
                Tahunan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {daysOfWeek.map((day) => (
            <div key={day} className="py-3 px-2 text-center text-sm font-semibold text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {calendarDays}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Keterangan Warna</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded"></div>
            <span className="text-sm text-gray-700">Selesai</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-700">Berjalan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-700">Overdue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <span className="text-sm text-gray-700">Belum Mulai</span>
          </div>
        </div>
      </div>
    </div>
  );
}
