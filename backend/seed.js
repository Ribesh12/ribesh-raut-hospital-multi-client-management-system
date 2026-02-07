import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Import models
import Hospital from './src/models/hospital.model.js';
import Doctor from './src/models/doctor.model.js';
import Appointment from './src/models/appointment.model.js';
import Service from './src/models/service.model.js';
import Schedule from './src/models/schedule.model.js';
import ContactForm from './src/models/contactForm.model.js';
import Admin from './src/models/admin.model.js';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hmt';

// Unsplash image URLs for hospitals
const hospitalImages = {
  profiles: [
    'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=400&fit=crop',
  ],
  gallery: [
    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=600&fit=crop',
  ],
};

// Doctor photos from Unsplash (professional headshots)
const doctorPhotos = [
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop', // Male doctor 1
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop', // Female doctor 1
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop', // Male doctor 2
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop', // Female doctor 2
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop', // Male doctor 3
  'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop', // Female doctor 3
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop', // Male doctor 4
  'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop', // Female doctor 4
  'https://images.unsplash.com/photo-1618498082410-b4aa22193b38?w=400&h=400&fit=crop', // Male doctor 5
  'https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=400&h=400&fit=crop', // Female doctor 5
];

// Hospital data
const hospitalsData = [
  {
    name: 'Kathmandu Medical Center',
    slug: 'kathmandu-medical-center',
    address: 'Maharajgunj, Kathmandu 44600, Nepal',
    phone: '+977-1-4412808',
    email: 'info@kathmandumedical.com.np',
    password: 'Hospital@123',
    registrationNumber: 'NMC-2018-KTM-001',
    totalBeds: 250,
    emergencyDepartment: true,
    description: 'Kathmandu Medical Center is a premier multi-specialty hospital providing world-class healthcare services in Nepal. With state-of-the-art facilities and experienced medical professionals, we are committed to delivering compassionate care and excellent patient outcomes.',
    isProfileComplete: true,
    profilePicture: hospitalImages.profiles[0],
    images: [hospitalImages.gallery[0], hospitalImages.gallery[1], hospitalImages.gallery[2]],
    googleMapsUrl: 'https://maps.google.com/?q=27.7372,85.3240',
    socialLinks: {
      facebook: 'https://facebook.com/kathmandumedical',
      twitter: 'https://twitter.com/ktmmedical',
      instagram: 'https://instagram.com/kathmandumedical',
      linkedin: 'https://linkedin.com/company/kathmandu-medical',
      youtube: 'https://youtube.com/kathmandumedical',
      website: 'https://kathmandumedical.com.np',
    },
    openingHours: {
      monday: { open: '07:00', close: '20:00', isClosed: false },
      tuesday: { open: '07:00', close: '20:00', isClosed: false },
      wednesday: { open: '07:00', close: '20:00', isClosed: false },
      thursday: { open: '07:00', close: '20:00', isClosed: false },
      friday: { open: '07:00', close: '20:00', isClosed: false },
      saturday: { open: '08:00', close: '16:00', isClosed: false },
      sunday: { open: '09:00', close: '14:00', isClosed: false },
    },
    specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology', 'General Surgery'],
    facilities: ['24/7 Emergency', 'ICU', 'CT Scan', 'MRI', 'Pharmacy', 'Ambulance Service', 'Cafeteria', 'Parking'],
  },
  {
    name: 'Pokhara Healthcare Hospital',
    slug: 'pokhara-healthcare-hospital',
    address: 'Lakeside Road, Pokhara 33700, Nepal',
    phone: '+977-61-520111',
    email: 'contact@pokharahealthcare.com.np',
    password: 'Hospital@123',
    registrationNumber: 'NMC-2019-PKR-045',
    totalBeds: 150,
    emergencyDepartment: true,
    description: 'Pokhara Healthcare Hospital is the leading healthcare provider in the Gandaki Province. We specialize in providing comprehensive medical services with a focus on patient comfort and advanced treatment options.',
    isProfileComplete: true,
    profilePicture: hospitalImages.profiles[1],
    images: [hospitalImages.gallery[1], hospitalImages.gallery[3], hospitalImages.gallery[4]],
    googleMapsUrl: 'https://maps.google.com/?q=28.2096,83.9856',
    socialLinks: {
      facebook: 'https://facebook.com/pokharahealthcare',
      twitter: 'https://twitter.com/pkrhealthcare',
      instagram: 'https://instagram.com/pokharahealthcare',
      linkedin: null,
      youtube: null,
      website: 'https://pokharahealthcare.com.np',
    },
    openingHours: {
      monday: { open: '08:00', close: '18:00', isClosed: false },
      tuesday: { open: '08:00', close: '18:00', isClosed: false },
      wednesday: { open: '08:00', close: '18:00', isClosed: false },
      thursday: { open: '08:00', close: '18:00', isClosed: false },
      friday: { open: '08:00', close: '18:00', isClosed: false },
      saturday: { open: '09:00', close: '15:00', isClosed: false },
      sunday: { open: '00:00', close: '00:00', isClosed: true },
    },
    specialties: ['General Medicine', 'Gynecology', 'Orthopedics', 'ENT', 'Dermatology'],
    facilities: ['Emergency', 'ICU', 'X-Ray', 'Ultrasound', 'Pharmacy', 'Laboratory', 'Ambulance'],
  },
  {
    name: 'Chitwan Life Care Center',
    slug: 'chitwan-life-care-center',
    address: 'Bharatpur-10, Chitwan 44200, Nepal',
    phone: '+977-56-527333',
    email: 'admin@chitwanlifecare.com.np',
    password: 'Hospital@123',
    registrationNumber: 'NMC-2020-CTW-078',
    totalBeds: 100,
    emergencyDepartment: true,
    description: 'Chitwan Life Care Center provides affordable and quality healthcare services to the residents of Chitwan and surrounding districts. Our dedicated team of doctors and nurses ensure the best possible care for all patients.',
    isProfileComplete: true,
    profilePicture: hospitalImages.profiles[2],
    images: [hospitalImages.gallery[2], hospitalImages.gallery[4], hospitalImages.gallery[0]],
    googleMapsUrl: 'https://maps.google.com/?q=27.6766,84.4322',
    socialLinks: {
      facebook: 'https://facebook.com/chitwanlifecare',
      twitter: null,
      instagram: 'https://instagram.com/chitwanlifecare',
      linkedin: null,
      youtube: null,
      website: 'https://chitwanlifecare.com.np',
    },
    openingHours: {
      monday: { open: '06:00', close: '22:00', isClosed: false },
      tuesday: { open: '06:00', close: '22:00', isClosed: false },
      wednesday: { open: '06:00', close: '22:00', isClosed: false },
      thursday: { open: '06:00', close: '22:00', isClosed: false },
      friday: { open: '06:00', close: '22:00', isClosed: false },
      saturday: { open: '06:00', close: '22:00', isClosed: false },
      sunday: { open: '08:00', close: '18:00', isClosed: false },
    },
    specialties: ['General Medicine', 'Pediatrics', 'Obstetrics', 'Surgery', 'Dentistry'],
    facilities: ['24/7 Emergency', 'Labor Room', 'Operation Theater', 'Pharmacy', 'Lab', 'Ambulance'],
  },
];

