import Doctor from '../models/doctor.model.js';

export const createDoctor = async (req, res) => {
  try {
    const { name, specialty, phone, email, hospitalId } = req.body;

    if (!name || !specialty || !phone || !email || !hospitalId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const doctor = new Doctor({
      name,
      specialty,
      phone,
      email,
      hospitalId,
    });

    await doctor.save();
    res.status(201).json({
      message: 'Doctor added successfully',
      doctor,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDoctorsByHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    const doctors = await Doctor.find({ hospitalId });
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { name, specialty, phone, email } = req.body;

    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { name, specialty, phone, email },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.status(200).json({
      message: 'Doctor updated successfully',
      doctor,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findByIdAndDelete(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
