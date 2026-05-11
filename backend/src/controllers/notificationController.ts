import { Request, Response } from 'express';
// Import the messaging instance we already initialized in firebaseAdmin.ts
import { messaging } from '../services/firebaseAdmin'; 

/**
 * Handles FCM token registration and topic subscription
 * POST /api/subscribe
 */
export const subscribeToTopic = async (req: Request, res: Response) => {
  const { token, topic } = req.body;

  if (!token || !topic) {
    return res.status(400).json({
      success: false, 
      message: 'FCM Token and Topic name are required.' 
    });
  }

  // Safety check to ensure the Firebase service is ready
  if (!messaging) {
    return res.status(500).json({
      success: false,
      message: 'Firebase Messaging service is not initialized.'
    });
  }

  try {
    // FIX: Use the 'messaging' constant directly
    const response = await messaging.subscribeToTopic(token, topic);

    console.log(`Successfully subscribed to ${topic}. Success count: ${response.successCount}`);

    return res.status(200).json({
      success: true,
      message: `Successfully subscribed to ${topic}`,
      details: response
    });
  } catch (error) {
    console.error('FCM Subscription Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to subscribe to notification topic.' 
    });
  }
};