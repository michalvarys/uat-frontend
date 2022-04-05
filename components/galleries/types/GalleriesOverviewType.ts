import ImageType from '../../common/types/ImageType';
import UATGalleryType from '../../slices/types/UATGalleryType';
import { GalleryEventType } from './GalleryEventType';

type GalleriesOverviewType = {
  id: number,
  description: string,
  events: Array<GalleryEventType>,
  galleries_uats: Array<UATGalleryType>,
  subtitle: string,
  title: string,
};

export default GalleriesOverviewType;
