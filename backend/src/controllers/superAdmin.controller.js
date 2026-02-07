import Doctor from '../models/doctor.model.js';
import Appointment from '../models/appointment.model.js';
import Hospital from '../models/hospital.model.js';
import ContactForm from '../models/contactForm.model.js';
import WebsiteContactForm from '../models/websiteContactForm.model.js';
import Service from '../models/service.model.js';
import Admin from '../models/admin.model.js';
import mongoose from 'mongoose';

// Get super admin dashboard statistics
export const getSuperAdminStats = async (req, res) => {
  try {
    // Verify user is a website admin
    if (req.user.userType !== 'website_admin') {
      return res.status(403).json({ error: 'Access denied. Super admin only.' });
    }

    // Get all statistics
    const totalHospitals = await Hospital.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const totalContactForms = await ContactForm.countDocuments();
    const totalServices = await Service.countDocuments();

    // Get hospitals with profile complete
    const hospitalsWithProfile = await Hospital.countDocuments({ isProfileComplete: true });

    // Calculate growth metrics
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Hospital growth
    const hospitalsThisMonth = await Hospital.countDocuments({
      createdAt: { $gte: thisMonthStart }
    });
    const hospitalsLastMonth = await Hospital.countDocuments({
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });

    let hospitalGrowth = 0;
    if (hospitalsLastMonth > 0) {
      hospitalGrowth = Math.round(((hospitalsThisMonth - hospitalsLastMonth) / hospitalsLastMonth) * 100);
    } else if (hospitalsThisMonth > 0) {
      hospitalGrowth = 100;
    }

    // Doctor growth
    const doctorsThisMonth = await Doctor.countDocuments({
      createdAt: { $gte: thisMonthStart }
    });
    const doctorsLastMonth = await Doctor.countDocuments({
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });

    let doctorGrowth = 0;
    if (doctorsLastMonth > 0) {
      doctorGrowth = Math.round(((doctorsThisMonth - doctorsLastMonth) / doctorsLastMonth) * 100);
    } else if (doctorsThisMonth > 0) {
      doctorGrowth = 100;
    }

    // Appointment statistics by status
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const confirmedAppointments = await Appointment.countDocuments({ status: 'confirmed' });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'cancelled' });

    // Get today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAppointments = await Appointment.countDocuments({
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
      appointmentDate: {
        $gte: weekStart,
        $lt: weekEnd,
      },
    });

    // Get unique patients
    const uniquePatients = await Appointment.distinct('userEmail');
    const totalPatients = uniquePatients.length;

    // Get unread contact forms
    const unreadContactForms = await ContactForm.countDocuments({ status: 'unread' });

    // Get recent hospitals
    const recentHospitals = await Hospital.find()
      .select('name email phone address isProfileComplete createdAt slug')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent appointments across all hospitals
    const recentAppointments = await Appointment.find()
      .populate('doctorId', 'name specialty')
      .populate('hospitalId', 'name')
      .sort({ appointmentDate: -1 })
      .limit(10);

    // Get hospitals with most appointments
    const topHospitals = await Appointment.aggregate([
      {
        $group: {
          _id: '$hospitalId',
          appointmentCount: { $sum: 1 },
        },
      },
      { $sort: { appointmentCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'hospitals',
          localField: '_id',
          foreignField: '_id',
          as: 'hospital',
        },
      },
      { $unwind: '$hospital' },
      {
        $project: {
          hospitalId: '$_id',
          hospitalName: '$hospital.name',
          hospitalEmail: '$hospital.email',
          appointmentCount: 1,
        },
      },
    ]);

    // Get appointments by month for charts (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const appointmentsByMonth = await Appointment.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Get hospitals by month for charts (last 6 months)
    const hospitalsByMonth = await Hospital.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    return res.status(200).json({
      message: 'Super admin statistics retrieved successfully',
      data: {
        statistics: {
          hospitals: {
            total: totalHospitals,
            withProfile: hospitalsWithProfile,
            growth: hospitalGrowth,
            thisMonth: hospitalsThisMonth,
          },
          doctors: {
            total: totalDoctors,
            growth: doctorGrowth,
            thisMonth: doctorsThisMonth,
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
          services: {
            total: totalServices,
          },
        },
        recentHospitals: recentHospitals.map((hospital) => ({
          _id: hospital._id,
          name: hospital.name,
          email: hospital.email,
          phone: hospital.phone,
          address: hospital.address,
          isProfileComplete: hospital.isProfileComplete,
          createdAt: hospital.createdAt,
          slug: hospital.slug,
        })),
        recentAppointments: recentAppointments.map((apt) => ({
          _id: apt._id,
          patientName: apt.userName,
          patientEmail: apt.userEmail,
          doctorName: apt.doctorId?.name,
          doctorSpecialty: apt.doctorId?.specialty,
          hospitalName: apt.hospitalId?.name,
          appointmentDate: apt.appointmentDate,
          status: apt.status,
        })),
        topHospitals,
        chartData: {
          appointmentsByMonth,
          hospitalsByMonth,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching super admin stats:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Get all hospitals
export const getAllHospitals = async (req, res) => {
  try {
    // Verify user is a website admin
    if (req.user.userType !== 'website_admin') {
      return res.status(403).json({ error: 'Access denied. Super admin only.' });
    }

    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    // Profile status filter
    if (status === 'complete') {
      query.isProfileComplete = true;
    } else if (status === 'incomplete') {
      query.isProfileComplete = false;
    }

    const [hospitals, total] = await Promise.all([
      Hospital.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Hospital.countDocuments(query),
    ]);

    // Get stats for each hospital
    const hospitalsWithStats = await Promise.all(
      hospitals.map(async (hospital) => {
        const [doctorCount, appointmentCount, serviceCount] = await Promise.all([
          Doctor.countDocuments({ hospitalId: hospital._id }),
          Appointment.countDocuments({ hospitalId: hospital._id }),
          Service.countDocuments({ hospitalId: hospital._id }),
        ]);

        return {
          ...hospital.toObject(),
          stats: {
            doctors: doctorCount,
            appointments: appointmentCount,
            services: serviceCount,
          },
        };
      })
    );

    return res.status(200).json({
      message: 'Hospitals retrieved successfully',
      data: {
        hospitals: hospitalsWithStats,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Get hospital details with full stats
export const getHospitalDetails = async (req, res) => {
  try {
    // Verify user is a website admin
    if (req.user.userType !== 'website_admin') {
      return res.status(403).json({ error: 'Access denied. Super admin only.' });
    }

    const { hospitalId } = req.params;

    const hospital = await Hospital.findById(hospitalId).select('-password');
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    // Get detailed statistics
    const [
      totalDoctors,
      activeDoctors,
      totalAppointments,
      pendingAppointments,
      completedAppointments,
      totalServices,
      totalContactForms,
      recentAppointments,
      doctors,
    ] = await Promise.all([
      Doctor.countDocuments({ hospitalId }),
      Doctor.countDocuments({ hospitalId, status: 'Active' }),
      Appointment.countDocuments({ hospitalId }),
      Appointment.countDocuments({ hospitalId, status: 'pending' }),
      Appointment.countDocuments({ hospitalId, status: 'completed' }),
      Service.countDocuments({ hospitalId }),
      ContactForm.countDocuments({ hospitalId }),
      Appointment.find({ hospitalId })
        .populate('doctorId', 'name specialty')
        .sort({ appointmentDate: -1 })
        .limit(5),
      Doctor.find({ hospitalId }).select('name specialty status email'),
    ]);

    // Get unique patients
    const uniquePatients = await Appointment.distinct('userEmail', { hospitalId });

    return res.status(200).json({
      message: 'Hospital details retrieved successfully',
      data: {
        hospital: hospital.toObject(),
        statistics: {
          doctors: {
            total: totalDoctors,
            active: activeDoctors,
          },
          appointments: {
            total: totalAppointments,
            pending: pendingAppointments,
            completed: completedAppointments,
          },
          services: totalServices,
          contactForms: totalContactForms,
          patients: uniquePatients.length,
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
        doctors,
      },
    });
  } catch (error) {
    console.error('Error fetching hospital details:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Get all appointments across hospitals
export const getAllAppointments = async (req, res) => {
  try {
    // Verify user is a website admin
    if (req.user.userType !== 'website_admin') {
      return res.status(403).json({ error: 'Access denied. Super admin only.' });
    }

    const { page = 1, limit = 10, status = '', hospitalId = '', search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Hospital filter
    if (hospitalId) {
      query.hospitalId = hospitalId;
    }

    // Search filter
    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } },
        { userPhone: { $regex: search, $options: 'i' } },
      ];
    }

    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .populate('doctorId', 'name specialty')
        .populate('hospitalId', 'name email')
        .sort({ appointmentDate: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Appointment.countDocuments(query),
    ]);

    return res.status(200).json({
      message: 'Appointments retrieved successfully',
      data: {
        appointments: appointments.map((apt) => ({
          _id: apt._id,
          patientName: apt.userName,
          patientEmail: apt.userEmail,
          patientPhone: apt.userPhone,
          doctorName: apt.doctorId?.name,
          doctorSpecialty: apt.doctorId?.specialty,
          hospitalId: apt.hospitalId?._id,
          hospitalName: apt.hospitalId?.name,
          hospitalEmail: apt.hospitalId?.email,
          appointmentDate: apt.appointmentDate,
          timeSlot: apt.timeSlot,
          status: apt.status,
          notes: apt.notes,
          createdAt: apt.createdAt,
        })),
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Get all doctors across hospitals
export const getAllDoctors = async (req, res) => {
  try {
    // Verify user is a website admin
    if (req.user.userType !== 'website_admin') {
      return res.status(403).json({ error: 'Access denied. Super admin only.' });
    }

    const { page = 1, limit = 10, status = '', hospitalId = '', search = '', specialty = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Hospital filter
    if (hospitalId) {
      query.hospitalId = hospitalId;
    }

    // Specialty filter
    if (specialty) {
      query.specialty = { $regex: specialty, $options: 'i' };
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { specialty: { $regex: search, $options: 'i' } },
      ];
    }

    const [doctors, total] = await Promise.all([
      Doctor.find(query)
        .populate('hospitalId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Doctor.countDocuments(query),
    ]);

    return res.status(200).json({
      message: 'Doctors retrieved successfully',
      data: {
        doctors: doctors.map((doc) => ({
          _id: doc._id,
          name: doc.name,
          email: doc.email,
          phone: doc.phone,
          specialty: doc.specialty,
          qualification: doc.qualifications,
          experience: doc.experience,
          status: doc.status,
          hospitalId: doc.hospitalId?._id,
          hospitalName: doc.hospitalId?.name,
          photo: doc.photo,
          createdAt: doc.createdAt,
        })),
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Get all contact forms across hospitals
export const getAllContactForms = async (req, res) => {
  try {
    // Verify user is a website admin
    if (req.user.userType !== 'website_admin') {
      return res.status(403).json({ error: 'Access denied. Super admin only.' });
    }

    const { page = 1, limit = 10, status = '', hospitalId = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Hospital filter
    if (hospitalId) {
      query.hospitalId = hospitalId;
    }

    const [contactForms, total] = await Promise.all([
      ContactForm.find(query)
        .populate('hospitalId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      ContactForm.countDocuments(query),
    ]);

    return res.status(200).json({
      message: 'Contact forms retrieved successfully',
      data: {
        contactForms: contactForms.map((form) => ({
          _id: form._id,
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message,
          status: form.status,
          isStarred: form.isStarred,
          hospitalId: form.hospitalId?._id,
          hospitalName: form.hospitalId?.name,
          createdAt: form.createdAt,
        })),
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching contact forms:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Delete hospital (super admin only)
export const deleteHospital = async (req, res) => {
  try {
    // Verify user is a website admin
    if (req.user.userType !== 'website_admin') {
      return res.status(403).json({ error: 'Access denied. Super admin only.' });
    }

    const { hospitalId } = req.params;

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    // Delete all related data
    await Promise.all([
      Doctor.deleteMany({ hospitalId }),
      Appointment.deleteMany({ hospitalId }),
      Service.deleteMany({ hospitalId }),
      ContactForm.deleteMany({ hospitalId }),
      Hospital.findByIdAndDelete(hospitalId),
    ]);

    return res.status(200).json({
      message: 'Hospital and all related data deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting hospital:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Get platform statistics summary
export const getPlatformSummary = async (req, res) => {
  try {
    // Verify user is a website admin
    if (req.user.userType !== 'website_admin') {
      return res.status(403).json({ error: 'Access denied. Super admin only.' });
    }

    const [
      totalHospitals,
      totalDoctors,
      totalAppointments,
      totalPatients,
    ] = await Promise.all([
      Hospital.countDocuments(),
      Doctor.countDocuments(),
      Appointment.countDocuments(),
      Appointment.distinct('userEmail').then(emails => emails.length),
    ]);

    // Get status breakdown
    const appointmentsByStatus = await Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusBreakdown = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };

    appointmentsByStatus.forEach((item) => {
      statusBreakdown[item._id] = item.count;
    });

    return res.status(200).json({
      message: 'Platform summary retrieved successfully',
      data: {
        totalHospitals,
        totalDoctors,
        totalAppointments,
        totalPatients,
        appointmentsByStatus: statusBreakdown,
      },
    });
  } catch (error) {
    console.error('Error fetching platform summary:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Submit website contact form (public endpoint)
export const submitWebsiteContactForm = async (req, res) => {
  try {
    const { firstName, lastName, email, hospitalId, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ error: 'First name, last name, email, and message are required' });
    }

    // Get hospital name if hospitalId is provided
    let hospitalName = '';
    if (hospitalId) {
      const hospital = await Hospital.findById(hospitalId);
      if (hospital) {
        hospitalName = hospital.name;
      }
    }

    const contactForm = new WebsiteContactForm({
      firstName,
      lastName,
      email,
      hospitalName,
      message,
    });

    await contactForm.save();

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('super-admin').emit('websiteContactForm:new', {
        contactForm: {
          _id: contactForm._id,
          firstName: contactForm.firstName,
          lastName: contactForm.lastName,
          email: contactForm.email,
          hospitalName: contactForm.hospitalName,
          subject: contactForm.subject,
          message: contactForm.message,
          status: contactForm.status,
          isStarred: contactForm.isStarred,
          createdAt: contactForm.createdAt,
        },
      });
    }

    res.status(201).json({
      message: 'Contact form submitted successfully',
      data: contactForm,
    });
  } catch (error) {
    console.error('Error submitting website contact form:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all website contact forms (super admin only)
export const getWebsiteContactForms = async (req, res) => {
  try {
    // Verify user is a website admin
    if (req.user.userType !== 'website_admin') {
      return res.status(403).json({ error: 'Access denied. Super admin only.' });
    }

    const { page = 1, limit = 50, status = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const [contactForms, total] = await Promise.all([
      WebsiteContactForm.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      WebsiteContactForm.countDocuments(query),
    ]);

    return res.status(200).json({
      message: 'Website contact forms retrieved successfully',
      data: {
        contactForms: contactForms.map((form) => ({
          _id: form._id,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          hospitalName: form.hospitalName,
          subject: form.subject,
          message: form.message,
          status: form.status,
          isStarred: form.isStarred,
          response: form.response,
          respondedAt: form.respondedAt,
          createdAt: form.createdAt,
        })),
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching website contact forms:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Update website contact form status (super admin only)
export const updateWebsiteContactFormStatus = async (req, res) => {
  try {
    // Verify user is a website admin
    if (req.user.userType !== 'website_admin') {
      return res.status(403).json({ error: 'Access denied. Super admin only.' });
    }

    const { formId } = req.params;
    const { status, isStarred, response } = req.body;

    const updateData = {};

    if (status !== undefined) {
      if (!['unread', 'read', 'starred', 'responded'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      updateData.status = status;
    }

    if (isStarred !== undefined) {
      updateData.isStarred = isStarred;
    }

    if (response !== undefined) {
      updateData.response = response;
      updateData.respondedAt = new Date();
      updateData.respondedBy = req.user._id;
      updateData.status = 'responded';
    }

    const contactForm = await WebsiteContactForm.findByIdAndUpdate(
      formId,
      updateData,
      { new: true }
    );

    if (!contactForm) {
      return res.status(404).json({ error: 'Contact form not found' });
    }

    res.status(200).json({
      message: 'Contact form updated successfully',
      data: contactForm,
    });
  } catch (error) {
    console.error('Error updating website contact form:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete website contact form (super admin only)
export const deleteWebsiteContactForm = async (req, res) => {
  try {
    // Verify user is a website admin
    if (req.user.userType !== 'website_admin') {
      return res.status(403).json({ error: 'Access denied. Super admin only.' });
    }

    const { formId } = req.params;

    const contactForm = await WebsiteContactForm.findByIdAndDelete(formId);
    if (!contactForm) {
      return res.status(404).json({ error: 'Contact form not found' });
    }

    res.status(200).json({
      message: 'Contact form deleted successfully',
      data: null,
    });
  } catch (error) {
    console.error('Error deleting website contact form:', error);
    res.status(500).json({ error: error.message });
  }
};
