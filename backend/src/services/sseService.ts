import { Response } from 'express';

interface ClientConnection {
  id: string;
  res: Response;
  channel: string; // e.g. 'centre:cd-pillaiyar-today' or 'booking:bk-ramesh-main' or 'global'
}

class SSEService {
  private clients: ClientConnection[] = [];

  public addClient(id: string, channel: string, res: Response) {
    this.clients.push({ id, channel, res });

    // Send initial keep-alive comment
    res.write(`event: connected\ndata: ${JSON.stringify({ message: 'Connected to ProcureFlow Live Stream', channel })}\n\n`);

    res.on('close', () => {
      this.removeClient(id);
    });
  }

  public removeClient(id: string) {
    this.clients = this.clients.filter(c => c.id !== id);
  }

  public broadcast(channel: string, event: string, data: any) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;

    this.clients.forEach(client => {
      if (client.channel === channel || client.channel === 'global' || channel === 'global') {
        try {
          client.res.write(payload);
        } catch (err) {
          console.error(`Failed to push to SSE client ${client.id}:`, err);
        }
      }
    });
  }
}

export const sseService = new SSEService();
