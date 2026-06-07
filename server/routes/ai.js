import express from 'express';
import Professional from '../models/Professional.js';

const router = express.Router();

// Reusable chat handler for NLP matching
const chatHandler = async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ success: false, message: "Message is required" });
  }
  
  const lowercaseMsg = message.toLowerCase();

  try {
    let reply = "";
    let data = null;
    let action = null; // Can trigger frontend events (like open map, redirect, etc.)

    // Determine intent based on keywords
    if (
      lowercaseMsg.includes('plumber') ||
      lowercaseMsg.includes('electrician') ||
      lowercaseMsg.includes('mechanic') ||
      lowercaseMsg.includes('carpenter') ||
      lowercaseMsg.includes('painter') ||
      lowercaseMsg.includes('cleaner') ||
      lowercaseMsg.includes('ac repair') ||
      lowercaseMsg.includes('appliance') ||
      lowercaseMsg.includes('purifier') ||
      lowercaseMsg.includes('internet')
    ) {
      // Map message to model profession format
      let profession = "";
      if (lowercaseMsg.includes('plumber')) profession = "Plumber";
      else if (lowercaseMsg.includes('electrician')) profession = "Electrician";
      else if (lowercaseMsg.includes('mechanic')) profession = "Mechanic";
      else if (lowercaseMsg.includes('carpenter')) profession = "Carpenter";
      else if (lowercaseMsg.includes('painter')) profession = "Painter";
      else if (lowercaseMsg.includes('cleaner')) profession = "Home Cleaner";
      else if (lowercaseMsg.includes('ac repair') || lowercaseMsg.includes('air conditioner')) profession = "AC Repair";
      else if (lowercaseMsg.includes('appliance')) profession = "Appliance Repair";
      else if (lowercaseMsg.includes('purifier') || lowercaseMsg.includes('water')) profession = "Water Purifier";
      else if (lowercaseMsg.includes('internet') || lowercaseMsg.includes('wifi')) profession = "Internet Technician";

      // Query database for top active professionals in that field
      const pros = await Professional.find({ profession, availability: true })
        .sort({ rating: -1 })
        .limit(3);

      if (pros.length > 0) {
        reply = `I found some top-rated **${profession}s** active near you. You can view their profiles or book them directly:`;
        data = {
          profession,
          professionals: pros.map(p => ({
            id: p._id,
            name: p.name,
            rating: p.rating,
            experience: p.experience,
            phone: p.phone
          }))
        };
        action = "suggest_booking";
      } else {
        reply = `I see you are looking for a **${profession}**. Let me search. Currently, we don't have any online active professionals in this immediate category, but you can request an emergency dispatch!`;
      }
    } else if (lowercaseMsg.includes('emergency') || lowercaseMsg.includes('urgent') || lowercaseMsg.includes('30 min') || lowercaseMsg.includes('quick')) {
      reply = "🚨 **Emergency Mode Triggered!** FixMate AI offers rapid 30-minute dispatches for critical situations like pipe bursts, electrical short circuits, and vehicle breakdowns. Would you like me to open the Emergency Request panel for you?";
      action = "open_emergency_mode";
    } else if (lowercaseMsg.includes('how does') || lowercaseMsg.includes('work') || lowercaseMsg.includes('steps')) {
      reply = "FixMate AI is simple to use:\n\n1. **Choose Service**: Select from our 10+ categories.\n2. **Find Professionals**: Check nearby workers on our live map.\n3. **Book instantly**: Schedule a date/time or select Emergency mode.\n4. **Get work done**: Pay securely and rate your professional.";
    } else if (lowercaseMsg.includes('price') || lowercaseMsg.includes('cost') || lowercaseMsg.includes('charge') || lowercaseMsg.includes('rate')) {
      reply = "FixMate AI ensures transparent, premium pricing with base service rates:\n\n- Plumber/Electrician/Carpenter: ₹250 base rate\n- AC Repair/Appliance Repair: ₹399 base rate\n- Cleaner/Painter/Internet: ₹499 base rate\n\nYou only pay after the job is completed successfully. No hidden fees!";
    } else if (lowercaseMsg.includes('hello') || lowercaseMsg.includes('hi') || lowercaseMsg.includes('hey') || lowercaseMsg.includes('status')) {
      reply = "Hello! 👋 I'm **FixMate AI**, your smart home assistant. I can help you search for local service professionals, manage your active bookings, answer pricing FAQs, or trigger Emergency service dispatches. What service do you need today?";
    } else {
      reply = "I'm not sure I fully understood. I can help you find Plumbers, Electricians, Carpenters, Mechanics, AC repair professionals, and more. Try asking something like:\n\n- *'I need an Electrician'*\n- *'Is there a Plumber near me?'*\n- *'How does Emergency Mode work?'*";
    }

    res.json({
      success: true,
      reply,
      data,
      action
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

router.post('/chat', chatHandler);
router.post('/', chatHandler);

export default router;
