export interface Image {
  extension: string;
  filename: string;
  mime: string;
  name: string;
  url: string;
}

export interface ImageData {
  delete_url: string;
  display_url: string;
  expiration: number;
  height: number;
  id: string;
  image: Image;
  medium: Image;
  size: number;
  thumb: Image;
  time: number;
  title: string;
  url: string;
  url_viewer: string;
  width: number;
}

export interface ImgbbResponse {
  data: ImageData;
  status: number;
  success: boolean;
}
