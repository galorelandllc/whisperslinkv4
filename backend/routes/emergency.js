// File: mobile-app/emergency.js
import express from 'express';
import {generateEmergencyMessage} from '../agents/emergencyMessageAgent.js';
import { callHelp } from '../agents/callingAgent.js';

const emergencyRouter = express.Router();

emergencyRouter.post('/trigger', async (req, res) => {
  try {
    const {userId, context, vitals} = req.body;
    console.log(
      `[API Call] Triggering emergency for user ${userId} with context:`,
      context,
    );

    // Log vitals if provided
    // if (vitals) {
    //   console.log(`[Vitals Received] User: ${userId}, Data:`, vitals);
    // } else {
    //   console.log(`[Trigger Request] User: ${userId}, No vitals data included.`);
    // }

    const responsePhoneNumber = await generateEmergencyMessage(context);

    if (!responsePhoneNumber) {
      throw new Error('Failed to generate emergency message');
    }

    // Call Help
    const callingAgentResponse = await callHelp(responsePhoneNumber);
    if (!callingAgentResponse) {
      throw new Error('Failed to initiate emergency call');
    }

    console.log(
      `[Emergency Call] Initiated for user ${userId} to phone number: ${responsePhoneNumber}`,
    );
    // console.log(`[Emergency Message] Generated for user ${userId}:`, message);

    // res.json({ success: true, message });
  } catch (error) {
    console.error('[Trigger Error]', error);
    res.status(500).json({error: error.message});
  }
});

export default emergencyRouter;
