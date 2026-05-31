//create a interface for the response of imgbb api
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
  expiration: string;
  height: string;
  id: string;
  image: Image;
  medium: Image;
  size: string;
  thumb: Image;
  time: string;
  title: string;
  url: string;
  url_viewer: string;
  width: string;
}
export interface ImgbbResponse {
  data: ImageData;
  status: number;
  success: boolean;
}