// Doctors data
const doctorsData = [
  // Kathmandu Medical Center doctors
  {
    name: 'Dr. Rajesh Sharma',
    specialty: 'Cardiology',
    phone: '+977-9841234567',
    email: 'dr.rajesh@kathmandumedical.com.np',
    photo: doctorPhotos[0],
    qualifications: 'MBBS, MD (Cardiology), FACC',
    experience: 15,
    bio: 'Dr. Rajesh Sharma is a renowned cardiologist with over 15 years of experience in treating complex cardiac conditions. He has performed over 2000 cardiac interventions and is known for his patient-centric approach.',
    consultationFee: 1500,
    status: 'Active',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: { start: '09:00', end: '17:00' },
    hospitalIndex: 0,
  },
  {
    name: 'Dr. Sunita Poudel',
    specialty: 'Neurology',
    phone: '+977-9851234568',
    email: 'dr.sunita@kathmandumedical.com.np',
    photo: doctorPhotos[1],
    qualifications: 'MBBS, MD (Neurology), DM',
    experience: 12,
    bio: 'Dr. Sunita Poudel specializes in treating neurological disorders including stroke, epilepsy, and movement disorders. She has trained at prestigious institutions in India and the UK.',
    consultationFee: 1200,
    status: 'Active',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    workingHours: { start: '10:00', end: '16:00' },
    hospitalIndex: 0,
  },
  {
    name: 'Dr. Anil Kumar Jha',
    specialty: 'Orthopedics',
    phone: '+977-9801234569',
    email: 'dr.anil@kathmandumedical.com.np',
    photo: doctorPhotos[2],
    qualifications: 'MBBS, MS (Orthopedics)',
    experience: 10,
    bio: 'Dr. Anil Kumar Jha is an expert orthopedic surgeon specializing in joint replacement surgery and sports medicine. He has successfully performed over 500 joint replacement surgeries.',
    consultationFee: 1000,
    status: 'Active',
    workingDays: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: { start: '08:00', end: '14:00' },
    hospitalIndex: 0,
  },
  {
    name: 'Dr. Priya Thapa',
    specialty: 'Pediatrics',
    phone: '+977-9841234570',
    email: 'dr.priya@kathmandumedical.com.np',
    photo: doctorPhotos[3],
    qualifications: 'MBBS, MD (Pediatrics)',
    experience: 8,
    bio: 'Dr. Priya Thapa is a caring pediatrician who loves working with children. She specializes in childhood immunizations, developmental assessments, and pediatric infectious diseases.',
    consultationFee: 800,
    status: 'Active',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: { start: '09:00', end: '17:00' },
    hospitalIndex: 0,
  },
  // Pokhara Healthcare Hospital doctors
  {
    name: 'Dr. Bikash Gurung',
    specialty: 'General Medicine',
    phone: '+977-9846234571',
    email: 'dr.bikash@pokharahealthcare.com.np',
    photo: doctorPhotos[4],
    qualifications: 'MBBS, MD (Internal Medicine)',
    experience: 14,
    bio: 'Dr. Bikash Gurung is a highly experienced general physician with expertise in diagnosing and treating a wide range of medical conditions. He believes in holistic patient care.',
    consultationFee: 700,
    status: 'Active',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: { start: '08:00', end: '16:00' },
    hospitalIndex: 1,
  },
  {
    name: 'Dr. Kamala Rana',
    specialty: 'Gynecology',
    phone: '+977-9856234572',
    email: 'dr.kamala@pokharahealthcare.com.np',
    photo: doctorPhotos[5],
    qualifications: 'MBBS, MD (Obstetrics & Gynecology)',
    experience: 11,
    bio: 'Dr. Kamala Rana is a compassionate gynecologist specializing in high-risk pregnancies, infertility treatment, and minimally invasive gynecological surgeries.',
    consultationFee: 900,
    status: 'Active',
    workingDays: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: { start: '10:00', end: '15:00' },
    hospitalIndex: 1,
  },
  {
    name: 'Dr. Sanjay Adhikari',
    specialty: 'ENT',
    phone: '+977-9847234573',
    email: 'dr.sanjay@pokharahealthcare.com.np',
    photo: doctorPhotos[6],
    qualifications: 'MBBS, MS (ENT)',
    experience: 9,
    bio: 'Dr. Sanjay Adhikari is an ENT specialist with expertise in treating ear, nose, and throat disorders. He performs both medical and surgical treatments for ENT conditions.',
    consultationFee: 650,
    status: 'Active',
    workingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    workingHours: { start: '09:00', end: '14:00' },
    hospitalIndex: 1,
  },
  // Chitwan Life Care Center doctors
  {
    name: 'Dr. Ramesh Chaudhary',
    specialty: 'General Surgery',
    phone: '+977-9855234574',
    email: 'dr.ramesh@chitwanlifecare.com.np',
    photo: doctorPhotos[7],
    qualifications: 'MBBS, MS (General Surgery)',
    experience: 16,
    bio: 'Dr. Ramesh Chaudhary is a senior surgeon with vast experience in abdominal surgeries, trauma care, and laparoscopic procedures. He has served in various hospitals across Nepal.',
    consultationFee: 600,
    status: 'Active',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: { start: '07:00', end: '15:00' },
    hospitalIndex: 2,
  },
  {
    name: 'Dr. Anita Mahato',
    specialty: 'Pediatrics',
    phone: '+977-9845234575',
    email: 'dr.anita@chitwanlifecare.com.np',
    photo: doctorPhotos[8],
    qualifications: 'MBBS, MD (Pediatrics)',
    experience: 7,
    bio: 'Dr. Anita Mahato is dedicated to providing comprehensive healthcare to children from newborns to adolescents. She focuses on preventive care and child development.',
    consultationFee: 500,
    status: 'Active',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    workingHours: { start: '08:00', end: '14:00' },
    hospitalIndex: 2,
  },
  {
    name: 'Dr. Santosh Bhattarai',
    specialty: 'Dentistry',
    phone: '+977-9865234576',
    email: 'dr.santosh@chitwanlifecare.com.np',
    photo: doctorPhotos[9],
    qualifications: 'BDS, MDS (Prosthodontics)',
    experience: 6,
    bio: 'Dr. Santosh Bhattarai is a skilled dentist specializing in cosmetic dentistry, dental implants, and complete mouth rehabilitation. He uses the latest dental technologies.',
    consultationFee: 400,
    status: 'Active',
    workingDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    workingHours: { start: '10:00', end: '18:00' },
    hospitalIndex: 2,
  },
];

