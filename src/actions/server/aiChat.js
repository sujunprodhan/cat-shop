'use server';


export const getAIResponse = async (userMessage, history = []) => {
  try {
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate AI thinking

    const responses = [
      "Hello! I'm your CatShop AI assistant. How can I help you with your feline friends today?",
      "Our shipping usually takes 3-5 business days. Would you like me to check a specific order status?",
      "We have a great collection of organic cat food! You can find it in the 'Food' category in our shop.",
      "Yes, all our products come with a 1-year warranty for your peace of mind.",
      "I'm sorry to hear you're having trouble. You can also reach our human support team via WhatsApp for urgent matters."
    ];

    // Simple logic to pick a response or "generate" one
    const reply = responses[Math.floor(Math.random() * responses.length)];

    return { 
      success: true, 
      reply: reply 
    };
  } catch (error) {
    console.error('AI Chat Error:', error);
    return { success: false, message: 'I am resting my paws right now. Please try again later!' };
  }
};
