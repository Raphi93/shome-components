import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ImageLightBox } from '../Components/ImageLightBox/ImageLightBox';
import type { ImageDto } from '../Components/ImageLightBox/ImageLightBox';
import { Button } from '../Components/Button/Button';

const IMAGES: ImageDto[] = [
  { imageId: '1', jobId: 'j1', userId: 'u1', isActive: true, href: 'https://picsum.photos/seed/1/800/600', format: 'jpg' },
  { imageId: '2', jobId: 'j1', userId: 'u1', isActive: true, href: 'https://picsum.photos/seed/2/800/600', format: 'jpg' },
  { imageId: '3', jobId: 'j1', userId: 'u1', isActive: true, href: 'https://picsum.photos/seed/3/800/600', format: 'jpg' },
];

const meta: Meta = {
  title: 'Media/ImageLightBox',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Interactive: Story = {
  name: 'Gallery with lightbox',
  render: () => {
    const [selected, setSelected] = useState<ImageDto | null>(null);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {IMAGES.map((img) => (
            <img
              key={img.imageId}
              src={img.href}
              onClick={() => setSelected(img)}
              style={{ width: 160, height: 120, objectFit: 'cover', borderRadius: 'var(--border-radius)', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.2s' }}
              onMouseEnter={(e) => ((e.target as HTMLImageElement).style.borderColor = 'var(--color-brand)')}
              onMouseLeave={(e) => ((e.target as HTMLImageElement).style.borderColor = 'transparent')}
            />
          ))}
        </div>
        <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6 }}>Click any image to open the lightbox</p>

        {selected && (
          <ImageLightBox
            data={IMAGES}
            type="image"
            selectedImage={selected}
            setSelectedImageParent={setSelected}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    );
  },
};

export const SingleImage: Story = {
  name: 'Single image (no gallery)',
  render: () => {
    const [open, setOpen] = useState(false);
    const image = IMAGES[0];
    return (
      <div>
        <Button text="Open image" color="primary" onClick={() => setOpen(true)} />
        {open && (
          <ImageLightBox
            selectedImage={image}
            onClose={() => setOpen(false)}
            type="image"
          />
        )}
      </div>
    );
  },
};
