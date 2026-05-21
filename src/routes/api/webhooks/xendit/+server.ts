import { json } from '@sveltejs/kit';
import { XENDIT_WEBHOOK_TOKEN } from '$env/static/private';
import type { RequestHandler } from './$types';
import crypto from 'crypto';

/**
 * Xendit Webhook Handler
 * 
 * Receives payment notifications from Xendit.
 * When payment is successful, generates binding key and marks order as completed.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
  // Verify webhook token
  const callbackToken = request.headers.get('x-callback-token');
  if (callbackToken !== XENDIT_WEBHOOK_TOKEN) {
    return json({ error: 'Invalid webhook token' }, { status: 401 });
  }

  try {
    const payload = await request.json();

    // Xendit sends invoice webhook with status
    const { external_id, status, paid_amount } = payload;

    if (!external_id) {
      return json({ error: 'Missing external_id' }, { status: 400 });
    }

    // external_id is our order ID
    const orderId = external_id;

    if (status === 'PAID' || status === 'SETTLED') {
      // Get the order
      const { data: order } = await locals.supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (!order) {
        return json({ error: 'Order not found' }, { status: 404 });
      }

      // Update order status
      await locals.supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderId);

      // Generate binding key
      const bindingKey = generateBindingKey(order.product_id, order.device_id);

      // Create device binding
      await locals.supabase.from('device_bindings').insert({
        product_id: order.product_id,
        device_id: order.device_id,
        binding_key: bindingKey,
        customer_email: order.customer_email,
        is_active: true,
        expires_at: null
      });

      return json({ success: true, message: 'Payment processed, binding created' });
    }

    if (status === 'EXPIRED') {
      await locals.supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);

      return json({ success: true, message: 'Order cancelled due to expired payment' });
    }

    return json({ success: true, message: `Webhook received: ${status}` });
  } catch (e: any) {
    console.error('Webhook error:', e.message);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};

function generateBindingKey(productId: string, deviceId: string): string {
  const secret = `${productId}:${deviceId}:${Date.now()}`;
  return crypto.createHash('sha256').update(secret).digest('hex').substring(0, 32);
}
