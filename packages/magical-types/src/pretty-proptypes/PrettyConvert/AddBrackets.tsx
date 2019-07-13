// @flow
/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { Component, Fragment } from "react";
import { colors } from "../components/constants";

export let bracketStyle = ({ isHovered }: { isHovered: boolean }) => css`
  background-color: ${isHovered ? colors.P300 : colors.N20};
  color: ${isHovered ? "white" : colors.subtleText};
  border: 0;
  font-size: 14px;
  font-family: sans-serif;
  line-height: 20px;
  width: auto;
  margin: 2px 0;
  padding: 0 0.2em;
`;

const StateBit = ({
  isHovered,
  ...props
}: { isHovered: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    type="button"
    css={[
      bracketStyle({ isHovered }),
      css`
        :hover {
          cursor: pointer;
        }
      `
    ]}
    {...props}
  />
);

type Props = {
  openBracket: string;
  closeBracket: string;
  children: () => React.ReactNode;
  closedContent: React.ReactNode;
  initialIsShown: boolean;
};

type State = {
  isHovered: boolean;
  isShown: boolean;
};

export default class AddBrackets extends Component<Props, State> {
  static defaultProps = {
    openBracket: "(",
    closeBracket: ")",
    closedContent: "...",
    initialIsShown: false
  };

  state = { isHovered: false, isShown: this.props.initialIsShown };

  isHovered = () => this.setState({ isHovered: true });
  isNotHovered = () => this.setState({ isHovered: false });

  render() {
    let { openBracket, closeBracket, children, closedContent } = this.props;
    let { isHovered, isShown } = this.state;

    return (
      <Fragment>
        <StateBit
          isHovered={isHovered}
          onClick={() => this.setState({ isShown: !isShown })}
          onMouseEnter={this.isHovered}
          onMouseLeave={this.isNotHovered}
        >
          {openBracket}
        </StateBit>
        {isShown ? (
          children()
        ) : (
          <StateBit
            isHovered={isHovered}
            onClick={() => this.setState({ isShown: true, isHovered: false })}
            onMouseEnter={this.isHovered}
            onMouseLeave={this.isNotHovered}
          >
            {closedContent}
          </StateBit>
        )}
        <StateBit
          isHovered={isHovered}
          onClick={() => this.setState({ isShown: !isShown })}
          onMouseEnter={this.isHovered}
          onMouseLeave={this.isNotHovered}
        >
          {closeBracket}
        </StateBit>
      </Fragment>
    );
  }
}
