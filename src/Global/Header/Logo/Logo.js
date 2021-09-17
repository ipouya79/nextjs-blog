import Image from "next/image";

const Logo = ({ logo, width, height }) => {
  return (
    <a className="navbar-brand" href="#">
      <Image
        src={logo}
        alt="بیلبورد"
        className="d-inline-block align-text-top"
        width={width}
        height={height}
      />
    </a>
  );
};

export default Logo;
