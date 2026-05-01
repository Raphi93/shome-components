import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { faGear } from '@fortawesome/free-solid-svg-icons';

import { Cards, CardContent, CardExpander, CardIcon, CardImage } from '../Components/Cards';

const iconColors = [
  'primary', 'red', 'green', 'blue', 'orange', 'yellow', 'brand', 'white', 'black',
] as const;

type IconColor = (typeof iconColors)[number];

type CardsStoryArgs = ComponentProps<typeof Cards> & {
  iconColor: IconColor;
  expander: boolean;
};

const contentStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.5rem',
  padding: '0.5rem',
};

const meta: Meta<CardsStoryArgs> = {
  title: 'Layout/Cards',
  component: Cards,
  tags: ['autodocs'],
  argTypes: {
    link:        { control: 'boolean' },
    expander:    { control: 'boolean' },
    isRightIcon: { control: 'boolean' },
    noImage:     { control: 'boolean' },
    maxwidth:    { control: 'text' },
    iconColor:   { control: 'select', options: iconColors },
  },
  args: {
    maxwidth:  '30rem',
    iconColor: 'primary',
    expander:  false,
  },
};
export default meta;

type Story = StoryObj<CardsStoryArgs>;

export const Card: Story = {
  args: {
    noImage:     false,
    link:        false,
    isRightIcon: false,
    maxwidth:    '30rem',
    iconColor:   'primary',
    expander:    false,
  },
  render: args => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: '1rem' }}>
        {args.noImage ? (
          <Cards noImage={args.noImage} link={args.link} isRightIcon={args.isRightIcon} maxwidth={args.maxwidth}>
            <CardContent>
              <div style={contentStyle}>
                <h3>Card</h3>
                <p>This card can show all variants.</p>
              </div>
            </CardContent>
          </Cards>
        ) : args.expander ? (
          <Cards
            noImage={args.noImage}
            link={args.link}
            isRightIcon={args.isRightIcon}
            maxwidth={args.maxwidth}
            setValue={{ value: open, setValue: () => setOpen(prev => !prev) }}
          >
            <CardIcon icon={faGear} fontSize="2rem" iconColor={args.iconColor} />
            <CardContent>
              <div style={contentStyle}>
                <h3>Expandable card</h3>
                <p>Click the arrow to open more content.</p>
              </div>
            </CardContent>
            <CardExpander>
              <div style={contentStyle}>
                <p>This is the expandable content area.</p>
                <p>You can place additional details here.</p>
              </div>
            </CardExpander>
          </Cards>
        ) : (
          <Cards noImage={args.noImage} link={args.link} isRightIcon={args.isRightIcon} maxwidth={args.maxwidth}>
            <CardIcon icon={faGear} fontSize="5rem" iconColor={args.iconColor} />
            <CardContent>
              <div style={contentStyle}>
                <h3>Card</h3>
                <p>This card only contains content.</p>
              </div>
            </CardContent>
          </Cards>
        )}
      </div>
    );
  },
};

export const WithoutImage: Story = {
  args: { noImage: true },
  render: args => (
    <div style={{ padding: '1rem' }}>
      <Cards noImage={args.noImage} link={args.link} isRightIcon={args.isRightIcon} maxwidth={args.maxwidth}>
        <CardContent>
          <div style={contentStyle}>
            <h3>Card without image</h3>
            <p>This card only contains content.</p>
          </div>
        </CardContent>
      </Cards>
    </div>
  ),
};

export const WithImage: Story = {
  args: { noImage: false },
  render: args => (
    <div style={{ padding: '1rem' }}>
      <Cards noImage={args.noImage} link={args.link} isRightIcon={args.isRightIcon} maxwidth={args.maxwidth}>
        <CardImage src="https://placehold.co/160x100" alt="Preview" height="6rem" width="auto" />
        <CardContent>
          <div style={contentStyle}>
            <h3>Card with image</h3>
            <p>This card shows an image and content.</p>
          </div>
        </CardContent>
      </Cards>
    </div>
  ),
};

export const WithIcon: Story = {
  args: { noImage: false, iconColor: 'primary' },
  render: args => (
    <div style={{ padding: '1rem' }}>
      <Cards noImage={args.noImage} link={args.link} isRightIcon={args.isRightIcon} maxwidth={args.maxwidth}>
        <CardIcon icon={faGear} fontSize="2rem" iconColor={args.iconColor} />
        <CardContent>
          <div style={contentStyle}>
            <h3>Card with icon</h3>
            <p>This card uses an icon instead of an image.</p>
          </div>
        </CardContent>
      </Cards>
    </div>
  ),
};

export const LinkStyle: Story = {
  args: { noImage: true, link: true },
  render: args => (
    <div style={{ padding: '1rem' }}>
      <Cards noImage={args.noImage} link={args.link} isRightIcon={args.isRightIcon} maxwidth={args.maxwidth}>
        <CardContent>
          <div style={contentStyle}>
            <h3>Link card</h3>
            <p>This card uses the link styling.</p>
          </div>
        </CardContent>
      </Cards>
    </div>
  ),
};

export const WithExpander: Story = {
  args: { noImage: false, iconColor: 'primary' },
  render: args => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: '1rem' }}>
        <Cards
          noImage={args.noImage}
          link={args.link}
          isRightIcon={args.isRightIcon}
          maxwidth={args.maxwidth}
          setValue={{ value: open, setValue: () => setOpen(prev => !prev) }}
        >
          <CardIcon icon={faGear} fontSize="2rem" iconColor={args.iconColor} />
          <CardContent>
            <div style={contentStyle}>
              <h3>Expandable card</h3>
              <p>Click the arrow to open more content.</p>
            </div>
          </CardContent>
          <CardExpander>
            <div style={contentStyle}>
              <p>This is the expandable content area.</p>
              <p>You can place additional details here.</p>
            </div>
          </CardExpander>
        </Cards>
      </div>
    );
  },
};

export const WithExpanderRightIcon: Story = {
  args: { noImage: false, isRightIcon: true, iconColor: 'primary' },
  render: args => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: '1rem' }}>
        <Cards
          noImage={args.noImage}
          link={args.link}
          isRightIcon={args.isRightIcon}
          maxwidth={args.maxwidth}
          setValue={{ value: open, setValue: () => setOpen(prev => !prev) }}
        >
          <CardIcon icon={faGear} fontSize="2rem" iconColor={args.iconColor} />
          <CardContent>
            <div style={contentStyle}>
              <h3>Right icon expander</h3>
              <p>The icon area is aligned differently.</p>
            </div>
          </CardContent>
          <CardExpander>
            <div style={contentStyle}>
              <p>Expanded details on a card with right-aligned icon mode.</p>
            </div>
          </CardExpander>
        </Cards>
      </div>
    );
  },
};
