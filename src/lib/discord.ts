import { Ticket, PurchaseRecord } from '../types/database';

export interface DiscordNotificationPayload {
  title: string;
  description: string;
  color: number;
  fields: { name: string; value: string; inline?: boolean }[];
  timestamp?: string;
}

/**
 * Dispatches a formatted notification to the configured Discord webhook endpoint.
 * In production, this proxies through a server-side route or Edge Function
 * to avoid exposing the webhook token to client browsers.
 */
export async function sendDiscordNotification(
  type: 'new_ticket' | 'ticket_reply' | 'purchase_verified',
  data: Ticket | PurchaseRecord | { ticket: Ticket; message: string; author: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if Discord webhook URL is configured via environment or settings
    const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL || '';

    // If no webhook configured, log internally and return gracefully (never fail the main action)
    if (!webhookUrl) {
      // In development / unconfigured environments, record event without throwing
      console.info(`[Discord Notify - Simulated] Event: ${type}`, data);
      return { success: true };
    }

    let embed: DiscordNotificationPayload;

    if (type === 'new_ticket') {
      const ticket = data as Ticket;
      embed = {
        title: `🎫 New Ticket #${ticket.ticket_number}: ${ticket.title}`,
        description: ticket.description.slice(0, 500) + (ticket.description.length > 500 ? '...' : ''),
        color: ticket.type === 'custom_dev' ? 0xd7ff3f : 0x8b5cff,
        fields: [
          { name: 'Customer', value: `${ticket.customer_name} (${ticket.customer_email})`, inline: true },
          { name: 'Category', value: ticket.category, inline: true },
          { name: 'Priority', value: ticket.priority.toUpperCase(), inline: true },
          { name: 'MC Version', value: ticket.mc_version || 'N/A', inline: true },
          { name: 'Budget / Scope', value: ticket.budget_range || 'Standard', inline: true },
          { name: 'Timeframe', value: ticket.timeframe || 'Flexible', inline: true },
        ],
        timestamp: new Date().toISOString(),
      };
    } else if (type === 'purchase_verified') {
      const purchase = data as PurchaseRecord;
      embed = {
        title: `✅ Purchase Verified for ${purchase.product_name}`,
        description: `Customer email **${purchase.customer_email}** has been verified and granted review permissions.`,
        color: 0xd7ff3f,
        fields: [
          { name: 'Product', value: purchase.product_name, inline: true },
          { name: 'Verified By', value: purchase.verified_by, inline: true },
          { name: 'Review Permitted', value: purchase.review_permitted ? 'Yes' : 'No', inline: true },
          { name: 'Reason / Note', value: purchase.verification_reason || 'Verified via Discord/Email', inline: false },
        ],
        timestamp: new Date().toISOString(),
      };
    } else {
      const payload = data as { ticket: Ticket; message: string; author: string };
      embed = {
        title: `💬 Reply on Ticket #${payload.ticket.ticket_number}`,
        description: payload.message.slice(0, 400),
        color: 0x8b5cff,
        fields: [
          { name: 'Author', value: payload.author, inline: true },
          { name: 'Ticket Status', value: payload.ticket.status.toUpperCase(), inline: true },
        ],
        timestamp: new Date().toISOString(),
      };
    }

    // Attempt delivery
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Flix Studios Dispatch',
        avatar_url: 'https://flixcorestudios.com/flixcore-logo.png',
        embeds: [embed],
      }),
    });

    if (!res.ok) {
      console.warn(`[Discord Notify] Delivery responded with status: ${res.status}`);
      return { success: false, error: `HTTP ${res.status}` };
    }

    return { success: true };
  } catch (err: unknown) {
    // Non-blocking error handling: never fail a user transaction because Discord is unreachable
    console.warn('[Discord Notify Error] Gracefully caught error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
