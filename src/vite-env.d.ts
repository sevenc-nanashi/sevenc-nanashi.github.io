/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

declare module "*as=picture" {
  /**
   * The picture output format.
   */
  export interface Picture {
    /**
     * Key is format. Value is srcset.
     */
    sources: Record<string, string>;
    img: {
      src: string;
      w: number;
      h: number;
    };
  }
  const picture: Picture;
  export default picture;
}
