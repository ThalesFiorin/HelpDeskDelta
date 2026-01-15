export default async function handler(request, response) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Método não permitido' });
  }

  const { to, subject, html } = request.body;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        // AQUI: Usando o domínio oficial (ficará pausado até o DNS aprovar)
        from: 'Help Desk Delta <nao-responda@deltadomusadm.com.br>',
        to: [to],
        subject: subject,
        html: html
      })
    });

    const data = await res.json();
    return response.status(200).json(data);

  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}
