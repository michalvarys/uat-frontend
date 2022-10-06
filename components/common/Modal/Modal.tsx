import Image from 'next/image'
import ReactModal from 'react-modal'
import { MouseEvent, KeyboardEvent } from 'react'
import styles from './Modal.module.scss'

import CloseIcon from '../../../public/icons/common/close.svg'

if (ReactModal.defaultStyles && ReactModal.defaultStyles.overlay) {
  ReactModal.defaultStyles.overlay.backgroundColor = '#00000020'
  ReactModal.defaultStyles.overlay.zIndex = 10002
  ReactModal.setAppElement('#modal-root')
}

type Props = {
  children: JSX.Element | JSX.Element[]
  isImageStyle?: boolean
  isOpen: boolean
  onClose: (event: MouseEvent | KeyboardEvent) => void
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: '0',
    border: 'none',
    transform: 'translate(-50%, -50%)',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
}

const imageTypeStyles = {
  maxWidth: '90%',
  maxHeight: '95%',
}

const Modal = ({ children, isImageStyle = false, isOpen, onClose }: Props) => {
  return (
    <ReactModal
      style={{
        ...customStyles,
        content: {
          ...customStyles.content,
          ...(isImageStyle && imageTypeStyles),
        },
      }}
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      <div className={isImageStyle ? styles.image_container : styles.container}>
        {children}
      </div>
      <div className={styles.close_button} onClick={onClose}>
        <Image alt="close" src={CloseIcon} height={18} width={18} />
      </div>
    </ReactModal>
  )
}

export default Modal
