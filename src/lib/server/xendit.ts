import { XENDIT_SECRET_KEY } from '$env/static/private';

const XENDIT_API_URL = 'https://api.xendit.co';

interface CreateInvoiceParams {
  external_id: string;
  amount: number;
  payer_email: string;
  description: string;
  success_redirect_url: string;
  failure_redirect_url: string;
}

interface XenditInvoice {
  id: string;
  external_id: string;
  status: string;
  amount: number;
  invoice_url: string;
  expiry_date: string;
}

/**
 * Create a Xendit invoice for payment.
 */
export async function createInvoice(params: CreateInvoiceParams): Promise<XenditInvoice> {
  const response = await fetch(`${XENDIT_API_URL}/v2/invoices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(XENDIT_SECRET_KEY + ':')}`
    },
    body: JSON.stringify({
      external_id: params.external_id,
      amount: params.amount,
      payer_email: params.payer_email,
      description: params.description,
      success_redirect_url: params.success_redirect_url,
      failure_redirect_url: params.failure_redirect_url,
      currency: 'IDR',
      invoice_duration: 86400 // 24 hours
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Xendit error: ${error.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Get invoice details from Xendit.
 */
export async function getInvoice(invoiceId: string): Promise<XenditInvoice> {
  const response = await fetch(`${XENDIT_API_URL}/v2/invoices/${invoiceId}`, {
    headers: {
      Authorization: `Basic ${btoa(XENDIT_SECRET_KEY + ':')}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to get invoice: ${response.statusText}`);
  }

  return response.json();
}
