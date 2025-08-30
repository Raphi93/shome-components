import { ReactElement } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { CardImage, CardContent, CardsImageSelf, CardExpander } from "./CardChildren"; 


type ChildrenWithImage = 
    | [ReactElement<typeof CardImage> | ReactElement<typeof CardImage> | ReactElement<typeof CardsImageSelf>, ReactElement<typeof CardContent>, ReactElement<typeof CardExpander>?]
    | [ReactElement<typeof CardImage> | ReactElement<typeof CardImage> | ReactElement<typeof CardsImageSelf>, ReactElement<typeof CardContent>]
    | ReactElement<typeof CardContent>
    | [ReactElement<typeof CardContent>, ReactElement<typeof CardContent>, ReactElement<typeof CardContent>];

type ChildrenWithoutImage = 
    | [ReactElement<typeof CardContent>, ReactElement<typeof CardExpander>?]
    | [ReactElement<typeof CardContent>]
    | ReactElement<typeof CardContent>
    | [ReactElement<typeof CardContent>, ReactElement<typeof CardContent>, ReactElement<typeof CardContent>];

export interface CardsProps {
    children: ChildrenWithImage | ChildrenWithoutImage;
    link?: boolean;
    setValue?: SetValueProps;
    isRightIcon?: boolean;
    maxwidth?: string;
    noImage?: boolean;
}

export interface SetValueProps {
    setValue: () => void;
    value: boolean;
}

export interface CardImageContentProps {
    src: string;
    alt?: string;
    height?: string;
    width?: string;
    maxwidth?: string;
    landscape?: boolean;
    className?: string;
}

export interface CardIconContentProps {
    icon: IconProp;
    fontSize?: string;
    iconColor?: 'red' | 'green' | 'blue' | 'orange' | 'yellow' | 'secondary' | 'primary' | 'white' | 'black';
    className?: string;
    width?: string;
}

export interface CardChildrenProps {
    children: React.ReactNode;
}