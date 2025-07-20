import { Client } from '@notionhq/client';
import type { Nippo } from '../types/nippo';

// Note: In production, these should be environment variables
const NOTION_TOKEN = localStorage.getItem('notion_token') || '';
const NOTION_DATABASE_ID = localStorage.getItem('notion_database_id') || '';

class NotionService {
  private client: Client | null = null;

  constructor() {
    if (NOTION_TOKEN) {
      this.client = new Client({
        auth: NOTION_TOKEN,
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
    return Boolean(this.client && NOTION_TOKEN && NOTION_DATABASE_ID);
  }

  async createPage(nippo: Nippo): Promise<string | null> {
    if (!this.client || !NOTION_DATABASE_ID) {
      console.warn('Notion not configured');
      return null;
    }

    try {
      const response = await this.client.pages.create({
        parent: {
          database_id: NOTION_DATABASE_ID,
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