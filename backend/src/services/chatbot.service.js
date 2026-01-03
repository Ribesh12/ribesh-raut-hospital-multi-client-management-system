import { GoogleGenerativeAI } from '@google/generative-ai';
import Hospital from '../models/hospital.model.js';
import Doctor from '../models/doctor.model.js';
import Appointment from '../models/appointment.model.js';
import Chat from '../models/chat.model.js';

let genAI;

const initializeGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};

const buildHospitalContext = async (hospitalId) => {
  try {
    const hospital = await Hospital.findById(hospitalId);
    const doctors = await Doctor.find({ hospitalId });
    const appointments = await Appointment.find({ hospitalId }).limit(20);

    let context = `You are a helpful AI assistant for ${hospital.name} hospital.`;
    context += `\n\nHospital Information:`;
    context += `\nName: ${hospital.name}`;
    context += `\nAddress: ${hospital.address}`;
    context += `\nPhone: ${hospital.phone}`;
    context += `\nEmail: ${hospital.email}`;

    if (doctors.length > 0) {
      context += `\n\nAvailable Doctors:`;
      doctors.forEach((doc) => {
        context += `\n- Dr. ${doc.name} (${doc.specialty})`;
        context += `\n  Email: ${doc.email}, Phone: ${doc.phone}`;
        if (doc.experience) context += `\n  Experience: ${doc.experience} years`;
        if (doc.bio) context += `\n  Bio: ${doc.bio}`;
      });
    }

    if (appointments.length > 0) {
      const stats = {
        pending: appointments.filter((a) => a.status === 'pending').length,
        confirmed: appointments.filter((a) => a.status === 'confirmed').length,
        completed: appointments.filter((a) => a.status === 'completed').length,
        cancelled: appointments.filter((a) => a.status === 'cancelled').length,
      };
      context += `\n\nAppointment Statistics:`;
      context += `\nPending: ${stats.pending}`;
      context += `\nConfirmed: ${stats.confirmed}`;
      context += `\nCompleted: ${stats.completed}`;
      context += `\nCancelled: ${stats.cancelled}`;
    }

    context += `\n\nYou should help users with inquiries about appointments, doctor availability, hospital services, and general medical information related to this hospital. Be friendly, professional, and informative.`;

    return context;
  } catch (error) {
    console.error('Error building hospital context:', error);
    return 'You are a helpful AI assistant for a hospital. Help users with inquiries about appointments and services.';
  }
};

export const sendMessage = async (hospitalId, userId, userMessage) => {
  try {
    let chatSession = await Chat.findOne({ hospitalId, userId });

    if (!chatSession) {
      const context = await buildHospitalContext(hospitalId);
      chatSession = new Chat({
        hospitalId,
        userId,
        messages: [],
        context,
      });
    }

    const context = await buildHospitalContext(hospitalId);

    const conversationHistory = chatSession.messages.slice(-14).map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    const ai = initializeGenAI();
    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const chat = model.startChat({
      history: conversationHistory,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const systemPrompt = context;
    const fullMessage = `${systemPrompt}\n\nUser: ${userMessage}`;

    let result;
    let retries = 2;
    let lastError;
    
    while (retries >= 0) {
      try {
        result = await chat.sendMessage(fullMessage);
        break;
      } catch (error) {
        lastError = error;
        if (error.status === 429 && retries > 0) {
          const backoffTime = Math.pow(2, 2 - retries) * 1000;
          await new Promise(resolve => setTimeout(resolve, backoffTime));
          retries--;
        } else {
          throw error;
        }
      }
    }
    
    if (!result && lastError) {
      throw lastError;
    }
    const assistantMessage = result.response.text();

    chatSession.messages.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    });

    chatSession.messages.push({
      role: 'assistant',
      content: assistantMessage,
      timestamp: new Date(),
    });

    if (chatSession.messages.length > 30) {
      chatSession.messages = chatSession.messages.slice(-30);
    }

    await chatSession.save();

    return {
      userMessage,
      assistantMessage,
      chatId: chatSession._id,
    };
  } catch (error) {
    console.error('Error in chatbot service:', error);
    throw error;
  }
};

export const getChatHistory = async (hospitalId, userId) => {
  try {
    const chatSession = await Chat.findOne({ hospitalId, userId });

    if (!chatSession) {
      return [];
    }

    return chatSession.messages.slice(-15).map((msg) => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
    }));
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    throw error;
  }
};

export const clearChatHistory = async (hospitalId, userId) => {
  try {
    await Chat.findOneAndDelete({ hospitalId, userId });
    return { message: 'Chat history cleared' };
  } catch (error) {
    console.error('Error clearing chat history:', error);
    throw error;
  }
};