// Services data
const servicesData = [
  // Kathmandu Medical Center services
  { name: 'Cardiac Consultation', category: 'Cardiology', description: 'Comprehensive cardiac evaluation and consultation', duration: 45, price: 1500, icon: 'Heart', hospitalIndex: 0 },
  { name: 'ECG', category: 'Cardiology', description: 'Electrocardiogram to monitor heart activity', duration: 30, price: 500, icon: 'Activity', hospitalIndex: 0 },
  { name: 'Echocardiography', category: 'Cardiology', description: '2D Echo for detailed heart imaging', duration: 60, price: 3000, icon: 'Heart', hospitalIndex: 0 },
  { name: 'Brain MRI', category: 'Neurology', description: 'Magnetic resonance imaging of the brain', duration: 60, price: 8000, icon: 'Brain', hospitalIndex: 0 },
  { name: 'General Health Checkup', category: 'General', description: 'Complete health screening package', duration: 120, price: 5000, icon: 'Stethoscope', hospitalIndex: 0 },
  
  // Pokhara Healthcare Hospital services
  { name: 'General Consultation', category: 'General Medicine', description: 'Consultation with general physician', duration: 30, price: 700, icon: 'Stethoscope', hospitalIndex: 1 },
  { name: 'Prenatal Checkup', category: 'Gynecology', description: 'Complete prenatal care and monitoring', duration: 45, price: 1200, icon: 'Baby', hospitalIndex: 1 },
  { name: 'Ultrasound', category: 'Radiology', description: 'Diagnostic ultrasound imaging', duration: 30, price: 1500, icon: 'Scan', hospitalIndex: 1 },
  { name: 'Hearing Test', category: 'ENT', description: 'Comprehensive audiometry assessment', duration: 30, price: 800, icon: 'Ear', hospitalIndex: 1 },
  
  // Chitwan Life Care Center services
  { name: 'Emergency Care', category: 'Emergency', description: '24/7 emergency medical services', duration: 30, price: 1000, icon: 'Ambulance', hospitalIndex: 2 },
  { name: 'Child Vaccination', category: 'Pediatrics', description: 'Immunization services for children', duration: 30, price: 500, icon: 'Syringe', hospitalIndex: 2 },
  { name: 'Dental Cleaning', category: 'Dentistry', description: 'Professional teeth cleaning and polishing', duration: 45, price: 1000, icon: 'Smile', hospitalIndex: 2 },
  { name: 'Root Canal Treatment', category: 'Dentistry', description: 'Endodontic treatment for infected teeth', duration: 90, price: 5000, icon: 'Tooth', hospitalIndex: 2 },
  { name: 'Minor Surgery', category: 'Surgery', description: 'Outpatient minor surgical procedures', duration: 60, price: 3000, icon: 'Scissors', hospitalIndex: 2 },
];

