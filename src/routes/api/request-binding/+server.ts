import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * API endpoint for apps to request their binding key.
 * Used when the app is first launched after purchase.
 * 
 * POST /api/request-binding
 * Body: { product_id: string, device_id: string, email: string }
 * 
 * Returns: { success: boolean, binding_key?: string, message: string }
 */
export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const { product_id, device_id, email } = await request.json();

    if (!product_id || !device_id || !email) {
      return json(
        { success: false, message: 'Missing required fields: product_id, device_id, email' },
        { status: 400 }
      );
    }

    // Check if there's a completed order for this product + device + email
    const { data: order } = await locals.supabase
      .from('orders')
      .select('*')
      .eq('product_id', product_id)
      .eq('device_id', device_id)
      .eq('customer_email', email)
      .eq('status', 'completed')
      .single();

    if (!order) {
      return json(
        { success: false, message: 'No completed order found for this device' },
        { status: 404 }
      );
    }

    // Check if binding already exists
    const { data: existingBinding } = await locals.supabase
      .from('device_bindings')
      .select('*')
      .eq('product_id', product_id)
      .eq('device_id', device_id)
      .eq('is_active', true)
      .single();

    if (existingBinding) {
      return json({
        success: true,
        binding_key: existingBinding.binding_key,
        message: 'Binding key retrieved'
      });
    }

    return json(
      { success: false, message: 'Binding not found. Please contact support.' },
      { status: 404 }
    );
  } catch {
    return json(
      { success: false, message: 'Invalid request body' },
      { status: 400 }
    );
  }
};
