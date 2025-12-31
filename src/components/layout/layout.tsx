import type { LayoutProps } from "./layout.interface";
import { LayoutContainer, LayoutFooter, LayoutHeader } from "./layout.styles";

export const Layout = ({ children }: LayoutProps) => {
  return (
    <LayoutContainer>
      <LayoutHeader>
        <div>Graphing Calculator</div>
      </LayoutHeader>
      <main>{children}</main>
      <LayoutFooter>
        <p>
          This Graphing Calculator Was Built By{" "}
          <a href="https://andrewkepson.com/" target="_blank" rel="noreferrer">
            Andrew Kepson
          </a>
          .
        </p>
      </LayoutFooter>
    </LayoutContainer>
  );
};
