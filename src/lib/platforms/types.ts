export interface PlatformSDK {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  post(content: any): Promise<string>;
  schedule(content: any, date: Date): Promise<string>;
  delete(postId: string): Promise<void>;
}