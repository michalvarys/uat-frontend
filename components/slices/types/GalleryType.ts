import ImageType from '../../common/types/ImageType';

type GalleryItemType = {
  id: number,
  fullsize: ImageType,
  thumbnail: ImageType,
};

type GalleryType = {
  id: number,
  title?: string,
  gallery_item: Array<GalleryItemType>,
};

export type {
  GalleryItemType,
  GalleryType,
};
