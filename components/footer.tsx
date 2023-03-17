import Link from "next/link";

const Footer = ({}) => {
  return (
    <div className="bg-[hsla(0,0%,7%,.02)] text-sm">
      <div className="py-8 grid justify-items-center">
        <p>
          Made by{" "}
          <Link href="jbesomi.com" className="">
            Jonathan Besomi
          </Link>
        </p>

        <p>
          <Link href="https://github.com/jbesomi/notionGPT" target="_blank">
            GitHub: I am open-source
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Footer;
