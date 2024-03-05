addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
    // Check if the request method is POST
    if (request.method === 'POST') {
      try {
        // Parse the form data from the request body
        const formData = await request.formData();
  
        // Construct the message body for SendGrid
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
  
        // Construct the email payload for SendGrid
        const sendGridData = {
          personalizations: [{
            to: [{ email: formData.get('admin_email') }],
            subject: formData.get('form_subject')
          }],
          from: { email: 'noreply@example.com' },
          content: [{
            type: 'text/html',
            value: message
          }]
        };
  
        // Send the email using SendGrid API
        const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer YOUR_SENDGRID_API_KEY' // Replace with your SendGrid API key
          },
          body: JSON.stringify(sendGridData)
        });
  
        // Check if the email was sent successfully via SendGrid
        if (!sendGridResponse.ok) {
          return new Response('Failed to submit form via SendGrid', { status: 500 });
        }
  
        // Construct the request body for adding a subscriber to Mailchimp
        const mailchimpData = {
          email_address: formData.get('Email'), // Assuming the form field for email is named 'email'
          status: 'subscribed',
          merge_fields: {
            NAME: formData.get('Name'), // Assuming the form field for first name is named 'first_name'
            MESSAGE: formData.get('Message')   // Assuming the form field for last name is named 'last_name'
          }
        };
  
        // Send the request to Mailchimp API
        const mailchimpResponse = await fetch('https://<dc>.api.mailchimp.com/3.0/lists/YOUR_MAILCHIMP_AUDIENCE_ID/members', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${btoa(`apikey:YOUR_MAILCHIMP_API_KEY`)}`
          },
          body: JSON.stringify(mailchimpData)
        });
  
        // Check if the request was successful via Mailchimp
        if (!mailchimpResponse.ok) {
          return new Response('Failed to submit form via Mailchimp', { status: 500 });
        }
  
        return new Response('Form submitted successfully', { status: 200 });
      } catch (error) {
        return new Response('Internal server error', { status: 500 });
      }
    } else {
      return new Response('Method Not Allowed', { status: 405 });
    }
  }
  