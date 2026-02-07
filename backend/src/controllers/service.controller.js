import Service from '../models/service.model.js';

export const createService = async (req, res) => {
  try {
    const hospitalId = req.body.hospitalId || req.user.hospitalId;
    const { name, category, description, duration, price, status, icon } = req.body;

    if (!name || !category || !hospitalId) {
      return res.status(400).json({ error: 'Name, category, and hospitalId are required' });
    }

    const service = new Service({
      name,
      category,
      description: description || '',
      duration: duration || 30,
      price: price || 0,
      status: status || 'Active',
      icon: icon || 'Stethoscope',
      hospitalId,
    });

    await service.save();
    res.status(201).json({
      message: 'Service created successfully',
      data: service,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getServicesByHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    // Verify user has access to this hospital
    if (req.user.userType === 'hospital_admin' && req.user.hospitalId !== hospitalId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const services = await Service.find({ hospitalId });
    res.status(200).json({
      message: 'Services retrieved successfully',
      data: services,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Verify user has access to this service's hospital
    if (req.user.userType === 'hospital_admin' && req.user.hospitalId !== service.hospitalId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.status(200).json({
      message: 'Service retrieved successfully',
      data: service,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { name, category, description, duration, price, status, icon } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Verify user has access to this service's hospital
    if (req.user.userType === 'hospital_admin' && req.user.hospitalId !== service.hospitalId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Build update object with only provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (duration !== undefined) updateData.duration = duration;
    if (price !== undefined) updateData.price = price;
    if (status !== undefined) updateData.status = status;
    if (icon !== undefined) updateData.icon = icon;

    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: 'Service updated successfully',
      data: updatedService,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Verify user has access to this service's hospital
    if (req.user.userType === 'hospital_admin' && req.user.hospitalId !== service.hospitalId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Service.findByIdAndDelete(serviceId);

    res.status(200).json({
      message: 'Service deleted successfully',
      data: null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getServiceCategories = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    // Verify user has access to this hospital
    if (req.user.userType === 'hospital_admin' && req.user.hospitalId !== hospitalId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get unique categories from services in this hospital
    const categories = await Service.distinct('category', { hospitalId });

    res.status(200).json({
      message: 'Categories retrieved successfully',
      data: categories.filter(c => c), // Filter out empty/null values
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
