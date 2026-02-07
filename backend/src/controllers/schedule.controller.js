import Schedule from '../models/schedule.model.js';
import Doctor from '../models/doctor.model.js';

// Public route - no authentication required
export const getPublicSchedulesByHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    const schedules = await Schedule.find({ hospitalId, status: 'Active' })
      .populate('doctorId', 'name specialty photo qualifications experience consultationFee');
    
    res.status(200).json({
      message: 'Schedules retrieved successfully',
      data: schedules,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createSchedule = async (req, res) => {
  try {
    const hospitalId = req.body.hospitalId || req.user.hospitalId;
    const { doctorId, days, startTime, endTime, maxPatients, slotDuration, status } = req.body;

    if (!doctorId || !hospitalId) {
      return res.status(400).json({ error: 'doctorId and hospitalId are required' });
    }

    // Verify doctor exists and belongs to the hospital
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    if (doctor.hospitalId.toString() !== hospitalId) {
      return res.status(403).json({ error: 'Doctor does not belong to this hospital' });
    }

    // Check if schedule already exists for this doctor
    const existingSchedule = await Schedule.findOne({ doctorId, hospitalId });
    if (existingSchedule) {
      return res.status(400).json({ error: 'Schedule already exists for this doctor. Use update instead.' });
    }

    const schedule = new Schedule({
      doctorId,
      hospitalId,
      days: days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      startTime: startTime || '09:00',
      endTime: endTime || '17:00',
      maxPatients: maxPatients || 20,
      slotDuration: slotDuration || 30,
      status: status || 'Active',
    });

    await schedule.save();

    // Populate doctor info for response
    await schedule.populate('doctorId', 'name specialty photo');

    res.status(201).json({
      message: 'Schedule created successfully',
      data: schedule,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSchedulesByHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    // Verify user has access to this hospital
    if (req.user.userType === 'hospital_admin' && req.user.hospitalId !== hospitalId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const schedules = await Schedule.find({ hospitalId }).populate('doctorId', 'name specialty photo');
    res.status(200).json({
      message: 'Schedules retrieved successfully',
      data: schedules,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getScheduleById = async (req, res) => {
  try {
    const { scheduleId } = req.params;

    const schedule = await Schedule.findById(scheduleId).populate('doctorId', 'name specialty photo');
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    // Verify user has access to this schedule's hospital
    if (req.user.userType === 'hospital_admin' && req.user.hospitalId !== schedule.hospitalId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.status(200).json({
      message: 'Schedule retrieved successfully',
      data: schedule,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getScheduleByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Verify user has access to this doctor's hospital
    if (req.user.userType === 'hospital_admin' && req.user.hospitalId !== doctor.hospitalId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const schedule = await Schedule.findOne({ doctorId }).populate('doctorId', 'name specialty photo');

    res.status(200).json({
      message: 'Schedule retrieved successfully',
      data: schedule,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { days, startTime, endTime, maxPatients, slotDuration, status } = req.body;

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    // Verify user has access to this schedule's hospital
    if (req.user.userType === 'hospital_admin' && req.user.hospitalId !== schedule.hospitalId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Build update object with only provided fields
    const updateData = {};
    if (days !== undefined) updateData.days = days;
    if (startTime !== undefined) updateData.startTime = startTime;
    if (endTime !== undefined) updateData.endTime = endTime;
    if (maxPatients !== undefined) updateData.maxPatients = maxPatients;
    if (slotDuration !== undefined) updateData.slotDuration = slotDuration;
    if (status !== undefined) updateData.status = status;

    const updatedSchedule = await Schedule.findByIdAndUpdate(
      scheduleId,
      updateData,
      { new: true }
    ).populate('doctorId', 'name specialty photo');

    res.status(200).json({
      message: 'Schedule updated successfully',
      data: updatedSchedule,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    // Verify user has access to this schedule's hospital
    if (req.user.userType === 'hospital_admin' && req.user.hospitalId !== schedule.hospitalId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Schedule.findByIdAndDelete(scheduleId);

    res.status(200).json({
      message: 'Schedule deleted successfully',
      data: null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
