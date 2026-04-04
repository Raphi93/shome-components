import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ImageLightBox } from '../Components/ImageLightBox/ImageLightBox';
import { Button } from '../Components/Button/Button';
import type { ImageDto } from '../Components/ImageLightBox/ImageLightBox.type';

const IMAGES: ImageDto[] = [
  { imageId: '1', jobId: 'j1', userId: 'u1', isActive: true, href: 'https://placehold.co/800x600/aaa/fff?text=Image+1' },
  { imageId: '2', jobId: 'j1', userId: 'u1', isActive: true, href: 'https://placehold.co/800x600/888/fff?text=Image+2' },
  { imageId: '3', jobId: 'j1', userId: 'u1', isActive: true, href: 'https://placehold.co/800x600/666/fff?text=Image+3' },
];

const meta: Meta = {
  title: 'Overlay/ImageLightBox',
  tags: ['autodocs'],
};
export default meta;

export const Default: StoryObj = {
  render: () => {
    const [selected, setSelected] = useState<ImageDto | null>(null);
    return (
      <div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {IMAGES.map((img) => (
            <button key={img.imageId} onClick={() => setSelected(img)} style={{ padding: 0, border: 'none', cursor: 'pointer' }}>
              <img src={img.href} alt="" style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 4 }} />
            </button>
          ))}
        </div>
        {selected && (
          <ImageLightBox
            data={IMAGES}
            selectedImage={selected}
            setSelectedImageParent={setSelected}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    );
  },
};
