import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * API endpoint for apps to verify device binding.
 * 
 * POST /api/verify-binding
 * Body: { product_id: string, device_id: string, binding_key: string }
 * 
 * Returns: { valid: boolean, message: string }
 */
export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const { product_id, device_id, binding_key } = await request.json();

    if (!product_id || !device_id || !binding_key) {
      return json(
        { valid: false, message: 'Missing required fields: product_id, device_id, binding_key' },
        { status: 400 }
      );
    }

    const { data: binding } = await locals.supabase
      .from('device_bindings')
      .select('*')
      .eq('product_id', product_id)
      .eq('device_id', device_id)
      .eq('binding_key', binding_key)
      .eq('is_active', true)
      .single();

    if (!binding) {
      return json(
        { valid: false, message: 'Invalid binding key or device not authorized' },
        { status: 403 }
      );
    }

    // Check expiration
    if (binding.expires_at && new Date(binding.expires_at) < new Date()) {
      return json(
        { valid: false, message: 'Binding key has expired' },
        { status: 403 }
      );
    }

    return json({ valid: true, message: 'Device authorized' });
  } catch {
    return json(
      { valid: false, message: 'Invalid request body' },
      { status: 400 }
    );
  }
};
