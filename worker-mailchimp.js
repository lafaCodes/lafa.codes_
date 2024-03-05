addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
    // Check if the request method is POST
    if (request.method === 'POST') {
      try {
        // Parse the form data from the request body
        const formData = await request.formData();
        
        // Construct the Mailchimp API endpoint URL
        const audienceId = 'ed1f09477d';
        const apiKey = '745b16bdd87b35e5b5c5c59dba243d80-us22';
        const endpoint = `https://us22.api.mailchimp.com/3.0/lists/${audienceId}/members`;
        // Replace <dc> with the data center prefix for your Mailchimp account (e.g., us6)
        
        // Construct the request body for adding a subscriber
        const body = {
          email_address: formData.get('email'), // Assuming the form field for email is named 'email'
          status: 'subscribed',
          merge_fields: {
            FNAME: formData.get('first_name'), // Assuming the form field for first name is named 'first_name'
            LNAME: formData.get('last_name')   // Assuming the form field for last name is named 'last_name'
          }
        };
        
        // Send the request to Mailchimp API
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${btoa(`apikey:${apiKey}`)}`
          },
          body: JSON.stringify(body)
        });
  
        // Check if the request was successful
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
  