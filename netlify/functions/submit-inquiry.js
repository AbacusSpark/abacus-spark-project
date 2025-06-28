const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { customerName, customerPhone, requestedItems } = JSON.parse(event.body);

    // --- CONFIGURE YOUR EMAIL DETAILS HERE ---
    const yourEmail = 'abacussparks@gmail.com'; 
    const fromEmail = 'abacussparks@gmail.com'; 
    // -----------------------------------------

    if (!customerName || !customerPhone || !requestedItems || requestedItems.length === 0) {
      return { statusCode: 400, body: 'Bad request. Please fill all fields.' };
    }

    const productList = requestedItems.map(item => `- ${item.name}`).join('\n');

    const msg = {
      to: yourEmail,
      from: fromEmail, 
      subject: `New Callback Request from ${customerName}`,
      text: `You have received a new inquiry from the Abacus Spark website.\n\n` +
            `================================\n` +
            `CUSTOMER DETAILS:\n` +
            `Name: ${customerName}\n` +
            `Phone Number: ${customerPhone}\n\n` +
            `REQUESTED PRODUCTS:\n` +
            `${productList}\n` +
            `================================\n\n` +
            `Please call me back to confirm the order.`,
    };

    await sgMail.send(msg);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Request sent successfully!' }),
    };

  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'There was an error sending your request.' }),
    };
  }
};
