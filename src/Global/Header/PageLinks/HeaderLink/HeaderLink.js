import Link from "next/link";
import styles from "./HeaderLink.module.css";
import Image from "next/image";

const HeaderLink = ({ linkTo, content, icon, navLiClass }) => {
  return (
    <li className={`nav-item d-flex flex-row justify-content-center`}>
      <Image src={icon} width={18} height={18} />
      <Link href={`${linkTo}`}>
        <a className="nav-link">{content}</a>
      </Link>
    </li>
  );
};

export default HeaderLink;
