// Appointment Service - Helper functions for appointment operations
import Appointment from '../models/appointment.model.js';
import Doctor from '../models/doctor.model.js';

/**
 * Check if a time slot is available for a doctor
 * @param {string} doctorId - Doctor ID
 * @param {Date} appointmentDate - Appointment start date/time
 * @param {number} duration - Duration in minutes (30, 45, or 60)
 * @returns {Promise<boolean>} - True if slot is available
 */
export const isSlotAvailable = async (doctorId, appointmentDate, duration) => {
  try {
    const appointmentEndTime = new Date(appointmentDate.getTime() + duration * 60000);

    const existingAppointments = await Appointment.find({
      doctorId,
      status: { $in: ['confirmed', 'pending'] },
      appointmentDate: {
        $lt: appointmentEndTime,
      },
    });

    for (const appointment of existingAppointments) {
      const existingEndTime = new Date(
        appointment.appointmentDate.getTime() + appointment.duration * 60000
      );
      if (appointmentDate < existingEndTime && appointmentEndTime > appointment.appointmentDate) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error checking slot availability:', error);
    throw error;
  }
};

/**
 * Get available time slots for a doctor on a specific date
 * @param {string} doctorId - Doctor ID
 * @param {Date} date - Date to check
 * @param {number} slotDuration - Slot duration in minutes (default: 30)
 * @returns {Promise<Array>} - Array of available slots
 */
export const getAvailableSlotsForDate = async (doctorId, date, slotDuration = 30) => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      doctorId,
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: { $in: ['confirmed', 'pending'] },
    });

    const availableSlots = [];
    const workingHours = {
      start: 9,
      end: 17,
    };

    for (let hour = workingHours.start; hour < workingHours.end; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const slotTime = new Date(date);
        slotTime.setHours(hour, minute, 0, 0);

        let isAvailable = true;
        for (const appointment of appointments) {
          const appointmentEnd = new Date(
            appointment.appointmentDate.getTime() + appointment.duration * 60000
          );
          if (slotTime >= appointment.appointmentDate && slotTime < appointmentEnd) {
            isAvailable = false;
            break;
          }
        }

        if (isAvailable && slotTime > new Date()) {
          availableSlots.push({
            time: slotTime.toISOString(),
            label: `${hour}:${minute === 0 ? '00' : minute}`,
          });
        }
      }
    }

    return availableSlots;
  } catch (error) {
    console.error('Error getting available slots:', error);
    throw error;
  }
};

/**
 * Get appointment statistics for a hospital
 * @param {string} hospitalId - Hospital ID
 * @returns {Promise<Object>} - Statistics object with appointment counts by status
 */
export const getAppointmentStats = async (hospitalId) => {
  try {
    const stats = await Appointment.aggregate([
      { $match: { hospitalId: hospitalId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
      total: 0,
    };

    stats.forEach((stat) => {
      result[stat._id] = stat.count;
      result.total += stat.count;
    });

    return result;
  } catch (error) {
    console.error('Error getting appointment stats:', error);
    throw error;
  }
};

/**
 * Get doctor's appointment count for a specific date range
 * @param {string} doctorId - Doctor ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<number>} - Number of appointments in date range
 */
export const getDoctorAppointmentCount = async (doctorId, startDate, endDate) => {
  try {
    const count = await Appointment.countDocuments({
      doctorId,
      appointmentDate: {
        $gte: startDate,
        $lte: endDate,
      },
      status: { $in: ['confirmed', 'completed'] },
    });

    return count;
  } catch (error) {
    console.error('Error getting doctor appointment count:', error);
    throw error;
  }
};

/**
 * Cancel all pending appointments for a doctor (admin feature)
 * @param {string} doctorId - Doctor ID
 * @param {string} reason - Reason for cancellation
 * @returns {Promise<Object>} - Result with count of cancelled appointments
 */
export const cancelDoctorPendingAppointments = async (doctorId, reason) => {
  try {
    const result = await Appointment.updateMany(
      {
        doctorId,
        status: 'pending',
      },
      {
        status: 'cancelled',
        adminNotes: reason || 'Cancelled by admin',
      }
    );

    return {
      modifiedCount: result.modifiedCount,
      message: `${result.modifiedCount} pending appointments cancelled`,
    };
  } catch (error) {
    console.error('Error cancelling doctor pending appointments:', error);
    throw error;
  }
};

/**
 * Get upcoming appointments for a doctor
 * @param {string} doctorId - Doctor ID
 * @param {number} days - Number of days to look ahead (default: 7)
 * @returns {Promise<Array>} - Array of upcoming appointments
 */
export const getUpcomingAppointments = async (doctorId, days = 7) => {
  try {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    const appointments = await Appointment.find({
      doctorId,
      appointmentDate: {
        $gte: startDate,
        $lte: endDate,
      },
      status: { $in: ['confirmed', 'pending'] },
    })
      .populate('doctorId')
      .sort({ appointmentDate: 1 });

    return appointments;
  } catch (error) {
    console.error('Error getting upcoming appointments:', error);
    throw error;
  }
};

/**
 * Generate appointment report for hospital admin
 * @param {string} hospitalId - Hospital ID
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<Object>} - Detailed report
 */
export const generateAppointmentReport = async (hospitalId, startDate, endDate) => {
  try {
    const appointments = await Appointment.find({
      hospitalId,
      appointmentDate: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate('doctorId');

    const report = {
      totalAppointments: appointments.length,
      byStatus: {
        pending: 0,
        confirmed: 0,
        cancelled: 0,
        completed: 0,
      },
      byDoctor: {},
      byDuration: {
        30: 0,
        45: 0,
        60: 0,
      },
      dateRange: {
        start: startDate,
        end: endDate,
      },
    };

    appointments.forEach((apt) => {
      report.byStatus[apt.status]++;
      report.byDuration[apt.duration]++;

      const doctorName = apt.doctorId?.name || 'Unknown';
      if (!report.byDoctor[doctorName]) {
        report.byDoctor[doctorName] = {
          total: 0,
          pending: 0,
          confirmed: 0,
          cancelled: 0,
          completed: 0,
        };
      }
      report.byDoctor[doctorName].total++;
      report.byDoctor[doctorName][apt.status]++;
    });

    return report;
  } catch (error) {
    console.error('Error generating appointment report:', error);
    throw error;
  }
};
