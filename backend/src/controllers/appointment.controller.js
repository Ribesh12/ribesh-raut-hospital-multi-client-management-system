import Appointment from '../models/appointment.model.js';
import Doctor from '../models/doctor.model.js';

export const createAppointmentRequest = async (req, res) => {
  try {
    const { doctorId, hospitalId, appointmentDate, duration, notes, userName, userEmail, userPhone } = req.body;

    if (!doctorId || !hospitalId || !appointmentDate || !duration || !userName || !userEmail || !userPhone) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (![30, 45, 60].includes(duration)) {
      return res.status(400).json({ error: 'Duration must be 30, 45, or 60 minutes' });
    }

    const appointmentDateObj = new Date(appointmentDate);
    if (appointmentDateObj < new Date()) {
      return res.status(400).json({ error: 'Appointment date cannot be in the past' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Check for overlapping appointments
    const appointmentEndTime = new Date(appointmentDateObj.getTime() + duration * 60000);
    const existingAppointments = await Appointment.find({
      doctorId,
      status: { $in: ['confirmed', 'pending'] },
      appointmentDate: {
        $lt: appointmentEndTime,
      },
    });

    for (const existing of existingAppointments) {
      const existingEndTime = new Date(existing.appointmentDate.getTime() + existing.duration * 60000);
      if (appointmentDateObj < existingEndTime && appointmentEndTime > existing.appointmentDate) {
        return res.status(409).json({ error: 'Doctor is not available at this time slot' });
      }
    }

    const appointment = new Appointment({
      doctorId,
      userId: req.body.userId || 'guest',
      userName,
      userEmail,
      userPhone,
      hospitalId,
      appointmentDate: appointmentDateObj,
      duration,
      notes: notes || '',
      status: 'pending',
    });

    await appointment.save();

    // Populate doctor details
    await appointment.populate('doctorId');

    res.status(201).json({
      message: 'Appointment request created successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { status } = req.query;

    let filter = { doctorId };
    if (status) {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter)
      .populate('doctorId')
      .populate('hospitalId')
      .sort({ appointmentDate: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAppointmentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    let filter = { userId };
    if (status) {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter)
      .populate('doctorId')
      .populate('hospitalId')
      .sort({ appointmentDate: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAppointmentsByHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { status, doctorId } = req.query;

    let filter = { hospitalId };
    if (status) {
      filter.status = status;
    }
    if (doctorId) {
      filter.doctorId = doctorId;
    }

    const appointments = await Appointment.find(filter)
      .populate('doctorId')
      .populate('hospitalId')
      .sort({ appointmentDate: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, adminNotes } = req.body;

    if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { 
        status, 
        adminNotes: adminNotes || '' 
      },
      { new: true }
    )
      .populate('doctorId')
      .populate('hospitalId');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json({
      message: 'Appointment status updated successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { reason } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { 
        status: 'cancelled',
        adminNotes: reason || 'Cancelled by user'
      },
      { new: true }
    )
      .populate('doctorId')
      .populate('hospitalId');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json({
      message: 'Appointment cancelled successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({ error: 'Doctor ID and date are required' });
    }

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

    // Generate available slots (e.g., hourly slots from 9 AM to 5 PM)
    const availableSlots = [];
    const workingHours = {
      start: 9,
      end: 17,
    };

    for (let hour = workingHours.start; hour < workingHours.end; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotTime = new Date(date);
        slotTime.setHours(hour, minute, 0, 0);

        let isAvailable = true;
        for (const appointment of appointments) {
          const appointmentEnd = new Date(appointment.appointmentDate.getTime() + appointment.duration * 60000);
          if (slotTime >= appointment.appointmentDate && slotTime < appointmentEnd) {
            isAvailable = false;
            break;
          }
        }

        if (isAvailable) {
          availableSlots.push({
            time: slotTime.toISOString(),
            label: `${hour}:${minute === 0 ? '00' : minute}`,
          });
        }
      }
    }

    res.status(200).json(availableSlots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId)
      .populate('doctorId')
      .populate('hospitalId');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
