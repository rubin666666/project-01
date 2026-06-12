'use client';

import { cloneElement } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import CloseIcon from '@/src/assets/icons/close-icon.svg';
import styles from '@/src/components/Modal/modal.module.css';

export default function Modal({ open, onOpenChange, title, message, actions }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.modal}>
          <Dialog.Close asChild>
            <button className={styles.closeBtn} aria-label="Close">
              <CloseIcon className={styles.icon} />
            </button>
          </Dialog.Close>
          <Dialog.Title className={styles.title}>{title}</Dialog.Title>
          <Dialog.Description className={styles.message}>
            {message}
          </Dialog.Description>
          <ul className={styles.actions}>
            {actions?.map((action, index) => (
              <li key={action.text || index} className={styles.actionItem}>
                {action.element
                  ? cloneElement(action.element, {
                      className:
                        action.type === 'secondary'
                          ? styles.secondaryBtn
                          : styles.primaryBtn,
                    })
                  : (
                      <button
                        type="button"
                        className={
                          action.type === 'secondary'
                            ? styles.secondaryBtn
                            : styles.primaryBtn
                        }
                        onClick={action.onClick}
                        disabled={action.disabled}
                      >
                        {action.text}
                      </button>
                    )}
              </li>
            ))}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
