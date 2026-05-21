import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { createInvoice } from '$lib/server/xendit';
import crypto from 'crypto';

export const load: PageServerLoad = async ({ params, locals, url }) => {
  const session = await locals.getSession();

  // Redirect to login if not authenticated
  if (!session) {
    redirect(303, `/auth/login?next=${encodeURIComponent(url.pathname)}`);
  }

  const { data: product } = await locals.supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single();

  if (!product) {
    throw error(404, 'Produk tidak ditemukan');
  }

  return { product, userEmail: session.user.email };
};

export const actions: Actions = {
  default: async ({ request, params, locals }) => {
    const session = await locals.getSession();
    if (!session) {
      return fail(401, { error: 'Silakan login terlebih dahulu' });
    }

    const formData = await request.formData();
    const deviceId = formData.get('device_id') as string;
    const email = session.user.email!;

    if (!deviceId) {
      return fail(400, { error: 'Device ID wajib diisi' });
    }

    const { data: product } = await locals.supabase
      .from('products')
      .select('*')
      .eq('slug', params.slug)
      .single();

    if (!product) {
      return fail(404, { error: 'Produk tidak ditemukan' });
    }

    // Create order
    const { data: order, error: orderError } = await locals.supabase
      .from('orders')
      .insert({
        customer_email: email,
        product_id: product.id,
        device_id: deviceId,
        status: 'pending',
        amount: product.price
      })
      .select()
      .single();

    if (orderError) {
      return fail(500, { error: 'Gagal membuat pesanan' });
    }

    // For free apps, auto-complete and generate binding key
    if (product.price === 0) {
      const bindingKey = generateBindingKey(product.id, deviceId);

      await locals.supabase.from('device_bindings').insert({
        product_id: product.id,
        device_id: deviceId,
        binding_key: bindingKey,
        customer_email: email,
        is_active: true,
        expires_at: null
      });

      await locals.supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', order.id);

      redirect(303, `/orders/${order.id}/success`);
    }

    // For paid apps, create Xendit invoice
    try {
      const invoice = await createInvoice({
        external_id: order.id,
        amount: product.price,
        payer_email: email,
        description: `Pembelian ${product.name} - AppStore`,
        success_redirect_url: `${PUBLIC_BASE_URL}/orders/${order.id}/success`,
        failure_redirect_url: `${PUBLIC_BASE_URL}/orders/${order.id}/failed`
      });

      // Save invoice URL to order (store in a simple way via update)
      await locals.supabase
        .from('orders')
        .update({ status: 'pending' })
        .eq('id', order.id);

      // Redirect to Xendit payment page
      redirect(303, invoice.invoice_url);
    } catch (e: any) {
      console.error('Xendit error:', e.message);
      return fail(500, { error: `Gagal membuat pembayaran: ${e.message}` });
    }
  }
};

function generateBindingKey(productId: string, deviceId: string): string {
  const secret = `${productId}:${deviceId}:${Date.now()}`;
  return crypto.createHash('sha256').update(secret).digest('hex').substring(0, 32);
}
