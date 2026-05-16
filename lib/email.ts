type SendOtpEmailInput = {
  to: string;
  code: string;
};

type ResendError = {
  message?: string;
  name?: string;
};

const resendApiUrl = "https://api.resend.com/emails";

export async function sendOtpEmail({ to, code }: SendOtpEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.EMAIL_FROM || "Sahabat Ilmu <noreply@sahabatilmu.web.id>";

  if (!apiKey) {
    throw new Error("RESEND_API_KEY belum dikonfigurasi");
  }

  const response = await fetch(resendApiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: "Kode masuk Sahabat Ilmu",
      text: `Kode masuk Sahabat Ilmu kamu: ${code}. Kode ini berlaku 10 menit.`,
      html: `
        <div style="font-family:Arial,sans-serif;background:#fffaf0;padding:32px;color:#0f3d2e">
          <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e6ddc7;border-radius:16px;padding:28px">
            <p style="margin:0 0 12px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#8a5a12;font-weight:700">Sahabat Ilmu</p>
            <h1 style="margin:0 0 16px;font-size:24px;color:#0f3d2e">Kode masuk</h1>
            <p style="margin:0 0 18px;line-height:1.7;color:#315846">Gunakan kode berikut untuk masuk ke dashboard.</p>
            <div style="font-size:32px;letter-spacing:.28em;font-weight:800;background:#f6efe0;border-radius:12px;padding:18px 20px;text-align:center;color:#0f3d2e">${code}</div>
            <p style="margin:18px 0 0;line-height:1.7;color:#6b7b71;font-size:14px">Kode berlaku 10 menit. Abaikan email ini kalau kamu tidak meminta kode.</p>
          </div>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    let error: ResendError = {};
    try {
      error = await response.json();
    } catch {
      error = { message: response.statusText };
    }

    throw new Error(error.message || "Gagal mengirim kode OTP");
  }

  return response.json();
}
