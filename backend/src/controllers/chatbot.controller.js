import { sendMessage, getChatHistory, clearChatHistory } from '../services/chatbot.service.js';

const requestCounts = new Map();
const responseCache = new Map();
const RATE_LIMIT = 1;
const RATE_LIMIT_WINDOW = 300000;
const CACHE_DURATION = 600000;

const getCacheKey = (hospitalId, message) => {
  return `${hospitalId}:${message.toLowerCase().trim()}`;
};

const getCachedResponse = (cacheKey) => {
  const cached = responseCache.get(cacheKey);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    responseCache.delete(cacheKey);
    return null;
  }
  
  return cached.response;
};

const setCachedResponse = (cacheKey, response) => {
  responseCache.set(cacheKey, {
    response,
    timestamp: Date.now(),
  });
};

const checkRateLimit = (userId) => {
  const now = Date.now();
  const key = `${userId}-${Math.floor(now / RATE_LIMIT_WINDOW)}`;
  
  if (!requestCounts.has(key)) {
    requestCounts.set(key, 1);
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }
  
  const count = requestCounts.get(key);
  if (count >= RATE_LIMIT) {
    const resetTime = Math.ceil((RATE_LIMIT_WINDOW - (now % RATE_LIMIT_WINDOW)) / 1000);
    return { allowed: false, resetTime };
  }
  
  requestCounts.set(key, count + 1);
  return { allowed: true, remaining: RATE_LIMIT - count - 1 };
};

export const chat = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { message, userId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const trimmedMessage = message.trim();
    const cacheKey = getCacheKey(hospitalId, trimmedMessage);
    
    const cachedResponse = getCachedResponse(cacheKey);
    if (cachedResponse) {
      return res.status(200).json({
        success: true,
        message: cachedResponse,
        cached: true,
      });
    }

    const rateLimit = checkRateLimit(userId);
    if (!rateLimit.allowed) {
      return res.status(429).json({ 
        error: `Rate limit exceeded. Please try again in ${rateLimit.resetTime} seconds.`,
        resetTime: rateLimit.resetTime,
      });
    }

    const result = await sendMessage(hospitalId, userId, trimmedMessage);

    setCachedResponse(cacheKey, result.assistantMessage);

    res.status(200).json({
      success: true,
      message: result.assistantMessage,
      chatId: result.chatId,
      cached: false,
    });
  } catch (error) {
    console.error('Error in chat controller:', error);
    if (error.status === 429) {
      return res.status(429).json({ error: 'API rate limit exceeded. Please try again in a few minutes.' });
    }
    res.status(500).json({ error: 'Failed to process message' });
  }
};

export const getHistory = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const history = await getChatHistory(hospitalId, userId);

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error('Error retrieving chat history:', error);
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
};

export const clearHistory = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    await clearChatHistory(hospitalId, userId);

    res.status(200).json({
      success: true,
      message: 'Chat history cleared successfully',
    });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
};
