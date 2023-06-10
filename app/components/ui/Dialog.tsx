import * as DialogPrimitive from '@radix-ui/react-dialog';
import Button from './Button';
import { Cross2Icon } from '@radix-ui/react-icons';
import cn from 'classnames';

type DialogProps = {
  trigger: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
} & DialogPrimitive.DialogProps;

export default function Dialog({
  trigger,
  title,
  description,
  children,
  maxWidth = 'sm',
  ...props
}: DialogProps) {
  return (
    <DialogPrimitive.Root {...props}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="
            fixed inset-0 z-30
            bg-black bg-opacity-20 backdrop-blur-sm
            animate-backdropIn
          "
        />

        <DialogPrimitive.Content
          className={cn(
            `
            fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40
            w-[calc(100vw-2rem)] lg:w-[calc(100vw-4rem)]
            max-h-[calc(100vh-2rem)] lg:max-h-[calc(100vh-4rem)]
            p-6 rounded-2xl border surface-thick
            animate-modalIn
            `,
            {
              'max-w-screen-sm': maxWidth === 'sm',
              'max-w-screen-md': maxWidth === 'md',
              'max-w-screen-lg': maxWidth === 'lg',
              'max-w-screen-xl': maxWidth === 'xl',
              'max-w-screen-2xl': maxWidth === '2xl',
            },
          )}
        >
          <DialogPrimitive.Title className="font-display text-3xl mb-2 -mt-2">
            {title}
          </DialogPrimitive.Title>

          {description ? (
            <DialogPrimitive.Description className="text-sm text-light mb-2">
              {description}
            </DialogPrimitive.Description>
          ) : null}

          <div className="border-t pt-2">
            {children}
          </div>

          <DialogPrimitive.Close asChild>
            <Button
              variant={{ type: 'icon', size: 'sm', color: 'neutral' }}
              className="absolute top-4 right-4"
            >
              <Cross2Icon />
            </Button>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

const DialogClose = DialogPrimitive.Close;

export { DialogClose };
