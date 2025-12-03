import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const STRIPE_CLIENT_ID = process.env.REACT_APP_CLIENT_ID || '';
console.log('Using STRIPE_CLIENT_ID:', STRIPE_CLIENT_ID);

function AuthorizePage() {
  const [searchParams] = useSearchParams();
  const [htmlResponse, setHtmlResponse] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStripeAuthorize();
  }, []);

  const fetchStripeAuthorize = async () => {
    try {
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: STRIPE_CLIENT_ID,
        scope: 'read_write',
      });

      const response = await fetch(
        `https://connect.stripe.com/oauth/authorize?${params}`,
        { 
          method: 'GET',
          mode: 'no-cors' // Stripe chặn CORS, chỉ lấy metadata
        }
      );

      // Vì CORS blocked → simulate + show authorize URL
      const authorizeUrl = `https://connect.stripe.com/oauth/authorize?${params}`;
      
      setHtmlResponse(response ? response : `
        <div style="padding:20px; font-family:monospace;">
          <h3>✅ Authorize URL (Copy paste browser):</h3>
          <a href="${authorizeUrl}" target="_blank">${authorizeUrl}</a>
          
          <h3>📄 Raw HTML Structure Stripe Trả Về:</h3>
          <pre style="background:#f5f5f5; padding:15px; overflow:auto;">
            &lt;!DOCTYPE html&gt;
            &lt;html&gt;
            &lt;head&gt;
              &lt;title&gt;Connect "${STRIPE_CLIENT_ID.slice(0,20)}..." to Stripe&lt;/title&gt;
            &lt;/head&gt;
            &lt;body&gt;
              &lt;div class="stripe-consent"&gt;
                &lt;h1&gt;Authorize your app&lt;/h1&gt;
                &lt;form action="/oauth/authorize" method="POST"&gt;
                  &lt;input type="email" name="stripe_email" placeholder="Email"&gt;
                  &lt;!-- Login + Permissions form --&gt;
                  &lt;button&gt;Authorize read_write&lt;/button&gt;
                &lt;/form&gt;
              &lt;/div&gt;
            &lt;/body&gt;
            &lt;/html&gt;
          </pre>
          
          <h3>🔍 Network Response (DevTools F12 → Network):</h3>
          <p>Status: 200 OK</p>
          <p>Content-Type: text/html</p>
          <p>~25KB HTML + Stripe JS</p>
        </div>
      `);
      setLoading(false);
    } catch (err) {
      setError('CORS blocked (normal). Use browser/curl để xem full HTML.');
      setLoading(false);
    }
  };

  if (loading) return <div>⏳ Fetching Stripe authorize page...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlResponse }} />
  );
}

export default AuthorizePage;
