import Image from 'next/image';
import { useState } from 'react';

import { GalleryItemType, GalleryType } from '../types/GalleryType';
import styles from './GallerySlice.module.scss';

import { transformLink } from '../../../utils/transformLink';
import Modal from '../../common/Modal';

import ArrowRightIcon from '../../../public/icons/common/arrow_right.svg';

type Props = {
  data: GalleryType
  isSmall?: boolean,
}

type GalleryItemProps = {
  data: GalleryItemType,
  isSmall: boolean,
  onSelect: (item: GalleryItemType) => void,
}

const GalleryItem = ({ data , isSmall, onSelect}: GalleryItemProps) => {
  const { thumbnail } = data;
  if (!thumbnail) {
    return null;
  }
  let thumbnailPath = thumbnail.url;
  if (thumbnail.formats && thumbnail.formats.small) {
    thumbnailPath = thumbnail.formats.small.url;
  } else if (thumbnail.formats && thumbnail.formats.thumbnail) {
    thumbnailPath = thumbnail.formats.thumbnail.url;
  }

  return (
    <div
      className={isSmall ? styles.image_container_small : styles.image_container}
      onClick={() => onSelect(data)}
    >
      <Image
        src={transformLink(thumbnailPath)}
        alt={thumbnail.alternativeText}
        layout={'fill'}
        objectFit={'cover'}
        objectPosition={'50% 30%'}
      />
    </div>
  )
}

const GallerySlice = ({ data, isSmall = false }: Props) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1);
  const onSelectImage = (idx: number) => {
    setSelectedItemIndex(idx);
  }

  const onNextImage = () => {
    if (selectedItemIndex < data.gallery_item.length - 1) {
      setSelectedItemIndex(selectedItemIndex + 1);
    }
  }

  const onPrevImage = () => {
    if (selectedItemIndex > 0) {
      setSelectedItemIndex(selectedItemIndex - 1);
    }
  }

  const renderFullsizeImage = () => (
    <Modal
      isImageStyle
      isOpen={selectedItemIndex > -1 ? true : false}
      onClose={() => setSelectedItemIndex(-1)}
    >
      <div className={styles.modal_container}>
        {selectedItemIndex > -1 && (
          <Image
            className={styles.full_image}
            alt={data.gallery_item[selectedItemIndex].fullsize.alternativeText}
            src={transformLink(data.gallery_item[selectedItemIndex].fullsize.url)}
            width={data.gallery_item[selectedItemIndex].fullsize.width}
            height={data.gallery_item[selectedItemIndex].fullsize.height}
            // layout={'fill'}
            objectFit={'contain'}
            objectPosition={'center top'}
          />
        )}
        <div
          className={styles.right_button}
          onClick={onNextImage}
        >
          <Image src={ArrowRightIcon} alt={'arrow'} height={20} width={20}/>
        </div>
        <div
          className={styles.left_button}
          onClick={onPrevImage}
        >
          <Image src={ArrowRightIcon} alt={'arrow'} height={20} width={20}/>
        </div>
      </div>
    </Modal>
  )
  return (
    <div className={styles.container}>
      {data.gallery_item.map((item, idx) => (
        <GalleryItem
          isSmall={isSmall}
          key={`gallery_item${item.id}`}
          data={item}
          onSelect={() => onSelectImage(idx)}
          />
      ))}
      {selectedItemIndex > -1 && renderFullsizeImage()}
    </div>
  );
};

export default GallerySlice;
