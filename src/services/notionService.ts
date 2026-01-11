import { Client } from '@notionhq/client';
import type { Nippo } from '../types/nippo';

class NotionService {
  private client: Client | null = null;

  constructor() {
    const token = localStorage.getItem('notion_token');
    if (token) {
      this.client = new Client({
        auth: token,
      });
    }
  }

  setCredentials(token: string, databaseId: string) {
    localStorage.setItem('notion_token', token);
    localStorage.setItem('notion_database_id', databaseId);
    this.client = new Client({
      auth: token,
    });
  }

  isConfigured(): boolean {
    const token = localStorage.getItem('notion_token');
    const databaseId = localStorage.getItem('notion_database_id');
    return Boolean(this.client && token && databaseId);
  }

  async createPage(nippo: Nippo): Promise<string | null> {
    const databaseId = localStorage.getItem('notion_database_id');
    if (!this.client || !databaseId) {
      console.warn('Notion not configured');
      return null;
    }

    try {
      const response = await this.client.pages.create({
        parent: {
          database_id: databaseId,
        },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: `${nippo.date} - ${nippo.title}`,
                },
              },
            ],
          },
          Date: {
            date: {
              start: nippo.date,
            },
          },
          Title: {
            rich_text: [
              {
                text: {
                  content: nippo.title,
                },
              },
            ],
          },
        },
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: nippo.content,
                  },
                },
              ],
            },
          },
        ],
      });

      return response.id;
    } catch (error) {
      console.error('Failed to create Notion page:', error);
      return null;
    }
  }
}

export const notionService = new NotionService();