import Link from "next/link";
import { Text } from "../Atoms/Text";

const Footer: React.FC = () => {
  return (
    <footer
      className="flex grid grid-cols-1 flex-col xl:w-128"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-16">
        <div className="xl:grid xl:grid-cols-2 xl:gap-8">
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider ">
                  <Text className="text-altPrimary">Homeowners</Text>
                </h3>
                <ul role="list" className="mt-4 space-y-2">
                  <li>
                    <Link
                      href="/Dashboard"
                      className="text-base font-normal text-gray-500 hover:text-blue-600"
                    >
                      <Text>Dashboard</Text>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-bold uppercase tracking-wider text-teal-600">
                  <Text className="text-altPrimary">Trades</Text>
                </h3>
                <ul role="list" className="mt-4 space-y-2">
                  <li>
                    <a
                      href="https://www.wickedblocks.dev"
                      className="text-base font-normal text-gray-500 hover:text-blue-600"
                    >
                      <Text>TBC</Text>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-teal-600">
                  <Text className="text-altPrimary">Legal</Text>
                </h3>
                <ul role="list" className="mt-4 space-y-2">
                  <li>
                    <a
                      href="./changelog.html"
                      className="text-base font-normal text-gray-500 hover:text-blue-600"
                    >
                      <Text>About</Text>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-bold uppercase tracking-wider text-teal-600">
                  <Text className="text-altPrimary">Socials</Text>
                </h3>
                <ul role="list" className="mt-4 space-y-2"></ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl  px-4 py-12 sm:px-6 lg:px-16">
        <div className="flex flex-wrap items-baseline">
          <span className="mt-2 text-sm font-light text-gray-500">
            Copyright © 2020 - 2021
            <a
              href=""
              className="text-wickedblue mx-2 hover:text-gray-500"
              rel="noopener noreferrer"
            ></a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
