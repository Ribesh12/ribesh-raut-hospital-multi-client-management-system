import Doctor from '../models/doctor.model.js';
import Appointment from '../models/appointment.model.js';
import Hospital from '../models/hospital.model.js';
import ContactForm from '../models/contactForm.model.js';
import Service from '../models/service.model.js';
import mongoose from 'mongoose';

export const getDashboardStats = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    if (!hospitalId) {
      return res.status(400).json({ error: 'Hospital ID is required' });
    }

    // Verify user has access to this hospital
    if (req.user.userType === 'hospital_admin' && req.user.hospitalId !== hospitalId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Verify hospital exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    // Get all statistics
    const totalDoctors = await Doctor.countDocuments({ hospitalId });
    const activeDoctors = await Doctor.countDocuments({ 
      hospitalId,
      status: 'Active'
    });

    // Calculate doctor growth (compare current month vs last month)
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const doctorsThisMonth = await Doctor.countDocuments({
      hospitalId,
      createdAt: { $gte: thisMonthStart }
    });
    const doctorsLastMonth = await Doctor.countDocuments({
      hospitalId,
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });

    // Calculate doctor growth percentage
    let doctorGrowth = 0;
    if (doctorsLastMonth > 0) {
      doctorGrowth = Math.round(((doctorsThisMonth - doctorsLastMonth) / doctorsLastMonth) * 100);
    } else if (doctorsThisMonth > 0) {
      doctorGrowth = 100;
    }

    const totalAppointments = await Appointment.countDocuments({ hospitalId });
    const pendingAppointments = await Appointment.countDocuments({ 
      hospitalId, 
      status: 'pending' 
    });
    const confirmedAppointments = await Appointment.countDocuments({ 
      hospitalId, 
      status: 'confirmed' 
    });
    const completedAppointments = await Appointment.countDocuments({ 
      hospitalId, 
      status: 'completed' 
    });
    const cancelledAppointments = await Appointment.countDocuments({ 
      hospitalId, 
      status: 'cancelled' 
    });

    // Get today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await Appointment.countDocuments({
      hospitalId,
      appointmentDate: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    // Get this week's appointments
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const thisWeekAppointments = await Appointment.countDocuments({
      hospitalId,
      appointmentDate: {
        $gte: weekStart,
        $lt: weekEnd,
      },
    });

    // Get recent appointments for dashboard
    const recentAppointments = await Appointment.find({ hospitalId })
      .populate('doctorId', 'name specialty')
      .sort({ appointmentDate: -1 })
      .limit(5);

    // Get contact forms / messages
    const totalContactForms = await ContactForm.countDocuments({ hospitalId });
    const unreadContactForms = await ContactForm.countDocuments({ 
      hospitalId,
      status: 'unread'
    });

    // Get unique patients from appointments
    const uniquePatients = await Appointment.distinct('userEmail', { hospitalId });
    const totalPatients = uniquePatients.length;

    // Calculate average appointment duration from services
    const hospitalIdObj = new mongoose.Types.ObjectId(hospitalId);
    const avgDurationResult = await Service.aggregate([
      { $match: { hospitalId: hospitalIdObj } },
      { $group: { _id: null, avgDuration: { $avg: '$duration' } } },
    ]);
    const avgAppointmentDuration = Math.round(avgDurationResult[0]?.avgDuration || 30);

    // Get recent messages/contact forms
    const recentMessages = await ContactForm.find({ hospitalId })
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({
      message: 'Dashboard statistics retrieved successfully',
      data: {
        hospitalInfo: {
          id: hospital._id,
          name: hospital.name,
          email: hospital.email,
          phone: hospital.phone,
          address: hospital.address,
        },
        statistics: {
          doctors: {
            total: totalDoctors,
            active: activeDoctors,
            growth: doctorGrowth,
          },
          appointments: {
            total: totalAppointments,
            pending: pendingAppointments,
            confirmed: confirmedAppointments,
            completed: completedAppointments,
            cancelled: cancelledAppointments,
            today: todayAppointments,
            thisWeek: thisWeekAppointments,
          },
          patients: {
            total: totalPatients,
          },
          contactForms: {
            total: totalContactForms,
            unread: unreadContactForms,
          },
          avgAppointmentDuration,
        },
        recentAppointments: recentAppointments.map((apt) => ({
          _id: apt._id,
          patientName: apt.userName,
          patientEmail: apt.userEmail,
          doctorName: apt.doctorId?.name,
          doctorSpecialty: apt.doctorId?.specialty,
          appointmentDate: apt.appointmentDate,
          status: apt.status,
        })),
        recentMessages: recentMessages.map((msg) => ({
          _id: msg._id,
          name: msg.name,
          email: msg.email,
          phone: msg.phone,
          subject: msg.subject,
          message: msg.message,
          status: msg.status,
          createdAt: msg.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const getDashboardOverview = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    if (!hospitalId) {
      return res.status(400).json({ error: 'Hospital ID is required' });
    }

    // Verify user has access to this hospital
    if (req.user.userType === 'hospital_admin' && req.user.hospitalId !== hospitalId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Quick overview for dashboard
    const totalDoctors = await Doctor.countDocuments({ hospitalId });
    const totalAppointments = await Appointment.countDocuments({ hospitalId });

    const appointmentStats = await Appointment.aggregate([
      { $match: { hospitalId: hospitalId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const appointmentsByStatus = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };

    appointmentStats.forEach((stat) => {
      appointmentsByStatus[stat._id] = stat.count;
    });

    // Get upcoming appointments (next 7 days)
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingAppointments = await Appointment.countDocuments({
      hospitalId,
      appointmentDate: {
        $gte: today,
        $lte: nextWeek,
      },
      status: { $in: ['pending', 'confirmed'] },
    });

    return res.status(200).json({
      message: 'Dashboard overview retrieved successfully',
      data: {
        totalDoctors,
        totalAppointments,
        appointmentsByStatus,
        upcomingAppointments,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    return res.status(500).json({ error: error.message });
  }
};