// Patient names for appointments
const patientNames = [
  { name: 'Hari Bahadur Tamang', email: 'hari.tamang@gmail.com', phone: '+977-9841111111' },
  { name: 'Sita Kumari Shrestha', email: 'sita.shrestha@gmail.com', phone: '+977-9851222222' },
  { name: 'Ram Prasad Koirala', email: 'ram.koirala@yahoo.com', phone: '+977-9801333333' },
  { name: 'Gita Devi Karki', email: 'gita.karki@gmail.com', phone: '+977-9841444444' },
  { name: 'Bishnu Maya Lama', email: 'bishnu.lama@outlook.com', phone: '+977-9851555555' },
  { name: 'Krishna Bahadur Magar', email: 'krishna.magar@gmail.com', phone: '+977-9861666666' },
  { name: 'Sarita Rai', email: 'sarita.rai@gmail.com', phone: '+977-9847777777' },
  { name: 'Dipak Sharma', email: 'dipak.sharma@hotmail.com', phone: '+977-9858888888' },
  { name: 'Pramila Gurung', email: 'pramila.gurung@gmail.com', phone: '+977-9869999999' },
  { name: 'Suresh Thapa', email: 'suresh.thapa@gmail.com', phone: '+977-9840000000' },
];

// Contact form messages
const contactMessages = [
  { name: 'Anup Basnet', email: 'anup.basnet@gmail.com', phone: '+977-9841234000', subject: 'Appointment Query', message: 'I would like to know the availability of Dr. Rajesh Sharma for a cardiac consultation next week.' },
  { name: 'Maya Devi KC', email: 'maya.kc@yahoo.com', phone: '+977-9851234001', subject: 'Insurance Coverage', message: 'Does your hospital accept health insurance from Nepal Life Insurance? Please provide details.' },
  { name: 'Prakash Neupane', email: 'prakash.n@gmail.com', phone: '+977-9861234002', subject: 'Medical Report Request', message: 'I visited your hospital last month and need a copy of my medical reports. How can I obtain them?' },
  { name: 'Rekha Thapa', email: 'rekha.thapa@outlook.com', phone: '+977-9801234003', subject: 'General Inquiry', message: 'What are your visiting hours for admitted patients? Also, is parking available at the hospital?' },
  { name: 'Binod Adhikari', email: 'binod.a@gmail.com', phone: '+977-9841234004', subject: 'Emergency Services', message: 'Do you have 24/7 emergency services? What is the procedure for emergency admissions?' },
];

