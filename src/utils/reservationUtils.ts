/**
 * Utility functions for reservation management
 */

/**
 * Checks if a specific date and time slot is already booked
 * @param selectedDate - The selected date
 * @param selectedTime - The selected time slot (e.g., "14:00")
 * @param bookedSlots - Array of booked slots in ISO string format
 * @returns boolean - true if slot is booked, false if available
 */
export const isSlotBooked = (
  selectedDate: Date,
  selectedTime: string,
  bookedSlots: string[]
): boolean => {
  if (!selectedDate || !selectedTime || !bookedSlots.length) {
    return false;
  }

  // Convert selected date and time to ISO string
  const [hours, minutes] = selectedTime.split(':');
  const selectedDateTime = new Date(selectedDate);
  selectedDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  const selectedISO = selectedDateTime.toISOString();

  // Check if this exact datetime is in bookedSlots
  return bookedSlots.some(bookedSlot => {
    const bookedDate = new Date(bookedSlot);
    const selectedCheck = new Date(selectedISO);
    
    // Compare dates (year, month, day, hour, minute)
    return bookedDate.getTime() === selectedCheck.getTime();
  });
};

/**
 * Gets all booked time slots for a specific date
 * @param selectedDate - The date to check
 * @param bookedSlots - Array of booked slots in ISO string format
 * @returns string[] - Array of booked time slots for that date (e.g., ["14:00", "16:00"])
 */
export const getBookedTimeSlotsForDate = (
  selectedDate: Date,
  bookedSlots: string[]
): string[] => {
  if (!selectedDate || !bookedSlots.length) {
    return [];
  }

  const selectedDateStr = selectedDate.toDateString();
  
  return bookedSlots
    .filter(bookedSlot => {
      const bookedDate = new Date(bookedSlot);
      return bookedDate.toDateString() === selectedDateStr;
    })
    .map(bookedSlot => {
      const bookedDate = new Date(bookedSlot);
      return `${bookedDate.getHours().toString().padStart(2, '0')}:${bookedDate.getMinutes().toString().padStart(2, '0')}`;
    });
};

/**
 * Validates if a reservation can be made for the given date and time
 * @param selectedDate - The selected date
 * @param selectedTime - The selected time slot
 * @param bookedSlots - Array of booked slots
 * @returns object with validation result and message
 */
export const validateReservationSlot = (
  selectedDate: Date,
  selectedTime: string,
  bookedSlots: string[]
): { isValid: boolean; message?: string } => {
  if (!selectedDate || !selectedTime) {
    return { isValid: false, message: "Lütfen tarih ve saat seçiniz!" };
  }

  // Check if the selected datetime is in the past
  const [hours, minutes] = selectedTime.split(':');
  const selectedDateTime = new Date(selectedDate);
  selectedDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  if (selectedDateTime <= new Date()) {
    return { isValid: false, message: "Geçmiş tarih ve saatler için rezervasyon yapılamaz!" };
  }

  // Check if slot is already booked
  if (isSlotBooked(selectedDate, selectedTime, bookedSlots)) {
    return { 
      isValid: false, 
      message: `Bu tarih ve saat (${selectedDate.toLocaleDateString('tr-TR')} ${selectedTime}) için zaten rezervasyon bulunmaktadır!` 
    };
  }

  return { isValid: true };
};

/**
 * Creates ISO string from date and time
 * @param date - The date object
 * @param time - Time string in "HH:MM" format
 * @returns ISO string
 */
export const createReservationDateTime = (date: Date, time: string): string => {
  const [hours, minutes] = time.split(':');
  const reservationDateTime = new Date(date);
  reservationDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return reservationDateTime.toISOString();
};

/**
 * Formats booked slots for display
 * @param bookedSlots - Array of booked slots in ISO string format
 * @returns Formatted string for display
 */
export const formatBookedSlotsDisplay = (bookedSlots: string[]): string => {
  if (!bookedSlots.length) return "Henüz rezervasyon yok";
  
  const grouped = bookedSlots.reduce((acc, slot) => {
    const date = new Date(slot);
    const dateStr = date.toLocaleDateString('tr-TR');
    const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(timeStr);
    
    return acc;
  }, {} as Record<string, string[]>);
  
  return Object.entries(grouped)
    .map(([date, times]) => `${date}: ${times.join(', ')}`)
    .join('\n');
}; 