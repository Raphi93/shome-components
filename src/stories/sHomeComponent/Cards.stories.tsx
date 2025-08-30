// stories/Cards.stories.tsx
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
    CardContent,
    CardImage,
    CardExpander,
    CardsImageSelf,
    CardIcon,
    Cards
} from "../../components/index";

import { faCircleInfo, faCar, faUser, faFile, faFileCsv } from "@fortawesome/free-solid-svg-icons";

const meta: Meta<typeof Cards> = {
    title: "sHomeComponents/Cards",
    component: Cards,
    parameters: {
        layout: "centered",
    },
    args: {
        link: false,
        isRightIcon: false,
        maxwidth: "40rem",
        noImage: false,
    },
    tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Cards>;

/* ----------------------------------------------------------------------------------------------
 * 1) Basic: Image + Content
 * ---------------------------------------------------------------------------------------------- */
export const BasicImageAndContent: Story = {
    render: (args) => (
        <Cards {...args}>
            <CardImage src={"https://www.svgrepo.com/show/508699/landscape-placeholder.svg"} alt="Hero" height="7rem" />
            <CardContent>
                <h3 style={{ margin: '1rem' }}>Basic Card</h3>
                <p style={{ margin: '1rem' }}>Image + main content.</p>
            </CardContent>
        </Cards>
    ),
};

/* ----------------------------------------------------------------------------------------------
 * 2) Content Only (noImage = true)
 * ---------------------------------------------------------------------------------------------- */
export const ContentOnly: Story = {
    args: { noImage: true },
    render: (args) => (
        <Cards {...args}>
            <CardContent>
                <h3 style={{ margin: '1rem' }}>Only Content</h3>
                <p style={{ margin: '1rem' }}>This card has no image slot.</p>
            </CardContent>
        </Cards>
    ),
};

/* ----------------------------------------------------------------------------------------------
 * 3) Expandable (controlled) – chevron links, Expander unterhalb
 * ---------------------------------------------------------------------------------------------- */
export const Expandable: Story = {
    render: (args) => {
        const [open, setOpen] = useState(false);
        return (
            <Cards
                {...args}
                setValue={{ value: open, setValue: () => setOpen((v) => !v) }}
            >
                <CardIcon icon={faCircleInfo} iconColor="blue"/>
                <CardContent>
                    <h3 style={{ margin: "1rem" }}>Expandable</h3>
                    <p style={{ margin: "1rem" }}>Click chevron to toggle details.</p>
                </CardContent>
                <CardExpander>
                    <div style={{ padding: "1rem" }}>
                        <strong>Hidden details</strong>
                        <p style={{ margin: 0 }}>
                            This panel expands/collapses with a smooth height transition.
                        </p>
                    </div>
                </CardExpander>
            </Cards>
        );
    },
};

/* ----------------------------------------------------------------------------------------------
 * 4) Expandable + Icon/Image rechts (isRightIcon = true)
 * ---------------------------------------------------------------------------------------------- */
export const ExpandableRightIcon: Story = {
    args: { isRightIcon: true },
    render: (args) => {
        const [open, setOpen] = useState(true);
        return (
            <Cards
                {...args}
                setValue={{ value: open, setValue: () => setOpen((v) => !v) }}
            >
                <CardIcon icon={faCircleInfo} iconColor="blue"/>
                <CardContent>
                    <h3 style={{ margin: "1rem" }}>Right-aligned Chevron</h3>
                    <p style={{ margin: "1rem" }}>Image + chevron on the right.</p>
                </CardContent>
                <CardExpander>
                    <div style={{ padding: "1rem" }}>
                        <em>More content here…</em>
                    </div>
                </CardExpander>
            </Cards>
        );
    },
};

/* ----------------------------------------------------------------------------------------------
 * 5) Link Hover Style (visual affordance)
 * ---------------------------------------------------------------------------------------------- */
export const LinkStyleHover: Story = {
    args: { link: true },
    render: (args) => (
        <Cards {...args}>
            <CardImage src={"https://www.svgrepo.com/show/508699/landscape-placeholder.svg"} alt="Link Style" height="6rem" />
            <CardContent>
                <h3 style={{ margin: "1rem" }}>Link Style</h3>
                <p style={{ margin: "1rem" }}>
                    Hover to see subtle scale & shadow (no navigation).
                </p>
            </CardContent>
        </Cards>
    ),
};

/* ----------------------------------------------------------------------------------------------
 * 6) Narrow MaxWidth (z. B. 24rem)
 * ---------------------------------------------------------------------------------------------- */
export const NarrowMaxWidth: Story = {
    args: { maxwidth: "24rem" },
    render: (args) => (
        <Cards {...args}>
            <CardImage src={"https://www.svgrepo.com/show/508699/landscape-placeholder.svg"} alt="Narrow" height="6rem" />
            <CardContent>
                <h3 style={{ margin: "1rem" }}>Narrow (24rem)</h3>
                <p style={{ margin: "1rem" }}>Max width constrained to 24rem.</p>
            </CardContent>
        </Cards>
    ),
};

/* ----------------------------------------------------------------------------------------------
 * 7) Custom Image via CardsImageSelf (eigenes Markup)
 * ---------------------------------------------------------------------------------------------- */
export const CustomImageSelf: Story = {
    render: (args) => (
        <Cards {...args}>
            <CardsImageSelf>
                <div
                    style={{
                        width: "100%",
                        height: "6rem",
                        borderRadius: "8px",
                        background:
                            "repeating-linear-gradient(45deg, #393a3bff, #404144ff 10px, #1d1e1eff 10px, #262729ff 20px)",
                    }}
                />
            </CardsImageSelf>
            <CardContent>
                <h3 style={{ margin: "1rem" }}>Custom Image (Self)</h3>
                <p style={{ margin: "1rem" }}>
                    Provide your own element(s) to the image slot.
                </p>
            </CardContent>
        </Cards>
    ),
};

/* ----------------------------------------------------------------------------------------------
 * 8) Landscape Image helper (height bump bei landscape=true)
 * ---------------------------------------------------------------------------------------------- */
export const LandscapeImage: Story = {
    render: (args) => (
        <Cards {...args}>
            <CardImage src={"https://www.svgrepo.com/show/508699/landscape-placeholder.svg"} alt="Landscape" landscape />
            <CardContent>
                <h3 style={{ margin: "1rem" }}>Landscape</h3>
                <p style={{ margin: "1rem" }}>
                    Default height bumps from 5rem → 7rem when <code>landscape</code> is
                    true.
                </p>
            </CardContent>
        </Cards>
    ),
};

/* ----------------------------------------------------------------------------------------------
 * 9) Icons im Content (CardIcon helper)
 * ---------------------------------------------------------------------------------------------- */
export const WithIconsInContent: Story = {
    render: (args) => (
        <Cards {...args}>
            <CardImage src={"https://www.svgrepo.com/show/508699/landscape-placeholder.svg"} alt="Icons" height="7rem" />
            <CardContent>
                <h3 style={{ margin: "1rem" }}>With Icons</h3>
                <div style={{ margin: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                    <CardIcon icon={faCircleInfo} iconColor="blue" />
                    <CardIcon icon={faCar} iconColor="secondary" />
                    <CardIcon icon={faUser} iconColor="primary" />
                </div>
                <p style={{ margin: "1rem" }}>
                    Color tokens map to CSS variables.
                </p>
            </CardContent>
        </Cards>
    ),
};

/* ----------------------------------------------------------------------------------------------
 * 10) Showcase: mehrere Cards in einem Grid
 * ---------------------------------------------------------------------------------------------- */
export const GridShowcase: Story = {
    render: (args) => {
        const CardItem = ({
            title,
            desc,
        }: {
            title: string;
            desc: string;
        }) => (
            <Cards {...args} maxwidth="22rem" link>
                <CardIcon icon={faFileCsv} iconColor="primary" fontSize="4rem"/>
                <CardContent>
                    <h3 style={{ margin: "1rem" }}>{title}</h3>
                    <p style={{ margin: "1rem" }}>{desc}</p>
                </CardContent>
            </Cards>
        );

        return (
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(22em, 1fr))",
                    gap: "1rem",
                    width: "70rem",
                }}
            >
                <CardItem title="Card A" desc="Simple content." />
                <CardItem title="Card B" desc="Hover link style." />
                <CardItem title="Card C" desc="Another one." />
                <CardItem title="Card D" desc="Grid item." />
            </div>
        );
    },
};
