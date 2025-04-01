export interface MezonWebView {
  postEvent: (
    eventType: string,
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    eventData: any,
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    callback?: (error?: any) => void
  ) => void;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  receiveEvent: (eventType: string, eventData: any) => void;
  onEvent: (
    eventType: string,
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    callback: (eventType: string, eventData: any) => void
  ) => void;
  offEvent: (
    eventType: string,
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    callback: (eventType: string, eventData: any) => void
  ) => void;
}

export interface Mezon {
  WebView: MezonWebView;
}

export declare global {
  interface Window {
    Mezon: Mezon;
  }
}
