// .storybook/preview.tsx
import type { Preview } from "@storybook/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { PageProvider } from "../src/context/PageContext";

const preview: Preview = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/"]}>
        <PageProvider>
          <Story />
        </PageProvider>
      </MemoryRouter>
    ),
  ],
};

export default preview;
