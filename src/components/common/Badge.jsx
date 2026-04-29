import { classNames } from "../../utils/classNames";

const COLOR_MAP = {
  success: "bg-green-lt text-green",
  warning: "bg-yellow-lt text-yellow",
  info: "bg-blue-lt text-blue",
  danger: "bg-red-lt text-red",
  neutral: "bg-secondary-lt text-secondary",
};

export default function Badge({ children, color = "neutral", className }) {
  return (
    <span className={classNames("badge", COLOR_MAP[color], className)}>
      {children}
    </span>
  );
}
