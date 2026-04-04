import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageCard } from '../Components/ImageCard/ImageCard';
import type { ImageCardMediaType } from '../Components/ImageCard/ImageCard';

const TYPES: ImageCardMediaType[] = ['image', 'video', 'audio', 'document', 'base64', 'iframe'];

const meta: Meta<typeof ImageCard> = {
  title: 'Media/ImageCard',
  component: ImageCard,
  tags: ['autodocs'],
  args: {
    type:      'image',
    href:      'https://picsum.photos/400/300',
    filename:  'photo.jpg',
    extension: 'jpg',
  },
  argTypes: {
    type: {
      control: 'select',
      options: TYPES,
      description: 'Media type — controls the icon and preview rendering.',
    },
    href:       { control: 'text', description: 'URL of the file.' },
    filename:   { control: 'text' },
    extension:  { control: 'text' },
    model:      { control: 'text', description: 'Optional model/category label.' },
    onDelete:      { action: 'deleted' },
    onDownload:    { action: 'downloaded' },
    onFullScreen:  { action: 'fullscreen' },
  },
};
export default meta;

type Story = StoryObj<typeof ImageCard>;

export const Default: Story = {};

export const VideoCard: Story = {
  args: { type: 'video', href: 'https://example.com/clip.mp4', filename: 'clip.mp4', extension: 'mp4' },
};

export const DocumentCard: Story = {
  args: { type: 'document', href: 'https://example.com/report.pdf', filename: 'report.pdf', extension: 'pdf' },
};

export const AudioCard: Story = {
  args: { type: 'audio', href: 'https://example.com/track.mp3', filename: 'track.mp3', extension: 'mp3' },
};

export const WithActions: Story = {
  name: 'With all actions',
  args: {
    type:      'image',
    href:      'https://picsum.photos/400/300',
    filename:  'landscape.jpg',
    extension: 'jpg',
    onDelete:      () => alert('Delete clicked'),
    onDownload:    () => alert('Download clicked'),
    onFullScreen:  () => alert('Fullscreen clicked'),
  },
};

export const AllTypes: Story = {
  name: 'All media types',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {TYPES.map((type) => (
        <ImageCard
          key={type}
          type={type}
          href="https://picsum.photos/400/300"
          filename={`file.${type}`}
          extension={type}
          onDelete={() => undefined}
          onDownload={() => undefined}
          onFullScreen={() => undefined}
        />
      ))}
    </div>
  ),
};
