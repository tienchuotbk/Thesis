import logoSrc from "@/assets/images/logo.png";
type Props = {
  onClick: () => void;
};

export default function HeaderLogo({ onClick }: Props) {
  return (
    <span className="w-[100px] inline-block mr-8 cursor-pointer hoangnx" onClick={onClick}>
      <img src={logoSrc} alt="" />
    </span>
  );
}
