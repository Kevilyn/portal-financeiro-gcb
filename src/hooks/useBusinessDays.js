import { useState, useCallback } from 'react';

const useBusinessDays = () => {
  // Mock holidays (DD/MM string format)
  const holidays = [
    '01/01', // Confraternização Universal
    '21/04', // Tiradentes
    '01/05', // Dia do Trabalho
    '07/09', // Independência do Brasil
    '12/10', // Nossa Senhora Aparecida
    '02/11', // Finados
    '15/11', // Proclamação da República
    '25/12', // Natal
  ];

  const isBusinessDay = useCallback((date) => {
    const dayOfWeek = date.getDay();
    // 0 = Sunday, 6 = Saturday
    if (dayOfWeek === 0 || dayOfWeek === 6) return false;

    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (holidays.includes(formattedDate)) return false;

    return true;
  }, [holidays]);

  const addBusinessDays = useCallback((startDate, days) => {
    let count = 0;
    const currentDate = new Date(startDate);
    
    while (count < days) {
      currentDate.setDate(currentDate.getDate() + 1);
      if (isBusinessDay(currentDate)) {
        count++;
      }
    }
    return currentDate;
  }, [isBusinessDay]);

  const getBusinessDateRange = useCallback((startDate, maxDays) => {
    const dates = [];
    const currentDate = new Date(startDate);
    let count = 0;

    // Start checking from tomorrow
    currentDate.setDate(currentDate.getDate()); 

    // Loop to find next 'maxDays' business days
    // Safety break after 30 days
    for(let i = 0; i < 30 && count < maxDays; i++) {
        currentDate.setDate(currentDate.getDate() + 1);
        if (isBusinessDay(currentDate)) {
            dates.push(new Date(currentDate));
            count++;
        }
    }
    return dates;
  }, [isBusinessDay]);

  return {
    isBusinessDay,
    addBusinessDays,
    getBusinessDateRange
  };
};

export default useBusinessDays;