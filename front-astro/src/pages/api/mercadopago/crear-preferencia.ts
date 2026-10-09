import type { APIRoute } from 'astro';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const host = process.env.HOST ?? 'http://localhost:4321';

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const { pedidoId, items, emailUsuario } = await request.json();

    if (!process.env.MP_ACCESS_TOKEN) {
      return new Response(
        JSON.stringify({ error: 'Falta la variable MP_ACCESS_TOKEN.' }),
        { status: 500 },
      );
    }

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: items.map((item: any) => ({
          id: String(item.producto_id),
          title: item.nombre,
          quantity: Number(item.cantidad),
          unit_price: Number(item.precio),
          currency_id: 'MXN',
        })),
        external_reference: String(pedidoId),
        payer: { email: emailUsuario },
        back_urls: {
          success: `${host}/pago/exito`,
          failure: `${host}/pago/error`,
          pending: `${host}/pago/pendiente`,
        },
        auto_return: 'approved',
        notification_url: `${host}/api/mercadopago/webhook`,
      },
    });

    return new Response(JSON.stringify({ init_point: result.init_point }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error MP Preferencia:', error);
    return new Response(
      JSON.stringify({ error: 'Error al crear la preferencia de pago' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};