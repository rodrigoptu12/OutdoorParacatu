// components/admin/DatePickerWithOccupancy.tsx
"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  occupiedDates: string[];
  minDate?: string;
  label: string;
  required?: boolean;
  onError?: (error: string) => void;
}

export default function DatePickerWithOccupancy({
  value,
  onChange,
  occupiedDates,
  minDate,
  label,
  required = false,
  onError,
}: DatePickerProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
      setCurrentMonth(new Date(value));
    }
  }, [value]);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const isDateOccupied = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return occupiedDates.includes(dateStr);
  };

  const isDateDisabled = (date: Date) => {
    if (minDate) {
      const min = new Date(minDate);
      if (date < min) return true;
    }
    return false;
  };

  const handleDateClick = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    if (isDateDisabled(date)) {
      if (onError) onError("Esta data não pode ser selecionada");
      return;
    }

    if (isDateOccupied(date)) {
      if (onError) onError("Esta data está ocupada!");
      return;
    }

    setSelectedDate(date);
    onChange(date.toISOString().split("T")[0]);
    setShowCalendar(false);
    if (onError) onError("");
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Dias vazios no início
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const isSelected =
        selectedDate &&
        date.toISOString().split("T")[0] ===
          selectedDate.toISOString().split("T")[0];
      const isOccupied = isDateOccupied(date);
      const isDisabled = isDateDisabled(date);
      const isToday =
        new Date().toISOString().split("T")[0] ===
        date.toISOString().split("T")[0];

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateClick(day)}
          disabled={isDisabled || isOccupied}
          className={`
            h-8 w-8 rounded-full text-sm font-medium transition-all
            ${
              isSelected
                ? "bg-green-600 text-white"
                : isToday
                ? "bg-green-100 text-green-800"
                : isOccupied
                ? "bg-red-100 text-red-600 cursor-not-allowed"
                : isDisabled
                ? "text-gray-300 cursor-not-allowed"
                : "hover:bg-gray-100 text-gray-900"
            }
          `}
          title={
            isOccupied
              ? "Data ocupada"
              : isDisabled
              ? "Data indisponível"
              : `${day} de ${monthNames[currentMonth.getMonth()]}`
          }
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && "*"}
      </label>
      
      <div className="relative">
        <input
          type="text"
          value={
            selectedDate
              ? selectedDate.toLocaleDateString("pt-BR")
              : ""
          }
          onClick={() => setShowCalendar(!showCalendar)}
          readOnly
          required={required}
          placeholder="Selecione uma data"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2 border cursor-pointer"
        />
        
        {showCalendar && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowCalendar(false)}
            />
            <div className="absolute z-50 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
              {/* Header do calendário */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                
                <h3 className="text-sm font-semibold text-gray-900">
                  {monthNames[currentMonth.getMonth()]}{" "}
                  {currentMonth.getFullYear()}
                </h3>
                
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Dias da semana */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="h-8 w-8 flex items-center justify-center text-xs font-medium text-gray-500"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Dias do mês */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendarDays()}
              </div>

              {/* Legenda */}
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-1">
                <div className="flex items-center text-xs">
                  <div className="h-3 w-3 bg-red-100 rounded-full mr-2" />
                  <span className="text-gray-600">Datas ocupadas</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="h-3 w-3 bg-green-100 rounded-full mr-2" />
                  <span className="text-gray-600">Hoje</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="h-3 w-3 bg-green-600 rounded-full mr-2" />
                  <span className="text-gray-600">Data selecionada</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
