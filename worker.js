addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
    // Check if the request method is POST
    if (request.method === 'POST') {
      try {
        // Parse the form data from the request body
        const formData = await request.formData();
  
        // Construct the message body
        let message = '';
        for (const [key, value] of formData.entries()) {
          // Exclude predefined fields and empty values
          if (value && key !== 'project_name' && key !== 'admin_email' && key !== 'form_subject') {
            // Sanitize and concatenate key-value pairs
            message += `<tr><td style="padding: 10px; border: #e9e9e9 1px solid;"><b>${key}</b></td><td style="padding: 10px; border: #e9e9e9 1px solid;">${value}</td></tr>`;
          }
        }
  
        // Wrap the message in a table
        message = `<table style="width: 100%;">${message}</table>`;
  
        // Construct the email payload
        const emailData = {
          personalizations: [{
            to: [{ email: formData.get('admin_email') }],
            subject: formData.get('form_subject')
          }],
          from: { email: 'porfolio@lafa.codes' },
          content: [{
            type: 'text/html',
            value: message
          }]
        };
  
        // Send the email using SendGrid API
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer YOUR_SENDGRID_API_KEY' // Replace with your SendGrid API key
          },
          body: JSON.stringify(emailData)
        });
  
        // Check if the email was sent successfully
        if (response.ok) {
          return new Response('Form submitted successfully', { status: 200 });
        } else {
          return new Response('Failed to submit form', { status: 500 });
        }
      } catch (error) {
        return new Response('Internal server error', { status: 500 });
      }
    } else {
      return new Response('Method Not Allowed', { status: 405 });
    }
  }
  