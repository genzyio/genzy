import { type FC } from "react";
import { Link, type LinkProps } from "react-router-dom";

type NewTabLinkProps = Omit<LinkProps & React.RefAttributes<HTMLAnchorElement>, "rel" | "target">;

export const NewTabLink: FC<NewTabLinkProps> = ({ to, className, children }) => {
  return (
    <Link to={to} rel="noreferrer" target={"_blank"} className={`hover:underline ${className}`}>
      {children}
    </Link>
  );
};
