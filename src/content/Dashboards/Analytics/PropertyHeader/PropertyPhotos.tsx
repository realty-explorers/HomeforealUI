import { useState, useEffect, useCallback, useRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Images,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { validateValue } from '@/utils/converters';
import Image from '@/components/Photos/Image';
import { cn } from '@/lib/utils';

const defaultImage =
  '/static/images/placeholders/covers/house_placeholder.jpg';

type LightboxProps = {
  open: boolean;
  onClose: () => void;
  photos: string[];
  startIndex?: number;
};

const Lightbox = ({ open, onClose, photos, startIndex = 0 }: LightboxProps) => {
  const [index, setIndex] = useState(startIndex);
  const [zoomed, setZoomed] = useState(false);
  const thumbRailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setIndex(startIndex);
      setZoomed(false);
    }
  }, [open, startIndex]);

  const goNext = useCallback(() => {
    setZoomed(false);
    setIndex((i) => (i + 1) % photos.length);
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setZoomed(false);
    setIndex((i) => (i - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, goNext, goPrev]);

  useEffect(() => {
    if (!thumbRailRef.current) return;
    const active = thumbRailRef.current.querySelector<HTMLElement>(
      `[data-thumb-index="${index}"]`
    );
    active?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }, [index]);

  if (!photos || photos.length === 0) return null;

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(o) => !o && onClose()}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed inset-0 z-50 flex flex-col outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
          {/* soft ambient glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] rounded-full bg-violet-500/10 blur-[120px]" />
            <div className="absolute -bottom-32 -right-32 w-[40vw] h-[40vw] rounded-full bg-fuchsia-500/10 blur-[120px]" />
          </div>
          <DialogPrimitive.Title className="sr-only">
            Property photos
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Browse all property photos
          </DialogPrimitive.Description>

          {/* Top bar */}
          <div className="relative z-10 flex items-center justify-between p-4 sm:p-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-white/90 font-poppins text-sm font-semibold border border-white/10">
              <Images className="size-4" />
              <span className="tabular-nums">
                {index + 1} / {photos.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                className="inline-flex items-center justify-center size-10 rounded-full bg-white/10 backdrop-blur-md text-white/90 hover:bg-white/20 border border-white/10 transition-colors outline-none"
                aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
              >
                {zoomed ? (
                  <Minimize2 className="size-4" />
                ) : (
                  <Maximize2 className="size-4" />
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center size-10 rounded-full bg-white/10 backdrop-blur-md text-white/90 hover:bg-white/20 border border-white/10 transition-colors outline-none"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Main image area */}
          <div className="relative z-10 flex-1 flex items-center justify-center overflow-hidden px-4 sm:px-16">
            {photos.length > 1 && (
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center size-12 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/10 transition-all hover:scale-110 outline-none"
                aria-label="Previous photo"
              >
                <ChevronLeft className="size-6" />
              </button>
            )}

            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <img
                key={photos[index]}
                src={photos[index]}
                alt=""
                className={cn(
                  'max-h-full max-w-full object-contain rounded-xl shadow-2xl transition-transform duration-300 ease-out animate-in fade-in-0 zoom-in-95',
                  zoomed
                    ? 'scale-150 cursor-zoom-out'
                    : 'cursor-zoom-in hover:scale-[1.01]'
                )}
                onClick={() => setZoomed((z) => !z)}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultImage;
                }}
              />
            </div>

            {photos.length > 1 && (
              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center size-12 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/10 transition-all hover:scale-110 outline-none"
                aria-label="Next photo"
              >
                <ChevronRight className="size-6" />
              </button>
            )}
          </div>

          {/* Thumbnail rail */}
          {photos.length > 1 && (
            <div className="relative z-10 px-4 pb-4 sm:px-6 sm:pb-6 pt-2">
              <div
                ref={thumbRailRef}
                className="flex gap-2 py-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                {photos.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    data-thumb-index={i}
                    type="button"
                    onClick={() => {
                      setZoomed(false);
                      setIndex(i);
                    }}
                    className={cn(
                      'relative shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden transition-all duration-200 outline-none',
                      i === index
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent shadow-[0_0_20px_rgba(255,255,255,0.25)]'
                        : 'opacity-60 hover:opacity-100 ring-1 ring-white/10'
                    )}
                    aria-label={`Photo ${i + 1}`}
                    aria-current={i === index ? 'true' : undefined}
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultImage;
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

type PropertyPhotosProps = {
  photos: string[];
};

const PropertyPhotos = ({ photos }: PropertyPhotosProps) => {
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const extraCount = Math.max(0, photos.length - 3);

  if (!photos || photos.length === 0) return null;

  const openAt = (i: number) => {
    setStartIndex(i);
    setOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-[2fr_1fr] grid-rows-2 w-full h-[30vh] gap-1 p-2 mt-4">
        <div
          className={cn(
            'row-span-2 col-span-2 flex items-center justify-center cursor-pointer overflow-hidden rounded-lg',
            photos.length === 1 ? 'sm:col-span-2' : 'sm:col-span-1'
          )}
        >
          <Image
            src={validateValue(photos[0], 'string', '')}
            alt=""
            className="rounded-lg zoom-effect"
            onClick={() => openAt(0)}
            defaultSrc={defaultImage}
          />
        </div>

        {photos.length >= 2 && (
          <div
            className={cn(
              'h-full justify-center items-center cursor-pointer overflow-hidden rounded-lg hidden sm:flex',
              photos.length === 2 ? 'row-span-2' : 'row-span-2 xl:row-span-1'
            )}
          >
            <Image
              src={validateValue(photos[1], 'string', '')}
              className="rounded-lg zoom-effect"
              alt=""
              onClick={() => openAt(1)}
              defaultSrc={defaultImage}
            />
          </div>
        )}

        {photos.length >= 3 && (
          <div className="h-full justify-center items-center cursor-pointer relative overflow-hidden rounded-lg hidden xl:flex">
            <Image
              src={validateValue(photos[2], 'string', '')}
              className="rounded-lg zoom-effect"
              alt=""
              onClick={() => openAt(2)}
              defaultSrc={defaultImage}
            />
            {extraCount > 0 && (
              <button
                type="button"
                onClick={() => openAt(2)}
                className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-poppins font-semibold gap-1.5 transition-colors hover:bg-black/55 outline-none focus:outline-none border-0"
              >
                <Images className="size-4" />
                +{extraCount} more
              </button>
            )}
          </div>
        )}
      </div>

      <Lightbox
        open={open}
        onClose={() => setOpen(false)}
        photos={photos}
        startIndex={startIndex}
      />
    </>
  );
};

export default PropertyPhotos;
