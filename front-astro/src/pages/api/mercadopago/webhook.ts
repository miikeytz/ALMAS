import type { APIRoute } from 'astro';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const BACKEND_GRAPHQL_URL =
  process.env.BACKEND_GRAPHQL_URL ?? 'https://almas-1.onrender.com/graphql';

export const POST: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const payload = await request.json().catch(() => ({} as Record<string, unknown>));
    const type = url.searchParams.get('type') ?? String((payload as { type?: string }).type ?? '');
    const dataId =
      url.searchParams.get('data.id') ??
      String((payload as { data?: { id?: string } }).data?.id ?? '');

    if (type === 'payment' && dataId) {
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: dataId });

      const mappedStatus =
        paymentData.status === 'approved'
          ? 'pagado'
          : paymentData.status === 'rejected'
            ? 'rechazado'
            : 'pendiente';

      await fetch(BACKEND_GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation ActualizarEstadoPagoPorMp($idPagoMp: String!, $estatus: String!, $externalReference: String) {
              actualizarEstadoPagoPorMp(idPagoMp: $idPagoMp, estatus: $estatus, externalReference: $externalReference)
            }
          `,
          variables: {
            idPagoMp: String(paymentData.id),
            estatus: mappedStatus,
            externalReference: paymentData.external_reference ?? null,
          },
        }),
      });

      console.log('Webhook Mercado Pago recibido:', {
        id: paymentData.id,
        status: paymentData.status,
        external_reference: paymentData.external_reference,
      });
    }

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Error procesando webhook de Mercado Pago:', error);
    return new Response('KO', { status: 400 });
  }
};