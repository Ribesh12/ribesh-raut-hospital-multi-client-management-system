import ContactForm from '../models/contactForm.model.js';

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, message, hospitalId } = req.body;

    if (!name || !email || !phone || !message || !hospitalId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const contactForm = new ContactForm({
      name,
      email,
      phone,
      message,
      hospitalId,
    });

    await contactForm.save();
    res.status(201).json({
      message: 'Contact form submitted successfully',
      contactForm,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getContactFormsByHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    const contactForms = await ContactForm.find({ hospitalId });
    res.status(200).json(contactForms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getContactFormById = async (req, res) => {
  try {
    const { formId } = req.params;

    const contactForm = await ContactForm.findById(formId);
    if (!contactForm) {
      return res.status(404).json({ error: 'Contact form not found' });
    }

    res.status(200).json(contactForm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateContactFormStatus = async (req, res) => {
  try {
    const { formId } = req.params;
    const { status } = req.body;

    if (!['new', 'read', 'responded'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const contactForm = await ContactForm.findByIdAndUpdate(
      formId,
      { status },
      { new: true }
    );

    if (!contactForm) {
      return res.status(404).json({ error: 'Contact form not found' });
    }

    res.status(200).json({
      message: 'Contact form updated successfully',
      contactForm,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteContactForm = async (req, res) => {
  try {
    const { formId } = req.params;

    const contactForm = await ContactForm.findByIdAndDelete(formId);
    if (!contactForm) {
      return res.status(404).json({ error: 'Contact form not found' });
    }

    res.status(200).json({ message: 'Contact form deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
