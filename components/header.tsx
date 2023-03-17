import Link from "next/link";

const Header = () => {
  return (
    <div className="text-base">
      <div className="container mx-auto w-3/6 py-5">
        <ul className="flex flex-row flex-nowrap justify-evenly">
          <li className="sans text-5xl font-semibold">
            <Link href="/">notionGPT</Link>
          </li>
        </ul>
        <p className="text-center mt-1">Notion + ChatGPT = 🔥</p>
      </div>
      <div
        className="bg-gradient-to-r from-yellow-200 to-yellow-600"
        style={{ height: "2px" }}
      ></div>
    </div>
  );
};

export default Header;
