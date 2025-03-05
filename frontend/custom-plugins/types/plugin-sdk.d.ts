declare module '@lobehub/chat-plugin-sdk' {
  export interface PluginConfig {
    identifier: string;
    version: string;
    api: Array<{
      name: string;
      description: string;
      url: string;
      method: string;
    }>;
    ui?: {
      url: string;
      height?: number;
    };
    settings?: {
      properties: Record<string, {
        title: string;
        type: string;
        enum?: string[];
        default?: string | number | boolean;
        format?: string;
      }>;
      required?: string[];
    };
    meta: {
      title: string;
      description: string;
      avatar: string;
      tags: string[];
      author: string;
    };
  }
} 