// Helper function to generate random date in the future
const getRandomFutureDate = (daysAhead = 30) => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead) + 1);
  date.setHours(9 + Math.floor(Math.random() * 8), Math.random() > 0.5 ? 0 : 30, 0, 0);
  return date;
};

// Helper function to generate random past date
const getRandomPastDate = (daysBack = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack) - 1);
  date.setHours(9 + Math.floor(Math.random() * 8), Math.random() > 0.5 ? 0 : 30, 0, 0);
  return date;
};

async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      Hospital.deleteMany({}),
      Doctor.deleteMany({}),
      Appointment.deleteMany({}),
      Service.deleteMany({}),
      Schedule.deleteMany({}),
      ContactForm.deleteMany({}),
      Admin.deleteMany({}),
    ]);
    console.log('✅ Existing data cleared');

    // Create Super Admin
    console.log('👤 Creating super admin...');
    const superAdmin = new Admin({
      username: 'superadmin',
      password: 'Admin@123',
    });
    await superAdmin.save();
    console.log('✅ Super admin created (username: superadmin, password: Admin@123)');

    // Create Hospitals
    console.log('🏥 Creating hospitals...');
    const hospitals = [];
    for (const hospitalData of hospitalsData) {
      const hospital = new Hospital(hospitalData);
      await hospital.save();
      hospitals.push(hospital);
      console.log(`   ✅ Created: ${hospital.name}`);
    }

    // Create Doctors
    console.log('👨‍⚕️ Creating doctors...');
    const doctors = [];
    for (const doctorData of doctorsData) {
      const { hospitalIndex, ...data } = doctorData;
      const doctor = new Doctor({
        ...data,
        hospitalId: hospitals[hospitalIndex]._id,
      });
      await doctor.save();
      doctors.push(doctor);
      console.log(`   ✅ Created: ${doctor.name} (${doctor.specialty})`);
    }

    // Create Services
    console.log('🩺 Creating services...');
    for (const serviceData of servicesData) {
      const { hospitalIndex, ...data } = serviceData;
      const service = new Service({
        ...data,
        hospitalId: hospitals[hospitalIndex]._id,
      });
      await service.save();
      console.log(`   ✅ Created: ${service.name}`);
    }

    // Create Schedules for each doctor
    console.log('📅 Creating schedules...');
    for (const doctor of doctors) {
      const schedule = new Schedule({
        doctorId: doctor._id,
        hospitalId: doctor.hospitalId,
        days: doctor.workingDays,
        startTime: doctor.workingHours.start,
        endTime: doctor.workingHours.end,
        maxPatients: 15,
        slotDuration: 30,
        status: 'Active',
      });
      await schedule.save();
      console.log(`   ✅ Schedule for: ${doctor.name}`);
    }

    // Create Appointments
    console.log('📋 Creating appointments...');
    const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    let appointmentCount = 0;

    for (const doctor of doctors) {
      // Create 3-5 appointments per doctor
      const numAppointments = 3 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < numAppointments; i++) {
        const patient = patientNames[Math.floor(Math.random() * patientNames.length)];
        const isPast = Math.random() > 0.5;
        const appointmentDate = isPast ? getRandomPastDate() : getRandomFutureDate();
        
        let status;
        if (isPast) {
          status = Math.random() > 0.2 ? 'completed' : 'cancelled';
        } else {
          status = Math.random() > 0.5 ? 'confirmed' : 'pending';
        }

        const appointment = new Appointment({
          doctorId: doctor._id,
          hospitalId: doctor.hospitalId,
          userId: `patient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userName: patient.name,
          userEmail: patient.email,
          userPhone: patient.phone,
          appointmentDate,
          duration: [30, 45, 60][Math.floor(Math.random() * 3)],
          status,
          notes: status === 'completed' ? 'Follow-up recommended in 2 weeks.' : '',
        });
        await appointment.save();
        appointmentCount++;
      }
    }
    console.log(`   ✅ Created ${appointmentCount} appointments`);

    // Create Contact Form Messages
    console.log('📧 Creating contact form messages...');
    for (let i = 0; i < contactMessages.length; i++) {
      const msg = contactMessages[i];
      const hospital = hospitals[i % hospitals.length];
      
      const contactForm = new ContactForm({
        ...msg,
        hospitalId: hospital._id,
        status: ['unread', 'read', 'responded'][Math.floor(Math.random() * 3)],
        isStarred: Math.random() > 0.7,
      });
      await contactForm.save();
      console.log(`   ✅ Message from: ${msg.name}`);
    }

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('='.repeat(50));
    console.log('📊 Summary:');
    console.log('='.repeat(50));
    console.log(`   🏥 Hospitals: ${hospitals.length}`);
    console.log(`   👨‍⚕️ Doctors: ${doctors.length}`);
    console.log(`   📋 Appointments: ${appointmentCount}`);
    console.log(`   🩺 Services: ${servicesData.length}`);
    console.log(`   📅 Schedules: ${doctors.length}`);
    console.log(`   📧 Contact Messages: ${contactMessages.length}`);
    console.log('='.repeat(50));
    console.log('\n🔐 Login Credentials:');
    console.log('='.repeat(50));
    console.log('   Super Admin:');
    console.log('      Username: superadmin');
    console.log('      Password: Admin@123');
    console.log('\n   Hospital Admins:');
    hospitals.forEach((h, i) => {
      console.log(`      ${i + 1}. ${h.name}`);
      console.log(`         Email: ${h.email}`);
      console.log(`         Password: Hospital@123`);
    });
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();
